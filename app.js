/* World Cup 2026 Sweepstake — all logic runs client-side, state in localStorage.
   Scoring: +1 every win (incl. penalty-shootout wins), cumulative stage bonuses:
   R32 +2, R16 +3, QF +4, SF +5, Final +7, Champion +10. */
(function () {
  "use strict";

  const D = window.WC_DATA;
  const LS_KEY = "wc26-sweepstake-v1";
  const NUM_PLAYERS = 6;
  const PLAYER_COLORS = ["#e6553f", "#3f8de6", "#41b96b", "#c84fd1", "#e0a330", "#2fb6b0"];
  const ROUND_LABELS = { r32: "Round of 32", r16: "Round of 16", qf: "Quarter-finals", sf: "Semi-finals", third: "Third-place play-off", final: "Final" };
  const STAGE_POINTS = [["r32", 2], ["r16", 3], ["qf", 4], ["sf", 5], ["final", 7], ["champion", 10]];

  const TEAMS = {};
  D.teams.forEach(t => (TEAMS[t.id] = t));

  function expandGroup([id, group, date, h, m, tz, home, away, venue]) {
    return { id, stage: "group", group, date, home, away, venue, utc: kickoffUtc(date, h, m, tz) };
  }
  function expandKo([id, round, date, h, m, tz, srcH, srcA, venue]) {
    return { id, stage: "ko", round, date, srcH, srcA, venue, utc: kickoffUtc(date, h, m, tz) };
  }
  function kickoffUtc(date, h, m, tz) {
    const [y, mo, d] = date.split("-").map(Number);
    return Date.UTC(y, mo - 1, d, h - tz, m); // venue-local time minus offset = UTC
  }

  const MATCHES = [...D.groupMatches.map(expandGroup), ...D.koMatches.map(expandKo)];
  const BY_ID = {};
  MATCHES.forEach(mt => (BY_ID[mt.id] = mt));

  // ---------- state ----------
  let state = defaultState();
  let activeTab = "leaderboard";
  let editing = false;

  function defaultState() {
    return {
      players: D.seedPlayers ? [...D.seedPlayers] : Array.from({ length: NUM_PLAYERS }, (_, i) => "Player " + (i + 1)),
      assignments: D.seedAssignments ? { ...D.seedAssignments } : {},
      results: {},   // matchId -> [h, a] or [h, a, "h"|"a"]
      slots: {},     // matchId -> { h: teamId, a: teamId } manual knockout picks
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        state = { ...defaultState(), ...s };
      }
    } catch (e) { /* corrupted state -> defaults */ }
    importFromHash();
  }
  function save() {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  function importFromHash() {
    const mAt = location.hash.match(/^#d=(.+)$/);
    if (!mAt) return;
    try {
      const json = decodeURIComponent(escape(atob(mAt[1])));
      const s = JSON.parse(json);
      state = { ...defaultState(), ...s };
      save();
      history.replaceState(null, "", location.pathname + location.search);
      toast("Imported shared sweepstake data ✔");
    } catch (e) {
      toast("Could not read the shared link");
    }
  }
  function shareLink() {
    const payload = { players: state.players, assignments: state.assignments, results: state.results, slots: state.slots };
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    return location.origin === "null" || location.protocol === "file:"
      ? "#d=" + b64
      : location.origin + location.pathname + "#d=" + b64;
  }

  // Published results (data.js) act as the base layer; local edits override.
  function getResult(id) {
    if (state.results[id] !== undefined) return state.results[id]; // may be null = cleared
    return D.seedResults[id] !== undefined ? D.seedResults[id] : null;
  }
  function winnerOf(id) {
    const mt = BY_ID[id], r = getResult(id);
    if (!r) return null;
    const [h, a, pens] = r;
    if (h > a) return resolvedTeam(mt, "h");
    if (a > h) return resolvedTeam(mt, "a");
    if (pens === "h") return resolvedTeam(mt, "h");
    if (pens === "a") return resolvedTeam(mt, "a");
    return null; // drawn (group) or shootout winner not set yet
  }
  function loserOf(id) {
    const mt = BY_ID[id], w = winnerOf(id);
    if (!w) return null;
    const h = resolvedTeam(mt, "h"), a = resolvedTeam(mt, "a");
    return w === h ? a : h;
  }

  // ---------- group standings ----------
  function groupComplete(g) {
    return MATCHES.filter(mt => mt.stage === "group" && mt.group === g).every(mt => getResult(mt.id));
  }
  function standings(g) {
    const rows = {};
    D.teams.filter(t => t.group === g).forEach(t => (rows[t.id] = { id: t.id, P: 0, W: 0, Dr: 0, L: 0, GF: 0, GA: 0, Pts: 0 }));
    const ms = MATCHES.filter(mt => mt.stage === "group" && mt.group === g);
    ms.forEach(mt => {
      const r = getResult(mt.id);
      if (!r) return;
      const [hg, ag] = r;
      const H = rows[mt.home], A = rows[mt.away];
      H.P++; A.P++; H.GF += hg; H.GA += ag; A.GF += ag; A.GA += hg;
      if (hg > ag) { H.W++; A.L++; H.Pts += 3; }
      else if (ag > hg) { A.W++; H.L++; A.Pts += 3; }
      else { H.Dr++; A.Dr++; H.Pts++; A.Pts++; }
    });
    const list = Object.values(rows);
    list.forEach(r => (r.GD = r.GF - r.GA));
    // FIFA order: points, GD, GF, then head-to-head among the tied teams.
    list.sort((x, y) => y.Pts - x.Pts || y.GD - x.GD || y.GF - x.GF || h2h(g, x, y) || x.id.localeCompare(y.id));
    return list;
  }
  function h2h(g, x, y) {
    const mt = MATCHES.find(m => m.stage === "group" && m.group === g &&
      ((m.home === x.id && m.away === y.id) || (m.home === y.id && m.away === x.id)));
    const r = mt && getResult(mt.id);
    if (!r) return 0;
    const xGoals = mt.home === x.id ? r[0] : r[1];
    const yGoals = mt.home === x.id ? r[1] : r[0];
    return yGoals - xGoals; // fewer conceded head-to-head sorts higher
  }
  function thirdPlaceTable() {
    const thirds = D.groups
      .filter(g => groupComplete(g))
      .map(g => ({ group: g, row: standings(g)[2] }));
    thirds.sort((x, y) => y.row.Pts - x.row.Pts || y.row.GD - x.row.GD || y.row.GF - x.row.GF || x.row.id.localeCompare(y.row.id));
    return thirds;
  }
  const allGroupsComplete = () => D.groups.every(groupComplete);

  // ---------- knockout slot resolution ----------
  function resolvedTeam(mt, side) {
    if (mt.stage === "group") return side === "h" ? mt.home : mt.away;
    const manual = state.slots[mt.id] && state.slots[mt.id][side];
    if (manual) return manual;
    const src = side === "h" ? mt.srcH : mt.srcA;
    let m;
    if ((m = src.match(/^([12])([A-L])$/))) {
      const g = m[2];
      if (!groupComplete(g)) return null;
      return standings(g)[Number(m[1]) - 1].id;
    }
    if (src.startsWith("3:")) return null; // FIFA chart decides — pick manually
    if ((m = src.match(/^W(\d+)$/))) return winnerOf(Number(m[1]));
    if ((m = src.match(/^L(\d+)$/))) return loserOf(Number(m[1]));
    return null;
  }
  function slotCandidates(mt, side) {
    const src = side === "h" ? mt.srcH : mt.srcA;
    let m;
    if ((m = src.match(/^[12]([A-L])$/))) return D.teams.filter(t => t.group === m[1]).map(t => t.id);
    if (src.startsWith("3:")) {
      return src.slice(2).split("").map(g => {
        const s = standings(g);
        return s[2] ? s[2].id : null;
      }).filter(Boolean);
    }
    if ((m = src.match(/^[WL](\d+)$/))) {
      const ref = BY_ID[Number(m[1])];
      return ["h", "a"].map(s => resolvedTeam(ref, s)).filter(Boolean);
    }
    return [];
  }
  function srcLabel(src) {
    let m;
    if ((m = src.match(/^([12])([A-L])$/))) return (m[1] === "1" ? "Winner Group " : "Runner-up Group ") + m[2];
    if (src.startsWith("3:")) return "3rd place: " + src.slice(2).split("").join("/");
    if ((m = src.match(/^W(\d+)$/))) return "Winner M" + m[1];
    if ((m = src.match(/^L(\d+)$/))) return "Loser M" + m[1];
    return src;
  }

  // ---------- scoring ----------
  function teamProgress() {
    const prog = {};
    D.teams.forEach(t => (prog[t.id] = { r32: false, r16: false, qf: false, sf: false, final: false, champion: false }));
    const mark = (id, key) => { if (id && prog[id]) prog[id][key] = true; };

    // R32 from group outcomes (counts as soon as qualification is mathematically settled here: group complete)
    D.groups.forEach(g => {
      if (!groupComplete(g)) return;
      const s = standings(g);
      mark(s[0].id, "r32"); mark(s[1].id, "r32");
    });
    if (allGroupsComplete()) thirdPlaceTable().slice(0, 8).forEach(t => mark(t.row.id, "r32"));

    // Later rounds from appearing in a resolved knockout slot
    MATCHES.filter(mt => mt.stage === "ko").forEach(mt => {
      const h = resolvedTeam(mt, "h"), a = resolvedTeam(mt, "a");
      const key = mt.round === "r32" ? "r32" : mt.round === "r16" ? "r16" : mt.round === "qf" ? "qf"
        : mt.round === "sf" ? "sf" : mt.round === "final" ? "final" : null; // third-place game: no bonus
      if (key) { mark(h, key); mark(a, key); }
    });
    mark(winnerOf(104), "champion");
    return prog;
  }

  function teamScore(teamId, prog) {
    let wins = 0;
    MATCHES.forEach(mt => {
      if (winnerOf(mt.id) === teamId) wins++;
    });
    let stagePts = 0;
    const stages = [];
    STAGE_POINTS.forEach(([key, pts]) => {
      if (prog[teamId][key]) { stagePts += pts; stages.push(key); }
    });
    return { wins, stagePts, stages, total: wins + stagePts };
  }

  function computeAll() {
    const prog = teamProgress();
    const teamScores = {};
    D.teams.forEach(t => (teamScores[t.id] = teamScore(t.id, prog)));
    const players = state.players.map((name, i) => {
      const teams = D.teams.filter(t => state.assignments[t.id] === i);
      const total = teams.reduce((s, t) => s + teamScores[t.id].total, 0);
      const wins = teams.reduce((s, t) => s + teamScores[t.id].wins, 0);
      return { i, name, teams, total, wins, stagePts: total - wins };
    });
    return { prog, teamScores, players };
  }

  // ---------- rendering helpers ----------
  const $ = sel => document.querySelector(sel);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function teamChip(id, opts = {}) {
    if (!id) return `<span class="chip tbd">${esc(opts.placeholder || "TBD")}</span>`;
    const t = TEAMS[id];
    const owner = state.assignments[id];
    const dot = owner !== undefined && owner !== null && owner !== ""
      ? `<span class="owner-dot" style="background:${PLAYER_COLORS[owner]}" title="${esc(state.players[owner])}"></span>` : "";
    return `<span class="chip">${dot}<span class="flag">${t.flag}</span>${esc(opts.short ? t.id : t.name)}</span>`;
  }
  function fmtKickoff(utc) {
    const dte = new Date(utc);
    return dte.toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2600);
  }

  // ---------- ticker ----------
  function renderTicker() {
    const el = $("#ticker");
    if (!el) return;
    const played = MATCHES.filter(mt => getResult(mt.id) && resolvedTeam(mt, "h") && resolvedTeam(mt, "a"))
      .sort((x, y) => y.utc - x.utc).slice(0, 5); // newest first
    const upcoming = MATCHES.filter(mt => !getResult(mt.id) && resolvedTeam(mt, "h") && resolvedTeam(mt, "a"))
      .sort((x, y) => x.utc - y.utc).slice(0, 4);
    const code = id => TEAMS[id].flag + " " + TEAMS[id].id;
    const ticks = [
      ...played.map(mt => {
        const r = getResult(mt.id);
        const pens = r[2] ? " p" : "";
        return `<span class="tick"><span class="ft">FT</span>${code(resolvedTeam(mt, "h"))} <span class="tsc">${r[0]}–${r[1]}${pens}</span> ${code(resolvedTeam(mt, "a"))}</span>`;
      }),
      ...upcoming.map(mt => {
        const when = new Date(mt.utc).toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" });
        return `<span class="tick"><span class="next">${esc(when)}</span>${code(resolvedTeam(mt, "h"))} v ${code(resolvedTeam(mt, "a"))}</span>`;
      }),
    ];
    el.innerHTML = `<div class="ticker-inner">${ticks.join("")}</div>`;
  }

  // ---------- views ----------
  function render() {
    document.body.classList.toggle("editing", editing);
    $("#edit-toggle").textContent = editing ? "Done editing" : "Edit scores";
    renderTicker();
    document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === activeTab));
    const view = { leaderboard: viewLeaderboard, teams: viewTeams, groups: viewGroups, fixtures: viewFixtures, bracket: viewBracket, setup: viewSetup }[activeTab];
    $("#view").innerHTML = view();
    bindView();
  }

  function viewLeaderboard() {
    const { players, teamScores } = computeAll();
    const ranked = [...players].sort((x, y) => y.total - x.total);
    const anyAssigned = Object.keys(state.assignments).length > 0;
    if (!anyAssigned) {
      return `<div class="empty">No teams assigned yet — head to <a href="#" data-goto="setup">Setup</a> to enter your names and assign the 48 teams (8 each).</div>`;
    }
    return `<div class="board">` + ranked.map((p, idx) => {
      const teams = [...p.teams].sort((a, b) => teamScores[b.id].total - teamScores[a.id].total);
      const rows = teams.map(t => {
        const sc = teamScores[t.id];
        const out = isOut(t.id) ? " out" : "";
        return `<tr class="trow${out}"><td>${teamChip(t.id)}</td><td>${sc.wins}</td><td>${sc.stagePts}</td><td class="num">${sc.total}</td></tr>`;
      }).join("");
      const alive = p.teams.filter(t => !isOut(t.id)).length;
      return `<details class="brow${idx === 0 ? " leader" : ""}" ${idx === 0 ? "open" : ""}>
        <summary>
          <span class="rank">${idx + 1}</span>
          <span class="pcol" style="--pc:${PLAYER_COLORS[p.i]}"></span>
          <span class="pname">${esc(p.name)}</span>
          <span class="pstats">${p.wins}W · ${p.stagePts} stage pts<br>${alive}/8 teams alive</span>
          <span class="ptotal">${p.total}</span>
        </summary>
        <div class="breakdown">
          <table class="mini"><thead><tr><th>Team</th><th>Wins</th><th>Stage</th><th class="num">Pts</th></tr></thead><tbody>${rows}</tbody></table>
        </div>
      </details>`;
    }).join("") + `</div>
    <p class="note">Scoring: +1 per win (shootout wins count) · reaching R32 +2 · R16 +3 · QF +4 · SF +5 · Final +7 · Champions +10 (cumulative).</p>`;
  }

  function isOut(teamId) {
    // eliminated: group complete & finished 4th, or 3rd and missed the best-8 cut,
    // or lost a knockout match
    const g = TEAMS[teamId].group;
    if (groupComplete(g)) {
      const pos = standings(g).findIndex(r => r.id === teamId);
      if (pos === 3) return true;
      if (pos === 2 && allGroupsComplete() && !thirdPlaceTable().slice(0, 8).some(t => t.row.id === teamId)) return true;
    }
    return MATCHES.some(mt => mt.stage === "ko" && mt.round !== "third" && loserOf(mt.id) === teamId);
  }

  function viewTeams() {
    const { players, teamScores } = computeAll();
    return `<div class="cards">` + players.map(p => {
      const rows = p.teams.length
        ? p.teams.map(t => `<tr class="trow${isOut(t.id) ? " out" : ""}"><td>${teamChip(t.id)}</td><td>Group ${t.group}</td><td class="num">${teamScores[t.id].total}</td></tr>`).join("")
        : `<tr><td colspan="3" class="muted">No teams yet</td></tr>`;
      return `<div class="card"><h3><span class="pdot" style="--pc:${PLAYER_COLORS[p.i]}"></span>${esc(p.name)} <span class="count">${p.teams.length}/8</span></h3>
        <table class="mini"><tbody>${rows}</tbody></table></div>`;
    }).join("") + `</div>`;
  }

  function viewGroups() {
    const thirds = thirdPlaceTable();
    const groupsHtml = D.groups.map(g => {
      const s = standings(g);
      const complete = groupComplete(g);
      const rows = s.map((r, i) => {
        let cls = "";
        if (complete && i < 2) cls = "qualified";
        else if (complete && i === 2) cls = "maybe";
        else if (complete) cls = "out";
        return `<tr class="${cls}"><td class="pos">${i + 1}</td><td>${teamChip(r.id)}</td><td>${r.P}</td><td>${r.W}</td><td>${r.Dr}</td><td>${r.L}</td><td>${r.GD > 0 ? "+" + r.GD : r.GD}</td><td class="num"><b>${r.Pts}</b></td></tr>`;
      }).join("");
      return `<div class="card"><h3>Group ${g}</h3>
        <table class="mini standings"><thead><tr><th></th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th class="num">Pts</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }).join("");
    const thirdsHtml = thirds.length ? `<div class="card wide"><h3>Third-place ranking <span class="count">best 8 advance</span></h3>
      <table class="mini standings"><thead><tr><th></th><th>Team</th><th>Grp</th><th>Pts</th><th>GD</th><th>GF</th></tr></thead><tbody>` +
      thirds.map((t, i) => `<tr class="${allGroupsComplete() ? (i < 8 ? "qualified" : "out") : ""}"><td class="pos">${i + 1}</td><td>${teamChip(t.row.id)}</td><td>${t.group}</td><td>${t.row.Pts}</td><td>${t.row.GD > 0 ? "+" + t.row.GD : t.row.GD}</td><td>${t.row.GF}</td></tr>`).join("") +
      `</tbody></table></div>` : "";
    return `<div class="cards">${groupsHtml}${thirdsHtml}</div>
      <p class="note">Top two of each group qualify, plus the 8 best third-placed teams. Tiebreakers applied: points, goal difference, goals scored, head-to-head.</p>`;
  }

  function viewFixtures() {
    const sorted = [...MATCHES].sort((x, y) => x.utc - y.utc || x.id - y.id);
    const byDate = {};
    sorted.forEach(mt => (byDate[mt.date] = byDate[mt.date] || []).push(mt));
    const today = new Date().toISOString().slice(0, 10);
    return Object.entries(byDate).map(([date, ms]) => {
      const d = new Date(date + "T12:00:00Z");
      const label = d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
      return `<h3 class="datehdr${date === today ? " today" : ""}">${label}${date === today ? " · today" : ""}</h3>
        <div class="matchlist">` + ms.map(mt => matchRow(mt)).join("") + `</div>`;
    }).join("");
  }

  function matchRow(mt, tagOverride) {
    const r = getResult(mt.id);
    const h = resolvedTeam(mt, "h"), a = resolvedTeam(mt, "a");
    const tag = tagOverride || (mt.stage === "group" ? "Group " + mt.group : ROUND_LABELS[mt.round]);
    const pens = r && r[2] ? `<span class="pens">${TEAMS[r[2] === "h" ? h : a] ? esc(TEAMS[r[2] === "h" ? h : a].name) : ""} win on pens</span>` : "";
    let mid;
    if (editing) {
      const needsPens = mt.stage === "ko" && r && r[0] === r[1];
      mid = `<span class="score-edit" data-mid="${mt.id}">
        <input type="number" min="0" class="g h" value="${r ? r[0] : ""}" ${h ? "" : "disabled"}>
        <span>–</span>
        <input type="number" min="0" class="g a" value="${r ? r[1] : ""}" ${a ? "" : "disabled"}>
        ${needsPens ? `<select class="penswin"><option value="">pens?</option><option value="h" ${r[2] === "h" ? "selected" : ""}>${h ? esc(TEAMS[h].id) : "home"}</option><option value="a" ${r[2] === "a" ? "selected" : ""}>${a ? esc(TEAMS[a].id) : "away"}</option></select>` : ""}
      </span>`;
    } else {
      mid = r ? `<span class="score">${r[0]} – ${r[1]}</span>` : `<span class="score upcoming">${fmtKickoff(mt.utc)}</span>`;
    }
    return `<div class="match">
      <span class="mtag">${tag}</span>
      <span class="side home">${teamChip(h, { placeholder: srcLabel(mt.srcH || "") })}</span>
      ${mid}
      <span class="side away">${teamChip(a, { placeholder: srcLabel(mt.srcA || "") })}</span>
      <span class="venue">${esc(mt.venue)}</span>
      ${pens}
    </div>`;
  }

  function viewBracket() {
    const rounds = ["r32", "r16", "qf", "sf", "third", "final"];
    return rounds.map(rd => {
      const ms = MATCHES.filter(mt => mt.stage === "ko" && mt.round === rd);
      return `<h3 class="datehdr">${ROUND_LABELS[rd]}</h3><div class="matchlist">` + ms.map(mt => {
        let row = matchRow(mt, "M" + mt.id);
        if (editing) {
          const sel = side => {
            const src = side === "h" ? mt.srcH : mt.srcA;
            if (!src.startsWith("3:") && resolvedTeam(mt, side)) return "";
            const cands = slotCandidates(mt, side);
            if (!cands.length) return "";
            const cur = state.slots[mt.id] && state.slots[mt.id][side];
            return `<select class="slotpick" data-mid="${mt.id}" data-side="${side}">
              <option value="">${esc(srcLabel(src))} — pick…</option>
              ${cands.map(c => `<option value="${c}" ${cur === c ? "selected" : ""}>${esc(TEAMS[c].flag + " " + TEAMS[c].name)}</option>`).join("")}
            </select>`;
          };
          const picks = sel("h") + sel("a");
          if (picks) row += `<div class="slotpicks">M${mt.id}: ${picks}</div>`;
        }
        return row;
      }).join("") + `</div>`;
    }).join("") + `<p class="note">Knockout slots fill in automatically from results. Third-place slots (and any tiebreak oddities) can be set by hand in edit mode — FIFA's allocation chart decides which qualifying third goes where.</p>`;
  }

  function viewSetup() {
    const counts = state.players.map((_, i) => D.teams.filter(t => state.assignments[t.id] === i).length);
    const names = state.players.map((n, i) =>
      `<label class="pinput"><span class="owner-dot" style="background:${PLAYER_COLORS[i]}"></span>
       <input type="text" class="pname-input" data-pi="${i}" value="${esc(n)}" maxlength="20">
       <span class="count">${counts[i]}/8</span></label>`).join("");
    const grid = D.groups.map(g => {
      const rows = D.teams.filter(t => t.group === g).map(t => {
        const cur = state.assignments[t.id];
        return `<div class="assign-row">
          ${teamChip(t.id)}
          <select class="assign" data-team="${t.id}">
            <option value="">— unassigned —</option>
            ${state.players.map((n, i) => `<option value="${i}" ${cur === i ? "selected" : ""}>${esc(n)}</option>`).join("")}
          </select></div>`;
      }).join("");
      return `<div class="card"><h3>Group ${g}</h3>${rows}</div>`;
    }).join("");
    return `<div class="setup">
      <div class="card wide"><h3>Players</h3><div class="pnames">${names}</div>
        <div class="btnrow">
          <button id="btn-random" class="btn">🎲 Randomly assign unassigned teams</button>
          <button id="btn-clear" class="btn danger">Clear all assignments</button>
        </div>
        <p class="note">Assign all 48 teams — 8 each. Changes save automatically in this browser; use <b>Share</b> (top right) to send the live state to the others.</p>
      </div>
      <div class="cards">${grid}</div>
    </div>`;
  }

  // ---------- events ----------
  function bindView() {
    document.querySelectorAll("[data-goto]").forEach(el => el.addEventListener("click", e => {
      e.preventDefault(); activeTab = el.dataset.goto; render();
    }));
    document.querySelectorAll(".score-edit .g, .score-edit .penswin").forEach(inp => inp.addEventListener("change", () => {
      const wrap = inp.closest(".score-edit");
      const id = Number(wrap.dataset.mid);
      const hv = wrap.querySelector(".g.h").value, av = wrap.querySelector(".g.a").value;
      if (hv === "" && av === "") {
        if (getResult(id) == null) return; // nothing to clear
        state.results[id] = null; // explicitly cleared (overrides seed)
      } else if (hv === "" || av === "") {
        return; // half-entered score — wait for the other box before saving
      } else {
        const res = [Math.max(0, Number(hv)), Math.max(0, Number(av))];
        const pensSel = wrap.querySelector(".penswin");
        if (BY_ID[id].stage === "ko" && res[0] === res[1] && pensSel && pensSel.value) res.push(pensSel.value);
        state.results[id] = res;
      }
      save(); render();
    }));
    document.querySelectorAll(".slotpick").forEach(sel => sel.addEventListener("change", () => {
      const id = Number(sel.dataset.mid), side = sel.dataset.side;
      state.slots[id] = state.slots[id] || {};
      if (sel.value) state.slots[id][side] = sel.value; else delete state.slots[id][side];
      save(); render();
    }));
    document.querySelectorAll(".pname-input").forEach(inp => inp.addEventListener("change", () => {
      state.players[Number(inp.dataset.pi)] = inp.value.trim() || "Player " + (Number(inp.dataset.pi) + 1);
      save(); render();
    }));
    document.querySelectorAll(".assign").forEach(sel => sel.addEventListener("change", () => {
      const team = sel.dataset.team;
      if (sel.value === "") delete state.assignments[team];
      else state.assignments[team] = Number(sel.value);
      save(); render();
    }));
    const rnd = $("#btn-random");
    if (rnd) rnd.addEventListener("click", () => {
      const unassigned = D.teams.map(t => t.id).filter(id => state.assignments[id] === undefined);
      const capacity = state.players.map((_, i) => 8 - D.teams.filter(t => state.assignments[t.id] === i).length);
      const shuffled = unassigned.sort(() => Math.random() - 0.5);
      shuffled.forEach(id => {
        const eligible = capacity.map((c, i) => (c > 0 ? i : -1)).filter(i => i >= 0);
        if (!eligible.length) return;
        const pick = eligible[Math.floor(Math.random() * eligible.length)];
        state.assignments[id] = pick; capacity[pick]--;
      });
      save(); render(); toast("Teams randomly assigned 🎲");
    });
    const clr = $("#btn-clear");
    if (clr) clr.addEventListener("click", () => {
      if (confirm("Clear ALL team assignments?")) { state.assignments = {}; save(); render(); }
    });
  }

  function bindShell() {
    document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => { activeTab = b.dataset.tab; render(); }));
    $("#edit-toggle").addEventListener("click", () => { editing = !editing; render(); });
    $("#share").addEventListener("click", () => {
      const link = shareLink();
      (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject())
        .then(() => toast("Share link copied 📋 — send it to the group"))
        .catch(() => { prompt("Copy this link:", link); });
    });
  }

  load();
  bindShell();
  render();
})();
