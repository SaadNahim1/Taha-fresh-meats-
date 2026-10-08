# Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Global Default-Deny Catch-All**: Any path not explicitly matched is strictly denied (`allow read, write: if false;`).
2. **No Unbounded List Queries (`allow list: if false`)**: All collections (`/catalogConfig/{configId}`, `/ownerSettings/{settingId}`, `/ownerAuth/{challengeId}`) forbid `list` queries (`allow list: if false;`).
3. **Zero-Read Secret PIN Storage**: Both `/ownerSettings/{settingId}` and `/ownerAuth/{challengeId}` enforce `allow read: if false;` (`allow get: if false; allow list: if false;`). No client can ever read or scrape the stored PIN from Firestore.
4. **Atomic Batch PIN Proof (`hasValidPinChallengeInBatch`)**: Every write to `/catalogConfig/live` or `/ownerSettings/security` requires an atomic batch write to `/ownerAuth/pinChallenge` where `getAfter(...).data.updatedAt == request.time` and `getAfter(...).data.submittedPin == getActivePin()`.
5. **Strict Key & Schema Validation (`isValidCatalogConfig`, `isValidOwnerSecuritySetting`, `isValidOwnerPinChallenge`)**: Every `create` and `update` validates exact keys (`hasAll` and `hasOnly`), field types, string/map size bounds, and regex patterns.
6. **Temporal Integrity**: `updatedAt` must strictly equal `request.time` on every write.

---

## 2. The "Dirty Dozen" Payloads

1. **Payload 1 (Catalog Write Without PIN Proof Batch)**: Client attempts to update `/catalogConfig/live` directly without an atomic PIN proof in `/ownerAuth/pinChallenge`.
2. **Payload 2 (Catalog Write With Wrong PIN)**: Client submits `submittedPin: "0000"` in batch when active PIN is `"1234"`.
3. **Payload 3 (Direct Read of Stored PIN)**: Client attempts `get` on `/ownerSettings/security` to steal the PIN.
4. **Payload 4 (Direct Read of PIN Challenge)**: Client attempts `get` on `/ownerAuth/pinChallenge` to intercept the submitted PIN.
5. **Payload 5 (Shadow Field Injection on Catalog Update)**: Client sends valid fields plus `"isHacked": true` to `/catalogConfig/live`.
6. **Payload 6 (Immutable `configId` Mutation)**: Client attempts to change `configId` during an update on `/catalogConfig/live`.
7. **Payload 7 (Forged Client Timestamp)**: Client sends a past/future `updatedAt` timestamp instead of `request.time`.
8. **Payload 8 (ID Poisoning / Wrong Singleton ID)**: Client attempts to create `/catalogConfig/poisoned_id` instead of `live`.
9. **Payload 9 (Resource Exhaustion / Invalid WhatsApp Format)**: Client sends a non-numeric or >20 char string in `orderWhatsApp`.
10. **Payload 10 (Invalid PIN Format on Rotation)**: Client attempts to set `pinCode: "abcd"` or a 20-character string in `/ownerSettings/security`.
11. **Payload 11 (Unauthorized PIN Rotation Without Current PIN)**: Client attempts to update `/ownerSettings/security` without proving knowledge of the existing PIN.
12. **Payload 12 (Collection Scraping via `list`)**: Client attempts a `list` query on `/catalogConfig`, `/ownerSettings`, or `/ownerAuth`.
