# Deploying CoinHelper on Railway (git push)

CoinHelper is a **long-running Discord bot** (no public HTTP port). Railway runs the Docker image; env vars are set in the Railway dashboard, not baked into the image.

## One-time Railway setup

### 1. Create project

1. Go to [railway.com](https://railway.com) and sign in with GitHub.
2. **New Project** → **Deploy from GitHub repo** → select `jmcoder1/CoinHelper`.
3. Railway detects `Dockerfile` and `railway.toml` automatically.

### 2. Service settings

- **Root directory:** `/` (repo root)
- **Public networking:** Off (this is a Discord bot, not a web app)
- **Branch:** `main` (enables deploy on every push to `main`)

### 3. Environment variables

In Railway → your service → **Variables**, add everything the bot needs:

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | Postgres connection string (`?sslmode=require` for DO) |
| `DISCORD_TOKEN` | Yes | Bot token |
| `UNBELIEVABOAT_TOKEN` | Yes | Unbelievaboat API token |
| `AWS_S3_ACCESS_KEY_ID` | Yes | Text-to-image uploads |
| `AWS_S3_SECRET_ACCESS_KEY` | Yes | Text-to-image uploads |
| `HF_TOKEN` | Yes | Hugging Face / roleplay API |
| `NODE_ENV` | Yes | Set to `production` |

Optional (not used by bot runtime today, but safe to copy from Dokku if present):

- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_PUBLIC_KEY_`, `PORT`

**Do not** commit `.env` or `.env.production`. Railway injects vars at runtime.

### 4. Database

**Option A — Keep DigitalOcean Postgres (simplest migration)**

- Use the same `DATABASE_URL` as Dokku.
- In DO: add Railway’s outbound IPs to **Trusted sources**, or allow your DB host’s public access with SSL.
- Test from Railway deploy logs: `prisma migrate deploy` should succeed.

**Option B — Railway Postgres**

- Add **PostgreSQL** plugin to the project.
- Point `DATABASE_URL` at the Railway Postgres URL (often `${{Postgres.DATABASE_URL}}` reference).
- Dump/restore data from DO before cutover if you need existing guild config.

### 5. First deploy

After variables are set, trigger **Deploy** once manually, then watch logs for:

```
Prisma migrate deploy ... done
<botname> is online
```

## Deploy on git push (ongoing)

With GitHub connected:

```bash
git add .
git commit -m "your change"
git push origin main
```

Railway builds the Dockerfile and redeploys automatically on each push to `main`.

To deploy another branch, change the tracked branch in Railway **Settings → Source**.

## Local admin panel (unchanged)

The admin UI still runs **on your machine**, not on Railway:

```bash
yarn build
yarn admin
```

Uses `.env.production` locally with prod `DATABASE_URL` (see `todo.md`).

## Migrating off DigitalOcean / Dokku

1. Set up Railway + env vars (above).
2. Deploy and confirm bot online in Discord.
3. Smoke-test: `/balance`, image coins, roleplay in one guild.
4. Stop Dokku app (`dokku ps:stop` or destroy) only after Railway is stable.
5. Remove DO deploy webhook/SSH deploy if you had one.

## Troubleshooting

### P3009 (failed migration)

If deploy logs show `P3009` and a migration name (e.g. `20260601120000_roleplay_duo_mode`), the database has a **stuck failed migration** from an earlier deploy attempt.

**Railway Postgres (new / empty DB — recommended):**

1. Railway → **Postgres** service → **Settings** → remove and re-add the plugin, or delete the volume/data (wipes DB).
2. Push the latest code (includes migration order fix).
3. Redeploy CoinHelper — `prisma migrate deploy` should run all migrations cleanly.

**Without wiping the DB** (from your machine with Railway `DATABASE_URL`):

```bash
npx prisma migrate resolve --rolled-back "20260601120000_roleplay_duo_mode"
git push origin main   # after migration fix is on main
```

Then redeploy. If it still fails, reset Postgres as above.

**Using existing DigitalOcean Postgres (Option A):** point `DATABASE_URL` at DO instead of Railway Postgres — schema is already migrated; no fresh `migrate deploy` on an empty DB.

| Issue | Fix |
|-------|-----|
| `Missing required environment variables` | Add missing vars in Railway Variables |
| `prisma migrate deploy` fails | Check `DATABASE_URL`, SSL, DB firewall |
| `P3009` failed migration | See **P3009 (failed migration)** below |
| Bot offline after deploy | Check Railway logs; verify `DISCORD_TOKEN` |
| `403` from Unbelievaboat | Authorize API app for each guild (separate from deploy) |
| Build fails on `yarn build` | Bot deploy uses `yarn build:bot` (tsc only). Run full `yarn build` locally for admin assets. |

## Files involved

- `Dockerfile` — build image, run migrations + bot
- `railway.toml` — Railway build/deploy hints
- `src/bot/envBootstrap.ts` — prod env validation (no `.env` file on Railway)
