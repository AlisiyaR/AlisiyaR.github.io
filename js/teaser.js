// משחקון הפתיח: מנחשים עדיפות של מייל בדיקה, ורואים מה ה-AI ענה.
// הנתונים ב-js/content.js (teaser): מיילים ותשובות שמורות מפרויקט Heido. בלי רשת ובלי שמירה.
window.TEASER = ({ h, tr, icon, data, lang, href }) => {
  const T = {
    en: { of: (i, n) => `Email ${i} of ${n}`, pick: "Your priority", you: "You", ai: "AI", should: "Expected", right: "The AI got it right", wrong: "The AI got it wrong", to: "Assigned by a fixed rule to", next: "Next email", end: "See the score", score: (y, a, n) => `You ${y}/${n}, AI ${a}/${n}`, how: "See how I tested it", again: "Play again" },
    he: { of: (i, n) => `מייל ${i} מתוך ${n}`, pick: "העדיפות שלכם", you: "אתם", ai: "ה-AI", should: "התשובה הצפויה", right: "ה-AI צדק", wrong: "ה-AI טעה", to: "כלל קבוע העביר אל", next: "למייל הבא", end: "לתוצאה", score: (y, a, n) => `אתם ${y}/${n}, ה-AI ${a}/${n}`, how: "איך בדקתי את זה", again: "עוד פעם" }
  }[lang];
  const LEVELS = ["High", "Medium", "Low"], n = data.items.length;
  const step = h("div", { class: "tz-step" });
  let at = 0, you = 0, ai = 0, picks = [];
  const pill = (label, v, ok) => h("div", { class: "tz-pill" + (ok ? " ok" : " no") }, h("dt", {}, label), h("dd", {}, h("bdi", {}, v), h("span", { "aria-hidden": "true" }, ok ? " ✓" : " ✗")));
  // אחרי התשובה נשארת רק השורה המכריעה (mark)
  const card = (m, short) => h("div", { class: "tz-mail", dir: "ltr", lang: "en" }, h("p", { class: "tz-subj", tabindex: "-1" }, m.subject),
    m.body.split("\n\n").map((x, i) => short && i !== m.mark ? null : h("p", { class: short ? "tz-text key" : "tz-text" }, x)));

  function ask(focus) {
    const m = data.items[at];
    step.replaceChildren(
      h("p", { class: "tz-count" }, T.of(at + 1, n)), card(m),
      h("div", { class: "tz-pick", role: "group", "aria-label": T.pick }, LEVELS.map(p => h("button", { type: "button", class: "btn", lang: "en", onclick() { answer(p); } }, p))),
      h("p", { class: "tz-hint" }, tr(data.hint)));
    if (focus) step.querySelector(".tz-subj").focus({ preventScroll: true });
  }
  function answer(p) {
    const m = data.items[at], aiOk = m.ai === m.expected;
    if (p === m.expected) you++;
    if (aiOk) ai++;
    picks.push(p);
    step.replaceChildren(
      h("p", { class: "tz-count" }, T.of(at + 1, n)), card(m, true),
      h("div", { class: "tz-out", role: "status" },
        h("p", { class: "tz-verdict" }, aiOk ? T.right : T.wrong),
        h("dl", { class: "tz-row" }, pill(T.you, p, p === m.expected), pill(T.ai, m.ai, aiOk), aiOk ? null : h("div", { class: "tz-pill" }, h("dt", {}, T.should), h("dd", {}, h("bdi", {}, m.expected)))),
        h("p", {}, tr(m.note)),
        h("p", { class: "tz-hint" }, T.to + " ", h("bdi", {}, m.assignee))),
      h("button", { type: "button", class: "btn main", onclick() { at++; at < n ? ask(true) : done(); } }, at < n - 1 ? T.next : T.end, icon("arrow")));
    step.querySelector(".btn.main").focus({ preventScroll: true });
  }
  function done() {
    step.replaceChildren(
      h("p", { class: "tz-score", tabindex: "-1", role: "status" }, T.score(you, ai, n)),
      h("table", { class: "tz-sum" },
        h("thead", {}, h("tr", {}, ["", T.you, T.ai].map(x => h("th", { scope: "col" }, x)))),
        h("tbody", {}, data.items.map((m, i) => h("tr", {}, h("th", { scope: "row", lang: "en" }, h("bdi", {}, m.subject)), [picks[i], m.ai].map(v => h("td", { class: v === m.expected ? "ok" : "no" }, h("bdi", { lang: "en" }, v), h("span", { "aria-hidden": "true" }, v === m.expected ? " ✓" : " ✗"))))))),
      h("p", {}, tr(data.end)),
      h("div", { class: "tz-pick" },
        h("a", { class: "btn main", href }, T.how, icon("arrow")),
        h("button", { type: "button", class: "btn", onclick() { at = you = ai = 0; picks = []; ask(true); } }, T.again)));
    step.querySelector(".tz-score").focus({ preventScroll: true });
  }
  ask();
  return h("aside", { class: "tz", "aria-labelledby": "tz-title" },
    h("h2", { id: "tz-title" }, tr(data.title)), h("p", { class: "tz-lead" }, tr(data.lead)), step, h("p", { class: "tz-note" }, tr(data.note)));
};
