# vpcompras-nacionais

**VerticalParts Enterprise Module — National Procurement System**
> Engineering Standard: SpaceX (Grok) — Methodology: SDD + AIOX + TDD + BDD

## 1. Overview
The `vpcompras-nacionais` project is a core module of the `vpsistema` ecosystem. It orchestrates the entire national procurement lifecycle, from initial request to receipt of goods and financial integration with Omie.

### Core Mission
Build a highly secure, auditable, and approval-driven procurement engine with **Zero System Pollution** (Isolated schemas).

## 2. Tech Stack (MVP 1.0)
- **Frontend:** Next.js Latest (App Router) in `apps/web`.
- **Backend:** PostgreSQL / Supabase with RLS (Isolated: `vpcn_*`).
- **Authorization:** 3-Level Data-Driven Approval Engine (`vpcn_config.approver_rules`).
- **Integrations:** Omie ERP/Purchase Orders sync (HMAC Secured).
- **Security:** RLS, Signed URLs, HMAC, Append-only Audit logs.

## 3. Getting Started (Local Development)

### 3.1. Requirements
Ensure you have `pnpm` and `supabase` CLI installed globally.

### 3.2. Setup Instructions
```powershell
# 1. Install project dependencies
pnpm install

# 2. Local Supabase Initial Setup
# Make sure the local Docker environment is running.
supabase start

# 3. Apply Local Migrations
supabase db push

# 4. Optional: Insert Seed Data
supabase db reset # (This will apply migrations + seed.sql automatically)

# 5. Run the Local Web Application
cd apps/web
pnpm dev
```

### 3.3. Key Repositories / Folders
- [/docs/](docs/): Detailed Specs.
- [/apps/web/](apps/web/): Main Next.js portal.
- [/packages/database/](packages/database/): Global types and schemas.
- [/packages/lib/](packages/lib/): Approval Engine and Utilities.
- [/supabase/migrations/](supabase/migrations/): Controlled DB changes.

## 4. MVP Status (Phase 2)
- [x] Initial Architecture & Constitution.
- [x] Schema Design (`vpcn_config`, `vpcn_audit`, `vpcn_produtos`).
- [x] Shared TypeScript Types & Logic Libraries.
- [x] Basic Frontend Skeleton & Auth Middleware.
- [ ] 3-Level Approval Integration (Wait validation).
- [ ] Product Forms (Awaiting spec refinement).

---
**Lead:** Antigravity (@architect-spaceX) — **Stakeholder:** Gelson (VerticalParts)
