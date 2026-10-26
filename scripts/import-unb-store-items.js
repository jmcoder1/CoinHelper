/**
 * Import UnbelievaBoat store items into CoinHelper StoreItem tables.
 *
 * Usage:
 *   node scripts/import-unb-store-items.js              # write to DB (.env.production)
 *   node scripts/import-unb-store-items.js --dry-run    # fetch + report only
 *   node scripts/import-unb-store-items.js --guild=ID   # one Discord guild id
 *
 * Maps:
 *   - name, price, description, emoji_unicode → StoreItem
 *   - action type 2 (ADD_ROLES) ids → StoreItemRoleAction
 *   - requirement type 1 (ROLE) ids → StoreItemRoleRequirement (EVERY / all must match)
 * Skips RESPOND and other action/requirement types (logged).
 */
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "../.env.production"),
  override: true,
});

const { PrismaClient } = require("@prisma/client");

const UNB_BASE = "https://unbelievaboat.com/api/v1";
const ACTION_ADD_ROLES = 2;
const REQUIREMENT_ROLE = 1;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const guildArg = args.find((a) => a.startsWith("--guild="));
const onlyGuildDiscordId = guildArg ? guildArg.slice("--guild=".length) : null;

const token = process.env.UNBELIEVABOAT_TOKEN;
if (!token) {
  console.error("UNBELIEVABOAT_TOKEN missing in .env.production");
  process.exit(1);
}

const prisma = new PrismaClient();

const unbHeaders = {
  Authorization: token,
  Accept: "application/json",
};

const parsePrice = (value) => {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.trunc(n);
};

const uniqueIds = (ids) =>
  [...new Set((ids || []).map(String).filter(Boolean))];

const fetchAllUnbItems = async (guildDiscordId) => {
  const all = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const { data } = await axios.get(
      `${UNB_BASE}/guilds/${guildDiscordId}/items`,
      {
        headers: unbHeaders,
        params: { page, limit: 100, sort: "id" },
      }
    );
    totalPages = data.total_pages || data.totalPages || 1;
    all.push(...(data.items || []));
    page += 1;
  }

  return all;
};

const mapUnbItem = (raw) => {
  const price = parsePrice(raw.price);
  const warnings = [];

  if (price === null) {
    warnings.push(`invalid price: ${raw.price}`);
  }
  if (!raw.name || String(raw.name).trim().length < 1) {
    warnings.push("missing name");
  }

  const actionRoleIds = [];
  for (const action of raw.actions || []) {
    if (action.type === ACTION_ADD_ROLES) {
      actionRoleIds.push(...uniqueIds(action.ids));
    } else {
      warnings.push(`skipped action type ${action.type}`);
    }
  }

  const requirementRoleIds = [];
  for (const req of raw.requirements || []) {
    if (req.type === REQUIREMENT_ROLE) {
      if (req.match_type != null && req.match_type !== 1) {
        warnings.push(
          `ROLE requirement match_type=${req.match_type} (importing as EVERY/all)`
        );
      }
      requirementRoleIds.push(...uniqueIds(req.ids));
    } else {
      warnings.push(`skipped requirement type ${req.type}`);
    }
  }

  const iconEmoji =
    raw.emoji_unicode ||
    (raw.emoji_id ? `custom:${raw.emoji_id}` : null) ||
    null;

  return {
    unbItemId: String(raw.id),
    name: String(raw.name || "").trim(),
    price,
    description: String(raw.description || ""),
    iconEmoji,
    listed: raw.is_visible !== false,
    actionRoleIds: uniqueIds(actionRoleIds),
    requirementRoleIds: uniqueIds(requirementRoleIds),
    warnings,
  };
};

const replaceRoles = async (storeItemId, mapped) => {
  await prisma.storeItemRoleAction.deleteMany({ where: { storeItemId } });
  await prisma.storeItemRoleRequirement.deleteMany({ where: { storeItemId } });
  if (mapped.actionRoleIds.length) {
    await prisma.storeItemRoleAction.createMany({
      data: mapped.actionRoleIds.map((discordRoleId) => ({
        storeItemId,
        discordRoleId,
      })),
    });
  }
  if (mapped.requirementRoleIds.length) {
    await prisma.storeItemRoleRequirement.createMany({
      data: mapped.requirementRoleIds.map((discordRoleId) => ({
        storeItemId,
        discordRoleId,
      })),
    });
  }
};

