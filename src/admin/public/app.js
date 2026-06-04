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
let confirmResolver = null;

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
    ["currency", "Currency"],
    ["ai-roleplay", "AI Roleplay"],
    ["reasons", "Removal Reasons"],
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

const renderSlotForm = (items, prefix) => {
  const grid = document.createElement("div");
  grid.className = "field-grid";

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "field-row";

    const label = document.createElement("label");
    label.textContent = item.name;
    label.setAttribute("for", `${prefix}-${item.name}`);

    const input = document.createElement("input");
    input.type = "text";
    input.id = `${prefix}-${item.name}`;
    input.dataset.slotName = item.name;
    input.value = item.discordId || "";
    input.placeholder = "Discord channel/role ID";

    row.appendChild(label);
    row.appendChild(input);
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

    const select = document.createElement("select");
    select.id = `${prefix}-${slotName}`;
    select.dataset.slotName = slotName;

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "— Not mapped —";
    select.appendChild(emptyOption);

    discordItems.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} (${item.id})`;
      select.appendChild(option);
    });

    select.value = mappings[slotName] || "";
    row.appendChild(label);
    row.appendChild(select);
    grid.appendChild(row);
  });

  return grid;
};

const collectSlotSelects = (prefix) => {
  const selects = mainPanel.querySelectorAll(`select[data-slot-name]`);
  const slots = {};

  selects.forEach((select) => {
    if (!select.id.startsWith(prefix)) return;
    slots[select.dataset.slotName] = select.value.trim();
  });

  return slots;
};

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

const renderGuildPanel = async () => {
  if (activeTab === "app-settings") {
    await renderAppSettingsPanel();
    return;
  }

  if (!selectedGuildId) {
    mainPanel.innerHTML = `<p class="placeholder">Select a guild or create a new one.</p>`;
    return;
  }

  mainPanel.innerHTML = `<p class="placeholder">Loading...</p>`;
  const data = await apiFetch(`/guilds/${selectedGuildId}`);
  const { guild, channels, roles, currency, removalReasons, aiRoleplay } = data;

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
        `Delete "${guild.name}" and all related channels, roles, currency, and removal reasons from PRODUCTION?`,
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
    const form = renderSlotForm(channels, "channel");
    form.querySelectorAll("input").forEach((input) => {
      input.id = `channel-${input.dataset.slotName}`;
    });
    panel.appendChild(form);

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

  if (activeTab === "roles") {
    const tierNames = new Set(meta?.tierRoleSlotNames ?? []);
    const grid = document.createElement("div");
    grid.className = "field-grid";

    roles.forEach((role) => {
      const row = document.createElement("div");
      row.className = "field-row";

      const label = document.createElement("label");
      label.textContent = role.name;
      label.setAttribute("for", `role-${role.name}`);

      const fields = document.createElement("div");
      fields.className = "field-grid";

      const idInput = document.createElement("input");
      idInput.type = "text";
      idInput.id = `role-${role.name}`;
      idInput.dataset.slotName = role.name;
      idInput.value = role.discordId || "";
      idInput.placeholder = "Discord role ID";
      fields.appendChild(idInput);

      if (tierNames.has(role.name)) {
        const limitInput = document.createElement("input");
        limitInput.type = "number";
        limitInput.min = "0";
        limitInput.id = `role-limit-${role.name}`;
        limitInput.value =
          role.imageLimit === null || role.imageLimit === undefined
            ? ""
            : String(role.imageLimit);
        limitInput.placeholder = role.name === "diamond" ? "Empty = unlimited" : "Image limit";
        fields.appendChild(limitInput);
        if (role.name === "diamond") {
          const hint = document.createElement("small");
          hint.textContent = "Leave empty for unlimited (diamond).";
          fields.appendChild(hint);
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

  if (activeTab === "currency") {
    panel.innerHTML = `
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

    panel.querySelector("#save-currency-btn").addEventListener("click", async () => {
      const confirmed = await confirmProduction(
        "Save currency",
        "You are editing PRODUCTION. Save currency settings for this guild?",
      );
      if (!confirmed) return;

      await apiFetch(`/guilds/${guild.id}/currency`, {
        method: "PUT",
        body: JSON.stringify({
          name: panel.querySelector("#currency-name").value.trim(),
          namePlural: panel.querySelector("#currency-plural").value.trim(),
          iconSrc: panel.querySelector("#currency-icon").value.trim(),
        }),
      });
      await renderGuildPanel();
    });
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

      await apiFetch(`/guilds/${guild.id}/ai-roleplay`, {
        method: "PUT",
        body: JSON.stringify({
          triggerEmoji: panel.querySelector("#ai-rp-trigger-emoji").value.trim(),
          systemPrompt: panel.querySelector("#ai-rp-system-prompt").value.trim(),
          buttonCost,
          authorRewardOnTrigger,
          authorRewardOnChoice,
          thinkingMode: panel.querySelector("#ai-rp-thinking-mode").value === "true",
        }),
      });
      await renderGuildPanel();
    });
  }

  if (activeTab === "reasons") {
    removalReasons.forEach((reason) => {
      const card = document.createElement("div");
      card.className = "reason-card";
      card.innerHTML = `
        <h4>Reason #${reason.id}</h4>
        <div class="field-grid">
          <div class="field-row">
            <label>Title</label>
            <input type="text" data-field="title" value="${escapeHtml(reason.title)}" />
          </div>
          <div class="field-row">
            <label>Description</label>
            <textarea data-field="description">${escapeHtml(reason.description)}</textarea>
          </div>
          <div class="field-row">
            <label>Value</label>
            <input type="text" data-field="value" value="${escapeHtml(reason.value)}" />
          </div>
        </div>
        <div class="actions">
          <button type="button" class="save-reason-btn">Save</button>
          <button type="button" class="delete-reason-btn danger secondary">Delete</button>
        </div>
      `;

      card.querySelector(".save-reason-btn").addEventListener("click", async () => {
        const confirmed = await confirmProduction(
          "Save removal reason",
          "You are editing PRODUCTION. Save this removal reason?",
        );
        if (!confirmed) return;

        await apiFetch(`/guilds/${guild.id}/removal-reasons/${reason.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: card.querySelector('[data-field="title"]').value.trim(),
            description: card.querySelector('[data-field="description"]').value.trim(),
            value: card.querySelector('[data-field="value"]').value.trim(),
          }),
        });
        await renderGuildPanel();
      });

      card.querySelector(".delete-reason-btn").addEventListener("click", async () => {
        const confirmed = await confirmProduction(
          "Delete removal reason",
          "You are editing PRODUCTION. Delete this removal reason?",
        );
        if (!confirmed) return;

        await apiFetch(`/guilds/${guild.id}/removal-reasons/${reason.id}`, {
          method: "DELETE",
        });
        await renderGuildPanel();
      });

      panel.appendChild(card);
    });

    const addCard = document.createElement("div");
    addCard.className = "reason-card";
    addCard.innerHTML = `
      <h4>Add removal reason</h4>
      <div class="field-grid">
        <div class="field-row">
          <label>Title</label>
          <input type="text" id="new-reason-title" />
        </div>
        <div class="field-row">
          <label>Description</label>
          <textarea id="new-reason-description"></textarea>
        </div>
        <div class="field-row">
          <label>Value</label>
          <input type="text" id="new-reason-value" />
        </div>
      </div>
      <div class="actions">
        <button type="button" id="add-reason-btn">Add reason</button>
      </div>
    `;

    addCard.querySelector("#add-reason-btn").addEventListener("click", async () => {
      const confirmed = await confirmProduction(
        "Add removal reason",
        "You are editing PRODUCTION. Add this removal reason?",
      );
      if (!confirmed) return;

      await apiFetch(`/guilds/${guild.id}/removal-reasons`, {
        method: "POST",
        body: JSON.stringify({
          title: addCard.querySelector("#new-reason-title").value.trim(),
          description: addCard.querySelector("#new-reason-description").value.trim(),
          value: addCard.querySelector("#new-reason-value").value.trim(),
        }),
      });
      await renderGuildPanel();
    });

    panel.appendChild(addCard);
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
