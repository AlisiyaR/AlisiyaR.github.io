// לוח בחירת צבעים. נטען רק בתצוגה המקומית (localhost), לא באתר שמפורסם.
(() => {
  const FIELDS = {
    bg: "רקע האתר", ink: "טקסט ראשי", soft: "טקסט משני", line: "קווים ומסגרות", panel: "רקע האיורים והתגיות",
    acc: "כפתור ראשי והדגשות", on: "טקסט על הכפתור הראשי", dot: "נקודות: צבע ראשון", dot2: "הדגשה באיורים"
  };
  // זוגות שחייבים להיות קריאים
  const PAIRS = [["ink", "bg"], ["soft", "bg"], ["on", "acc"], ["acc", "bg"]];
  const KEY = "palette", root = document.documentElement, style = document.createElement("style");
  let saved = { light: {}, dark: {} };
  try {
    const raw = JSON.parse(localStorage.getItem(KEY)) || {};
    for (const t of ["light", "dark"]) for (const k in FIELDS)
      if (/^#[0-9a-f]{6}$/i.test(raw[t]?.[k])) saved[t][k] = raw[t][k];
  } catch {}

  const full = c => c.length === 4 ? "#" + [...c.slice(1)].map(x => x + x).join("") : c;
  // ערכי המקור מתוך style.css, לפני השינויים
  const base = {}, shown = root.dataset.theme;
  for (const t of ["light", "dark"]) {
    root.dataset.theme = t;
    const cs = getComputedStyle(root);
    base[t] = Object.fromEntries(Object.keys(FIELDS).map(k => [k, full(cs.getPropertyValue("--" + k).trim())]));
  }
  root.dataset.theme = shown;
  document.head.append(style);

  const theme = () => root.dataset.theme === "dark" ? "dark" : "light";
  const value = (t, k) => saved[t][k] || base[t][k];
  const rule = t => (t === "dark" ? "[data-theme=dark]" : ":root") + "{" +
    Object.keys(FIELDS).map(k => `--${k}:${value(t, k)}`).join(";") + `;color-scheme:${t}}`;
  const css = () => rule("light") + "\n" + rule("dark");

  const lum = c => [1, 3, 5].reduce((s, at, i) => {
    const v = parseInt(c.slice(at, at + 2), 16) / 255;
    return s + [.2126, .7152, .0722][i] * (v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  }, 0);
  const ratio = (a, b) => {
    const [lo, hi] = [lum(a), lum(b)].sort((x, y) => x - y);
    return (hi + .05) / (lo + .05);
  };

  const host = document.createElement("div");
  host.dir = "rtl";
  host.lang = "he";
  document.body.append(host);
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `<style>
    :host{position:fixed;left:1rem;bottom:1rem;z-index:9;font:15px/1.4 "IBM Plex Sans Hebrew",system-ui,sans-serif;color:#222}
    button{font:inherit;padding:.45rem .8rem;border:1px solid #bbb;border-radius:4px;background:#fff;color:#222;cursor:pointer}
    button:hover{background:#eee}
    :focus-visible{outline:2px solid #222;outline-offset:2px}
    #panel{width:min(19rem,calc(100vw - 2rem));max-height:calc(100vh - 6rem);overflow:auto;background:#fff;border:1px solid #bbb;border-radius:6px;padding:1rem;margin-bottom:.5rem;box-shadow:0 4px 18px #0003;box-sizing:border-box}
    #panel[hidden]{display:none}
    p{margin:0 0 .6rem}
    label{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.2rem 0}
    input{width:3rem;height:2rem;padding:1px;border:1px solid #bbb;border-radius:4px;background:#fff;cursor:pointer}
    .row{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.8rem}
    #warn{color:#9a2a12;margin-top:.6rem;white-space:pre-line}
    #warn:empty{display:none}
    textarea{width:100%;box-sizing:border-box;height:5rem;margin-top:.6rem;direction:ltr;font:12px monospace}
  </style>
  <div id="panel" hidden>
    <p id="mode"></p><div id="fields"></div><p id="warn" role="status"></p>
    <div class="row"><button id="copy">העתקת הצבעים</button><button id="reset">איפוס המצב הזה</button></div>
    <textarea id="out" readonly hidden aria-label="קוד הצבעים"></textarea>
  </div>
  <button id="open" aria-expanded="false" aria-controls="panel">בחירת צבעים</button>`;
  const $ = id => shadow.getElementById(id), inputs = {};
  for (const k in FIELDS) {
    const label = document.createElement("label"), input = document.createElement("input");
    input.type = "color";
    input.oninput = () => { saved[theme()][k] = input.value; apply(); };
    label.append(FIELDS[k], input);
    inputs[k] = input;
    $("fields").append(label);
  }

  function apply() {
    const t = theme();
    style.textContent = css();
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch {}
    $("mode").textContent = t === "dark" ? "עריכת המצב הכהה" : "עריכת המצב הבהיר";
    for (const k in inputs) inputs[k].value = value(t, k);
    $("warn").textContent = PAIRS.filter(([a, b]) => ratio(value(t, a), value(t, b)) < 4.5)
      .map(([a, b]) => `קשה לקריאה: "${FIELDS[a]}" מול "${FIELDS[b]}"`).join("\n");
    $("out").hidden = true;
    $("copy").textContent = "העתקת הצבעים";
  }
  $("open").onclick = () => {
    const hide = !$("panel").hidden;
    $("panel").hidden = hide;
    $("open").setAttribute("aria-expanded", String(!hide));
    $("open").textContent = hide ? "בחירת צבעים" : "סגירה";
  };
  $("reset").onclick = () => { saved[theme()] = {}; apply(); };
  $("copy").onclick = async () => {
    try {
      await navigator.clipboard.writeText(css());
      $("copy").textContent = "הועתק";
    } catch {
      $("out").value = css();
      $("out").hidden = false;
      $("out").select();
    }
  };
  new MutationObserver(apply).observe(root, { attributeFilter: ["data-theme"] });
  apply();
})();
