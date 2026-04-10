# Project Constitution: vpcompras-nacionais
**Standard:** SpaceX Engineering (Grok) — **Methodology:** SDD + AIOX + TDD + BDD

## 1. Non-Negotiable Core Principles ('The Iron Rules')
These are the fundamental laws of the project. Any PR that violates these will be rejected automatically.

1.  **Spec-Driven Development (SDD):** No code without an approved spec, plan, and task list. Documentation is the source of truth, not the implementation.
2.  **Schema Isolation (Zero Pollution):** All module data must strictly reside in `vpcn_*` schemas. No changes allowed to standard `public` or other system schemas unless explicitly specified.
3.  **Security First (The Shield):**
    - Every table MUST have Row Level Security (RLS) active.
    - Policies must enforce ownership or role-based access based on `centro_custo`.
    - Signed URLs for all shared assets.
    - HMAC verification for all external webhooks.
4.  **Auditability (The Black Box):**
    - Every state change or data mutation must be logged to `vpcn_audit.events` (append-only).
    - Hard deletes are forbidden globally. Soft deletes or terminal status updates only.
5.  **Quality Standard (The SpaceX Way):**
    - Code coverage goal: > 80% with TDD/BDD.
    - Sub-100ms response targets for critical path database queries.
    - Self-critique is mandatory for every agent interaction.

## 2. Methodology: Agile (BMAD)
- **B**uild: Rapid prototyping of approved specs.
- **M**easure: Validating against acceptance criteria and TDD tests.
- **A**dapt: Refactoring based on stakeholder (Gelson) feedback.
- **D**eliver: Incremental, safe deployment via controlled migrations.

---
**Custodian:** Antigravity (@architect-spaceX) — **Rev:** 1.0 (April 2026)
