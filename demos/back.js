// בדמו שנפתח במסך מלא (לא בתוך האתר): שורת חזרה לעמוד הפרויקט.
if (self === top) {
  const me = document.currentScript, he = document.documentElement.lang === "he";
  const bar = Object.assign(document.createElement("nav"), { className: "demobar" });
  bar.append(Object.assign(document.createElement("a"), { href: "../../" + me.dataset.page, textContent: (he ? "→ " : "← ") + (he ? "אליסיה רבינוביץ, לעמוד הפרויקט" : "Alisiya Rabinovich, back to the project") }));
  document.body.prepend(bar);
}
