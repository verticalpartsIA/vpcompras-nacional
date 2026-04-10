# Spec: vpcompras-nacionais (v1.0)
**Status:** DRAFT (Waiting for Gelson's Approval)
**Tech Lead / Architect:** Antigravity (Pair-programming with Gelson & Grok Standard)

## 1. Overview
The `vpcompras-nacionais` project is a core module of the `vpsistema` ecosystem. It handles national procurement and purchasing workflows with strict security, auditability, and approval levels.

## 2. Technical Stack (Proposed)
Based on `vpsistema` ecosystem standards:
- **Database:** PostgreSQL with isolated schemas (`vpcn_*`).
- **Backend Architecture:** SDD + TDD focused.
- **Security:** RLS (Row Level Security), Audit Log (Append-only), Signed URLs, HMAC for webhooks.

## 3. Core Features (MVP)
### 3.1. Schema Isolation
- All tables and triggers must reside within the `vpcn_` schemas to prevent pollution of the main `vpsistema` namespaces.
### 3.2. 3-Level Approval Engine
- **Level 1 (Request):** Creation of purchasing requests.
- **Level 2 (Validation/Review):** Technical or financial validation.
- **Level 3 (Authorization):** Execution or final approval.
- *Status Machine:* Pending -> Reviewing -> Approved/Rejected -> Completed.
### 3.3. Products Module (MVP)
- Management of a centralized product catalog.
- Price history and supplier association.
### 3.4. Auditability
- Append-only `vpcn_audit_log` to track every change (WHO, WHEN, WHAT, OLD_VAL, NEW_VAL).

## 4. Integration
- Integrated as a module parent on the `vpsistema` portal.
- Authentication/Authorization shared via `vpsistema` master context.

## 5. Non-Functional Requirements
- **Performance:** Sub-100ms API responses for critical paths.
- **Code Coverage:** > 80% with TDD.
- **Quality:** Clean Code principles, Grok (SpaceX Engineering Standard).
- **Security:** Strict HMAC validation for all external webhooks.

## 6. Open Questions for Gelson
1.  Are there specific product categories for the MVP?
2.  Should the 3-level approval roles be fixed (e.g. Requester -> Manager -> Admin) or configurable per request type?
3.  Are there existing database credentials we should use for integration?
