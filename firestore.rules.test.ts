/**
 * Firestore Security Rules Test Suite (Dirty Dozen Verification)
 * Verifies that all 12 adversarial payloads in security_spec.md are rejected with PERMISSION_DENIED.
 */

export interface TestCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: {
    uid: string;
    email: string;
    email_verified: boolean;
  } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_TESTS: TestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Catalog Write',
    operation: 'update',
    path: '/catalogConfig/live',
    auth: null,
    payload: {
      configId: 'live',
      outOfStockMap: { '0-0': true },
      customPrices: {},
      orderWhatsApp: '258847521920',
      ownerId: 'admin-1',
      updatedBy: 'anon',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 2,
    name: 'Unverified Admin Email Spoof',
    operation: 'update',
    path: '/catalogConfig/live',
    auth: { uid: 'spoof-uid', email: 'SNahim46@gmail.com', email_verified: false },
    payload: {
      configId: 'live',
      outOfStockMap: { '0-0': true },
      customPrices: {},
      orderWhatsApp: '258847521920',
      ownerId: 'spoof-uid',
      updatedBy: 'spoof-uid',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 3,
    name: 'Non-Admin Authenticated Write',
    operation: 'update',
    path: '/catalogConfig/live',
    auth: { uid: 'customer-1', email: 'customer@example.com', email_verified: true },
    payload: {
      configId: 'live',
      outOfStockMap: {},
      customPrices: { '0-0': 1 },
      orderWhatsApp: '258847521920',
      ownerId: 'admin-1',
      updatedBy: 'customer-1',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 4,
    name: 'Shadow Field Injection on Catalog Update',
    operation: 'update',
    path: '/catalogConfig/live',
    auth: { uid: 'owner-1', email: 'SNahim46@gmail.com', email_verified: true },
    payload: {
      configId: 'live',
      outOfStockMap: {},
      customPrices: {},
      orderWhatsApp: '258847521920',
      ownerId: 'owner-1',
      updatedBy: 'owner-1',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP',
      isHacked: true
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 5,
    name: 'Identity Spoofing on updatedBy',
    operation: 'update',
    path: '/catalogConfig/live',
    auth: { uid: 'owner-1', email: 'SNahim46@gmail.com', email_verified: true },
    payload: {
      configId: 'live',
      outOfStockMap: { '0-1': true },
      customPrices: {},
      orderWhatsApp: '258847521920',
      ownerId: 'owner-1',
      updatedBy: 'other-user-uid',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 6,
    name: 'Immutable ownerId Mutation',
    operation: 'update',
    path: '/catalogConfig/live',
    auth: { uid: 'owner-1', email: 'SNahim46@gmail.com', email_verified: true },
    payload: {
      configId: 'live',
      outOfStockMap: {},
      customPrices: {},
      orderWhatsApp: '258847521920',
      ownerId: 'new-owner-id',
      updatedBy: 'owner-1',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 7,
    name: 'Forged Client Timestamp',
    operation: 'update',
    path: '/catalogConfig/live',
    auth: { uid: 'owner-1', email: 'SNahim46@gmail.com', email_verified: true },
    payload: {
      configId: 'live',
      outOfStockMap: {},
      customPrices: {},
      orderWhatsApp: '258847521920',
      ownerId: 'owner-1',
      updatedBy: 'owner-1',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: '2020-01-01T00:00:00Z'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 8,
    name: 'ID Poisoning / Wrong Singleton ID',
    operation: 'create',
    path: '/catalogConfig/poisoned_id_123',
    auth: { uid: 'owner-1', email: 'SNahim46@gmail.com', email_verified: true },
    payload: {
      configId: 'poisoned_id_123',
      outOfStockMap: {},
      customPrices: {},
      orderWhatsApp: '258847521920',
      ownerId: 'owner-1',
      updatedBy: 'owner-1',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 9,
    name: 'Resource Exhaustion / Invalid WhatsApp Format',
    operation: 'update',
    path: '/catalogConfig/live',
    auth: { uid: 'owner-1', email: 'SNahim46@gmail.com', email_verified: true },
    payload: {
      configId: 'live',
      outOfStockMap: {},
      customPrices: {},
      orderWhatsApp: 'INVALID_PHONE_NUMBER_WITH_LETTERS_AND_TOO_LONG_1234567890',
      ownerId: 'owner-1',
      updatedBy: 'owner-1',
      createdAt: 'SERVER_TIMESTAMP',
      updatedAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 10,
    name: 'Unauthorized Read of Owner PIN',
    operation: 'get',
    path: '/ownerSettings/security',
    auth: { uid: 'customer-1', email: 'customer@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 11,
    name: 'Self-Assigned Admin Privilege Escalation',
    operation: 'create',
    path: '/admins/customer-1',
    auth: { uid: 'customer-1', email: 'customer@example.com', email_verified: true },
    payload: {
      adminId: 'customer-1',
      grantedBy: 'customer-1',
      createdAt: 'SERVER_TIMESTAMP'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 12,
    name: 'Collection Scraping via list Query',
    operation: 'list',
    path: '/catalogConfig',
    auth: { uid: 'owner-1', email: 'SNahim46@gmail.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED'
  }
];
