const API_KEY_STORAGE = "coinhelper_admin_api_key";

const loginScreen = document.getElementById("login-screen");
const appEl = document.getElementById("app");
const apiKeyInput = document.getElementById("api-key-input");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const dbHostEl = document.getElementById("db-host");
const readOnlyBadgeEl = document.getElementById("read-only-badge");
const guildListEl = document.getElementById("guild-list");
const mainPanel = document.getElementById("main-panel");
const addGuildBtn = document.getElementById("add-guild-btn");
const appSettingsBtn = document.getElementById("app-settings-btn");
const discordAuditBtn = document.getElementById("discord-audit-btn");
const confirmModal = document.getElementById("confirm-modal");
const confirmTitle = document.getElementById("confirm-title");
const confirmMessage = document.getElementById("confirm-message");
const confirmCancel = document.getElementById("confirm-cancel");
const confirmOk = document.getElementById("confirm-ok");

let apiKey = sessionStorage.getItem(API_KEY_STORAGE) || "";
let meta = null;
let guilds = [];
let selectedGuildId = null;
let activeTab = "settings";
let economySubTab = "currency";
let confirmResolver = null;
let latestDiscordAudit = null;
let discordResourcesCache = { guildId: null, data: null };

const loadDiscordResources = async (guildId) => {
  if (
    discordResourcesCache.guildId === guildId &&
    discordResourcesCache.data
  ) {
    return discordResourcesCache.data;
  }
  const data = await apiFetch(`/guilds/${guildId}/discord-resources`);
  discordResourcesCache = { guildId, data };
  return data;
};

const findDiscordItemLabel = (items, id) => {
  if (!id) return "";
  const match = (items || []).find((item) => item.id === id);
  return match ? `${match.name} (${match.id})` : id;
};

/**
 * Searchable Discord channel/role picker.
 * Single mode exposes a hidden input with data-slot-name for collectSlots.
 */
const createDiscordPicker = ({
  items,
  value = "",
  values = [],
  multiple = false,
  placeholder = "Search by name or ID…",
  inputId = "",
  datasetSlotName = "",
}) => {
  const root = document.createElement("div");
  root.className = "discord-picker";

  const selectedEl = document.createElement("div");
  selectedEl.className = "discord-picker-selected empty";

  const chipsEl = document.createElement("div");
  chipsEl.className = "discord-picker-chips";

  const search = document.createElement("input");
  search.type = "text";
  search.placeholder = placeholder;
  search.autocomplete = "off";
  if (inputId) search.id = inputId;

  const hidden = document.createElement("input");
  hidden.type = "hidden";
  if (datasetSlotName) {
    hidden.dataset.slotName = datasetSlotName;
    if (inputId) hidden.id = `${inputId}-value`;
  }

  const dropdown = document.createElement("div");
  dropdown.className = "discord-picker-dropdown";

  let selectedIds = multiple
    ? [...new Set((values || []).filter(Boolean))]
    : value
      ? [value]
      : [];
  let highlightIndex = 0;

  const selectedSet = () => new Set(selectedIds);

  const syncHidden = () => {
    if (!multiple) {
      hidden.value = selectedIds[0] || "";
    }
  };

  const renderSelected = () => {
    if (multiple) {
      selectedEl.classList.add("empty");
      selectedEl.textContent = "";
      chipsEl.innerHTML = "";
      selectedIds.forEach((id) => {
        const chip = document.createElement("span");
        chip.className = "discord-picker-chip";
        chip.innerHTML = `<span>${escapeHtml(
          findDiscordItemLabel(items, id),
        )}</span>`;
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "×";
        removeBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          selectedIds = selectedIds.filter((entry) => entry !== id);
          syncHidden();
          renderSelected();
          renderDropdown();
        });
        chip.appendChild(removeBtn);
        chipsEl.appendChild(chip);
      });
    } else {
      chipsEl.innerHTML = "";
      if (selectedIds[0]) {
        selectedEl.classList.remove("empty");
        selectedEl.textContent = findDiscordItemLabel(items, selectedIds[0]);
      } else {
        selectedEl.classList.add("empty");
        selectedEl.textContent = "Nothing selected";
      }
    }
  };

  const filteredItems = () => {
    const query = search.value.trim().toLowerCase();
    const taken = selectedSet();
    return (items || []).filter((item) => {
      if (multiple && taken.has(item.id)) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      );
    });
  };

  const close = () => root.classList.remove("open");
  const open = () => {
    root.classList.add("open");
    highlightIndex = 0;
    renderDropdown();
  };

  const choose = (id) => {
    if (!id) return;
    if (multiple) {
      if (!selectedIds.includes(id)) selectedIds.push(id);
      search.value = "";
    } else {
      selectedIds = [id];
      search.value = "";
      close();
    }
    syncHidden();
    renderSelected();
    renderDropdown();
  };

  const renderDropdown = () => {
    dropdown.innerHTML = "";
    const list = filteredItems().slice(0, 80);
    if (list.length === 0) {
      const empty = document.createElement("div");
      empty.className = "discord-picker-empty";
      empty.textContent = "No matches";
      dropdown.appendChild(empty);
      return;
    }

    list.forEach((item, index) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = `discord-picker-option${
        index === highlightIndex ? " active" : ""
      }`;
      option.innerHTML = `${escapeHtml(item.name)} <span class="muted">${escapeHtml(
        item.id,
      )}</span>`;
      option.addEventListener("mousedown", (event) => {
        event.preventDefault();
        choose(item.id);
      });
      dropdown.appendChild(option);
    });
  };

  search.addEventListener("focus", open);
  search.addEventListener("input", () => {
    highlightIndex = 0;
    open();
    renderDropdown();
  });
  search.addEventListener("blur", () => {
    window.setTimeout(close, 150);
  });
  search.addEventListener("keydown", (event) => {
    const list = filteredItems().slice(0, 80);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlightIndex = Math.min(highlightIndex + 1, Math.max(list.length - 1, 0));
      renderDropdown();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      highlightIndex = Math.max(highlightIndex - 1, 0);
      renderDropdown();
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (list[highlightIndex]) choose(list[highlightIndex].id);
    } else if (event.key === "Escape") {
      close();
    } else if (
      event.key === "Backspace" &&
      !search.value &&
      multiple &&
      selectedIds.length > 0
    ) {
      selectedIds.pop();
      syncHidden();
      renderSelected();
      renderDropdown();
    }
  });

  if (multiple) {
    root.appendChild(chipsEl);
  } else {
    root.appendChild(selectedEl);
  }
  root.appendChild(search);
  if (!multiple) root.appendChild(hidden);
  root.appendChild(dropdown);

  syncHidden();
  renderSelected();

  return {
    root,
    getValue: () => selectedIds[0] || "",
    getValues: () => [...selectedIds],
    setValue: (id) => {
      selectedIds = id ? [id] : [];
      syncHidden();
      renderSelected();
    },
    setValues: (ids) => {
      selectedIds = [...new Set((ids || []).filter(Boolean))];
      syncHidden();
      renderSelected();
    },
  };
};

