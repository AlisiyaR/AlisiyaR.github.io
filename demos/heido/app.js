// הדמיה: מיילים מובנים ותשובות AI שמורות; כלל הניתוב רץ באמת. בלי בקשות רשת ובלי שמירה, לכן רענון מאפס.
(() => {
  const H = HEIDO, $ = id => document.getElementById(id), root = document.documentElement;
  let lang, theme;
  try { lang = localStorage.getItem("lang"); theme = localStorage.getItem("theme"); } catch {}
  const he = lang ? lang === "he" : /^(he|iw)/.test(navigator.language);
  root.lang = he ? "he" : "en";
  root.dir = he ? "rtl" : "ltr";
  root.dataset.theme = theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const T = he ? {
    lead: "בחרו מייל מוכן ושלחו אותו כלקוח. כמה שניות אחר כך המשימה תופיע בלוח של צוות התמיכה.",
    cTitle: "מסך הלקוח", cSub: "תיבת המייל", tTitle: "מסך צוות התמיכה", tSub: "לוח העבודה של העובדים", fTitle: "מאחורי הקלעים",
    ready: "מוכנים לשליחה", inbox: "דואר נכנס", from: "מאת", to: "אל", subject: "נושא", send: "שליחה", sending: "נשלח...", sent: "נשלח",
    noInbox: "אין עדיין תשובות. שלחו מייל כדי לקבל אישור.", got: "המייל נשלח, והתקבל אישור בדואר הנכנס.", on: "המייל נשלח.", wait: "מייל אחר נשלח כרגע.", see: "למשימה בלוח", read: "לאישור שהתקבל", translated: "תורגם מעברית",
    steps: ["קריאת המייל", "נושא ותוכן בלבד ל-AI", "תשובת Gemini", "כלל קבוע בוחר עובד", "משימה בלוח", "אישור ללקוח"], idle: "שלחו מייל כדי לראות את השלבים.",
    kept: "כתובת השולח לא נשלחת ל-AI.", arrow: " ← ", added: "משימה חדשה בלוח: ", conf: "נשלח ללקוח מספר פנייה ",
    note: "הדמיה, ואינה מוצר של monday.com. Heido היא חברה בדויה, וכל השמות והכתובות בדויים. תשובות ה-AI הן הפלט ש-Gemini החזיר בבדיקות, והן לא מחושבות מחדש; שתיים מהן שגויות ונשארו כמו שהיו (System failure recurring issue ו-Customer Callback Request). שום מייל לא נשלח באמת, והלוח מתאפס ברענון."
  } : {
    lead: "Choose a ready-made email and send it as a customer. A few seconds later the task appears on the support team's board.",
    cTitle: "Customer screen", cSub: "Mailbox", tTitle: "Support team screen", tSub: "The employees' work board", fTitle: "Behind the scenes",
    ready: "Ready to send", inbox: "Inbox", from: "From", to: "To", subject: "Subject", send: "Send", sending: "Sending...", sent: "Sent",
    noInbox: "No replies yet. Send an email to get a confirmation.", got: "The email was sent, and a confirmation arrived in the inbox.", on: "The email was sent.", wait: "Another email is being sent.", see: "See the task", read: "Read the confirmation", translated: "Translated from Hebrew",
    steps: ["Read the email", "Only subject and body to the AI", "Gemini's answer", "A fixed rule picks the employee", "Task on the board", "Confirm to the customer"], idle: "Send an email to see the steps.",
    kept: "The sender's address is not sent to the AI.", arrow: " → ", added: "New task on the board: ", conf: "The customer received ticket number ",
    note: "Simulation, not a monday.com product. Heido is a fictional company, and all names and addresses are fictional. The AI answers are what Gemini returned in testing and are not recomputed; two of them are wrong and were kept as they were (System failure recurring issue and Customer Callback Request). No email is really sent, and the board resets on refresh."
  };
  for (const k of ["lead", "cTitle", "cSub", "tTitle", "tSub", "fTitle", "note"]) $(k).textContent = T[k];

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) k.startsWith("on") ? e[k] = attrs[k] : attrs[k] != null && e.setAttribute(k, attrs[k]);
    e.append(...kids.flat(Infinity).filter(x => x != null));
    return e;
  }
  const btn = (attrs, ...k) => h("button", { type: "button", ...attrs }, ...k);
  const en = s => h("bdi", { lang: "en" }, s);
  const assign = category => H.routing[category] || H.defaultAssignee;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function received(at) {
    const [, d, m, hh, mm] = at.match(/(\d+)\/(\d+)\/\d+ (\d+):(\d+)/);
    return `${MON[m - 1]} ${Number(d)}, ${hh % 12 || 12}:${mm} ${hh < 12 ? "AM" : "PM"}`;
  }

  /* ---------- מסך הלקוח ---------- */
  const tasks = H.board.map(t => ({ ...t })), status = {}; // status[id]: "sending" | "task" | "done"
  let folder = "ready", mail = H.emails[0], reply = null, busy = false, inbox = [];

  function drawList() {
    const top = $("list").scrollTop, own = folder === "ready" ? H.emails : inbox, cur = folder === "ready" ? mail : reply;
    $("folders").replaceChildren(...[["ready", `${T.ready} (${H.emails.filter(e => !status[e.id]).length})`], ["inbox", `${T.inbox} (${inbox.length})`]].map(([k, label]) =>
      btn({ "aria-pressed": String(folder === k), "data-f": k, onclick: () => { open(k); $("folders").querySelector(`[data-f=${k}]`).focus(); } }, label)));
    $("list").replaceChildren(...(own.length ? own.map(e => h("li", {}, btn({ "aria-current": String(e === cur), "data-id": e.id, onclick: () => { folder === "ready" ? mail = e : reply = e; draw(); $("list").querySelector(`[data-id=${e.id}]`).focus({ preventScroll: true }); } },
      h("b", {}, folder === "ready" ? en(e.name) : en("Heido Support")), folder === "ready" && status[e.id] ? h("span", { class: "sent" }, "✓ " + T.sent) : "",
      h("span", { class: "subj", dir: "ltr" }, folder === "ready" ? e.subject : `We received your request – Ticket ${e.item}`)))) : [h("li", { class: "none" }, T.noInbox)]));
    $("list").scrollTop = top;
  }
  const head = rows => h("div", { class: "hd" }, rows.map(([a, b]) => [h("span", {}, a), en(b)]));
  function drawPane() {
    const pane = $("pane");
    if (folder === "inbox") {
      if (!reply) return pane.replaceChildren(h("p", { class: "tr" }, T.noInbox));
      return pane.replaceChildren(h("div", { dir: "ltr", lang: "en", class: "subject" }, `We received your request – Ticket ${reply.item}`), head([[T.from, "Heido Support"], [T.to, `${reply.name} (${reply.email})`]]),
        h("div", { class: "text", dir: "ltr", lang: "en" }, "Hi,\n\nThank you for contacting ", h("strong", {}, "Heido Support"), ".\n\nWe have received your request and opened a support ticket:\n\n", h("strong", {}, "Ticket number: "), reply.item + "\n", h("strong", {}, "Topic: "), reply.title,
          "\n\nOur team is reviewing your request and will get back to you as soon as possible.\nPlease keep this ticket number for future reference.\n\nBest regards,\nHeido Support Team"));
    }
    const s = status[mail.id];
    const act = !s ? [btn({ class: "btn main", disabled: busy ? "" : null, onclick: () => send(mail) }, T.send), busy ? h("p", {}, T.wait) : null]
      : s === "sending" ? [btn({ class: "btn main", disabled: "" }, T.sending)]
      : [h("p", {}, s === "done" ? T.got : T.on), btn({ class: "btn", onclick: () => seeTask(mail.id) }, T.see), s === "done" ? btn({ class: "btn", onclick: () => { reply = inbox.find(x => x.id === mail.id); open("inbox"); pane.focus({ preventScroll: true }); } }, T.read) : null];
    pane.replaceChildren(h("div", { class: "subject", dir: "ltr", lang: "en" }, mail.subject), head([[T.from, `${mail.name} (${mail.email})`], [T.to, "Heido Support"]]),
      h("div", { class: "text", dir: "ltr", lang: "en" }, mail.body), mail.translated ? h("p", { class: "tr" }, T.translated) : "", h("div", { class: "act" }, act.filter(Boolean)));
  }
  function open(f) {
    folder = f;
    if (f === "inbox" && !reply) reply = inbox[0] || null;
    draw();
  }
  function draw() { drawList(); drawPane(); }

  /* ---------- מאחורי הקלעים ---------- */
  function flow(n, ...out) {
    $("steps").replaceChildren(...T.steps.map((s, i) => h("li", { class: i < n ? "on" : "" }, s)));
    $("fOut").replaceChildren(...out);
  }
  async function send(e) {
    if (busy || status[e.id]) return;
    busy = true;
    status[e.id] = "sending";
    draw();
    $("pane").focus({ preventScroll: true });
    flow(1, en(e.subject));
    await wait(900);
    flow(2, T.kept);
    await wait(1200);
    flow(3, en(`${e.title} | ${e.category} | ${e.priority}`));
    await wait(1500);
    flow(4, en(e.category), T.arrow, en(assign(e.category)));
    await wait(1200);
    tasks.push({ ...e, status: "Not Started", group: "new" });
    status[e.id] = "task";
    closed.delete("new");
    drawBoard(e.id);
    flow(5, T.added, en(e.title));
    draw();
    await wait(1200);
    inbox = [e, ...inbox];
    reply = e;
    status[e.id] = "done";
    busy = false;
    flow(6, T.conf, en(e.item));
    draw();
  }

  /* ---------- מסך הצוות ---------- */
  const DARK = "#1f2130", WHITE = "#fff";
  const PRI = { Low: ["#a1e3f6", DARK], Medium: ["#ff7575", DARK], High: ["#d83a52", WHITE] };
  const STA = { "Working on it": ["#fdab3d", DARK], Stuck: ["#ff7544", DARK], Done: ["#33c573", DARK], "Not Started": ["#c4c4c4", DARK] };
  const CAT = { "Software & System Issues": ["#225091", WHITE], "Performance Issues": ["#2169d4", WHITE], "Network & Connectivity Issues": ["#cd9282", DARK], "Hardware Issues": ["#bca58a", DARK],
    "Service Requests & General Support": ["#faa1f1", DARK], "Installation & Configuration": ["#7f5347", WHITE], "Data & Information Issues": ["#ff5ac4", DARK], "Other / Unclassified": ["#bda8f9", DARK], "Login & Access Issues": ["#c4c4c4", DARK] };
  const COLS = [["Task", 16], ["Item ID", 7.5], ["Priority", 8.5], ["Status", 9.5], ["Assigned to", 10], ["Category", 10.5], ["Summary", 11], ["Customer Name", 9.5], ["Customer Email", 12], ["Received At", 10], ["Files", 5.5], ["Original Message", 13]];
  const fill = (map, v) => h("td", { class: "fill", title: v, style: `background:${map[v][0]};color:${map[v][1]}` }, v);
  const closed = new Set();
  const line = t => h("tr", { "data-task": t.id },
    h("td", {}, btn({ title: t.title, onclick: () => show(t) }, t.title)), h("td", { class: "l", title: t.item }, t.item), fill(PRI, t.priority), fill(STA, t.status),
    h("td", {}, h("span", { class: "chip" }, assign(t.category))), fill(CAT, t.category), h("td", { class: "l", title: t.summary }, t.summary), h("td", {}, t.name),
    h("td", { class: "mail", title: t.email }, t.email), h("td", { class: "sub" }, received(t.at)), h("td", {}), h("td", { class: "l" }, t.body.replace(/\s+/g, " ")));
  function dist(list, map, key) {
    const counts = Object.keys(map).map(k => [k, list.filter(t => t[key] === k).length]).filter(x => x[1]);
    return h("td", {}, h("div", { class: "dist", role: "img", "aria-label": counts.map(([k, n]) => `${k}: ${n}`).join(", "), title: counts.map(([k, n]) => `${k}: ${n}`).join(", ") },
      counts.map(([k, n]) => h("i", { style: `flex:${n};background:${map[k][0]}` }))));
  }
  function group(id, name) {
    const list = tasks.filter(t => t.group === id), isOpen = !closed.has(id), people = [...new Set(list.map(t => assign(t.category)))];
    const gap = () => h("td", {});
    return [btn({ class: "gh" + (id === "done" ? " done" : ""), "data-g": id, "aria-expanded": String(isOpen), onclick: () => { isOpen ? closed.add(id) : closed.delete(id); drawBoard(); $("board").querySelector(`[data-g=${id}]`).focus({ preventScroll: true }); } },
      h("i", { "aria-hidden": "true" }, "▾"), name, h("small", {}, `${list.length} Tasks`)),
    isOpen ? h("table", { class: id, "aria-label": name }, h("colgroup", {}, COLS.map(c => h("col", { style: `width:${c[1]}rem` }))), h("thead", {}, h("tr", {}, COLS.map(c => h("th", { scope: "col" }, c[0])))),
      h("tbody", {}, list.map(line)),
      h("tfoot", {}, h("tr", {}, gap(), gap(), dist(list, PRI, "priority"), dist(list, STA, "status"), h("td", { title: people.join(", ") }, h("span", { class: "chip" }, people[0]), people.length > 1 ? ` +${people.length - 1}` : ""), dist(list, CAT, "category"),
        COLS.slice(6).map(gap)))) : null];
  }
  function drawBoard(fresh) {
    const b = $("board"), top = b.scrollTop, left = b.scrollLeft;
    b.replaceChildren(h("div", { class: "bt" }, "Customer Support"), h("div", { class: "vw" }, "Main table"), ...[group("new", "New Inquiries"), group("done", "Resolved")].flat().filter(Boolean));
    b.scrollTop = top;
    b.scrollLeft = left;
    if (fresh) reveal(fresh);
  }
  // גלילה בתוך הלוח בלבד, בלי להזיז את העמוד
  function reveal(id) {
    const b = $("board"), r = b.querySelector(`[data-task=${id}]`);
    if (!r) return;
    b.scrollLeft = 0;
    b.scrollTop += r.getBoundingClientRect().top - b.getBoundingClientRect().top - b.clientHeight / 2;
    r.classList.remove("fresh");
    void r.offsetWidth;
    r.classList.add("fresh");
  }
  function seeTask(id) {
    if (closed.delete("new")) drawBoard();
    $("team").scrollIntoView({ block: "start" });
    reveal(id);
    $("board").querySelector(`[data-task=${id}] button`).focus({ preventScroll: true });
  }
  function show(t) {
    const d = $("task"), lab = (map, v) => h("span", { class: "lab", style: `background:${map[v][0]};color:${map[v][1]}` }, v);
    const rows = [["Item ID", t.item], ["Priority", lab(PRI, t.priority)], ["Status", lab(STA, t.status)], ["Assigned to", assign(t.category)], ["Category", lab(CAT, t.category)],
      ["Summary", t.summary], ["Customer Name", t.name], ["Customer Email", t.email], ["Received At", received(t.at)], ["Files", "None"]];
    d.replaceChildren(h("div", { class: "top2" }, h("h2", { id: "taskTitle", tabindex: "-1" }, t.title), btn({ class: "x", "aria-label": "Close", onclick: () => d.close() }, "×")),
      h("dl", {}, rows.flatMap(([a, v]) => [h("dt", {}, a), h("dd", {}, v)])), h("div", { class: "text" }, h("strong", {}, "Original Message"), "\n\n" + t.body), t.translated ? h("p", { class: "tr" }, "Translated from Hebrew") : "");
    // במסגרת בתוך האתר: ממקמים את החלון בחלק שנראה כרגע על המסך
    d.style.cssText = "";
    try {
      const r = frameElement.getBoundingClientRect(), bar = parent.document.querySelector(".top")?.getBoundingClientRect().bottom || 0, from = Math.max(0, bar - r.top), to = Math.min(r.height, parent.innerHeight - r.top);
      if (to - from > 200) d.style.cssText = `margin-top:${from + 12}px;max-height:${Math.min(704, to - from - 24)}px`;
    } catch {}
    d.showModal();
    d.scrollTop = 0;
    $("taskTitle").focus({ preventScroll: true });
  }
  $("task").onclick = e => { if (e.target === $("task")) $("task").close(); };

  flow(0, T.idle);
  draw();
  drawBoard();
})();
