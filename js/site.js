(() => {
  const S = window.SITE;
  const LOCAL = ["localhost", "127.0.0.1"].includes(location.hostname); // באתר המפורסם פסקאות זמניות ב"עליי" מוסתרות
  const UI = {
    he: { projects: "פרויקטים", about: "עליי", skills: "כישורים", exp: "ניסיון והשכלה", contact: "יצירת קשר", github: "GitHub", linkedin: "LinkedIn", cv: "קורות חיים", email: "אימייל", copy: "העתקת כתובת המייל", copied: "הועתק", manual: "הכתובת סומנה, העתיקו עם Ctrl+C", try: "לנסות את הדמו", view: "לעמוד הפרויקט", soon: "הדמו בהכנה", back: "לכל הפרויקטים", full: "פתיחה בחלון מלא", demo: "דמו", missing: "הפרויקט לא נמצא", add: "קישור יתווסף", light: "מצב בהיר", dark: "מצב כהה", other: "English", nav: "ניווט" },
    en: { projects: "Projects", about: "About", skills: "Skills", exp: "Experience and education", contact: "Contact", github: "GitHub", linkedin: "LinkedIn", cv: "CV", email: "Email", copy: "Copy email address", copied: "Copied", manual: "Address selected, copy with Ctrl+C", try: "Try the demo", view: "View project", soon: "Demo in progress", back: "All projects", full: "Open full page", demo: "Demo", missing: "Project not found", add: "Link coming", light: "Light mode", dark: "Dark mode", other: "עברית", nav: "Navigation" }
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
  const current = () => {
    const id = new URLSearchParams(location.search).get("id");
    return S.projects.find(p => p.id === (id === "heido-no-code" ? "heido-code" : id)); // הפרויקטים אוחדו
  };

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) {
      if (k.startsWith("on")) e[k] = attrs[k];
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    e.append(...kids.flat(Infinity).filter(x => x != null));
    return e;
  }
  // טקסט זמני "[...]" מקבל סימון
  const txt = v => tr(v).startsWith("[") ? h("span", { class: "todo" }, plain(v)) : tr(v);
  const link = (label, href) => href
    ? h("a", { class: "btn", href, ...(/^https?:|\.pdf$/.test(href) ? { target: "_blank", rel: "noopener" } : {}) }, label)
    : h("span", { class: "btn off", title: UI[lang].add }, label);
  const ICONS = {
    copy: "M9 9h11v11H9zM5 15H4V4h11v1",
    link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
    github: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.1-1.2-.3-2.5-1-3.5.3-1.1.3-2.3 0-3.5 0 0-1 0-3 1.5-2.6-.5-5.4-.5-8 0C6 2 5 2 5 2c-.3 1.2-.3 2.4 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.4.5-.7 1.1-.8 1.7-.2.6-.2 1.2-.2 1.8v4M9 18c-4.5 2-5-2-7-2"
  };
  function icon(name) {
    const ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg"), path = document.createElementNS(ns, "path");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "icon");
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
    h("a", { class: "btn", href: c.url, target: "_blank", rel: "noopener", "aria-label": `${tr(c.label)}, GitHub: ${plain(p.title)}` }, tr(c.label), icon("github")));
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
    } }, text, icon("copy"));
    return h("span", { class: "mail" }, b, note);
  }
  const links = () => {
    const u = UI[lang], l = S.links;
    return h("div", { class: "links" },
      link(u.github, l.github), link(u.linkedin, l.linkedin), link(u.cv, tr(l.cv)),
      l.email ? mailCopy(l.email) : link(u.email, ""));
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

  function header(home) {
    const u = UI[lang], at = home ? "" : "index.html";
    return h("header", { class: "top" },
      h("a", { class: "brand", href: "index.html" }, tr(S.name)),
      h("nav", { "aria-label": u.nav }, ["projects", "about", "contact"].map(k => h("a", { href: at + "#" + k }, u[k]))),
      h("div", { class: "tools" },
        h("button", { type: "button", lang: lang === "he" ? "en" : "he", onclick() { lang = lang === "he" ? "en" : "he"; store.set("lang", lang); render(); } }, u.other),
        h("button", { type: "button", onclick() { theme = theme === "dark" ? "light" : "dark"; store.set("theme", theme); render(); } }, theme === "dark" ? u.light : u.dark)));
  }
  const section = (id, ...kids) =>
    h("section", { id, class: "wrap" }, h("h2", {}, UI[lang][id]), h("div", { class: "body" }, ...kids));

  function home() {
    const u = UI[lang];
    return h("main", {},
      h("div", { class: "hero wrap" }, h("h1", {}, tr(S.name)), h("p", { class: "lead" }, txt(S.headline)), h("p", { class: "intro" }, txt(S.intro)), links()),
      section("projects", S.projects.map(p => {
        const label = p.demo ? u.try : u.view;
        return h("article", { class: "project" }, art(p),
          h("div", {}, h("h3", {}, txt(p.title)), h("p", {}, txt(p.summary)),
            tags(p.tech),
            h("div", { class: "links" },
              h("a", { class: p.demo ? "btn main" : "btn", href: "project.html?id=" + encodeURIComponent(p.id), "aria-label": label + ": " + plain(p.title) }, label, icon("link")),
              github(p))));
      })),
      section("about", S.about[lang].filter(x => LOCAL || !x.startsWith("[")).map(x => h("p", {}, txt(x)))),
      section("skills", h("dl", {}, S.skills.flatMap(s => [h("dt", {}, tr(s.label)), h("dd", {}, txt(s.items))]))),
      section("exp", h("dl", {}, S.experience.flatMap(s => [h("dt", {}, h("bdi", {}, txt(s.when))), h("dd", {}, txt(s.what), s.note ? h("p", { class: "note" }, txt(s.note)) : null)]))),
      section("contact", links()));
  }

  // מתאים את גובה המסגרת לתוכן הדמו, כדי שלא תהיה גלילה כפולה
  function fit() {
    try {
      const body = this.contentDocument.body;
      const set = () => { this.style.height = Math.max(544, body.scrollHeight + 2) + "px"; };
      this.contentDocument.documentElement.style.overflowY = "hidden"; // הגובה מותאם, אין צורך בפס גלילה
      set();
      new ResizeObserver(set).observe(body);
    } catch {}
  }

  function project(p) {
    const u = UI[lang], back = h("a", { class: "back", href: "index.html#projects" }, u.back);
    if (!p) return h("main", { class: "wrap detail" }, back, h("h1", {}, u.missing));
    return h("main", { class: "wrap detail" }, back,
      h("h1", {}, txt(p.title)), h("p", { class: "lead" }, txt(p.summary)),
      h("div", { class: "demohead" }, h("h2", {}, u.demo), p.demo ? h("a", { href: p.demo, target: "_blank", rel: "noopener" }, u.full) : null),
      p.demo ? h("iframe", { src: p.demo, onload: fit, title: u.demo + ": " + plain(p.title) })
        : h("div", { class: "soon" }, pattern(p.id), h("p", {}, u.soon)),
      p.shots ? h("div", { class: p.wide ? "shots wide" : "shots" }, p.shots.map(s => h("figure", {},
        h("a", { href: s.src, target: "_blank", rel: "noopener" }, h("img", { src: s.src, alt: tr(s.text), loading: "lazy", width: s.w || 1080, height: s.h || 2340 })),
        h("figcaption", {}, tr(s.text))))) : null,
      h("div", { class: "detailtext" }, p.details[lang].map(x => h("p", {}, txt(x))),
        tags(p.tech), h("div", { class: "links" }, github(p))));
  }

  function render() {
    root.lang = lang;
    root.dir = lang === "he" ? "rtl" : "ltr";
    root.dataset.theme = theme;
    const isProject = document.body.dataset.page === "project", p = isProject ? current() : null;
    document.getElementById("app").replaceChildren(header(!isProject), isProject ? project(p) : home());
    document.title = (p ? plain(p.title) + " | " : "") + tr(S.name);
  }
  render();
  // לוחות הצבעים ועריכת הטקסט זמינים רק בתצוגה המקומית
  if (LOCAL) {
    window.SITE_UI = UI;
    window.siteRender = render;
    document.body.append(h("script", { src: "js/palette.js" }), h("script", { src: "js/edit.js" }));
  }
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
})();