const getApiKey = () => apiKey;

const isReadOnly = () => meta?.readOnly === true;

const applyReadOnlyUi = () => {
  const readOnly = isReadOnly();

  readOnlyBadgeEl.classList.toggle("hidden", !readOnly);
  addGuildBtn.disabled = readOnly;

  mainPanel
    .querySelectorAll("button, input, textarea, select")
    .forEach((element) => {
      element.disabled = readOnly;
    });
};

const apiFetch = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    "X-Admin-Api-Key": getApiKey(),
    ...(options.headers || {}),
  };

  const response = await fetch(`/api${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
};

const confirmProduction = (title, message) =>
  new Promise((resolve) => {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmModal.classList.remove("hidden");
    confirmResolver = resolve;
  });

confirmCancel.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
  if (confirmResolver) confirmResolver(false);
  confirmResolver = null;
});

confirmOk.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
  if (confirmResolver) confirmResolver(true);
  confirmResolver = null;
});

const showLoginError = (message) => {
  loginError.textContent = message;
  loginError.classList.remove("hidden");
};

const hideLoginError = () => {
  loginError.classList.add("hidden");
};

const showApp = () => {
  loginScreen.classList.add("hidden");
  appEl.classList.remove("hidden");
};

const showLogin = () => {
  loginScreen.classList.remove("hidden");
  appEl.classList.add("hidden");
};

const loadMeta = async () => {
  meta = await apiFetch("/meta");
  dbHostEl.textContent = `Database: ${meta.databaseHost}`;
  applyReadOnlyUi();
};

const loadGuilds = async () => {
  const data = await apiFetch("/guilds");
  guilds = data.guilds;
  renderGuildList();
};

const renderGuildList = () => {
  guildListEl.innerHTML = "";

  guilds.forEach((guild) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = guild.name;
    btn.className = guild.id === selectedGuildId ? "active" : "";
    btn.addEventListener("click", () => {
      selectedGuildId = guild.id;
      activeTab = "settings";
      discordResourcesCache = { guildId: null, data: null };
      renderGuildList();
      void renderGuildPanel();
    });
    li.appendChild(btn);
    guildListEl.appendChild(li);
  });
};

const renderTabs = (guild) => {
  const tabs = [
    ["settings", "Settings"],
    ["sync", "Sync from Discord"],
    ["channels", "Channels"],
    ["roles", "Roles"],
    ["economy", "Economy"],
    ["ai-roleplay", "AI Roleplay"],
  ];

  const tabsEl = document.createElement("div");
  tabsEl.className = "tabs";

  tabs.forEach(([key, label]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tab${activeTab === key ? " active" : ""}`;
    btn.textContent = label;
    btn.addEventListener("click", () => {
      activeTab = key;
      void renderGuildPanel();
    });
    tabsEl.appendChild(btn);
  });

  const header = document.createElement("div");
  header.className = "panel-header";
  header.innerHTML = `<h2>${guild.name}</h2>`;
  header.appendChild(tabsEl);

  return header;
};

const renderSlotForm = (items, prefix, discordItems) => {
  const grid = document.createElement("div");
  grid.className = "field-grid";

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "field-row";

    const label = document.createElement("label");
    label.textContent = item.name;
    label.setAttribute("for", `${prefix}-${item.name}`);

    const picker = createDiscordPicker({
      items: discordItems || [],
      value: item.discordId || "",
      placeholder: `Search ${prefix} by name or ID…`,
      inputId: `${prefix}-${item.name}`,
      datasetSlotName: item.name,
    });

    row.appendChild(label);
    row.appendChild(picker.root);
    grid.appendChild(row);
  });

  return grid;
};

const collectSlots = (prefix) => {
  const inputs = mainPanel.querySelectorAll(`[data-slot-name]`);
  const slots = {};

  inputs.forEach((input) => {
    if (!input.id.startsWith(prefix)) return;
    slots[input.dataset.slotName] = input.value.trim();
  });

  return slots;
};

const renderWarningBox = (missingChannels, missingRoles) => {
  if (missingChannels.length === 0 && missingRoles.length === 0) return null;

  const box = document.createElement("div");
  box.className = "warning-box";
  const parts = [];

  if (missingChannels.length > 0) {
    parts.push(`Unmapped channels: ${missingChannels.join(", ")}`);
  }
  if (missingRoles.length > 0) {
    parts.push(`Unmapped roles: ${missingRoles.join(", ")}`);
  }

  box.textContent = parts.join(" · ");
  return box;
};

