// לוח עריכת טקסט. נטען רק בתצוגה המקומית (localhost), לא באתר שמפורסם.
// השינויים נשמרים בדפדפן; כדי להכניס אותם לקבצים מעתיקים ושולחים ל-Claude.
(() => {
  const S = window.SITE, UI = window.SITE_UI, KEY = "textEdits", fields = [], groups = [];
  const pack = v => Array.isArray(v) ? v.join("\n\n") : v;
  const unpack = (v, list) => list ? v.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean) : v;

  // שדה דו-לשוני, או שדה יחיד (תקופה)
  function add(group, path, label, get, set) {
    const base = get(), list = Array.isArray(base.he);
    fields.push({ group, path, label, list, set, base: { he: pack(base.he), en: pack(base.en) }, value: { he: pack(base.he), en: pack(base.en) } });
  }
  const pair = (group, path, label, o) => add(group, path, label, () => o, (l, v) => { o[l] = v; });
  const flat = (group, path, label, o, k) => typeof o[k] === "string"
    ? add(group, path, label, () => ({ he: o[k], en: o[k] }), (l, v) => { if (typeof o[k] === "string") o[k] = { he: o[k], en: o[k] }; o[k][l] = v; })
    : pair(group, path, label, o[k]);

  pair("ראש העמוד", "name", "שם", S.name);
  pair("ראש העמוד", "headline", "כותרת מתחת לשם", S.headline);
  pair("ראש העמוד", "intro", "פתיח", S.intro);
  for (const [k, l] of [["title", "כותרת"], ["lead", "הסבר"], ["hint", "רמז"], ["note", "הערה"], ["end", "סיום"]]) pair("המשחקון של Heido", `teaser.${k}`, l, S.teaser[k]);
  S.teaser.items.forEach((s, i) => pair("המשחקון של Heido", `teaser.${i}.note`, `הסבר למייל ${i + 1}`, s.note));
  for (const p of S.projects) {
    const g = "פרויקט: " + p.title.he;
    pair(g, `projects.${p.id}.title`, "שם", p.title);
    pair(g, `projects.${p.id}.summary`, "תיאור קצר", p.summary);
    pair(g, `projects.${p.id}.shows`, "מה זה מראה", p.shows);
    pair(g, `projects.${p.id}.result`, "תוצאה", p.result);
    const c = p.case, at = `projects.${p.id}.case.`;
    for (const [k, l] of [["type", "סוג"], ["role", "תפקיד"], ["when", "מתי"], ["lookLabel", "כותרת השורה מעל הדמו"], ["look", "השורה מעל הדמו"], ["problem", "הבעיה"], ["goal", "המטרה"], ["did", "מה עשיתי (שורה ריקה בין פסקאות)"], ["tested", "איך בדקתי"], ["limits", "מגבלות (שורה ריקה בין סעיפים)"]]) if (c[k]) pair(g, at + k, l, c[k]);
    c.decisions.forEach((d, i) => { for (const [k, l] of [["title", "כותרת"], ["instead", "במקום"], ["why", "למה"]]) if (d[k]) pair(g, `${at}decisions.${i}.${k}`, `החלטה ${i + 1}: ${l}`, d[k]); });
    (c.trace || []).forEach((s, i) => s.forEach((x, j) => pair(g, `${at}trace.${i}.${j}`, `שלב ${i + 1}${j ? ": פירוט" : ""}`, x)));
    if (c.runs) pair(g, at + "runs.note", "הערה לתרשים", c.runs.note);
  }
  pair("עליי", "about", "טקסט (שורה ריקה בין פסקאות)", S.about);
  S.how.forEach((s, i) => {
    pair("איך אני עובדת", `how.${i}.label`, `נקודה ${i + 1}`, s.label);
    pair("איך אני עובדת", `how.${i}.text`, `פירוט ${i + 1}`, s.text);
  });
  pair("כישורים", "proofNote", "הערה מעל הרשימה", S.proofNote);
  pair("עליי", "looking", "מה אני מחפשת", S.looking);
  pair("יצירת קשר", "closing", "משפט סיום", S.closing);
  S.site.forEach((s, i) => { pair("על האתר", `site.${i}.label`, `נושא ${i + 1}`, s.label); pair("על האתר", `site.${i}.text`, `פירוט ${i + 1}`, s.text); });
  S.skills.forEach((s, i) => {
    pair("כישורים", `skills.${i}.label`, `נושא ${i + 1}`, s.label);
    flat("כישורים", `skills.${i}.items`, `פירוט ${i + 1}`, s, "items");
  });
  for (const [k, g, what] of [["education", "השכלה", "לימודים"], ["experience", "ניסיון תעסוקתי", "תפקיד"]]) S[k].forEach((s, i) => {
    flat(g, `${k}.${i}.when`, `תקופה ${i + 1}`, s, "when");
    pair(g, `${k}.${i}.what`, `${what} ${i + 1}`, s.what);
    if (s.note) pair(g, `${k}.${i}.note`, `פירוט ${i + 1}`, s.note);
  });
  const NAMES = { projects: "כותרת: פרויקטים", about: "כותרת: עליי", how: "כותרת: איך אני עובדת", looking: "כותרת: מה אני מחפשת", skills: "כותרת: כישורים", edu: "כותרת: השכלה", exp: "כותרת: ניסיון", contact: "כותרת: יצירת קשר", cv: "כפתור: קורות חיים", see: "כפתור: לפרויקטים", try: "כפתור: דמו", back: "קישור: חזרה", full: "קישור: חלון מלא", demo: "כותרת: דמו" };
  for (const k in NAMES) add("כותרות וכפתורים", `ui.${k}`, NAMES[k], () => ({ he: UI.he[k], en: UI.en[k] }), (l, v) => { UI[l][k] = v; });

  // שינויים שמורים. אם הטקסט בקובץ כבר התעדכן, השינוי הישן נזרק.
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch {}
  for (const f of fields) for (const l of ["he", "en"]) {
    const e = saved[f.path]?.[l];
    if (e && e.base === f.base[l] && typeof e.value === "string") { f.value[l] = e.value; f.set(l, unpack(e.value, f.list)); }
  }
  const changed = () => fields.flatMap(f => ["he", "en"].filter(l => f.value[l] !== f.base[l]).map(l => [f, l]));
  function store() {
    const out = {};
    for (const [f, l] of changed()) (out[f.path] ||= {})[l] = { base: f.base[l], value: f.value[l] };
    try { localStorage.setItem(KEY, JSON.stringify(out)); } catch {}
  }
  const isProject = document.body.dataset.page === "project";
  let timer;
  function refresh() {
    clearTimeout(timer);
    const y = scrollY;
    window.siteRender();
    scrollTo({ top: y, behavior: "instant" });
  }

  const host = document.createElement("div");
  host.dir = "rtl";
  host.lang = "he";
  document.body.append(host);
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `<style>
    :host{position:fixed;right:1rem;bottom:1rem;z-index:9;font:15px/1.45 "IBM Plex Sans Hebrew",system-ui,sans-serif;color:#222;text-align:right}
    button{font:inherit;padding:.45rem .8rem;border:1px solid #bbb;border-radius:4px;background:#fff;color:#222;cursor:pointer}
    button:hover{background:#eee}
    button:disabled{opacity:.5;cursor:default}
    :focus-visible{outline:2px solid #222;outline-offset:1px}
    #panel{width:min(26rem,calc(100vw - 2rem));max-height:calc(100vh - 9rem);overflow:auto;background:#fff;border:1px solid #bbb;border-radius:6px;padding:1rem;margin-bottom:.5rem;box-shadow:0 4px 18px #0003;box-sizing:border-box}
    #panel[hidden]{display:none}
    p{margin:0 0 .6rem}
    summary{cursor:pointer;padding:.45rem 0;font-weight:600;border-top:1px solid #ddd}
    fieldset{border:0;margin:0 0 .9rem;padding:0}
    legend{font-weight:500;padding:0;margin-bottom:.2rem}
    label{display:block;font-size:13px;color:#555;margin-top:.25rem}
    textarea{display:block;width:100%;box-sizing:border-box;font:inherit;color:#222;background:#fff;border:1px solid #bbb;border-radius:4px;padding:.35rem .5rem;resize:vertical;field-sizing:content;min-height:2.2rem;max-height:16rem}
    textarea.mod{border-color:#505d94;background:#f1f3fb}
    .row{display:flex;flex-wrap:wrap;gap:.4rem;position:sticky;bottom:-1rem;background:#fff;padding:.7rem 0 1rem;margin-bottom:-1rem;border-top:1px solid #ddd}
    #out{direction:ltr;height:7rem;font:12px monospace;margin-bottom:.6rem}
    @media(max-width:30rem){:host{display:none}}
  </style>
  <div id="panel" hidden>
    <p>לחצו על טקסט באתר כדי לקפוץ לשדה שלו, או בחרו מהרשימה. טקסט שמתחיל ב-[ מסומן כזמני; מחקו את הסוגריים כשהוא סופי.</p>
    <div id="groups"></div>
    <textarea id="out" readonly hidden aria-label="השינויים להעתקה"></textarea>
    <div class="row"><button id="copy"></button><button id="undo">ביטול כל השינויים</button></div>
  </div>
  <button id="open" aria-expanded="false" aria-controls="panel">עריכת טקסט</button>`;
  const $ = id => shadow.getElementById(id);
  function count() {
    const n = changed().length;
    $("copy").textContent = n ? `העתקת השינויים (${n})` : "אין שינויים";
    $("copy").disabled = $("undo").disabled = !n;
    $("out").hidden = true;
  }
  for (const f of fields) {
    let g = groups.find(x => x.name === f.group);
    if (!g) {
      g = { name: f.group, el: document.createElement("details") };
      g.el.append(Object.assign(document.createElement("summary"), { textContent: f.group }));
      groups.push(g);
      $("groups").append(g.el);
    }
    const box = document.createElement("fieldset");
    box.append(Object.assign(document.createElement("legend"), { textContent: f.label }));
    f.input = {};
    for (const l of ["he", "en"]) {
      const label = Object.assign(document.createElement("label"), { textContent: l === "he" ? "עברית" : "English" });
      const t = Object.assign(document.createElement("textarea"), { value: f.value[l], dir: l === "he" ? "rtl" : "ltr", rows: 1 });
      t.classList.toggle("mod", f.value[l] !== f.base[l]);
      t.oninput = () => {
        f.value[l] = t.value;
        f.set(l, unpack(t.value, f.list));
        t.classList.toggle("mod", f.value[l] !== f.base[l]);
        store();
        count();
        clearTimeout(timer);
        if (!isProject) timer = setTimeout(refresh, 400); // בעמוד פרויקט: רק בסיום, כדי לא לטעון את הדמו מחדש
      };
      t.onchange = refresh;
      f.input[l] = t;
      label.append(t);
      box.append(label);
    }
    g.el.append(box);
  }
  $("open").onclick = () => {
    const hide = !$("panel").hidden;
    $("panel").hidden = hide;
    $("open").setAttribute("aria-expanded", String(!hide));
    $("open").textContent = hide ? "עריכת טקסט" : "סגירת העריכה";
  };
  // לחיצה על טקסט בזמן עריכה מדלגת לשדה המתאים
  document.addEventListener("click", e => {
    if ($("panel").hidden) return;
    const el = e.target.closest("h1,h2,h3,p,dt,dd,.todo,.btn,.back,.brand");
    if (!el || e.target.closest(".tools")) return;
    const clean = s => s.replace(/^\[|\]$|\u2060/g, "").trim(), text = el.matches("dd") ? clean(el.firstChild?.textContent || "") : clean(el.textContent), l = document.documentElement.lang;
    const f = fields.find(x => unpack(x.value[l], true).some(v => clean(v) === text));
    if (!f) return;
    e.preventDefault();
    const d = f.input[l].closest("details");
    d.open = true;
    f.input[l].focus();
    f.input[l].scrollIntoView({ block: "center" });
  }, true);
  $("copy").onclick = async () => {
    const out = {};
    for (const [f, l] of changed()) (out[f.path] ||= {})[l] = f.value[l];
    const text = "עדכוני טקסט לאתר:\n" + JSON.stringify(out, null, 1);
    try {
      await navigator.clipboard.writeText(text);
      $("copy").textContent = "הועתק. הדביקו בצ'אט";
    } catch {
      $("out").value = text;
      $("out").hidden = false;
      $("out").select();
      $("out").scrollIntoView({ block: "center" });
    }
  };
  let sure = 0;
  $("undo").onclick = () => {
    // לחיצה שנייה תוך 4 שניות מאשרת
    if (Date.now() - sure > 4000) { sure = Date.now(); $("undo").textContent = "לחצו שוב לאישור"; setTimeout(() => { $("undo").textContent = "ביטול כל השינויים"; }, 4000); return; }
    sure = 0;
    $("undo").textContent = "ביטול כל השינויים";
    for (const [f, l] of changed()) {
      f.value[l] = f.base[l];
      f.set(l, unpack(f.base[l], f.list));
      f.input[l].value = f.base[l];
      f.input[l].classList.remove("mod");
    }
    store();
    count();
    refresh();
  };
  count();
  if (changed().length) refresh();
})();