const upsertStoreItem = async (guildId, mapped) => {
  const byUnb = await prisma.storeItem.findFirst({
    where: { guildId, unbItemId: mapped.unbItemId },
  });

  // Unique (guildId, name) includes soft-deleted rows — reuse by name if needed.
  const byName =
    byUnb ||
    (await prisma.storeItem.findFirst({
      where: { guildId, name: mapped.name },
    }));

  if (byName) {
    await prisma.storeItem.update({
      where: { id: byName.id },
      data: {
        unbItemId: mapped.unbItemId,
        name: mapped.name,
        price: mapped.price,
        description: mapped.description,
        iconEmoji: mapped.iconEmoji,
        listed: mapped.listed,
        deletedAt: null,
      },
    });
    await replaceRoles(byName.id, mapped);
    return "updated";
  }

  const created = await prisma.storeItem.create({
    data: {
      guildId,
      unbItemId: mapped.unbItemId,
      name: mapped.name,
      price: mapped.price,
      description: mapped.description,
      iconEmoji: mapped.iconEmoji,
      listed: mapped.listed,
    },
  });
  await replaceRoles(created.id, mapped);
  return "created";
};

const run = async () => {
  const guilds = await prisma.guild.findMany({
    orderBy: { name: "asc" },
    ...(onlyGuildDiscordId
      ? { where: { discordId: onlyGuildDiscordId } }
      : {}),
  });

  if (guilds.length === 0) {
    console.error(
      onlyGuildDiscordId
        ? `No guild found with discordId=${onlyGuildDiscordId}`
        : "No guilds in database."
    );
    process.exit(1);
  }

  console.log(
    dryRun
      ? `Dry run — ${guilds.length} guild(s), no DB writes`
      : `Importing UnbelievaBoat store items for ${guilds.length} guild(s)`
  );

  const summary = [];

  for (const guild of guilds) {
    const guildSummary = {
      guild: guild.name,
      discordId: guild.discordId,
      fetched: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      warnings: [],
    };

    let rawItems;
    try {
      rawItems = await fetchAllUnbItems(guild.discordId);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        String(error);
      console.error(`\n[${guild.name}] fetch failed: ${message}`);
      guildSummary.warnings.push(`fetch failed: ${message}`);
      summary.push(guildSummary);
      continue;
    }

    guildSummary.fetched = rawItems.length;
    console.log(`\n[${guild.name}] ${rawItems.length} UnbelievaBoat item(s)`);

    for (const raw of rawItems) {
      const mapped = mapUnbItem(raw);
      if (mapped.warnings.length) {
        guildSummary.warnings.push(
          `${mapped.name || mapped.unbItemId}: ${mapped.warnings.join("; ")}`
        );
      }

      if (mapped.price === null || !mapped.name) {
        guildSummary.skipped += 1;
        console.log(`  skip ${mapped.unbItemId}: invalid name/price`);
        continue;
      }

      console.log(
        `  ${mapped.name} — ${mapped.price} | actions=${mapped.actionRoleIds.length} reqs=${mapped.requirementRoleIds.length}`
      );

      if (dryRun) continue;

      try {
        const result = await upsertStoreItem(guild.id, mapped);
        if (result === "created") guildSummary.created += 1;
        else guildSummary.updated += 1;
      } catch (error) {
        guildSummary.skipped += 1;
        const message = error.message || String(error);
        guildSummary.warnings.push(`${mapped.name}: ${message}`);
        console.error(`  failed ${mapped.name}: ${message}`);
      }
    }

    summary.push(guildSummary);
  }

  console.log("\n=== Summary ===");
  for (const row of summary) {
    console.log(
      `${row.guild}: fetched=${row.fetched} created=${row.created} updated=${row.updated} skipped=${row.skipped}`
    );
    for (const w of row.warnings) {
      console.log(`  warn: ${w}`);
    }
  }

  if (dryRun) {
    console.log("\nDry run complete — re-run without --dry-run to write.");
  }
};

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