const renderSlotSelectForm = (slotNames, mappings, discordItems, prefix) => {
  const grid = document.createElement("div");
  grid.className = "field-grid";

  slotNames.forEach((slotName) => {
    const row = document.createElement("div");
    row.className = "field-row";

    const label = document.createElement("label");
    label.textContent = slotName;
    label.setAttribute("for", `${prefix}-${slotName}`);

    const picker = createDiscordPicker({
      items: discordItems || [],
      value: mappings[slotName] || "",
      placeholder: "Search by name or ID…",
      inputId: `${prefix}-${slotName}`,
      datasetSlotName: slotName,
    });

    row.appendChild(label);
    row.appendChild(picker.root);
    grid.appendChild(row);
  });

  return grid;
};

const collectSlotSelects = (prefix) => collectSlots(prefix);

const collectRoleData = () => {
  const slots = collectSlots("role");
  const imageLimits = {};

  (meta?.tierRoleSlotNames ?? []).forEach((name) => {
    const input = document.getElementById(`role-limit-${name}`);
    if (!input) return;
    const value = input.value.trim();
    imageLimits[name] = value === "" ? null : Number(value);
  });

  return { slots, imageLimits };
};

const renderAppSettingsPanel = async () => {
  mainPanel.innerHTML = `<p class="placeholder">Loading...</p>`;
  const settings = await apiFetch("/settings");

  mainPanel.innerHTML = "";
  const header = document.createElement("div");
  header.className = "panel-header";
  header.innerHTML = `<h2>App settings</h2>`;
  mainPanel.appendChild(header);

  const panel = document.createElement("div");
  panel.className = "tab-panel";
  panel.innerHTML = `
    <div class="field-grid">
      <div class="field-row">
        <label for="new-member-image-limit">New member image limit</label>
        <input id="new-member-image-limit" type="number" min="0" value="${settings.newMemberImageLimit}" />
      </div>
      <div class="field-row">
        <label for="server-boost-icon-url">Server boost icon URL</label>
        <input id="server-boost-icon-url" type="text" value="${escapeHtml(settings.serverBoostIconUrl)}" />
      </div>
    </div>
    <div class="actions">
      <button type="button" id="save-app-settings-btn">Save app settings</button>
    </div>
  `;

  panel.querySelector("#save-app-settings-btn").addEventListener("click", async () => {
    const confirmed = await confirmProduction(
      "Save app settings",
      "You are editing PRODUCTION. Save global app settings?",
    );
    if (!confirmed) return;

    await apiFetch("/settings", {
      method: "PATCH",
      body: JSON.stringify({
        newMemberImageLimit: Number(panel.querySelector("#new-member-image-limit").value),
        serverBoostIconUrl: panel.querySelector("#server-boost-icon-url").value.trim(),
      }),
    });
    await renderAppSettingsPanel();
  });

  mainPanel.appendChild(panel);
  applyReadOnlyUi();
};

