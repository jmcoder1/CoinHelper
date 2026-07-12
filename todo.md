# CoinHelper Admin UI & Config Migration Plan

Localhost admin panel for managing guild config in **production Postgres only**. Channel/role slot names stay in code; per-server Discord IDs move to the DB and are edited via UI. Removing `constants.ts` is the final step.

---

## 1. Prerequisites & Production DB Access

- [x] Confirm production `DATABASE_URL` in `.env.production` (gitignored; same value as Dokku app)
- [x] Set up network access to prod Postgres from your machine:
  - Used Dokku postgres expose → reachable at `142.93.114.185`
  - ~~Option A: Add home IP to DO database **Trusted sources**~~
  - ~~Option B: SSH tunnel through droplet~~
- [x] Verify connectivity: `node scripts/test-db-connection.js .env.production` — confirmed 4 guilds
- [ ] Document connection steps in a short internal note (how to tunnel, where credentials live)

---

## 2. Admin Server Foundation

- [x] Add Express admin server under `src/admin/`
- [x] Single npm script: `"admin": "node dist/admin/server.js"` (loads `.env.production` on startup)
- [x] Bind to `127.0.0.1` only — never expose admin port publicly on the droplet
- [x] Load env from `.env.production` only — no local/dev DB path
- [x] **Prod-only guard** on startup: refuse to start if `DATABASE_URL` host is `localhost`, `127.0.0.1`, Dokku-internal hostname, etc.
- [x] **API key auth**: require `ADMIN_API_KEY` header/query on all routes
- [x] Add `ADMIN_API_KEY` and `ADMIN_PORT` to `.env.production` and `.env.example`

---

## 3. Admin UI — Core CRUD

Manage data already in Prisma. Slot names come from code constants; UI maps each slot to a Discord ID per guild.

### 3.1 Guilds

- [x] List all guilds (`Guild`: discordId, name)
- [x] Create guild (Discord guild ID + display name)
- [x] Edit / delete guild (delete cascades or warns about related rows)

### 3.2 Channels

- [x] For each guild, show a form keyed by semantic slot names from code (`announcement`, `economy`, `play`, …)
- [x] Create / update / delete `GuildChannel` rows (`name` = slot constant, `discordId` = Discord snowflake)
- [x] Validate: one row per (guild, slot name); discordId required

### 3.3 Roles

- [x] Same pattern for `GuildRole` (`preview`, `bronze`, `silver`, …)
- [x] Create / update / delete role mappings per guild

### 3.4 Currency

- [x] Edit `GuildCurrency` per guild: name, namePlural, iconSrc

### 3.5 Removal Reasons

- [x] List / add / edit / delete `GuildRemovalReason` per guild (title, description, value)

### 3.6 UI Polish

- [x] **Prod banner** on every page: show DB hostname (e.g. `*.db.ondigitalocean.com`)
- [x] Confirm dialog before destructive saves: “You are editing PRODUCTION”
- [x] Simple static HTML or minimal frontend — no over-engineering

---

## 4. Discord Sync Helper

Reduce manual copy-paste when onboarding a new server.

- [x] “Sync from Discord” action: given a guild Discord ID, fetch channels and roles via bot token
- [x] Display fetched channels/roles in UI with dropdowns to assign semantic slot names
- [x] Save assignments as `GuildChannel` / `GuildRole` rows (upsert, not wipe)
- [x] Handle missing slots (warn if a required slot has no mapping)

---

## 5. Safety Rules

- [x] Admin uses **upserts only** — never call `startMigration` or `deleteMany` on guild tables from UI
- [x] No wipe/reseed endpoint in admin
- [x] Bot continues reading from Prisma at runtime — no bot redeploy needed for ID changes
- [x] Optional: read-only mode env flag for debugging without writes

---

## 6. Bot & Runtime (No Breaking Changes)

- [x] Confirm all commands/listeners already resolve guild → channel/role via Prisma + semantic name constants (no code changes expected here)
- [x] Smoke-test after admin edits: balance, preview, paid-request, text-to-image, reaction moderation
- [x] Update test fixture `toBalanceUpdate.test.ts` to use inline/mock data instead of `OP_GUILD` when constants shrink

### Runtime verification notes

All bot commands/listeners resolve config via `prisma.guild.findUnique({ where: { discordId } })` then `findFirst` on channels/roles by semantic name from `constants.ts`. Admin edits DB rows directly — bot picks up changes on next lookup without redeploy.

**Automated config check:** `yarn build && yarn verify:guild-config` — confirms every guild has all channel slots, role slots, and currency in prod DB.

**Manual smoke-test checklist** (after admin edits in prod):
- [ ] `/balance` posts to economy channel with correct currency name
- [ ] `/preview` charges currency and posts to preview channel
- [ ] `/paid-request` routes to correct request channel by type
- [ ] `/text-to-image` posts to ai-image channel
- [ ] ❓ reaction on economy message shows removal-reason dropdown (moderation)

---

## 7. Optional — Move Remaining Code-Only Config to DB

Only if you want tier limits and global settings editable without deploys. Can be done before or in parallel with section 8.

- [x] Add Prisma model for tier image limits (or `imageLimit` column on tier roles)
- [x] Move `SERVER_BOOST_ICON` to env var or `AppSetting` table
- [x] Remove unused `APP_NAME` constant
- [x] Refactor `getMemberImagePostLimit.ts` and `guildMemberUpdate.ts` to read from DB/env

---

## 8. Remove `constants.ts` & Seed Script (Last)

Do this only after admin UI is live, prod DB is authoritative, and you’ve verified all four guilds (and any new ones) are fully configured via UI.

### 8.1 Extract Semantic Names

- [ ] Create `src/utils/apiUtils/prismaUtils/semanticNames.ts` (~30 lines)
- [ ] Move channel name constants (`ECONOMY_CHANNEL_NAME`, …) and role name constants (`BRONZE_ROLE_NAME`, …) there
- [ ] Move `TIER_ROLE_NAMES` / tier limits here **or** to DB if section 7 was done
- [ ] Update all imports across `src/` from `constants` → `semanticNames`

### 8.2 Delete Redundant Seed Data

- [ ] Delete `OP_GUILD`, `BMB_GUILD`, `Tt_GUILD`, `CUCK_GUILD`, and `guilds` export
- [ ] Delete `src/utils/apiUtils/prismaUtils/startMigration.ts`
- [ ] Delete `src/utils/apiUtils/prismaUtils/constants.ts`
- [ ] Remove any npm scripts or docs referencing `startMigration`

### 8.3 Final Verification

- [ ] Prod DB has complete rows for every guild (channels, roles, currency, removal reasons)
- [ ] Add a 5th test guild entirely via admin UI (no code deploy for IDs)
- [ ] Full bot regression on prod after constants removal

---

## Summary

| Phase | What | Status |
|-------|------|--------|
| 1 | Prod DB access from laptop | Done |
| 2 | Localhost admin server (prod-only) | Done |
| 3 | CRUD UI for guilds, channels, roles, currency, removal reasons | Done |
| 4 | Discord sync helper | Done |
| 5 | Safety guardrails | Done |
| 6 | Verify bot unchanged | Done |
| 7 | (Optional) Tier limits & global settings in DB | Done |
| 8 | **Last:** `semanticNames.ts` + delete `constants.ts` / `startMigration.ts |
