# Optional hosted learner / facilitator contract

The delivered app is a local reference. Nothing is submitted to a server. The following contract is a proposed production implementation, not an existing integration.

## Records

- Attempt: UUID, authenticated learner_id, scenario_version, status, created_at, updated_at, revision, state JSON, final_score, final_band.
- Event: UUID, attempt_id, sequence, event_type, payload JSON, resulting_ac, resulting_fr, resulting_reserve, server_timestamp.
- Identity: learner display name and matriculation number, linked to authenticated user. Never use a matriculation number alone as an authentication secret.

State JSON follows `fresh()` in `app/engine.js`. Keep scenario version with each attempt, so a later rubric change does not silently regrade previous cohorts. The current log describes choices; it is not an immutable server audit log.

## Proposed API

| Method | Path | Behaviour |
|---|---|---|
| POST | /api/attempts | Start new attempt for signed-in learner; return id + revision + state |
| GET | /api/attempts/current | Restore that learner's latest open attempt |
| POST | /api/attempts/:id/actions | Accept `{action, payload, expectedRevision, requestId}`; run reducer on server |
| POST | /api/attempts/:id/complete | Validate debrief reached; calculate canonical result; lock official submission |
| GET | /api/facilitator/attempts | Role-restricted cohort summary; filter and paginate |
| GET | /api/facilitator/attempts/:id | Role-restricted full decision trail and source/check usage |

Idempotent request IDs prevent repeat scoring on retries. Revision mismatch returns 409 and current state. Client-provided scores, AC and FR are never trusted. Authorise each attempt read/write by user/cohort role. Developer preview creates no official records. Do not store service secrets in browser code. Define retention/access policy with the institution before collecting learner identities at scale.

## Facilitator fields

Opening/closing stance, sources opened and time spent, attached sources/claim, all mechanism decisions, escalation/enforcement branch, checks and transfer choices, closing line, weakest strand, retreat response, four scores, adjustment, raw total, risk-based band reduction, AC/FR, event trail. Show wrong choices without overwriting them. CSV export is an explicit facilitator action.

## Migration seam

Replace `save()` and initial localStorage hydration in app.js with a persistence adapter. Keep the reducer pure and UI independent. Allow local demo mode without login. Add network retry/offline status only in hosted mode, not as unnecessary copy in the static prototype. End-to-end auth, role access and concurrency tests belong to that backend implementation.
