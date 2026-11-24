// הדמיה לצפייה בלבד של פרויקט SMC. אין כאן חיבור ל-Jira, שמירה או בקשות רשת.
(() => {
  const items = SMC.items, by = Object.fromEntries(items.map(i => [i.key, i]));
  const ranked = [...items].sort((a, b) => a.rank - b.rank);
  const kids = {};
  for (const i of ranked) if (i.parent) (kids[i.parent] ||= []).push(i);
  const STATUS = ["To Do", "In Progress", "Done"], TYPES = ["Epic", "Story", "Task", "Sub-task", "Bug"], PRIO = ["Highest", "High", "Medium"];
  const ME = "Alisiya Rabinovich", num = k => Number(k.slice(4));
  const epics = items.filter(i => i.type === "Epic");
  const children = key => kids[key] || [];
  const work = items.filter(i => i.type !== "Epic" && i.type !== "Sub-task");
  const sprint = n => SMC.sprints.find(s => s.id === n);
  const css = s => s.replace(" ", "");
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const day = s => Date.UTC(...s.split("-").map((n, i) => i === 1 ? n - 1 : Number(n)));
  const short = s => `${Number(s.slice(8))} ${MONTHS[s.slice(5, 7) - 1].slice(0, 3)}`;

  let lang, theme;
  try { lang = localStorage.getItem("lang"); theme = localStorage.getItem("theme"); } catch {}
  const he = lang ? lang === "he" : /^(he|iw)/.test(navigator.language);
  const root = document.documentElement, $ = id => document.getElementById(id);
  root.lang = he ? "he" : "en";
  root.dir = he ? "rtl" : "ltr";
  root.dataset.theme = theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  $("lead").textContent = he
    ? "עברו בין הלשוניות, סננו, ולחצו על פריט כדי לקרוא אותו. כל 123 הפריטים זמינים לצפייה."
    : "Switch tabs, filter, and click any item to read it. All 123 work items are available to view.";
  $("note").textContent = he
    ? "הדמיה לצפייה בלבד, תמונת מצב מ-23.11.2026. זהו פרויקט אקדמי: המערכת לא פותחה, והספרינטים, הסטטוסים, התאריכים והבאגים הם סימולציה משוחזרת. האתר אינו מחובר ל-Jira ואינו מוצר של Atlassian."
    : "View-only simulation, snapshot of 23 November 2026. This is an academic project: the system was not developed, and the sprints, statuses, dates and bugs are a reconstructed simulation. This site is not connected to Jira and is not an Atlassian product.";

  function h(tag, attrs, ...children) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) {
      if (k.startsWith("on")) e[k] = attrs[k];
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    e.append(...children.flat(Infinity).filter(x => x != null));
    return e;
  }
  const btn = (attrs, ...c) => h("button", { type: "button", ...attrs }, ...c);
  const NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs, ...c) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    e.append(...c);
    return e;
  }
  const PATHS = {
    Epic: "M9.5 1.5 3 9h4l-.5 5.5L13 7H9z", Story: "M4 2h8v12l-4-3-4 3z", Task: "M2.5 2.5h11v11h-11zM5 8l2 2 4-4",
    "Sub-task": "M2 2h6.5v6.5H2zM8.5 6H14v8H6V8.500", Bug: "M5 6.500a3 3 0 0 1 6 0V10a3 3 0 0 1-6 0zM5 8H1.500M14.500 8H11M5 5 3 3M11 5l2-2M5 11l-2 2M11 11l2 2",
    Highest: "M3 8l5-4 5 4M3 12l5-4 5 4", High: "M3 10l5-4 5 4", Medium: "M3 6h10M3 10h10",
    chev: "M6 3.500 10.500 8 6 12.500", check: "M3 8.500 6.500 12 13 4.500", x: "M3 3l10 10M13 3 3 13",
    Summary: "M8 1.500a6.500 6.500 0 1 0 0 13 6.500 6.500 0 0 0 0-13M1.500 8h13M8 1.500c-4 4-4 9 0 13 4-4 4-9 0-13", Timeline: "M2 3h8M5 8h9M3 13h7",
    Backlog: "M2.500 2.500h11v11h-11zM2.500 6.200h11M2.500 9.800h11", Board: "M2 2.500h12v11H2zM6 2.500v11M10 2.500v11",
    Calendar: "M2 3.500h12v10.500H2zM2 7h12M5 1.500v3M11 1.500v3", List: "M2 3h12v10H2zM2 6.500h12M2 10h12M6 3v10",
    person: "M8 2.500a2.500 2.500 0 1 1 0 5 2.500 2.500 0 0 1 0-5M3 14c0-5 10-5 10 0", doc: "M4 2h8v12H4zM6 6h4M6 9h4", half: "M8 2a6 6 0 1 0 6 6M8 4v4l3 2", circle: "M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2"
  };
  const icon = (name, cls = "", label) => {
    const s = svg("svg", { viewBox: "0 0 16 16", class: "ic " + cls, ...(label ? { role: "img", "aria-label": label } : { "aria-hidden": "true" }) }, svg("path", { d: PATHS[name] }));
    if (label) s.append(Object.assign(svg("title", {}), { textContent: label }));
    return s;
  };
  const kind = i => icon(i.type, "k-" + i.type, i.type);
  const prio = p => icon(p, "p-" + p, "Priority: " + p);
  const status = s => h("span", { class: "st s-" + css(s) }, s);
  const avatar = i => i.assigned ? h("span", { class: "av", title: ME, role: "img", "aria-label": ME }, "AR")
    : h("span", { class: "av none", title: "Unassigned", role: "img", "aria-label": "Unassigned" }, icon("person"));
  const keyText = i => h("span", { class: "key" + (i.status === "Done" ? " struck" : "") }, i.key);
  const epicTag = (i, full) => h("span", { class: "ep", title: by[i.epic].summary }, h("span", {}, (full ? i.epic + " " : "") + by[i.epic].summary));
  const tally = (list, f) => list.reduce((m, i) => (m[f(i)] = (m[f(i)] || 0) + 1, m), {});

  /* ---------- מצב וסינון ---------- */
  const NOT_DONE = "Not done"; // סינון לכל מה שלא הושלם, כמו בתרשימים ב-Summary
  const none = { q: "", type: "", priority: "", status: "", epic: "", who: "" };
  let f = { ...none };
  const state = { tab: "Board", sprint: 2, group: "", closed: new Set(), open: new Set(), tree: new Set(epics.map(e => e.key)), tl: new Set(), sort: "", desc: false, month: 9 };
  const match = i => (!f.type || i.type === f.type) && (!f.priority || i.priority === f.priority) && (!f.status || (f.status === NOT_DONE ? i.status !== "Done" : i.status === f.status))
    && (!f.epic || i.epic === f.epic) && (!f.who || (f.who === "me") === i.assigned)
    && (!f.q || (i.key + " " + i.summary).toLowerCase().includes(f.q.toLowerCase()));
  // כרטיס או שורה נשארים גם אם רק תת-משימה שלהם מתאימה
  const visible = i => match(i) || (i.type === "Task" && children(i.key).some(match));
  const filtering = () => Object.values(f).some(Boolean);

  let body, draw = () => {};
  function select(label, value, options, onchange) {
    const s = h("select", { "aria-label": label, onchange: () => onchange(s.value) }, options.map(([v, t]) => h("option", { value: v }, t)));
    s.value = value;
    return s;
  }
  function toolbar(opts, ...extra) {
    const bar = h("div", { class: "bar" });
    const pick = (label, key, list) => select(label, f[key], [["", label], ...list], v => { f[key] = v; draw(); });
    const who = (v, label, ...c) => {
      const b = btn({ class: v === "me" ? "av" : "av none", "aria-pressed": String(f.who === v), "aria-label": "Assignee: " + label, title: label,
        onclick: () => { f.who = f.who === v ? "" : v; for (const x of bar.querySelectorAll(".av")) x.setAttribute("aria-pressed", String(x === b && !!f.who)); draw(); } }, ...c);
      return b;
    };
    bar.append(
      h("input", { type: "search", placeholder: "Search", "aria-label": "Search work items", value: f.q, oninput: e => { f.q = e.target.value.trim(); draw(); } }),
      who("none", "Unassigned", icon("person")), who("me", ME, "AR"),
      h("div", { class: "fs" }, pick("Type", "type", (opts.types || TYPES).map(x => [x, x])), pick("Priority", "priority", PRIO.map(x => [x, x])),
      ...(opts.status ? [pick("Status", "status", [NOT_DONE, ...STATUS].map(x => [x, x]))] : []),
      pick("Epic", "epic", epics.map(e => [e.key, e.summary])),
      btn({ class: "clear", onclick: () => { f = { ...none }; render(); } }, "Clear"), ...extra));
    return bar;
  }
  const empty = () => h("p", { class: "empty" }, "No work items match.");
  const refresh = fn => { draw = () => body.replaceChildren(...[fn()].flat(Infinity)); draw(); };
  // רינדור מחדש ששומר על המיקוד של כפתור פתיחה
  function redraw(id) {
    const top = body.scrollTop, left = body.scrollLeft;
    draw();
    body.scrollTop = top;
    body.scrollLeft = left;
    body.querySelector(`[data-id="${id}"]`)?.focus({ preventScroll: true });
  }
  const flip = (set, key) => { set.has(key) ? set.delete(key) : set.add(key); };

  /* ---------- Summary ---------- */
  function toList(filter) {
    f = { ...none, ...filter };
    state.sort = "";
    go("List");
  }
  function summary() {
    const st = tally(items, i => i.status), open = items.filter(i => i.status !== "Done");
    const stat = (ic, n, text, sub, filter) => btn({ class: "stat", onclick: () => toList(filter) }, h("span", {}, icon(ic)), h("span", {}, h("b", {}, `${n} ${text}`), h("small", {}, sub)));
    const colors = { "In Progress": "var(--cProg)", "To Do": "var(--cTodo)", Done: "var(--cDone)" };
    let at = 25;
    const ring = svg("svg", { viewBox: "0 0 42 42", role: "img", "aria-label": `123 work items: ${STATUS.map(s => `${st[s]} ${s}`).join(", ")}` });
    for (const s of ["In Progress", "To Do", "Done"]) {
      const p = st[s] / items.length * 100;
      ring.append(svg("circle", { cx: 21, cy: 21, r: 15.9155, fill: "none", stroke: colors[s], "stroke-width": 4.5, "stroke-dasharray": `${p - .4} ${100.4 - p}`, "stroke-dashoffset": at }));
      at -= p;
    }
    ring.append(Object.assign(svg("text", { x: 21, y: 22 }), { textContent: items.length }), Object.assign(svg("text", { x: 21, y: 26.5 }), { textContent: "Total work items" }));
    const prios = tally(open, i => i.priority), top = Math.max(...Object.values(prios));
    const dist = (label, n, onclick) => btn({ class: "dist", onclick }, h("span", { class: "line" }, label), h("span", { class: "pc" },
      h("span", { class: "track" }, h("i", { style: `width:${n / open.length * 100}%` })), h("b", {}, Math.round(n / open.length * 100) + "%")));
    const types = tally(open, i => i.type), mine = open.filter(i => i.assigned).length;
    const panel = (title, text, ...c) => h("section", { class: "pan two" }, h("h3", {}, title), h("p", {}, text), ...c);
    body.replaceChildren(h("div", { class: "dash" },
      stat("check", st.Done, "done", "of 123 work items", { status: "Done" }),
      stat("half", st["In Progress"], "in progress", "across the project", { status: "In Progress" }),
      stat("circle", st["To Do"], "to do", "across the project", { status: "To Do" }),
      stat("doc", 12, "user stories", "with acceptance criteria", { type: "Story" }),
      panel("Status overview", "A snapshot of the status of all work items.", h("div", { class: "donut" }, ring, h("div", {},
        ["In Progress", "To Do", "Done"].map(s => btn({ class: "lg", onclick: () => toList({ status: s }) }, h("i", { style: "background:" + colors[s] }), `${s}: ${st[s]}`))))),
      panel("Epic progress", "Stories, tasks and bugs in each epic.", h("div", { class: "key3" }, [["Done", "Done"], ["InProgress", "In progress"], ["ToDo", "To do"]].map(([c, t]) => h("span", {}, h("i", { class: "b-" + c }), t))),
        epics.map(e => {
          const list = children(e.key), c = tally(list, i => i.status);
          return h("div", {}, btn({ class: "lnk line", onclick: () => show(e.key) }, kind(e), h("span", {}, `${e.key} ${e.summary}`)),
            h("div", { class: "prog" }, ["Done", "In Progress", "To Do"].filter(s => c[s]).map(s => h("i", { class: "b-" + css(s), style: `width:${c[s] / list.length * 100}%`, title: `${s}: ${c[s]}` }, Math.round(c[s] / list.length * 100) + "%"))));
        })),
      panel("Priority breakdown", `The ${open.length} work items that are not done.`,
        h("div", { class: "chart" }, PRIO.map(p => btn({ "aria-label": `${p}: ${prios[p]}`, onclick: () => toList({ priority: p, status: NOT_DONE }) }, String(prios[p]), h("i", { style: `height:${prios[p] / top * 85}%` })))),
        h("div", { class: "labels" }, PRIO.map(p => h("span", {}, prio(p), p)))),
      panel("Types of work", `The ${open.length} work items that are not done.`, ["Sub-task", "Task", "Bug", "Story", "Epic"].map(t => dist([icon(t, "k-" + t), t], types[t], () => toList({ type: t, status: NOT_DONE })))),
      panel("Team workload", `The ${open.length} work items that are not done.`,
        dist([h("span", { class: "av" }, "AR"), "Alisiya R."], mine, () => toList({ who: "me", status: NOT_DONE })),
        dist([h("span", { class: "av none" }, icon("person")), "Unassigned"], open.length - mine, () => toList({ who: "none", status: NOT_DONE }))),
      panel("Sprints", "40 work items are planned in each sprint.", SMC.sprints.map(s => btn({ class: "dist", onclick: () => { state.sprint = s.id; f = { ...none }; go("Board"); } },
        h("span", {}, s.name), h("span", {}, `${s.state}, ${short(s.start)} – ${short(s.end)}`))))
    ));
  }

  /* ---------- Board ---------- */
  function card(i) {
    const subs = children(i.key), isOpen = state.open.has(i.key);
    return h("div", { class: "card" },
      btn({ class: "open", onclick: () => show(i.key) }, h("span", {}, i.summary), epicTag(i, true),
        h("span", { class: "meta" }, kind(i), keyText(i), h("span", { class: "r" }, i.status === "Done" ? icon("check", "k-Story") : null, prio(i.priority), avatar(i)))),
      subs.length ? btn({ class: "subs", "data-id": "s" + i.key, "aria-expanded": String(isOpen), onclick: () => { flip(state.open, i.key); redraw("s" + i.key); } },
        icon("Sub-task"), "Subtasks", h("span", { class: "count" }, `${subs.filter(s => s.status === "Done").length}/${subs.length}`), icon("chev", "chev")) : null,
      isOpen ? h("ul", {}, subs.map(s => h("li", {}, btn({ onclick: () => show(s.key) }, kind(s), h("span", {}, s.summary), status(s.status))))) : null);
  }
  function board() {
    const list = ranked.filter(i => work.includes(i) && (!state.sprint || i.sprint === state.sprint) && visible(i));
    if (!list.length) return empty();
    const cols = part => h("div", { class: "cols" }, STATUS.map(s => {
      const c = part.filter(i => i.status === s);
      return h("section", { class: "col", "aria-label": s }, h("h3", {}, `${s}  ${c.length}`), c.map(card));
    }));
    const groups = { epic: epics.map(e => [e.summary, i => i.epic === e.key]), type: ["Story", "Task", "Bug"].map(t => [t, i => i.type === t]), who: [[ME, i => i.assigned], ["Unassigned", i => !i.assigned]] }[state.group];
    return groups ? groups.map(([name, test]) => [name, list.filter(test)]).filter(g => g[1].length).flatMap(([name, part]) => [h("h3", { class: "lane" }, `${name} (${part.length})`), cols(part)]) : cols(list);
  }

  /* ---------- Backlog ---------- */
  const row = i => btn({ class: "row", onclick: () => show(i.key) }, kind(i), keyText(i), h("span", { class: "sum" }, i.summary), epicTag(i), status(i.status), prio(i.priority), avatar(i));
  function backlog() {
    return SMC.sprints.map(s => {
      const all = ranked.filter(i => work.includes(i) && i.sprint === s.id), list = all.filter(visible), c = tally(list, i => i.status), isOpen = !state.closed.has(s.id);
      return h("section", { class: "box" },
        btn({ "data-id": "b" + s.id, "aria-expanded": String(isOpen), onclick: () => { flip(state.closed, s.id); redraw("b" + s.id); } }, icon("chev", "chev"), h("b", {}, s.name),
          h("span", { class: "muted" }, `${short(s.start)} – ${short(s.end)} (${list.length === all.length ? all.length : `${list.length} of ${all.length}`} work items)`), h("span", { class: "ro" }, s.state),
          h("span", { class: "tot" }, STATUS.map(x => h("span", { class: "st s-" + css(x), title: x, "aria-label": `${x}: ${c[x] || 0}` }, String(c[x] || 0))))),
        isOpen ? h("div", { class: "rows" }, list.length ? list.map(row) : empty()) : null);
    });
  }

  /* ---------- List ---------- */
  const COLS = { Work: i => num(i.key), Type: i => TYPES.indexOf(i.type), Assignee: i => i.assigned ? 0 : 1, Priority: i => PRIO.indexOf(i.priority), Status: i => STATUS.indexOf(i.status), Sprint: i => i.sprint };
  function list() {
    const tree = !filtering() && !state.sort, out = [];
    function line(i, depth) {
      const has = tree && children(i.key).length, isOpen = state.tree.has(i.key);
      out.push(h("tr", {},
        h("td", {}, h("div", { class: "tw", style: `padding-inline-start:${depth * 1.4}rem` },
          has ? btn({ class: "tg", "data-id": "t" + i.key, "aria-expanded": String(isOpen), "aria-label": "Expand " + i.key, onclick: () => { flip(state.tree, i.key); redraw("t" + i.key); } }, icon("chev", "chev")) : tree ? h("span", { style: "width:1.2rem;flex:none" }) : null,
          kind(i), btn({ class: "lnk" + (i.status === "Done" ? " struck" : ""), onclick: () => show(i.key) }, i.key), h("span", {}, i.summary))),
        h("td", {}, i.type), h("td", {}, h("span", { class: "line" }, avatar(i), i.assigned ? ME : "Unassigned")),
        h("td", {}, h("span", { class: "line" }, prio(i.priority), i.priority)), h("td", {}, status(i.status)), h("td", {}, i.sprint ? sprint(i.sprint).name : "")));
      if (has && isOpen) children(i.key).forEach(c => line(c, depth + 1));
    }
    let n;
    if (tree) { epics.forEach(e => line(e, 0)); n = items.length; }
    else {
      const get = COLS[state.sort || "Work"], rows = items.filter(match).sort((a, b) => (get(a) - get(b)) * (state.desc ? -1 : 1) || num(a.key) - num(b.key));
      rows.forEach(i => line(i, 0));
      n = rows.length;
    }
    if (!n) return empty();
    return [h("table", {}, h("thead", {}, h("tr", {}, Object.keys(COLS).map(c => h("th", { scope: "col", "aria-sort": state.sort === c ? (state.desc ? "descending" : "ascending") : "none" },
      btn({ "data-id": "h" + c, onclick: () => { if (state.sort !== c) { state.sort = c; state.desc = false; } else if (!state.desc) state.desc = true; else { state.sort = ""; state.desc = false; } redraw("h" + c); } },
        c + (state.sort === c ? (state.desc ? " ↓" : " ↑") : "")))))), h("tbody", {}, out)),
      h("p", { class: "muted", style: "margin-top:.6rem" }, `${n} of ${items.length} work items`)];
  }

  /* ---------- Timeline ---------- */
  const T0 = day("2026-09-01"), T1 = day("2026-12-01"), pos = s => (day(s) - T0) / (T1 - T0) * 100;
  const span = (a, b) => `left:${pos(a)}%;width:${pos(b) - pos(a) + 100 / 91}%`;
  function timeline() {
    const months = names => ["2026-09-01", "2026-10-01", "2026-11-01"].map((m, i) => h("span", { class: "mon", style: `left:${pos(m)}%;width:${[30, 31, 30][i] / 91 * 100}%` }, names ? MONTHS[8 + i] : ""));
    const rows = [h("div", {}, h("div", { class: "l" }, "Work"), h("div", { class: "g" }, months(true))),
      h("div", {}, h("div", { class: "l muted" }, "Sprints"), h("div", { class: "g" }, months(), SMC.sprints.map(s => btn({ class: "ev sp " + s.state, style: `left:${pos(s.start)}%;width:calc(${pos(s.end) - pos(s.start)}% - 4px)`, title: `${s.name}, ${s.state}, ${short(s.start)} – ${short(s.end)}`,
        onclick: () => { state.sprint = s.id; f = { ...none }; go("Board"); } }, s.name))))];
    for (const e of epics) {
      const isOpen = state.tl.has(e.key), c = tally(children(e.key), i => i.status), n = children(e.key).length;
      rows.push(h("div", {}, h("div", { class: "l" }, btn({ class: "tgl", "data-id": "l" + e.key, "aria-expanded": String(isOpen), onclick: () => { flip(state.tl, e.key); redraw("l" + e.key); } }, icon("chev", "chev"), kind(e), keyText(e), h("span", {}, e.summary)),
        h("div", { class: "mini", role: "img", "aria-label": STATUS.map(s => `${s}: ${c[s] || 0}`).join(", ") }, ["Done", "In Progress", "To Do"].filter(s => c[s]).map(s => h("i", { class: "b-" + css(s), style: `width:${c[s] / n * 100}%` })))),
        h("div", { class: "g" }, months(), btn({ class: "ev", style: span(e.start, e.due), "aria-label": `${e.summary}, ${short(e.start)} – ${short(e.due)}`, title: `${short(e.start)} – ${short(e.due)}`, onclick: () => show(e.key) }))));
      if (isOpen) children(e.key).forEach(i => rows.push(h("div", {}, h("div", { class: "l" }, btn({ class: "tgl", style: "padding-inline-start:1.6rem", onclick: () => show(i.key) }, kind(i), keyText(i), h("span", {}, i.summary))),
        h("div", { class: "g" }, months(), h("span", { class: "mon", style: `left:${pos(sprint(i.sprint).start)}%;border:0` }, status(i.status))))));
    }
    return h("div", { class: "tl" }, rows);
  }

  /* ---------- Calendar ---------- */
  function calendar() {
    const DAY = 864e5, first = Date.UTC(2026, state.month, 1), start = first - new Date(first).getUTCDay() * DAY, end = Date.UTC(2026, state.month + 1, 0);
    const events = [...epics.map(e => ({ a: day(e.start), b: day(e.due), text: `${e.key} ${e.summary}`, open: () => show(e.key) })),
      ...SMC.sprints.map(s => ({ a: day(s.start), b: day(s.end), text: s.name, sp: true, open: () => { state.sprint = s.id; f = { ...none }; go("Board"); } }))];
    const weeks = [h("div", { class: "week dow" }, ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => h("span", {}, d)))];
    for (let w = start; w <= end; w += 7 * DAY) {
      const cells = [0, 1, 2, 3, 4, 5, 6].map(i => { const d = new Date(w + i * DAY); return h("span", { class: "d" + (d.getUTCMonth() === state.month ? "" : " out"), style: `grid-column:${i + 1}` }, String(d.getUTCDate())); });
      const lanes = [];
      for (const e of events.filter(e => e.a <= w + 6 * DAY && e.b >= w)) {
        const c1 = Math.max(0, (e.a - w) / DAY), c2 = Math.min(6, (e.b - w) / DAY);
        let n = lanes.findIndex(used => used.every(([x, y]) => c2 < x || c1 > y));
        if (n < 0) n = lanes.push([]) - 1;
        lanes[n].push([c1, c2]);
        cells.push(btn({ class: e.sp ? "sp" : "", style: `grid-column:${c1 + 1}/${c2 + 2};grid-row:${n + 2}`, title: e.text, onclick: e.open }, e.text));
      }
      weeks.push(h("div", { class: "week" }, cells));
    }
    return h("div", { class: "cal" }, weeks);
  }

  /* ---------- חלון פריט ---------- */
  function show(key) {
    const i = by[key], d = $("item"), subs = children(key), related = i.type === "Story" ? ranked.filter(x => x.story === key && work.includes(x) && x.key !== key) : [];
    const link = x => btn({ class: "lnk", onclick: () => show(x.key) }, kind(x), x.key);
    const rows = arr => h("ul", { class: "kids" }, arr.map(x => h("li", {}, btn({ onclick: () => show(x.key) }, kind(x), keyText(x), h("span", { class: "sum" }, x.summary), prio(x.priority), status(x.status)))));
    const path = [];
    for (let p = by[i.parent]; p; p = by[p.parent]) path.unshift(p);
    const story = i.type !== "Story" && by[i.story], person = h("span", { class: "line" }, avatar(i), i.assigned ? ME : "Unassigned");
    const fields = [["Status", status(i.status)], ["Priority", h("span", { class: "line" }, prio(i.priority), i.priority)], ["Type", i.type], ["Assignee", person],
      i.parent ? ["Parent", link(by[i.parent])] : null, i.sprint ? ["Sprint", sprint(i.sprint).name] : null, i.start ? ["Start date", `${short(i.start)} 2026`] : null, i.due ? ["Due date", `${short(i.due)} 2026`] : null].filter(Boolean);
    d.replaceChildren(
      h("div", { class: "ih" }, h("span", {}, "Smart Care"), path.map(p => [h("span", {}, "/"), link(p)]), h("span", {}, "/"), h("span", { class: "line" }, kind(i), i.key), btn({ class: "x", "aria-label": "Close", onclick: () => d.close() }, icon("x"))),
      h("div", { class: "ib" }, h("div", {}, h("h2", { id: "itemTitle", tabindex: "-1" }, i.summary), h("h3", {}, "Description"), h("p", {}, i.description),
        i.criteria ? [h("h3", {}, "Acceptance criteria"), h("ul", { class: "ac" }, i.criteria.map(c => h("li", {}, c)))] : null,
        i.expected ? [h("h3", {}, "Expected result"), h("p", {}, i.expected), h("h3", {}, "Simulated actual result"), h("p", {}, i.actual)] : null,
        subs.length ? [h("h3", {}, i.type === "Epic" ? "Child work items" : "Subtasks"), rows(subs)] : null,
        related.length ? [h("h3", {}, "Related tasks and bugs"), rows(related)] : null,
        story ? [h("h3", {}, "Related story"), rows([story])] : null),
      h("aside", { class: "side" }, h("h3", {}, "Details"), h("dl", {}, fields.flatMap(([a, b]) => [h("dt", {}, a), h("dd", {}, b)])))));
    d.setAttribute("aria-labelledby", "itemTitle");
    // במסגרת בתוך האתר: ממקמים את החלון בחלק שנראה כרגע על המסך
    d.style.cssText = "";
    try {
      const r = frameElement.getBoundingClientRect(), bar = parent.document.querySelector(".top")?.getBoundingClientRect().bottom || 0, from = Math.max(0, bar - r.top), to = Math.min(r.height, parent.innerHeight - r.top);
      if (to - from > 200) d.style.cssText = `margin-top:${from + 12}px;max-height:${Math.min(704, to - from - 24)}px`;
    } catch {}
    if (!d.open) d.showModal();
    d.scrollTop = 0;
    $("itemTitle").focus({ preventScroll: true });
  }
  $("item").onclick = e => { if (e.target === $("item")) $("item").close(); };

  /* ---------- ניווט ---------- */
  const TABS = ["Summary", "Timeline", "Backlog", "Board", "Calendar", "List"];
  function render() {
    for (const b of $("tabs").children) {
      const on = b.dataset.tab === state.tab;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      if (on) $("tabs").scrollLeft = b.offsetLeft - 60;
    }
    const view = $("view");
    view.setAttribute("aria-labelledby", "tab" + state.tab);
    body = h("div", { class: "scroll" });
    draw = () => {};
    const bars = {
      Board: () => toolbar({ types: ["Story", "Task", "Bug"] }, select("Group", state.group, [["", "Group"], ["epic", "Group: Epic"], ["type", "Group: Type"], ["who", "Group: Assignee"]], v => { state.group = v; draw(); }),
        Object.assign(select("Sprint", String(state.sprint), [...SMC.sprints.map(s => [String(s.id), `${s.name} (${s.state})`]), ["0", "All sprints"]], v => { state.sprint = Number(v); draw(); }), { className: "end" })),
      Backlog: () => toolbar({ types: ["Story", "Task", "Bug"], status: true }), List: () => toolbar({ status: true }),
      Calendar: () => {
        const name = h("b", { "aria-live": "polite" }), prev = btn({ "aria-label": "Previous month" }, "‹"), next = btn({ "aria-label": "Next month" }, "›");
        const set = n => { state.month = n; name.textContent = `${MONTHS[n]} 2026`; prev.disabled = n === 8; next.disabled = n === 10; draw(); };
        prev.onclick = () => set(state.month - 1);
        next.onclick = () => set(state.month + 1);
        set(state.month);
        return h("div", { class: "bar nav" }, prev, name, next);
      }
    };
    if (state.tab === "Timeline") body.style.paddingTop = "1rem";
    // בלוח וב-Backlog אין Epics ותתי-משימות כפריט עצמאי
    if (/Board|Backlog/.test(state.tab) && /Epic|Sub-task/.test(f.type)) f.type = "";
    if (state.tab === "Board") f.status = "";
    view.replaceChildren(...(bars[state.tab] ? [bars[state.tab]()] : []), body);
    if (state.tab === "Summary") summary();
    else refresh({ Board: board, Backlog: backlog, List: list, Timeline: timeline, Calendar: calendar }[state.tab]);
    // בטלפון ציר הזמן נפתח באוקטובר, שבו מתחילה העבודה
    if (state.tab === "Timeline" && matchMedia("(max-width:44rem)").matches) body.scrollLeft = body.querySelector(".g").clientWidth * pos("2026-10-01") / 100;
  }
  function go(tab) {
    state.tab = tab;
    history.replaceState(null, "", "#" + tab.toLowerCase());
    render();
  }
  $("app").append(
    h("div", { class: "head" }, h("div", { class: "crumb" }, "Spaces /"), h("div", { class: "title" }, h("span", { class: "logo" }, icon("doc")), h("b", {}, "Smart Care"), h("span", { class: "ro" }, he ? "View only simulation · הדמיה לצפייה בלבד" : "View only simulation")),
      h("div", { class: "tabs", id: "tabs", role: "tablist", "aria-label": "Views", onkeydown: e => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        go(TABS[(TABS.indexOf(state.tab) + step + TABS.length) % TABS.length]);
        $("tab" + state.tab).focus();
      } }, TABS.map(t => btn({ role: "tab", id: "tab" + t, "data-tab": t, "aria-controls": "view", onclick: () => go(t) }, icon(t), t)))),
    h("div", { id: "view", role: "tabpanel", tabindex: "-1" }));
  // מסלול קצר: דרישה אחת, מהסיפור ועד הספרינט
  $("tour").setAttribute("aria-label", he ? "מעקב אחרי דרישה אחת" : "Follow one story");
  $("tour").append(h("strong", {}, he ? "מעקב אחרי דרישה אחת:" : "Follow one story:"), ...[
    [he ? "1. הסיפור" : "1. The story", () => show("SMC-43")], [he ? "2. משימה" : "2. A task", () => show("SMC-44")], [he ? "3. תרחיש תקלה" : "3. A defect scenario", () => show("SMC-52")],
    [he ? "4. הספרינט" : "4. Its sprint", () => { state.sprint = by["SMC-43"].sprint; state.group = ""; f = { ...none }; go("Board"); }]
  ].map(([t, onclick]) => btn({ onclick }, t)));
  state.tab = TABS.find(t => "#" + t.toLowerCase() === location.hash) || "Board";
  render();
})();
