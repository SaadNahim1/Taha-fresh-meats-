import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  writeBatch,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Verbatim validation constants from firebase-blueprint.json
export const CONFIG_ID_REGEX = /^live$/;
export const SETTING_ID_REGEX = /^security$/;
export const CHALLENGE_ID_REGEX = /^pinChallenge$/;
export const WHATSAPP_REGEX = /^[0-9]+$/;
export const PIN_REGEX = /^[0-9]+$/;
export const MAX_MAP_ENTRIES = 200;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on startup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'catalogConfig', 'live'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export interface LiveCatalogPayload {
  outOfStockIds: string[];
  customPrices: Record<string, number>;
  orderWhatsApp: string;
  pinCode: string;
}

function sanitizeOutOfStockMap(ids: string[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  const bounded = ids.slice(0, MAX_MAP_ENTRIES);
  for (const id of bounded) {
    if (typeof id === 'string' && id.length > 0 && id.length <= 64) {
      map[id] = true;
    }
  }
  return map;
}

function sanitizeCustomPrices(prices: Record<string, number>): Record<string, number> {
  const map: Record<string, number> = {};
  const entries = Object.entries(prices).slice(0, MAX_MAP_ENTRIES);
  for (const [id, price] of entries) {
    if (
      typeof id === 'string' &&
      id.length > 0 &&
      id.length <= 64 &&
      typeof price === 'number' &&
      Number.isFinite(price) &&
      price > 0
    ) {
      map[id] = Math.round(price * 100) / 100;
    }
  }
  return map;
}

function sanitizeWhatsApp(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '').slice(0, 20);
  if (digits.length < 8 || !WHATSAPP_REGEX.test(digits)) {
    throw new Error('O número de WhatsApp deve conter entre 8 e 20 dígitos numéricos.');
  }
  return digits;
}

function sanitizePin(raw: string): string {
  const clean = raw.trim();
  if (clean.length < 4 || clean.length > 6 || !PIN_REGEX.test(clean)) {
    throw new Error('O PIN deve conter entre 4 e 6 dígitos numéricos.');
  }
  return clean;
}

/**
 * Verifies the owner's PIN directly against Firestore security rules.
 * Returns true if the PIN is valid, or false if rejected.
 */
export async function verifyOwnerPinInCloud(pinInput: string): Promise<boolean> {
  const cleanPin = pinInput.trim();
  if (cleanPin.length < 4 || cleanPin.length > 6 || !PIN_REGEX.test(cleanPin)) {
    return false;
  }

  const path = 'ownerAuth/pinChallenge';
  const challengeRef = doc(db, 'ownerAuth', 'pinChallenge');
  try {
    await setDoc(challengeRef, {
      challengeId: 'pinChallenge',
      submittedPin: cleanPin,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (
      msg.includes('Missing or insufficient permissions') ||
      msg.includes('permission-denied')
    ) {
      return false;
    }
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Atomically verifies the owner's PIN and updates the live catalog configuration for all clients.
 */
export async function saveLiveCatalogToCloud(payload: LiveCatalogPayload): Promise<void> {
  const submittedPin = sanitizePin(payload.pinCode);
  const outOfStockMap = sanitizeOutOfStockMap(payload.outOfStockIds);
  const customPrices = sanitizeCustomPrices(payload.customPrices);
  const orderWhatsApp = sanitizeWhatsApp(payload.orderWhatsApp);

  const path = 'catalogConfig/live';
  const challengeRef = doc(db, 'ownerAuth', 'pinChallenge');
  const catalogRef = doc(db, 'catalogConfig', 'live');

  try {
    const batch = writeBatch(db);
    batch.set(challengeRef, {
      challengeId: 'pinChallenge',
      submittedPin,
      updatedAt: serverTimestamp(),
    });
    batch.set(catalogRef, {
      configId: 'live',
      outOfStockMap,
      customPrices,
      orderWhatsApp,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Atomically verifies the current PIN and rotates to a new 4-6 digit PIN in the cloud.
 */
export async function saveOwnerPinToCloud(currentPin: string, newPin: string): Promise<void> {
  const cleanCurrentPin = sanitizePin(currentPin);
  const cleanNewPin = sanitizePin(newPin);

  const path = 'ownerSettings/security';
  const challengeRef = doc(db, 'ownerAuth', 'pinChallenge');
  const securityRef = doc(db, 'ownerSettings', 'security');

  try {
    const batch = writeBatch(db);
    batch.set(challengeRef, {
      challengeId: 'pinChallenge',
      submittedPin: cleanCurrentPin,
      updatedAt: serverTimestamp(),
    });
    batch.set(securityRef, {
      settingId: 'security',
      pinCode: cleanNewPin,
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export { doc, onSnapshot };