const renderStoreSubPanel = async (subPanel, guild) => {
  subPanel.innerHTML = `<p class="placeholder">Loading store...</p>`;

  let discordRoles = [];
  try {
    const resources = await loadDiscordResources(guild.id);
    discordRoles = resources.discord?.roles || [];
  } catch (error) {
    subPanel.innerHTML = `<p class="error">Could not load Discord roles: ${escapeHtml(
      error.message,
    )}. Check bot token / guild access.</p>`;
    return;
  }

  const { items } = await apiFetch(
    `/guilds/${guild.id}/store-items?includeDeleted=true`,
  );

  const formState = {
    id: null,
    name: "",
    price: 200,
    description: "",
    iconEmoji: "",
    listed: true,
    actionRoleIds: [],
    requirementRoleIds: [],
  };

  const paint = () => {
    const editing = Boolean(formState.id);
    subPanel.innerHTML = `
      <p>Manage guild store items used by <code>/show-items</code> and <code>/buy-item</code>. Soft-deleted items stay in the DB but are hidden from Discord.</p>
      <div class="field-grid" id="store-item-form-grid">
        <div class="field-row">
          <label for="store-item-name">Name</label>
          <input id="store-item-name" type="text" value="${escapeHtml(formState.name)}" placeholder="Bronze Access" />
        </div>
        <div class="field-row">
          <label for="store-item-price">Price</label>
          <input id="store-item-price" type="number" min="0" step="1" value="${formState.price}" />
        </div>
        <div class="field-row">
          <label for="store-item-icon">Icon emoji</label>
          <input id="store-item-icon" type="text" value="${escapeHtml(formState.iconEmoji)}" placeholder="🥉" />
        </div>
        <div class="field-row">
          <label for="store-item-listed">Listed in store</label>
          <select id="store-item-listed">
            <option value="true" ${formState.listed ? "selected" : ""}>Yes</option>
            <option value="false" ${formState.listed ? "" : "selected"}>No</option>
          </select>
        </div>
        <div class="field-row">
          <label for="store-item-description">Description</label>
          <textarea id="store-item-description" rows="3">${escapeHtml(formState.description)}</textarea>
        </div>
      </div>
      <div class="actions">
        <button type="button" id="store-item-save-btn">${editing ? "Update item" : "Create item"}</button>
        ${editing ? `<button type="button" id="store-item-cancel-btn">Cancel edit</button>` : ""}
      </div>
      <h3>Items (${items.length})</h3>
      <div id="store-item-list"></div>
    `;

    const formGrid = subPanel.querySelector("#store-item-form-grid");
    const actionsRow = document.createElement("div");
    actionsRow.className = "field-row";
    actionsRow.innerHTML = `<label>Roles granted on buy</label>`;
    const actionPicker = createDiscordPicker({
      items: discordRoles,
      values: formState.actionRoleIds,
      multiple: true,
      placeholder: "Search roles to grant…",
      inputId: "store-item-actions",
    });
    actionsRow.appendChild(actionPicker.root);
    formGrid.appendChild(actionsRow);

    const reqsRow = document.createElement("div");
    reqsRow.className = "field-row";
    reqsRow.innerHTML = `<label>Required roles (all)</label>`;
    const reqPicker = createDiscordPicker({
      items: discordRoles,
      values: formState.requirementRoleIds,
      multiple: true,
      placeholder: "Search required roles…",
      inputId: "store-item-reqs",
    });
    reqsRow.appendChild(reqPicker.root);
    formGrid.appendChild(reqsRow);

    const listEl = subPanel.querySelector("#store-item-list");
    if (items.length === 0) {
      listEl.innerHTML = `<p class="placeholder">No store items yet. Import with <code>yarn import:unb-store</code> or create one above.</p>`;
    } else {
      items.forEach((item) => {
        const card = document.createElement("div");
        card.className = `store-item-card${item.deletedAt ? " deleted" : ""}`;
        const actionNames = (item.actionRoleIds || [])
          .map((id) => discordRoles.find((role) => role.id === id)?.name || id)
          .join(", ");
        const reqNames = (item.requirementRoleIds || [])
          .map((id) => discordRoles.find((role) => role.id === id)?.name || id)
          .join(", ");
        card.innerHTML = `
          <h4>${escapeHtml(item.iconEmoji || "")} ${escapeHtml(item.name)} — ${item.price}</h4>
          <div class="store-item-meta">
            ${item.deletedAt ? "Soft-deleted · " : ""}${item.listed ? "Listed" : "Unlisted"}
            ${item.unbItemId ? ` · UNB ${escapeHtml(item.unbItemId)}` : ""}
          </div>
          <div class="store-item-meta">${escapeHtml(item.description || "")}</div>
          <div class="store-item-meta">Grants: ${escapeHtml(actionNames || "—")}</div>
          <div class="store-item-meta">Requires: ${escapeHtml(reqNames || "—")}</div>
          <div class="actions">
            <button type="button" data-edit="${item.id}">Edit</button>
            ${
              item.deletedAt
                ? ""
                : `<button type="button" data-delete="${item.id}">Soft delete</button>`
            }
          </div>
        `;
        listEl.appendChild(card);
      });
    }

    subPanel.querySelector("#store-item-save-btn").addEventListener("click", async () => {
      const payload = {
        name: subPanel.querySelector("#store-item-name").value.trim(),
        price: Number(subPanel.querySelector("#store-item-price").value),
        description: subPanel.querySelector("#store-item-description").value,
        iconEmoji: subPanel.querySelector("#store-item-icon").value.trim(),
        listed: subPanel.querySelector("#store-item-listed").value === "true",
        actionRoleIds: actionPicker.getValues(),
        requirementRoleIds: reqPicker.getValues(),
      };

      const confirmed = await confirmProduction(
        editing ? "Update store item" : "Create store item",
        `You are editing PRODUCTION. ${editing ? "Update" : "Create"} store item?`,
      );
      if (!confirmed) return;

      if (editing) {
        await apiFetch(`/guilds/${guild.id}/store-items/${formState.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch(`/guilds/${guild.id}/store-items`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      await renderGuildPanel();
    });

    const cancelBtn = subPanel.querySelector("#store-item-cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        formState.id = null;
        formState.name = "";
        formState.price = 200;
        formState.description = "";
        formState.iconEmoji = "";
        formState.listed = true;
        formState.actionRoleIds = [];
        formState.requirementRoleIds = [];
        paint();
      });
    }

    listEl.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = items.find((row) => row.id === btn.getAttribute("data-edit"));
        if (!item) return;
        formState.id = item.id;
        formState.name = item.name;
        formState.price = item.price;
        formState.description = item.description || "";
        formState.iconEmoji = item.iconEmoji || "";
        formState.listed = item.listed;
        formState.actionRoleIds = item.actionRoleIds || [];
        formState.requirementRoleIds = item.requirementRoleIds || [];
        paint();
      });
    });

    listEl.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const itemId = btn.getAttribute("data-delete");
        const item = items.find((row) => row.id === itemId);
        const confirmed = await confirmProduction(
          "Soft delete store item",
          `Soft-delete "${item?.name || itemId}" on PRODUCTION?`,
        );
        if (!confirmed) return;
        await apiFetch(`/guilds/${guild.id}/store-items/${itemId}`, {
          method: "DELETE",
        });
        await renderGuildPanel();
      });
    });
  };

  paint();
};

const renderGuildPanel = async () => {
  if (activeTab === "app-settings") {
    await renderAppSettingsPanel();
    return;
  }

  if (activeTab === "discord-audit") {
    await renderDiscordAuditPanel();
    return;
  }

  if (!selectedGuildId) {
    mainPanel.innerHTML = `<p class="placeholder">Select a guild or create a new one.</p>`;
    return;
  }

  mainPanel.innerHTML = `<p class="placeholder">Loading...</p>`;
  const data = await apiFetch(`/guilds/${selectedGuildId}`);
  const { guild, channels, roles, currency, aiRoleplay } = data;

  mainPanel.innerHTML = "";
  mainPanel.appendChild(renderTabs(guild));

  const panel = document.createElement("div");
  panel.className = "tab-panel";

  if (activeTab === "settings") {
    panel.innerHTML = `
      <div class="field-grid">
        <div class="field-row">
          <label for="guild-name">Name</label>
          <input id="guild-name" type="text" value="${escapeHtml(guild.name)}" />
        </div>
        <div class="field-row">
          <label for="guild-discord-id">Discord guild ID</label>
          <input id="guild-discord-id" type="text" value="${escapeHtml(guild.discordId)}" />
        </div>
      </div>
      <div class="actions">
        <button type="button" id="save-guild-btn">Save settings</button>
        <button type="button" id="delete-guild-btn" class="danger">Delete guild</button>
      </div>
    `;

    panel.querySelector("#save-guild-btn").addEventListener("click", async () => {
      const confirmed = await confirmProduction(
        "Save guild settings",
        "You are editing PRODUCTION. Save guild name and Discord ID?",
      );
      if (!confirmed) return;

      await apiFetch(`/guilds/${guild.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: panel.querySelector("#guild-name").value.trim(),
          discordId: panel.querySelector("#guild-discord-id").value.trim(),
        }),
      });
      await loadGuilds();
      await renderGuildPanel();
    });

    panel.querySelector("#delete-guild-btn").addEventListener("click", async () => {
      const confirmed = await confirmProduction(
        "Delete guild",
        `Delete "${guild.name}" and all related channels, roles, and currency from PRODUCTION?`,
      );
      if (!confirmed) return;

      await apiFetch(`/guilds/${guild.id}`, { method: "DELETE" });
      selectedGuildId = null;
      await loadGuilds();
      mainPanel.innerHTML = `<p class="placeholder">Guild deleted. Select another guild.</p>`;
    });
  }

  if (activeTab === "sync") {
    panel.innerHTML = `
      <p>Fetch channels and roles from Discord, assign semantic slots, then save to production.</p>
      <div class="actions">
        <button type="button" id="fetch-discord-btn">Fetch from Discord</button>
      </div>
      <div id="sync-content" class="sync-content">
        <p class="placeholder">Click "Fetch from Discord" to load channels and roles.</p>
      </div>
    `;

    const syncContent = panel.querySelector("#sync-content");
    let syncData = null;

    const renderSyncForm = () => {
      if (!syncData) return;

      syncContent.innerHTML = "";
      const warning = renderWarningBox(
        syncData.missingChannels,
        syncData.missingRoles,
      );
      if (warning) syncContent.appendChild(warning);

      const channelsHeading = document.createElement("h3");
      channelsHeading.textContent = "Channel slots";
      syncContent.appendChild(channelsHeading);
      syncContent.appendChild(
        renderSlotSelectForm(
          meta.channelSlotNames,
          syncData.suggestedChannels,
          syncData.discord.channels,
          "sync-channel",
        ),
      );

      const rolesHeading = document.createElement("h3");
      rolesHeading.textContent = "Role slots";
      syncContent.appendChild(rolesHeading);
      syncContent.appendChild(
        renderSlotSelectForm(
          meta.roleSlotNames,
          syncData.suggestedRoles,
          syncData.discord.roles,
          "sync-role",
        ),
      );

      const actions = document.createElement("div");
      actions.className = "actions";
      const saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.textContent = "Save mappings to production";
      saveBtn.addEventListener("click", async () => {
        const channels = collectSlotSelects("sync-channel");
        const roles = collectSlotSelects("sync-role");
        const missingChannels = meta.channelSlotNames.filter(
          (name) => !channels[name],
        );
        const missingRoles = meta.roleSlotNames.filter((name) => !roles[name]);

        let message = "You are editing PRODUCTION. Save these Discord mappings?";
        if (missingChannels.length > 0 || missingRoles.length > 0) {
          message += `\n\nWarning: some slots are still unmapped.`;
          if (missingChannels.length > 0) {
            message += `\nChannels: ${missingChannels.join(", ")}`;
          }
          if (missingRoles.length > 0) {
            message += `\nRoles: ${missingRoles.join(", ")}`;
          }
        }

        const confirmed = await confirmProduction("Save Discord sync", message);
        if (!confirmed) return;

        const result = await apiFetch(`/guilds/${guild.id}/discord-sync`, {
          method: "POST",
          body: JSON.stringify({ channels, roles }),
        });

        syncData = {
          ...syncData,
          suggestedChannels: Object.fromEntries(
            result.channels.map((row) => [row.name, row.discordId]),
          ),
          suggestedRoles: Object.fromEntries(
            result.roles.map((row) => [row.name, row.discordId]),
          ),
          missingChannels: result.missingChannels,
          missingRoles: result.missingRoles,
        };
        renderSyncForm();
      });
      actions.appendChild(saveBtn);
      syncContent.appendChild(actions);
    };

    panel.querySelector("#fetch-discord-btn").addEventListener("click", async () => {
      syncContent.innerHTML = `<p class="placeholder">Fetching from Discord...</p>`;
      try {
        syncData = await apiFetch(`/guilds/${guild.id}/discord-resources`);
        renderSyncForm();
      } catch (error) {
        syncContent.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`;
      }
    });
  }

  if (activeTab === "channels") {
    let discordChannels = [];
    try {
      const resources = await loadDiscordResources(guild.id);
      discordChannels = resources.discord?.channels || [];
    } catch (error) {
      panel.innerHTML = `<p class="error">Could not load Discord channels: ${escapeHtml(
        error.message,
      )}</p>`;
    }

    if (!panel.querySelector(".error")) {
      const hint = document.createElement("p");
      hint.textContent =
        "Search channels by name or ID, then click a result to map the slot.";
      panel.appendChild(hint);
      panel.appendChild(renderSlotForm(channels, "channel", discordChannels));

      const actions = document.createElement("div");
      actions.className = "actions";
      const saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.textContent = "Save channels";
      saveBtn.addEventListener("click", async () => {
        const confirmed = await confirmProduction(
          "Save channels",
          "You are editing PRODUCTION. Save channel mappings for this guild?",
        );
        if (!confirmed) return;

        await apiFetch(`/guilds/${guild.id}/channels`, {
          method: "PUT",
          body: JSON.stringify({ slots: collectSlots("channel") }),
        });
        await renderGuildPanel();
      });
      actions.appendChild(saveBtn);
      panel.appendChild(actions);
    }
  }

  if (activeTab === "roles") {
    let discordRoles = [];
    try {
      const resources = await loadDiscordResources(guild.id);
      discordRoles = resources.discord?.roles || [];
    } catch (error) {
      panel.innerHTML = `<p class="error">Could not load Discord roles: ${escapeHtml(
        error.message,
      )}</p>`;
    }

    if (!panel.querySelector(".error")) {
      const tierNames = new Set(meta?.tierRoleSlotNames ?? []);
      const grid = document.createElement("div");
      grid.className = "field-grid";

      const hint = document.createElement("p");
      hint.textContent =
        "Search roles by name or ID, then click a result to map the slot.";
      panel.appendChild(hint);

      roles.forEach((role) => {
        const row = document.createElement("div");
        row.className = "field-row";

        const label = document.createElement("label");
        label.textContent = role.name;
        label.setAttribute("for", `role-${role.name}`);

        const fields = document.createElement("div");
        fields.className = "field-grid";

        const picker = createDiscordPicker({
          items: discordRoles,
          value: role.discordId || "",
          placeholder: "Search role by name or ID…",
          inputId: `role-${role.name}`,
          datasetSlotName: role.name,
        });
        fields.appendChild(picker.root);

        if (tierNames.has(role.name)) {
          const limitInput = document.createElement("input");
          limitInput.type = "number";
          limitInput.min = "0";
          limitInput.id = `role-limit-${role.name}`;
          limitInput.value =
            role.imageLimit === null || role.imageLimit === undefined
              ? ""
              : String(role.imageLimit);
          limitInput.placeholder =
            role.name === "diamond" ? "Empty = unlimited" : "Image limit";
          fields.appendChild(limitInput);
          if (role.name === "diamond") {
            const limitHint = document.createElement("small");
            limitHint.textContent = "Leave empty for unlimited (diamond).";
            fields.appendChild(limitHint);
          }
        }

        row.appendChild(label);
        row.appendChild(fields);
        grid.appendChild(row);
      });

      panel.appendChild(grid);

      const actions = document.createElement("div");
      actions.className = "actions";
      const saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.textContent = "Save roles";
      saveBtn.addEventListener("click", async () => {
        const confirmed = await confirmProduction(
          "Save roles",
          "You are editing PRODUCTION. Save role mappings and tier image limits for this guild?",
        );
        if (!confirmed) return;

        const { slots, imageLimits } = collectRoleData();
        await apiFetch(`/guilds/${guild.id}/roles`, {
          method: "PUT",
          body: JSON.stringify({ slots, imageLimits }),
        });
        await renderGuildPanel();
      });
      actions.appendChild(saveBtn);
      panel.appendChild(actions);
    }
  }

  if (activeTab === "economy") {
    const subTabs = [
      ["currency", "Currency"],
      ["store", "Store"],
    ];
    const subTabsEl = document.createElement("div");
    subTabsEl.className = "tabs sub-tabs";
    subTabs.forEach(([key, label]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `tab${economySubTab === key ? " active" : ""}`;
      btn.textContent = label;
      btn.addEventListener("click", () => {
        economySubTab = key;
        void renderGuildPanel();
      });
      subTabsEl.appendChild(btn);
    });
    panel.appendChild(subTabsEl);

    const subPanel = document.createElement("div");
    panel.appendChild(subPanel);

    if (economySubTab === "currency") {
      subPanel.innerHTML = `
        <div class="field-grid">
          <div class="field-row">
            <label for="currency-name">Name</label>
            <input id="currency-name" type="text" value="${escapeHtml(currency?.name || "")}" />
          </div>
          <div class="field-row">
            <label for="currency-plural">Plural name</label>
            <input id="currency-plural" type="text" value="${escapeHtml(currency?.namePlural || "")}" />
          </div>
          <div class="field-row">
            <label for="currency-icon">Icon URL</label>
            <input id="currency-icon" type="text" value="${escapeHtml(currency?.iconSrc || "")}" />
          </div>
        </div>
        <div class="actions">
          <button type="button" id="save-currency-btn">Save currency</button>
        </div>
      `;

      subPanel.querySelector("#save-currency-btn").addEventListener("click", async () => {
        const confirmed = await confirmProduction(
          "Save currency",
          "You are editing PRODUCTION. Save currency settings for this guild?",
        );
        if (!confirmed) return;

        await apiFetch(`/guilds/${guild.id}/currency`, {
          method: "PUT",
          body: JSON.stringify({
            name: subPanel.querySelector("#currency-name").value.trim(),
            namePlural: subPanel.querySelector("#currency-plural").value.trim(),
            iconSrc: subPanel.querySelector("#currency-icon").value.trim(),
          }),
        });
        await renderGuildPanel();
      });
    }

    if (economySubTab === "store") {
      await renderStoreSubPanel(subPanel, guild);
    }
  }

  if (activeTab === "ai-roleplay") {
    panel.innerHTML = `
      <p>Configure reaction-triggered AI roleplay for this guild. Map the <code>ai-roleplay</code> channel on the Channels tab first.</p>
      <div class="field-grid">
        <div class="field-row">
          <label for="ai-rp-trigger-emoji">Trigger emoji</label>
          <input id="ai-rp-trigger-emoji" type="text" value="${escapeHtml(aiRoleplay?.triggerEmoji || "")}" placeholder="e.g. 🎭" />
        </div>
        <div class="field-row">
          <label for="ai-rp-button-cost">Button click cost (coins)</label>
          <input id="ai-rp-button-cost" type="number" min="0" step="1" value="${aiRoleplay?.buttonCost ?? ""}" />
        </div>
        <div class="field-row">
          <label for="ai-rp-author-reward-trigger">Author reward on trigger (coins)</label>
          <input id="ai-rp-author-reward-trigger" type="number" min="0" step="1" value="${aiRoleplay?.authorRewardOnTrigger ?? ""}" />
        </div>
        <div class="field-row">
          <label for="ai-rp-author-reward-choice">Author reward on button click (coins)</label>
          <input id="ai-rp-author-reward-choice" type="number" min="0" step="1" value="${aiRoleplay?.authorRewardOnChoice ?? ""}" />
        </div>
        <div class="field-row">
          <label for="ai-rp-thinking-mode">Thinking mode</label>
          <select id="ai-rp-thinking-mode">
            <option value="false" ${aiRoleplay?.thinkingMode ? "" : "selected"}>Off (faster)</option>
            <option value="true" ${aiRoleplay?.thinkingMode ? "selected" : ""}>On</option>
          </select>
        </div>
        <div class="field-row">
          <label for="ai-rp-system-prompt">System prompt</label>
          <textarea id="ai-rp-system-prompt" rows="10">${escapeHtml(aiRoleplay?.systemPrompt || "")}</textarea>
        </div>
        <div class="field-row">
          <label for="ai-rp-roles">Roleplay roles (JSON)</label>
          <textarea id="ai-rp-roles" rows="10">${escapeHtml(
            JSON.stringify(
              Array.isArray(aiRoleplay?.roleplayRoles) &&
                aiRoleplay.roleplayRoles.length > 0
                ? aiRoleplay.roleplayRoles
                : [
                    {
                      id: "cuck",
                      label: "Cuck",
                      prompt: "The player is the humiliated cuck in this scene.",
                    },
                    {
                      id: "bull",
                      label: "Bull",
                      prompt: "The player is the dominant bull in this scene.",
                    },
                    {
                      id: "woman",
                      label: "Woman",
                      prompt: "The player is the woman in this scene.",
                    },
                  ],
              null,
              2,
            ),
          )}</textarea>
        </div>
      </div>
      <div class="actions">
        <button type="button" id="save-ai-roleplay-btn">Save AI roleplay settings</button>
      </div>
    `;

    panel.querySelector("#save-ai-roleplay-btn").addEventListener("click", async () => {
      const confirmed = await confirmProduction(
        "Save AI roleplay",
        "You are editing PRODUCTION. Save AI roleplay settings for this guild?",
      );
      if (!confirmed) return;

      const buttonCost = Number(panel.querySelector("#ai-rp-button-cost").value);
      const authorRewardOnTrigger = Number(
        panel.querySelector("#ai-rp-author-reward-trigger").value,
      );
      const authorRewardOnChoice = Number(
        panel.querySelector("#ai-rp-author-reward-choice").value,
      );

      let roleplayRoles;
      try {
        roleplayRoles = JSON.parse(panel.querySelector("#ai-rp-roles").value);
      } catch {
        alert("Roleplay roles must be valid JSON.");
        return;
      }

      await apiFetch(`/guilds/${guild.id}/ai-roleplay`, {
        method: "PUT",
        body: JSON.stringify({
          triggerEmoji: panel.querySelector("#ai-rp-trigger-emoji").value.trim(),
          systemPrompt: panel.querySelector("#ai-rp-system-prompt").value.trim(),
          roleplayRoles,
          buttonCost,
          authorRewardOnTrigger,
          authorRewardOnChoice,
          thinkingMode: panel.querySelector("#ai-rp-thinking-mode").value === "true",
        }),
      });
      await renderGuildPanel();
    });
  }

  mainPanel.appendChild(panel);
  applyReadOnlyUi();
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

appSettingsBtn.addEventListener("click", () => {
  selectedGuildId = null;
  activeTab = "app-settings";
  renderGuildList();
  void renderGuildPanel();
});

discordAuditBtn.addEventListener("click", () => {
  selectedGuildId = null;
  activeTab = "discord-audit";
  renderGuildList();
  void renderGuildPanel();
});

const boolLabel = (value) => {
  if (value === true) return "yes";
  if (value === false) return "no";
  return "n/a";
};

const statusBadge = (guild) => {
  if (guild.inDatabase) {
    return `<span class="audit-badge ok">in Discord + DB</span>`;
  }
  return `<span class="audit-badge warn">in Discord only</span>`;
};

const downloadBlob = (filename, content, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const auditRowsToCsv = (audit) => {
  const headers = [
    "discordGuildId",
    "name",
    "memberCount",
    "ownerId",
    "ownerUsername",
    "botConnected",
    "hasAdministrator",
    "hasManageGuild",
    "hasManageMessages",
    "hasManageChannels",
    "hasViewChannel",
    "hasSendMessages",
    "hasReadMessageHistory",
    "visibleChannelCount",
    "inDatabase",
    "dbGuildId",
    "dbName",
    "dbChannelCount",
    "dbRoleCount",
    "dbHasCurrency",
    "dbHasRoleplayConfig",
    "lastRecordedActivityAt",
    "notes",
  ];

  const escapeCsv = (value) => {
    const text = value == null ? "" : String(value);
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  };

  const lines = [headers.join(",")];
  for (const guild of audit.guilds) {
    lines.push(
      [
        guild.discordGuildId,
        guild.name,
        guild.memberCount,
        guild.ownerId,
        guild.ownerUsername,
        guild.botConnected,
        guild.hasAdministrator,
        guild.hasManageGuild,
        guild.hasManageMessages,
        guild.hasManageChannels,
        guild.hasViewChannel,
        guild.hasSendMessages,
        guild.hasReadMessageHistory,
        guild.visibleChannels?.length ?? "",
        guild.inDatabase,
        guild.dbGuildId,
        guild.dbName,
        guild.dbChannelCount,
        guild.dbRoleCount,
        guild.dbHasCurrency,
        guild.dbHasRoleplayConfig,
        guild.lastRecordedActivityAt,
        (guild.notes || []).join(" | "),
      ]
        .map(escapeCsv)
        .join(","),
    );
  }

  for (const guild of audit.dbOnlyGuilds || []) {
    lines.push(
      [
        guild.discordGuildId,
        guild.name,
        "",
        "",
        "",
        false,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        true,
        guild.dbGuildId,
        guild.name,
        "",
        "",
        "",
        "",
        "",
        guild.note,
      ]
        .map(escapeCsv)
        .join(","),
    );
  }

  return `${lines.join("\n")}\n`;
};

const renderDiscordAuditPanel = async () => {
  mainPanel.innerHTML = `<p class="placeholder">Loading Discord install audit…</p>`;

  try {
    latestDiscordAudit = await apiFetch("/audit/discord-guilds");
  } catch (error) {
    mainPanel.innerHTML = `<p class="error">${escapeHtml(error.message)}</p>`;
    return;
  }

  const audit = latestDiscordAudit;
  const panel = document.createElement("div");
  panel.className = "tab-panel";

  const guildRows = audit.guilds
    .map(
      (guild) => `
      <tr>
        <td>${escapeHtml(guild.name)}</td>
        <td>${escapeHtml(guild.discordGuildId)}</td>
        <td>${guild.memberCount ?? "n/a"}</td>
        <td>${escapeHtml(guild.ownerUsername || guild.ownerId || "n/a")}</td>
        <td>${statusBadge(guild)}</td>
        <td>${boolLabel(guild.hasAdministrator)}</td>
        <td>${boolLabel(guild.hasManageGuild)}</td>
        <td>${boolLabel(guild.hasManageMessages)}</td>
        <td>${boolLabel(guild.hasManageChannels)}</td>
        <td>${boolLabel(guild.hasViewChannel)}</td>
        <td>${boolLabel(guild.hasSendMessages)}</td>
        <td>${boolLabel(guild.hasReadMessageHistory)}</td>
        <td>${guild.visibleChannels?.length ?? "n/a"}</td>
        <td>${escapeHtml(guild.lastRecordedActivityAt || "n/a")}</td>
        <td>${escapeHtml((guild.notes || []).join(" | ") || "")}</td>
      </tr>`,
    )
    .join("");

  const dbOnlyRows = (audit.dbOnlyGuilds || [])
    .map(
      (guild) => `
      <tr>
        <td>${escapeHtml(guild.name)}</td>
        <td>${escapeHtml(guild.discordGuildId)}</td>
        <td colspan="12"><span class="audit-badge missing">in DB only</span> ${escapeHtml(guild.note)}</td>
      </tr>`,
    )
    .join("");

  panel.innerHTML = `
    <div class="panel-header">
      <h2>Discord install audit</h2>
    </div>
    <p class="audit-note">${escapeHtml(audit.ownerFieldMeaning)}</p>
    <p class="audit-note">Generated at ${escapeHtml(audit.generatedAt)}. Bot permissions are guild-level (channel overwrites not applied). Channel list is what Discord returns for the bot token.</p>
    <div class="audit-actions">
      <button type="button" id="audit-refresh-btn" class="readonly-safe">Refresh</button>
      <button type="button" id="audit-download-json" class="secondary readonly-safe">Download JSON</button>
      <button type="button" id="audit-download-csv" class="secondary readonly-safe">Download CSV</button>
    </div>
    <div class="audit-table-wrap">
      <table class="audit-table">
        <thead>
          <tr>
            <th>Server</th>
            <th>Guild ID</th>
            <th>Members</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Admin</th>
            <th>Manage Server</th>
            <th>Manage Messages</th>
            <th>Manage Channels</th>
            <th>View Channel</th>
            <th>Send Messages</th>
            <th>Read History</th>
            <th>Channels seen</th>
            <th>Last DB activity</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${guildRows || `<tr><td colspan="15">No Discord guilds returned for this bot token.</td></tr>`}
          ${dbOnlyRows}
        </tbody>
      </table>
    </div>
  `;

  mainPanel.innerHTML = "";
  mainPanel.appendChild(panel);

  panel.querySelector("#audit-refresh-btn").addEventListener("click", () => {
    void renderDiscordAuditPanel();
  });
  panel.querySelector("#audit-download-json").addEventListener("click", () => {
    downloadBlob(
      "discord-guild-audit.json",
      JSON.stringify(latestDiscordAudit, null, 2),
      "application/json",
    );
  });
  panel.querySelector("#audit-download-csv").addEventListener("click", () => {
    downloadBlob(
      "discord-guild-audit.csv",
      auditRowsToCsv(latestDiscordAudit),
      "text/csv;charset=utf-8",
    );
  });

  // Keep audit actions usable even in read-only mode (export is non-mutating).
  applyReadOnlyUi();
  panel.querySelectorAll(".readonly-safe").forEach((element) => {
    element.disabled = false;
  });
};

addGuildBtn.addEventListener("click", async () => {
  const name = prompt("Guild display name:");
  if (!name?.trim()) return;
  const discordId = prompt("Discord guild ID:");
  if (!discordId?.trim()) return;

  const confirmed = await confirmProduction(
    "Add guild",
    `You are editing PRODUCTION. Create guild "${name.trim()}"?`,
  );
  if (!confirmed) return;

  const data = await apiFetch("/guilds", {
    method: "POST",
    body: JSON.stringify({ name: name.trim(), discordId: discordId.trim() }),
  });

  selectedGuildId = data.guild.id;
  activeTab = "sync";
  await loadGuilds();
  await renderGuildPanel();
});

const boot = async () => {
  if (!apiKey) {
    showLogin();
    return;
  }

  try {
    await loadMeta();
    await loadGuilds();
    showApp();
  } catch (error) {
    sessionStorage.removeItem(API_KEY_STORAGE);
    apiKey = "";
    showLoginError(error.message);
    showLogin();
  }
};

loginBtn.addEventListener("click", async () => {
  hideLoginError();
  apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    showLoginError("API key is required");
    return;
  }

  try {
    await loadMeta();
    sessionStorage.setItem(API_KEY_STORAGE, apiKey);
    await loadGuilds();
    showApp();
  } catch (error) {
    showLoginError(error.message);
  }
});

apiKeyInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loginBtn.click();
});

void boot();
