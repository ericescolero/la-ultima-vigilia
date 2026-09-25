(() => {
  "use strict";

  const DATA_URL = "/assets/data/prophecy-explorer.json";
  const PROJECT_CLASSES = new Set(["HAR", "INT", "CHR", "HIS", "PROV", "SPEC", "UNR"]);
  const MOBILE_TIMELINE_MEDIA = window.matchMedia("(max-width: 719px)");
  const OVERVIEW_TYPES = new Set([
    "anchor",
    "transition",
    "heavenly_transition",
    "interpretive_transition",
    "span_start",
    "period_start",
    "system_transition",
    "religious_system_transition",
    "worship_enforcement",
    "resurrection",
    "gathering",
    "judgment_transition",
    "mobilization",
    "return",
    "final_state"
  ]);

  let lastFocusedElement = null;

  const state = {
    data: null,
    mode: "overview",
    scripture: false,
    project: false,
    showBadges: true,
    showFeasts: true,
    showCounts: true,
    showUnresolved: true,
    visibleLanes: new Set(),
    query: "",
    selectedPhase: "P00"
  };

  const el = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    cache();
    bind();

    try {
      const response = await fetch(DATA_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.data = await response.json();
      validateData(state.data);
      state.visibleLanes = new Set(state.data.lanes.map((lane) => lane.id));
      renderLaneControls();
      renderLegend();
      renderPhaseStrip();
      renderAll();
      handleHash(true);
      el.status.textContent = `${state.data.events.length} eventos · ${state.data.counts.length} conteos · esquema ${state.data.schema_version}`;
      window.addEventListener("hashchange", () => handleHash(false));
    } catch (error) {
      console.error(error);
      el.status.textContent = "No se pudo cargar el mapa profético.";
      el.overviewGrid.innerHTML = '<div class="prophecy-empty">No se pudieron cargar los datos del mapa.</div>';
    }
  }

  function cache() {
    Object.assign(el, {
      modeOverview: document.querySelector("#prophecy-mode-overview"),
      modeDetailed: document.querySelector("#prophecy-mode-detailed"),
      searchInput: document.querySelector("#prophecy-search-input"),
      reset: document.querySelector("#prophecy-reset"),
      scripture: document.querySelector("#prophecy-scripture"),
      project: document.querySelector("#prophecy-project"),
      badges: document.querySelector("#prophecy-badges"),
      feasts: document.querySelector("#prophecy-feasts"),
      counts: document.querySelector("#prophecy-counts"),
      unresolved: document.querySelector("#prophecy-unresolved"),
      lanes: document.querySelector("#prophecy-lanes"),
      legend: document.querySelector("#prophecy-legend"),
      status: document.querySelector("#prophecy-status"),
      phases: document.querySelector("#prophecy-phases"),
      searchResults: document.querySelector("#prophecy-search-results"),
      searchSummary: document.querySelector("#prophecy-search-summary"),
      searchGrid: document.querySelector("#prophecy-search-grid"),
      overview: document.querySelector("#prophecy-overview"),
      overviewSummary: document.querySelector("#prophecy-overview-summary"),
      overviewGrid: document.querySelector("#prophecy-overview-grid"),
      detailed: document.querySelector("#prophecy-detailed"),
      detailedSummary: document.querySelector("#prophecy-detailed-summary"),
      timeline: document.querySelector("#prophecy-timeline"),
      countSection: document.querySelector("#prophecy-count-section"),
      countGrid: document.querySelector("#prophecy-count-grid"),
      inspector: document.querySelector("#prophecy-inspector"),
      inspectorPanel: document.querySelector(".prophecy-inspector-panel"),
      inspectorKicker: document.querySelector("#prophecy-inspector-kicker"),
      inspectorTitle: document.querySelector("#prophecy-inspector-title"),
      inspectorBody: document.querySelector("#prophecy-inspector-body"),
      inspectorClose: document.querySelector("#prophecy-inspector-close")
    });
  }

  function bind() {
    el.modeOverview.addEventListener("click", () => setMode("overview"));
    el.modeDetailed.addEventListener("click", () => setMode("detailed"));

    el.searchInput.addEventListener("input", () => {
      state.query = el.searchInput.value.trim();
      renderAll();
    });

    el.scripture.addEventListener("change", () => {
      state.scripture = el.scripture.checked;
      renderAll();
    });

    el.project.addEventListener("change", () => {
      state.project = el.project.checked;
      renderAll();
    });

    el.badges.addEventListener("change", () => {
      state.showBadges = el.badges.checked;
      document.body.classList.toggle("prophecy-hide-badges", !state.showBadges);
    });

    el.feasts.addEventListener("change", () => {
      state.showFeasts = el.feasts.checked;
      renderAll();
    });

    el.counts.addEventListener("change", () => {
      state.showCounts = el.counts.checked;
      renderCounts();
    });

    el.unresolved.addEventListener("change", () => {
      state.showUnresolved = el.unresolved.checked;
      renderAll();
    });

    el.reset.addEventListener("click", reset);
    el.inspectorClose.addEventListener("click", closeInspector);
    el.inspector.addEventListener("click", (event) => {
      if (event.target.matches("[data-prophecy-close]")) closeInspector();
    });

    document.addEventListener("keydown", (event) => {
      if (!el.inspector.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        closeInspector();
        return;
      }

      if (event.key === "Tab") {
        trapInspectorFocus(event);
      }
    });

    const rerenderDetailedForBreakpoint = () => {
      if (state.data && state.mode === "detailed") {
        renderDetailed();
        renderSelection();
      }
    };
    if (typeof MOBILE_TIMELINE_MEDIA.addEventListener === "function") {
      MOBILE_TIMELINE_MEDIA.addEventListener("change", rerenderDetailedForBreakpoint);
    } else if (typeof MOBILE_TIMELINE_MEDIA.addListener === "function") {
      MOBILE_TIMELINE_MEDIA.addListener(rerenderDetailedForBreakpoint);
    }
  }

  function validateData(data) {
    const arrays = ["phases", "lanes", "classifications", "events", "counts"];
    for (const key of arrays) {
      if (!Array.isArray(data[key])) throw new Error(`Falta ${key}`);
    }
    const privateCandidate =
      data.public_export === false &&
      data.release_eligible === false &&
      data.deployment_authorized === false;

    const publicRelease =
      data.public_export === true &&
      data.release_eligible === true &&
      data.deployment_authorized === false &&
      data.public_release?.export_id === "prophetic-explorer-es-v1" &&
      data.public_release?.destination === "ericescolero/la-ultima-vigilia" &&
      data.public_release?.route === "/prophecy/" &&
      data.public_release?.authorization_part === 29;

    if (!privateCandidate && !publicRelease) {
      throw new Error("El paquete profético no coincide con un estado de publicación autorizado.");
    }
    if (data.phases.length !== 17 || data.lanes.length !== 13) {
      throw new Error("Cobertura P00-P16 / L01-L13 incompleta.");
    }
  }

  function setMode(mode) {
    state.mode = mode;
    const overview = mode === "overview";
    el.modeOverview.classList.toggle("is-active", overview);
    el.modeDetailed.classList.toggle("is-active", !overview);
    el.modeOverview.setAttribute("aria-pressed", String(overview));
    el.modeDetailed.setAttribute("aria-pressed", String(!overview));
    el.overview.hidden = !overview;
    el.detailed.hidden = overview;
    if (!overview) renderDetailed();
  }

  function reset() {
    state.mode = "overview";
    state.scripture = false;
    state.project = false;
    state.showBadges = true;
    state.showFeasts = true;
    state.showCounts = true;
    state.showUnresolved = true;
    state.query = "";
    state.selectedPhase = "P00";
    state.visibleLanes = new Set(state.data.lanes.map((lane) => lane.id));

    el.searchInput.value = "";
    el.scripture.checked = false;
    el.project.checked = false;
    el.badges.checked = true;
    el.feasts.checked = true;
    el.counts.checked = true;
    el.unresolved.checked = true;
    document.body.classList.remove("prophecy-hide-badges");

    renderLaneControls();
    setMode("overview");
    renderAll();
    history.replaceState(null, "", location.pathname + location.search);
  }

  function renderLaneControls() {
    el.lanes.innerHTML = "";
    for (const lane of state.data.lanes) {
      const label = document.createElement("label");
      label.className = "prophecy-lane-chip";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = state.visibleLanes.has(lane.id);
      input.addEventListener("change", () => {
        if (input.checked) state.visibleLanes.add(lane.id);
        else state.visibleLanes.delete(lane.id);
        renderAll();
      });

      const text = document.createElement("span");
      text.textContent = `${lane.id} · ${lane.label_es}`;
      label.append(input, text);
      el.lanes.append(label);
    }
  }

  function renderLegend() {
    el.legend.innerHTML = "";
    for (const item of state.data.classifications) {
      const badge = makeBadge(item.code);
      badge.title = `${item.name_es}: ${item.meaning_es}`;
      el.legend.append(badge);
    }
  }

  function renderPhaseStrip() {
    el.phases.innerHTML = "";
    for (const phase of state.data.phases) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "prophecy-phase-button";
      button.dataset.phase = phase.id;
      button.innerHTML = `<strong>${escapeHtml(phase.id)}</strong><span>${escapeHtml(phase.label_es)}</span>`;
      button.setAttribute("aria-label", `${phase.id}: ${phase.label_es}. ${phase.anchor_es}`);
      button.addEventListener("click", () => selectPhase(phase.id, true));
      el.phases.append(button);
    }
  }

  function renderAll() {
    if (!state.data) return;
    renderOverview();
    if (state.mode === "detailed") renderDetailed();
    renderCounts();
    renderSearch();
    renderSelection();
  }

  function selectPhase(phaseId, updateHash) {
    if (!state.data.phases.some((phase) => phase.id === phaseId)) return;
    state.selectedPhase = phaseId;

    if (state.mode === "overview") {
      renderSelection();
      document.querySelector(`.prophecy-phase-card[data-phase="${cssEscape(phaseId)}"]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    } else {
      renderDetailed();
      renderSelection();
      const selector = MOBILE_TIMELINE_MEDIA.matches
        ? `.prophecy-mobile-phase[data-phase="${cssEscape(phaseId)}"]`
        : `.prophecy-desktop-phase-detail[data-phase="${cssEscape(phaseId)}"]`;
      document.querySelector(selector)?.scrollIntoView({
        behavior: "smooth",
        block: MOBILE_TIMELINE_MEDIA.matches ? "start" : "nearest",
        inline: "nearest"
      });
    }

    if (updateHash) setHash(`phase:${phaseId}`);
  }

  function visibleEvents() {
    return state.data.events.filter(eventMatches);
  }

  function eventMatches(event) {
    if (event.lane_ids.length && !event.lane_ids.some((id) => state.visibleLanes.has(id))) return false;

    const codes = eventCodes(event);
    if (state.scripture || state.project) {
      const scriptureMatch = state.scripture && codes.includes("TXT");
      const projectMatch = state.project && codes.some((code) => PROJECT_CLASSES.has(code));
      if (!scriptureMatch && !projectMatch) return false;
    }

    if (!state.showUnresolved && codes.includes("UNR")) return false;

    if (state.query) {
      const haystack = [
        event.id,
        event.label_es,
        event.label,
        event.phase_id,
        event.anchor_es,
        ...(event.scripture_refs || []),
        ...(event.lane_ids || []),
        ...codes
      ].join(" ").toLowerCase();
      if (!haystack.includes(state.query.toLowerCase())) return false;
    }

    return true;
  }

  function renderOverview() {
    const visible = visibleEvents();
    el.overviewGrid.innerHTML = "";
    el.overviewSummary.textContent = `${visible.length} eventos visibles`;

    for (const phase of state.data.phases) {
      const all = visible.filter((event) => event.phase_id === phase.id);
      const preferred = all.filter((event) => OVERVIEW_TYPES.has(event.event_type));
      const shown = (preferred.length ? preferred : all).slice(0, 5);

      const card = document.createElement("article");
      card.className = "prophecy-phase-card";
      card.dataset.phase = phase.id;

      const head = document.createElement("div");
      head.className = "prophecy-phase-card-head";

      const copy = document.createElement("div");
      const id = document.createElement("div");
      id.className = "phase-id";
      id.textContent = phase.id;
      const title = document.createElement("h3");
      title.textContent = phase.label_es;
      const anchor = document.createElement("div");
      anchor.className = "prophecy-anchor";
      anchor.textContent = phase.anchor_es;
      if (!state.showFeasts) anchor.classList.add("prophecy-hide-feast");
      copy.append(id, title, anchor);

      const count = document.createElement("span");
      count.className = "prophecy-status";
      count.textContent = `${all.length} eventos`;
      head.append(copy, count);
      card.append(head);

      const list = document.createElement("div");
      list.className = "prophecy-event-list";
      if (!shown.length) {
        list.innerHTML = '<div class="prophecy-empty">Ningún evento coincide con los filtros actuales.</div>';
      } else {
        for (const event of shown) list.append(makeEventButton(event));
      }
      card.append(list);

      if (all.length > shown.length) {
        const more = document.createElement("div");
        more.className = "prophecy-more";
        more.textContent = `+${all.length - shown.length} más en vista Detallada`;
        card.append(more);
      }

      el.overviewGrid.append(card);
    }
  }

  function renderDetailed() {
    const visible = visibleEvents();
    el.timeline.innerHTML = "";

    if (MOBILE_TIMELINE_MEDIA.matches) {
      renderMobileDetailed(visible);
      return;
    }

    renderDesktopPhaseDetail(visible);
  }

  function renderDesktopPhaseDetail(visible) {
    const phase = state.data.phases.find((item) => item.id === state.selectedPhase)
      || state.data.phases[0];
    const phaseEvents = visible
      .filter((event) => event.phase_id === phase.id)
      .sort((a, b) => a.sort_key - b.sort_key);

    el.timeline.className = "prophecy-timeline prophecy-phase-detail";
    el.detailedSummary.textContent = `${phaseEvents.length} eventos en ${phase.id} · ${state.visibleLanes.size} líneas activas`;

    const shell = document.createElement("section");
    shell.className = "prophecy-desktop-phase-detail";
    shell.dataset.phase = phase.id;

    const head = document.createElement("div");
    head.className = "prophecy-detail-phase-head";

    const copy = document.createElement("div");
    copy.className = "prophecy-detail-phase-copy";

    const kicker = document.createElement("div");
    kicker.className = "prophecy-detail-phase-kicker";
    kicker.textContent = `${phase.id} · FASE SELECCIONADA`;

    const title = document.createElement("h3");
    title.textContent = phase.label_es;

    const anchor = document.createElement("div");
    anchor.className = "prophecy-detail-phase-anchor";
    anchor.textContent = phase.anchor_es;
    if (!state.showFeasts) anchor.classList.add("prophecy-hide-feast");

    copy.append(kicker, title, anchor);

    const phaseNav = document.createElement("div");
    phaseNav.className = "prophecy-detail-phase-nav";
    const phaseIndex = state.data.phases.findIndex((item) => item.id === phase.id);

    if (phaseIndex > 0) {
      phaseNav.append(makePhaseStepButton(
        state.data.phases[phaseIndex - 1],
        "← Anterior"
      ));
    }
    if (phaseIndex < state.data.phases.length - 1) {
      phaseNav.append(makePhaseStepButton(
        state.data.phases[phaseIndex + 1],
        "Siguiente →"
      ));
    }

    head.append(copy, phaseNav);
    shell.append(head);

    if (!phaseEvents.length) {
      const empty = document.createElement("div");
      empty.className = "prophecy-empty";
      empty.textContent = "Ningún evento de esta fase coincide con los filtros actuales.";
      shell.append(empty);
      el.timeline.append(shell);
      return;
    }

    const laneOrder = new Map(state.data.lanes.map((lane, index) => [lane.id, index]));
    const groups = new Map();

    for (const event of phaseEvents) {
      const visibleEventLanes = event.lane_ids
        .filter((laneId) => state.visibleLanes.has(laneId))
        .sort((a, b) => (laneOrder.get(a) ?? 999) - (laneOrder.get(b) ?? 999));
      const primaryLaneId = visibleEventLanes[0] || "UNASSIGNED";

      if (!groups.has(primaryLaneId)) groups.set(primaryLaneId, []);
      groups.get(primaryLaneId).push({ event, visibleEventLanes });
    }

    const grid = document.createElement("div");
    grid.className = "prophecy-detail-lane-grid";

    for (const [laneId, entries] of [...groups.entries()].sort((a, b) => {
      return (laneOrder.get(a[0]) ?? 999) - (laneOrder.get(b[0]) ?? 999);
    })) {
      const lane = state.data.lanes.find((item) => item.id === laneId);
      const group = document.createElement("section");
      group.className = "prophecy-detail-lane-group";

      const groupHead = document.createElement("div");
      groupHead.className = "prophecy-detail-lane-head";

      const laneTitle = document.createElement("div");
      laneTitle.className = "prophecy-detail-lane-title";
      laneTitle.innerHTML = lane
        ? `<strong>${escapeHtml(lane.id)}</strong><span>${escapeHtml(lane.label_es)}</span>`
        : "<strong>—</strong><span>Sin línea asignada</span>";

      const laneCount = document.createElement("span");
      laneCount.className = "prophecy-detail-lane-count";
      laneCount.textContent = entries.length === 1 ? "1 evento" : `${entries.length} eventos`;

      groupHead.append(laneTitle, laneCount);
      group.append(groupHead);

      const list = document.createElement("div");
      list.className = "prophecy-detail-event-list";

      for (const { event, visibleEventLanes } of entries) {
        const button = makeEventButton(event);
        button.classList.add("prophecy-detail-event");

        if (visibleEventLanes.length > 1) {
          const cross = document.createElement("span");
          cross.className = "prophecy-detail-cross-lanes";
          cross.textContent = "También: " + visibleEventLanes
            .slice(1)
            .map((id) => {
              const other = state.data.lanes.find((item) => item.id === id);
              return other ? `${other.id} · ${other.label_es}` : id;
            })
            .join(" · ");
          button.append(cross);
        }

        list.append(button);
      }

      group.append(list);
      grid.append(group);
    }

    shell.append(grid);
    el.timeline.append(shell);
  }

  function makePhaseStepButton(phase, label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "prophecy-control prophecy-phase-step";
    button.textContent = `${label} · ${phase.id}`;
    button.setAttribute("aria-label", `${label}: ${phase.id}, ${phase.label_es}`);
    button.addEventListener("click", () => selectPhase(phase.id, true));
    return button;
  }

  function renderMobileDetailed(visible) {
    el.timeline.className = "prophecy-timeline prophecy-mobile-timeline";
    el.detailedSummary.textContent = `${visible.length} eventos visibles · agrupados por fase`;

    for (const phase of state.data.phases) {
      const events = visible
        .filter((event) => event.phase_id === phase.id)
        .sort((a, b) => a.sort_key - b.sort_key);

      if (!events.length) continue;

      const section = document.createElement("section");
      section.className = "prophecy-mobile-phase";
      section.dataset.phase = phase.id;

      const head = document.createElement("div");
      head.className = "prophecy-mobile-phase-head";

      const copy = document.createElement("div");
      const id = document.createElement("div");
      id.className = "prophecy-mobile-phase-id";
      id.textContent = phase.id;

      const title = document.createElement("h3");
      title.textContent = phase.label_es;

      const anchor = document.createElement("div");
      anchor.className = "prophecy-mobile-phase-anchor";
      anchor.textContent = phase.anchor_es;
      if (!state.showFeasts) anchor.classList.add("prophecy-hide-feast");

      copy.append(id, title, anchor);

      const count = document.createElement("span");
      count.className = "prophecy-mobile-phase-count";
      count.textContent = events.length === 1 ? "1 evento" : `${events.length} eventos`;

      head.append(copy, count);
      section.append(head);

      const list = document.createElement("div");
      list.className = "prophecy-mobile-events";

      for (const event of events) {
        const button = makeEventButton(event);
        const lanes = document.createElement("span");
        lanes.className = "prophecy-mobile-lanes";
        lanes.textContent = event.lane_ids
          .map((laneId) => {
            const lane = state.data.lanes.find((item) => item.id === laneId);
            return lane ? `${lane.id} · ${lane.label_es}` : laneId;
          })
          .join(" · ");
        button.append(lanes);
        list.append(button);
      }

      section.append(list);
      el.timeline.append(section);
    }

    if (!el.timeline.children.length) {
      el.timeline.innerHTML = '<div class="prophecy-empty">Ningún evento coincide con los filtros actuales.</div>';
    }
  }

  function makeEventButton(event) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "prophecy-event";

    const id = document.createElement("span");
    id.className = "prophecy-event-id";
    id.textContent = event.id;

    const label = document.createElement("span");
    label.className = "prophecy-event-label";
    label.textContent = event.label_es;
    button.append(id, label);

    const meta = document.createElement("span");
    meta.className = "prophecy-event-meta";
    for (const code of eventCodes(event)) meta.append(makeBadge(code));

    if (event.anchor_es) {
      const anchor = document.createElement("span");
      anchor.className = "prophecy-badge";
      anchor.textContent = event.anchor_es;
      if (!state.showFeasts) anchor.classList.add("prophecy-hide-feast");
      meta.append(anchor);
    }

    button.append(meta);
    button.setAttribute(
      "aria-label",
      `${event.label_es}. Fase ${event.phase_id}. Clasificación ${eventCodes(event).join(", ") || "sin etiqueta"}.`
    );
    button.addEventListener("click", () => openEvent(event.id, true));
    return button;
  }

  function makeBadge(code) {
    const badge = document.createElement("span");
    badge.className = "prophecy-badge";
    badge.dataset.code = code;
    badge.textContent = code;
    return badge;
  }

  function renderCounts() {
    el.countSection.hidden = !state.showCounts;
    if (!state.showCounts) return;

    el.countGrid.innerHTML = "";
    const counts = state.data.counts.filter((count) => state.showUnresolved || count.count_status !== "unresolved_sync");

    for (const count of counts) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "prophecy-count-card";
      if (count.count_status === "unresolved_sync") card.classList.add("is-unresolved");

      const id = document.createElement("div");
      id.className = "prophecy-event-id";
      id.textContent = count.id;

      const title = document.createElement("h3");
      title.textContent = count.label_es;

      const value = document.createElement("div");
      value.className = "prophecy-count-value";
      value.textContent = `${count.value.toLocaleString("es-MX")} ${count.unit_es}`;

      const endpoints = document.createElement("div");
      endpoints.className = "prophecy-count-meta";
      endpoints.textContent = `${count.start_event_id} → ${count.end_event_id}`;

      const status = document.createElement("div");
      status.className = "prophecy-count-meta";
      status.textContent = count.status_es;

      card.append(id, title, value, endpoints, status);
      card.setAttribute(
        "aria-label",
        `${count.label_es}. ${count.value.toLocaleString("es-MX")} ${count.unit_es}. ${count.status_es}.`
      );
      card.addEventListener("click", () => openCount(count.id, true));
      el.countGrid.append(card);
    }
  }

  function renderSearch() {
    const query = state.query.toLowerCase();
    el.searchResults.hidden = !query;
    if (!query) {
      el.searchGrid.innerHTML = "";
      return;
    }

    const events = state.data.events.filter((event) => {
      const text = [
        event.id,
        event.label_es,
        event.label,
        event.phase_id,
        event.anchor_es,
        ...(event.scripture_refs || [])
      ].join(" ").toLowerCase();
      return text.includes(query) && eventMatchesWithoutQuery(event);
    });

    el.searchSummary.textContent = `${events.length} eventos`;
    el.searchGrid.innerHTML = "";

    if (!events.length) {
      el.searchGrid.innerHTML = '<div class="prophecy-empty">No hay eventos coincidentes.</div>';
      return;
    }

    for (const event of events.slice(0, 30)) {
      el.searchGrid.append(makeEventButton(event));
    }
  }

  function eventMatchesWithoutQuery(event) {
    if (event.lane_ids.length && !event.lane_ids.some((id) => state.visibleLanes.has(id))) return false;
    const codes = eventCodes(event);

    if (state.scripture || state.project) {
      const scriptureMatch = state.scripture && codes.includes("TXT");
      const projectMatch = state.project && codes.some((code) => PROJECT_CLASSES.has(code));
      if (!scriptureMatch && !projectMatch) return false;
    }

    if (!state.showUnresolved && codes.includes("UNR")) return false;
    return true;
  }

  function openEvent(id, updateHash) {
    const event = state.data.events.find((item) => item.id === id);
    if (!event) return;

    state.selectedPhase = event.phase_id;
    if (state.mode === "detailed" && !MOBILE_TIMELINE_MEDIA.matches) {
      renderDetailed();
    }
    renderSelection();
    el.inspectorKicker.textContent = "EVENTO";
    el.inspectorTitle.textContent = event.label_es;
    el.inspectorBody.innerHTML = "";

    el.inspectorBody.append(detailList([
      ["ID del evento", event.id],
      ["Fase", event.phase_id],
      ["Línea(s)", event.lane_ids.join(", ") || "—"],
      ["Tipo", event.event_type],
      ["Ancla", event.anchor_es || "—"],
      ["Estado de duración", event.duration_status || "—"],
      ["Precisión visual", event.visual_precision || "—"]
    ]));

    const classes = document.createElement("div");
    classes.className = "prophecy-detail-section";
    classes.append(sectionTitle("Clasificación"));
    const row = document.createElement("div");
    row.className = "prophecy-relations";
    for (const code of eventCodes(event)) {
      const badge = makeBadge(code);
      const info = state.data.classifications.find((item) => item.code === code);
      if (info) badge.title = `${info.name_es}: ${info.meaning_es}`;
      row.append(badge);
    }
    classes.append(row);
    el.inspectorBody.append(classes);

    if (event.scripture_refs?.length) {
      el.inspectorBody.append(textSection("Referencias bíblicas", event.scripture_refs.join(" · ")));
    }

    const relations = document.createElement("div");
    relations.className = "prophecy-detail-section";
    relations.append(sectionTitle("Relaciones"));
    const buttons = document.createElement("div");
    buttons.className = "prophecy-relations";

    for (const relationId of [...(event.predecessors || []), ...(event.successors || [])]) {
      const relation = document.createElement("button");
      relation.type = "button";
      relation.className = "prophecy-relation";
      relation.textContent = relationId;
      relation.addEventListener("click", () => openEvent(relationId, true));
      buttons.append(relation);
    }

    if (!buttons.children.length) {
      const p = document.createElement("p");
      p.textContent = "Sin relación explícita de predecesor/sucesor.";
      buttons.append(p);
    }

    relations.append(buttons);
    el.inspectorBody.append(relations);
    openInspector();

    if (updateHash) setHash(`event:${id}`);
  }

  function openCount(id, updateHash) {
    const count = state.data.counts.find((item) => item.id === id);
    if (!count) return;

    el.inspectorKicker.textContent = "CONTEO";
    el.inspectorTitle.textContent = count.label_es;
    el.inspectorBody.innerHTML = "";

    el.inspectorBody.append(detailList([
      ["ID del conteo", count.id],
      ["Valor", `${count.value.toLocaleString("es-MX")} ${count.unit_es}`],
      ["Estado", count.status_es]
    ]));

    const endpoints = document.createElement("div");
    endpoints.className = "prophecy-detail-section";
    endpoints.append(sectionTitle("Extremos"));
    const row = document.createElement("div");
    row.className = "prophecy-relations";

    for (const eventId of [count.start_event_id, count.end_event_id]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "prophecy-relation";
      button.textContent = eventId;
      button.addEventListener("click", () => openEvent(eventId, true));
      row.append(button);
    }

    endpoints.append(row);
    el.inspectorBody.append(endpoints);
    openInspector();

    if (updateHash) setHash(`count:${id.replace(/^COUNT_/, "")}`);
  }

  function openInspector() {
    if (!el.inspector.classList.contains("is-open")) {
      lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    el.inspector.classList.add("is-open");
    el.inspector.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => el.inspectorClose.focus(), 0);
  }

  function closeInspector() {
    el.inspector.classList.remove("is-open");
    el.inspector.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";

    const restore = lastFocusedElement;
    lastFocusedElement = null;
    if (restore instanceof HTMLElement && document.contains(restore)) {
      setTimeout(() => restore.focus(), 0);
    }
  }

  function trapInspectorFocus(event) {
    const focusable = Array.from(
      el.inspectorPanel.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((node) => node instanceof HTMLElement && !node.hidden);

    if (!focusable.length) {
      event.preventDefault();
      el.inspectorClose.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function detailList(rows) {
    const list = document.createElement("dl");
    list.className = "prophecy-detail-grid";
    for (const [term, value] of rows) {
      const dt = document.createElement("dt");
      dt.textContent = term;
      const dd = document.createElement("dd");
      dd.textContent = value ?? "—";
      list.append(dt, dd);
    }
    return list;
  }

  function sectionTitle(text) {
    const heading = document.createElement("h3");
    heading.textContent = text;
    return heading;
  }

  function textSection(title, text) {
    const section = document.createElement("div");
    section.className = "prophecy-detail-section";
    section.append(sectionTitle(title));
    const p = document.createElement("p");
    p.textContent = text;
    section.append(p);
    return section;
  }

  function renderSelection() {
    document.querySelectorAll("[data-phase]").forEach((node) => {
      const selected = node.dataset.phase === state.selectedPhase;
      node.classList.toggle("is-selected", selected);
    });
  }

  function handleHash(initial) {
    let value = "";
    try {
      value = decodeURIComponent(location.hash.replace(/^#/, ""));
    } catch {
      return;
    }
    if (!value) return;
    const [type, rawId] = value.split(":", 2);
    if (!type || !rawId) return;

    if (type === "phase") {
      state.selectedPhase = rawId;
      renderSelection();
      if (!initial) selectPhase(rawId, false);
      return;
    }

    if (type === "event") {
      openEvent(rawId, false);
      return;
    }

    if (type === "count") {
      openCount(`COUNT_${rawId}`, false);
      return;
    }

    if (type === "lane" && state.data.lanes.some((lane) => lane.id === rawId)) {
      state.visibleLanes = new Set([rawId]);
      renderLaneControls();
      setMode("detailed");
      renderAll();
    }
  }

  function setHash(value) {
    const hash = "#" + encodeURIComponent(value).replace(/%3A/gi, ":");
    if (location.hash !== hash) history.pushState(null, "", hash);
  }

  function eventCodes(event) {
    return [
      event.classifications?.primary,
      ...(event.classifications?.secondary || [])
    ].filter(Boolean);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function cssEscape(value) {
    if (window.CSS?.escape) return CSS.escape(value);
    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }
})();
