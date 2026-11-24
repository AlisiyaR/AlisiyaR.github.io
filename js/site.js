(() => {
  const S = window.SITE;
  const LOCAL = ["localhost", "127.0.0.1"].includes(location.hostname); // באתר המפורסם פסקאות זמניות ב"עליי" מוסתרות
  const UI = {
    he: { projects: "פרויקטים", about: "עליי", how: "איך אני עובדת", skills: "כישורים", edu: "השכלה", exp: "ניסיון תעסוקתי", site: "על האתר", looking: "מה אני מחפשת", contact: "יצירת קשר", github: "GitHub", linkedin: "LinkedIn", cv: "קורות חיים", email: "אימייל", copy: "העתקת כתובת המייל", copied: "הועתק", manual: "הכתובת סומנה, העתיקו עם Ctrl+C", try: "לנסות את הדמו", view: "לעמוד הפרויקט", soon: "הדמו בהכנה", back: "לכל הפרויקטים", full: "פתיחה בחלון מלא", demo: "דמו", missing: "הפרויקט לא נמצא", add: "קישור יתווסף", light: "מצב בהיר", dark: "מצב כהה", other: "English", nav: "ניווט", menu: "תפריט", see: "לפרויקטים", shows: "מה זה מראה", result: "תוצאה", next: "הפרויקט הבא", more: "רוצים לדעת עוד?", skip: "דילוג לתוכן", task: "משימה", priority: "עדיפות", assigned: "עובד", type: "סוג", role: "התפקיד שלי", when: "מתי", glance: "במבט אחד", look: "על הדמו", problem: "הבעיה", goal: "המטרה", did: "מה עשיתי", trace: "דרישה אחת, מהצורך ועד המשימות", decisions: "החלטות", instead: "במקום", why: "למה", source: "המקור", tested: "איך בדקתי", catacc: "קטגוריה ועובד", prio: "עדיפות", version: "גרסת פרומפט", hit: "נכון", miss: "טעות", limits: "תקלות, מגבלות והצעד הבא", shotsTitle: "צילומים", diagrams: "תרשימי UML", video: "סרטון של אב-הטיפוס", close: "סגירה", prev: "הקודם", nextImg: "הבא" },
    en: { projects: "Projects", about: "About", how: "How I work", skills: "Skills", edu: "Education", exp: "Work experience", site: "About this site", looking: "Looking for", contact: "Contact", github: "GitHub", linkedin: "LinkedIn", cv: "CV", email: "Email", copy: "Copy email address", copied: "Copied", manual: "Address selected, copy with Ctrl+C", try: "Try the demo", view: "View project", soon: "Demo in progress", back: "All projects", full: "Open full page", demo: "Demo", missing: "Project not found", add: "Link coming", light: "Light mode", dark: "Dark mode", other: "עברית", nav: "Navigation", menu: "Menu", see: "See the projects", shows: "What it shows", result: "Result", next: "Next project", more: "Want to know more?", skip: "Skip to content", task: "Task", priority: "Priority", assigned: "Assigned to", type: "Type", role: "My role", when: "When", glance: "At a glance", look: "About the demo", problem: "The problem", goal: "The goal", did: "What I did", trace: "One requirement, from the need to the tasks", decisions: "Decisions", instead: "Instead of", why: "Why", source: "Source", tested: "How I tested it", catacc: "Category and employee", prio: "Priority", version: "Prompt version", hit: "Right", miss: "Missed", limits: "Problems, limits and next steps", shotsTitle: "Screenshots", diagrams: "UML diagrams", video: "Video of the prototype", close: "Close", prev: "Previous", nextImg: "Next" }
  };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} }
  };
  const root = document.documentElement;
  const saved = store.get("lang");
  let lang = UI[saved] ? saved : /^(he|iw)/.test(navigator.language || "") ? "he" : "en";
  let theme = store.get("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  const tr = v => (v && typeof v === "object" ? v[lang] : v) || "";
  const plain = v => tr(v).replace(/^\[|\]$/g, "");
  const current = () => S.projects.find(p => p.id === document.body.dataset.id); // לכל פרויקט קובץ HTML משלו

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) {
      if (k.startsWith("on")) e[k] = attrs[k];
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    e.append(...kids.flat(Infinity).filter(x => x != null));
    return e;
  }
  // אות יחס לא נפרדת מהמילה בסוף שורה ("ב-Python")
  const glue = s => s.replace(/([א-ת])-(?=[A-Za-z0-9])/g, "$1-\u2060");
  // טקסט זמני "[...]" מקבל סימון
  const txt = v => tr(v).startsWith("[") ? h("span", { class: "todo" }, glue(plain(v))) : glue(tr(v));
  const OUT = href => /^https?:|\.pdf$/.test(href) ? { target: "_blank", rel: "noopener" } : {};
  const link = (label, href, cls = "btn", ...kids) => href
    ? h("a", { class: cls, href, ...OUT(href) }, label, ...kids)
    : h("span", { class: "btn off", title: UI[lang].add }, label);
  const cv = cls => link(UI[lang].cv, tr(S.links.cv), cls);
  const ICONS = {
    copy: "M9 9h11v11H9zM5 15H4V4h11v1",
    menu: "M4 7h16M4 12h16M4 17h16",
    close: "M6 6l12 12M18 6L6 18",
    dark: "M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z",
    light: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
    arrow: "M4 12h16M14 6l6 6-6 6",
    down: "M12 4v16M6 14l6 6 6-6",
    linkedin: "M5 9v11M5 4.500v.1M10 20V9M10 14a4.500 4.500 0 0 1 9 0v6",
    github: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.1-1.2-.3-2.5-1-3.5.3-1.1.3-2.3 0-3.5 0 0-1 0-3 1.5-2.6-.5-5.4-.5-8 0C6 2 5 2 5 2c-.3 1.2-.3 2.4 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.4.5-.7 1.1-.8 1.7-.2.6-.2 1.2-.2 1.8v4M9 18c-4.5 2-5-2-7-2"
  };
  function icon(name, cls) {
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg"), path = document.createElementNS(ns, "path");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", cls ? "icon " + cls : "icon");
    path.setAttribute("d", ICONS[name]);
    svg.append(path);
    return svg;
  }
  // איור הקו של הפרויקט (js/art.js)
  function art(p) {
    const shapes = window.ART?.[p.id];
    if (!shapes) return null;
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 320 200");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "art");
    for (const [tag, attrs, kind] of shapes) {
      const e = document.createElementNS(ns, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      if (kind) e.setAttribute("class", kind);
      svg.append(e);
    }
    return svg;
  }
  const tags = list => list.length ? h("ul", { class: "tags" }, list.map(x => h("li", { dir: "ltr" }, x))) : null;
  const github = p => (Array.isArray(p.code) ? p.code : p.code ? [{ label: "GitHub", url: p.code }] : []).map(c =>
    h("a", { class: "btn", href: c.url, target: "_blank", rel: "noopener", "aria-label": `${tr(c.label)}, GitHub: ${plain(p.title)}` }, tr(c.label), icon("github", "ring")));
  // כתובת המייל גלויה; לחיצה מעתיקה אותה
  function mailCopy(address) {
    const u = UI[lang], text = h("bdi", {}, address), note = h("span", { class: "copied", role: "status" });
    let timer;
    const b = h("button", { type: "button", class: "btn", title: u.copy, "aria-label": `${u.copy}: ${address}`, async onclick() {
      try {
        await navigator.clipboard.writeText(address);
        note.textContent = u.copied;
      } catch {
        // אם הדפדפן חוסם העתקה: מסמנים את הכתובת להעתקה ידנית
        getSelection().selectAllChildren(text);
        note.textContent = u.manual;
      }
      clearTimeout(timer);
      timer = setTimeout(() => { note.textContent = ""; }, 4000);
    } }, text, icon("copy", "ring"));
    return h("span", { class: "mail" }, b, note);
  }
  const mail = () => S.links.email ? mailCopy(S.links.email) : link(UI[lang].email, "");
  // אותו סגנון לכל הקישורים: בפתיח וביצירת קשר
  const links = () => {
    const u = UI[lang], l = S.links;
    return h("div", { class: "links" }, cv("btn"), link(u.github, l.github, "btn", icon("github", "ring")), link(u.linkedin, l.linkedin, "btn", icon("linkedin", "ring")), mail());
  };

  // דוגמת נקודות קבועה לכל פרויקט, לפי המזהה שלו
  function pattern(id) {
    let n = 2166136261;
    for (const c of id) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 160 100");
    svg.setAttribute("aria-hidden", "true");
    const a = 1 + (n >>> 3) % 4, b = 1 + (n >>> 9) % 5, p = (n >>> 15) % 7;
    for (let y = 0; y < 10; y++) for (let x = 0; x < 16; x++) {
      const v = (Math.sin(x * a / 4 + p) + Math.cos(y * b / 4 + x / 5)) / 2;
      const c = document.createElementNS(ns, "circle");
      c.setAttribute("cx", x * 10 + 5);
      c.setAttribute("cy", y * 10 + 5);
      c.setAttribute("r", (0.7 + (v + 1) * 1.7).toFixed(2));
      if (x + y > 15) c.setAttribute("class", "alt");
      svg.append(c);
    }
    return svg;
  }

  // בטלפון הקישורים נפתחים מכפתור תפריט
  function menu(open) {
    const bar = document.querySelector(".top");
    bar.classList.toggle("open", open);
    bar.querySelector(".menu").setAttribute("aria-expanded", String(open));
  }
  const isOpen = () => document.querySelector(".top").classList.contains("open");
  document.addEventListener("click", e => { if (isOpen() && !e.target.closest(".menu")) menu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && isOpen()) { menu(false); document.querySelector(".menu").focus(); } });
  addEventListener("blur", () => menu(false)); // מעבר אל תוך הדמו

  // החלפת ערכת נושא לא בונה מחדש את העמוד, כדי שהדמו יישמר
  function paint() {
    root.dataset.theme = theme;
    document.querySelector("meta[name=theme-color]")?.setAttribute("content", getComputedStyle(root).getPropertyValue("--acc").trim());
    for (const f of document.querySelectorAll("iframe")) try { f.contentDocument.documentElement.dataset.theme = theme; } catch {}
  }
  const isProject = document.body.dataset.page === "project";
  function setTheme(next) {
    theme = next;
    store.set("theme", theme);
    paint();
    document.querySelector(".top").replaceWith(header(!isProject));
    document.querySelector(".theme").focus();
    spy();
  }
  function setLang(next) {
    const y = scrollY;
    lang = next;
    store.set("lang", lang);
    render();
    scrollTo({ top: y, behavior: "instant" });
    document.querySelector(".lang").focus({ preventScroll: true });
  }
  // מסמן בתפריט את החלק שנמצא כרגע על המסך
  const PART = { projects: "projects", contact: "contact" };
  function spy() {
    let k = isProject ? "projects" : "";
    for (const s of document.querySelectorAll("main>section")) if (s.getBoundingClientRect().top <= innerHeight * .4) k = PART[s.id] || "about";
    if (!isProject && scrollY && scrollY + innerHeight >= root.scrollHeight - 4) k = "contact";
    for (const a of document.querySelectorAll(".top nav a[data-k]")) a.dataset.k === k ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
  }
  addEventListener("scroll", spy, { passive: true });

  function header(home) {
    const u = UI[lang], at = home ? "" : "index.html", mode = theme === "dark" ? "light" : "dark";
    // טקסט מלא במסך רחב, קיצור או סמל בטלפון
    const tool = (full, short) => [h("span", { class: "long" }, full), h("span", { class: "short" }, short)];
    return h("header", { class: "top" },
      h("a", { class: "brand", href: "index.html" }, tr(S.name)),
      h("button", { type: "button", class: "menu", "aria-label": u.menu, "aria-expanded": "false", onclick() { menu(!isOpen()); } }, icon("menu", "m"), icon("close", "x")),
      h("nav", { "aria-label": u.nav }, ["projects", "about", "contact"].map(k => h("a", { href: at + "#" + k, "data-k": k }, u[k])), cv("navcv")),
      h("div", { class: "tools" }, cv("barcv"),
        h("button", { type: "button", class: "lang", lang: lang === "he" ? "en" : "he", "aria-label": u.other, onclick() { setLang(lang === "he" ? "en" : "he"); } }, tool(u.other, lang === "he" ? "EN" : "עב")),
        h("button", { type: "button", class: "theme", "aria-label": u[mode], onclick() { setTheme(mode); } }, tool(u[mode], icon(mode)))));
  }
  const section = (id, ...kids) =>
    h("section", { id, class: "wrap" }, h("h2", {}, UI[lang][id]), h("div", { class: "body" }, ...kids));

  // מיומנות שיש לה הוכחה מוצגת כקישור
  const skill = items => tr(items).split(", ").flatMap((x, i) => [i ? ", " : "", S.proof?.[x] ? h("a", { href: S.proof[x], ...OUT(S.proof[x]) }, glue(x)) : glue(x)]);

  // רשימת תקופות: השכלה וניסיון
  const timeline = (list = []) => h("dl", {}, list.flatMap(s => [h("dt", {}, h("bdi", {}, txt(s.when))), h("dd", {}, txt(s.what), s.note ? h("p", { class: "note" }, txt(s.note)) : null)]));

  function card(p, i) {
    const u = UI[lang], label = p.demo ? u.try : u.view, lead = !i;
    return h("article", { class: lead ? "project feature" : "project" },
      lead && S.teaser && window.TEASER ? window.TEASER({ h, tr: v => glue(tr(v)), icon, data: S.teaser, lang, href: p.page + "#tested" }) : art(p),
      h("div", { class: "info" }, h("h3", {}, txt(p.title)), h("p", {}, txt(p.summary)),
        h("dl", { class: "facts" }, [["shows", p.shows], ["result", p.result]].filter(x => x[1]).map(([k, v]) => [h("dt", {}, u[k]), h("dd", {}, txt(v))])),
        tags(p.tech),
        h("div", { class: "links" },
          h("a", { class: p.demo ? "btn main" : "btn", href: p.page, "aria-label": label + ": " + plain(p.title) }, label, icon("arrow")),
          github(p))));
  }

  function home() {
    const u = UI[lang];
    return h("main", { id: "main", tabindex: "-1" },
      h("div", { class: "hero wrap" },
        h("div", { class: "pitch" }, h("h1", {}, tr(S.name)), h("p", { class: "lead" }, txt(S.headline)), h("p", { class: "intro" }, txt(S.intro)),
          links(), h("a", { class: "btn main go", href: "#projects" }, u.see, icon("down")))),
      section("projects", card(S.projects[0], 0), h("div", { class: "cards" }, S.projects.slice(1).map((p, i) => card(p, i + 1)))),
      section("about", S.about[lang].filter(x => LOCAL || !x.startsWith("[")).map(x => h("p", {}, txt(x)))),
      S.looking ? section("looking", h("p", {}, txt(S.looking))) : null,
      section("how", h("dl", {}, (S.how || []).flatMap(s => [h("dt", {}, tr(s.label)), h("dd", {}, txt(s.text))]))),
      section("skills", S.proofNote ? h("p", { class: "note" }, txt(S.proofNote)) : null, h("dl", {}, S.skills.flatMap(s => [h("dt", {}, tr(s.label)), h("dd", {}, skill(s.items))]))),
      section("edu", timeline(S.education)),
      section("exp", timeline(S.experience)),
      section("site", h("dl", {}, (S.site || []).flatMap(s => [h("dt", {}, tr(s.label)), h("dd", {}, txt(s.text))]))),
      section("contact", S.closing ? h("p", { class: "closing" }, txt(S.closing)) : null, links()));
  }

  const jump = () => { if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "instant" }); };
  // מתאים את גובה המסגרת לתוכן הדמו, כדי שלא תהיה גלילה כפולה
  function fit() {
    try {
      const body = this.contentDocument.body;
      const set = () => { this.style.height = Math.max(544, body.scrollHeight + 2) + "px"; };
      this.contentDocument.documentElement.style.overflowY = "hidden"; // הגובה מותאם, אין צורך בפס גלילה
      set();
      jump(); // הדמו שינה את גובה העמוד
      new ResizeObserver(set).observe(body);
    } catch {}
  }

  // ---------- תיק מקרה ----------
  function glance(p) {
    const u = UI[lang], c = p.case || {};
    return h("dl", { class: "glance", "aria-label": u.glance }, [["type", c.type], ["role", c.role], ["when", c.when], ["result", p.result]].filter(x => x[1]).map(([k, v]) => h("div", {}, h("dt", {}, u[k]), h("dd", {}, txt(v)))));
  }
  const paras = v => (Array.isArray(v?.[lang]) ? v[lang] : v ? [tr(v)] : []).map(x => h("p", {}, glue(x)));
  const block = (id, ...kids) => h("div", { class: "block", id }, h("h2", {}, UI[lang][id]), ...kids);
  // כל ריבוע הוא מייל אחד: מלא = נכון, ריק = טעות
  function runs(r) {
    const u = UI[lang], units = n => h("span", { class: "units", "aria-hidden": "true" }, Array.from({ length: 15 }, (_, i) => h("i", { class: i < n ? "" : "off" })));
    return h("figure", { class: "runs" },
      h("div", { class: "runs2" }, [["catacc", 1], ["prio", 2]].map(([k, col]) => h("table", {},
        h("caption", {}, u[k]),
        h("thead", {}, h("tr", {}, h("th", { scope: "col", class: "vh" }, u.version), h("th", { scope: "col", class: "vh" }, u[k]))),
        r.sets.map(s => h("tbody", {}, h("tr", {}, h("th", { scope: "colgroup", colspan: "2", class: "set" }, txt(s.name))),
          s.rows.map(row => h("tr", {}, h("th", { scope: "row" }, row[0]), h("td", { title: `${row[col]}/15` }, units(row[col]), h("b", { dir: "ltr" }, `${row[col]}/15`))))))))),
      h("p", { class: "key2" }, h("span", { class: "units" }, h("i")), " " + u.hit, h("span", { class: "units" }, h("i", { class: "off" })), " " + u.miss),
      h("figcaption", {}, txt(r.note)));
  }
  function story(p) {
    const u = UI[lang], c = p.case || {};
    return h("div", { class: "detailtext", id: "story" },
      c.problem ? block("problem", paras(c.problem)) : null, c.goal ? block("goal", paras(c.goal)) : null,
      c.did ? block("did", paras(c.did)) : null,
      c.trace ? block("trace", h("ol", { class: "trace" }, c.trace.map(([a, b]) => h("li", {}, h("strong", {}, txt(a)), h("span", {}, txt(b)))))) : null,
      c.decisions ? block("decisions", h("div", { class: "decisions" }, c.decisions.map(d => h("article", {}, h("h3", {}, txt(d.title)),
        d.instead ? h("p", { class: "note" }, u.instead + ": ", txt(d.instead)) : null, h("p", {}, txt(d.why)),
        d.url ? h("a", { href: d.url, ...OUT(d.url), "aria-label": `${u.source}: ${plain(d.title)}` }, u.source) : null)))) : null,
      c.tested ? block("tested", paras(c.tested), c.runs ? runs(c.runs) : null) : null,
      c.limits ? block("limits", h("ul", {}, c.limits[lang].map(x => h("li", {}, glue(x))))) : null,
      tags(p.tech), h("div", { class: "links" }, github(p), c.video ? link(u.video, c.video, "btn", icon("github", "ring")) : null));
  }
  // גלריה: לחיצה מגדילה בתוך העמוד (הקישור עצמו פותח את הקובץ)
  function gallery(title, list, wide) {
    if (!list) return null;
    return h("div", { class: "gal" }, h("h2", {}, title), h("div", { class: wide ? "shots wide" : "shots" }, list.map((s, i) => h("figure", {},
      h("a", { href: s.src, target: "_blank", rel: "noopener", onclick(e) { if (e.ctrlKey || e.metaKey || e.shiftKey) return; e.preventDefault(); zoom(list, i, this); } },
        h("img", { src: s.src, alt: tr(s.text), loading: "lazy", width: s.w || 1080, height: s.h || 2340 })),
      h("figcaption", {}, tr(s.text))))));
  }
  function zoom(list, i, from) {
    const u = UI[lang], img = h("img", {}), cap = h("p", { "aria-live": "polite" });
    const go = n => { i = (n + list.length) % list.length; const s = list[i]; img.src = s.src; img.alt = tr(s.text); cap.textContent = `${tr(s.text)} (${i + 1}/${list.length})`; };
    const b = (label, name, fn, cls) => h("button", { type: "button", class: cls, "aria-label": label, onclick: fn }, icon(name, name === "arrow" ? cls : ""));
    const d = h("dialog", { class: "zoom", "aria-label": UI[lang].shotsTitle, onclick(e) { if (e.target === d || e.target === box) d.close(); }, onclose() { d.remove(); from.focus(); },
      onkeydown(e) { const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (k) { e.preventDefault(); go(i + (root.dir === "rtl" ? -k : k)); } } });
    const box = h("div", { class: "zbox" }, img);
    d.append(b(u.close, "close", () => d.close(), "zx"), box, h("div", { class: "zbar" }, list.length > 1 ? b(u.prev, "arrow", () => go(i - 1), "flip") : null, cap, list.length > 1 ? b(u.nextImg, "arrow", () => go(i + 1), "arrow") : null));
    document.body.append(d);
    go(i);
    d.showModal();
  }

  function project(p) {
    const u = UI[lang], back = h("a", { class: "back", href: "index.html#projects" }, u.back);
    if (!p) return h("main", { id: "main", tabindex: "-1", class: "wrap detail" }, back, h("h1", {}, u.missing));
    const next = S.projects[(S.projects.indexOf(p) + 1) % S.projects.length];
    return h("main", { id: "main", tabindex: "-1", class: "wrap detail" }, back,
      h("h1", {}, txt(p.title)), h("p", { class: "lead" }, txt(p.summary)),
      glance(p),
      h("div", { class: "demohead" }, h("h2", {}, u.demo), p.demo ? h("a", { href: p.demo, target: "_blank", rel: "noopener" }, u.full) : null),
      p.case?.look ? h("p", { class: "look" }, h("strong", {}, (tr(p.case.lookLabel) || u.look) + ": "), txt(p.case.look)) : null,
      p.demo ? h("iframe", { src: p.demo, onload: fit, title: u.demo + ": " + plain(p.title) })
        : h("div", { class: "soon" }, pattern(p.id), h("p", {}, u.soon)),
      story(p),
      gallery(u.shotsTitle, p.shots, p.wide), gallery(u.diagrams, p.diagrams, true),
      h("div", { class: "after" },
        h("a", { class: "nextp", href: next.page }, h("span", {}, h("small", {}, u.next), h("strong", {}, txt(next.title))), icon("arrow")),
        h("div", { class: "ask" }, h("h2", {}, u.more), h("div", { class: "links" }, cv("btn"), link(u.linkedin, S.links.linkedin, "btn", icon("linkedin", "ring")), mail()))));
  }

  function render() {
    root.lang = lang;
    root.dir = lang === "he" ? "rtl" : "ltr";
    const p = isProject ? current() : null;
    document.getElementById("app").replaceChildren(h("a", { class: "skip", href: "#main" }, UI[lang].skip), header(!isProject), isProject ? project(p) : home());
    document.title = p ? plain(p.title) + " | " + tr(S.name) : tr(S.name) + " | " + plain(S.headline);
    paint();
    spy();
  }
  render();
  // לוחות הצבעים ועריכת הטקסט זמינים רק בתצוגה המקומית
  if (LOCAL) {
    window.SITE_UI = UI;
    window.siteRender = render;
    document.body.append(h("script", { src: "js/palette.js" }), h("script", { src: "js/edit.js" }));
  }
  jump();
})();
