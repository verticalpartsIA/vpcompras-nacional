# Supabase Setup: vpcompras-nacionais
**Environment:** Development & Production (v1.0)
**Schema Standard:** Isolated `vpcn_*` (Zero system pollution).

## 1. Local CLI Workflow
Assuming you have the Supabase CLI installed:

```powershell
# 1. Initialize Supabase in the current project (if not already done)
supabase init

# 2. Start local development environment
supabase start

# 3. Pull current remote schema (if applicable)
supabase db pull

# 4. Apply all migrations to local/remote
supabase db push

# 5. Insert Seed Data (CCs, Rules)
supabase db reset # (Will apply 001_init_schemas.sql + seed.sql)
```

## 2. Linking to the Remote Project
Once you have the Project ID from your Supabase Dashboard:

```powershell
# Link your local repo to the remote instance
supabase link --project-ref your-project-id-here

# To use remote credentials in local:
# 1. Add DB Password to your environment.
# 2. Add keys to the .env file.
```

## 3. Mandatory Environment Variables (.env)
These variables are REQUIRED for the project to function:

| Variable | Description | Source |
| :--- | :--- | :--- |
| `SUPABASE_URL` | API Endpoint for Supabase | Dashboard -> API |
| `SUPABASE_ANON_KEY` | Anonymous public API Key | Dashboard -> API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (Admin/Secret) | Dashboard -> API |
| `VPCN_HMAC_SECRET` | Secret for custom webhook validation | Internal Dev |

## 4. RLS Guidelines
- Every table MUST have RLS enabled (already included in `001_init_schemas.sql`).
- Policies are based on `user_centros_custo` and role validation from `approver_rules`.
- Always test policies with the `auth.uid()` function in the Supabase SQL Editor.

---
**Lead Engineer:** Antigravity (@supabase-expert)
