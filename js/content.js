// כל התוכן של האתר נמצא כאן. עורכים רק את הקובץ הזה.
// טקסט שמתחיל ב-"[" הוא זמני ומסומן באתר במסגרת מקווקוות.
// קישור ריק ("") מוצג ככפתור לא פעיל עד שממלאים אותו.
window.SITE = {
  name: { he: "אליסיה רבינוביץ'", en: "Alisiya Rabinovich" },
  headline: {
    he: "ניתוח מערכות, אוטומציה ו-AI",
    en: "Systems analysis, automation and AI"
  },
  intro: {
    he: "בוגרת תואר ראשון במערכות מידע ניהוליות, בהתמחות סייבר. אני מנתחת תהליכים, מאפיינת פתרונות ובונה אוטומציות, בקוד ובכלי No-Code.",
    en: "B.A. graduate in Management Information Systems, specializing in cybersecurity. I analyze processes, define solutions and build automations, in code and with no-code tools."
  },
  links: {
    github: "https://github.com/AlisiyaR",
    linkedin: "https://www.linkedin.com/in/alisiya-rabinovich-8b6187155",
    cv: { he: "assets/Alisiya_Rabinovich_CV.pdf", en: "assets/Alisiya_Rabinovich_CV.pdf" },
    email: "alisiya1r.ar@gmail.com"
  },

  // code: קישור אחד, או רשימה של { label, url }.
  // demo: כתובת העמוד שנפתח בתוך עמוד הפרויקט. ריק = "הדמו בהכנה".
  // shots: צילומי מסך לאורך (לא חובה); עם wide: true, צילומים לרוחב. מוצגים בעמוד הפרויקט.
  projects: [
    {
      id: "heido-code",
      title: { he: "Heido: מיון פניות תמיכה עם AI", en: "Heido: AI support inquiry triage" },
      summary: {
        he: "ממייל של לקוח ועד משימה אצל העובד המתאים. שתי גרסאות: אב-טיפוס ללא קוד ב-Make.com, ובנייה מחדש בקוד ב-Python.",
        en: "From a customer email to a task for the right employee. Two versions: a no-code prototype in Make.com, and a rebuild in Python code."
      },
      details: {
        he: [
          "Heido היא חברת שירותי IT בדיונית. המערכת קוראת כל מייל, קובעת עם Gemini קטגוריה ועדיפות, פותחת משימה ב-monday.com עם הקבצים המצורפים ושולחת ללקוח אישור. ה-AI רק מסווג; כלל קבוע בוחר את העובד, ורק הנושא והתוכן נשלחים ל-AI.",
          "התחלתי באב-טיפוס ללא קוד ב-Make ובתוכנית בדיקות: 15 מיילים לשיפור הפרומפט ו-15 מיילים חדשים לבדיקה, כולל ניסוח דחוף מטעה וניסיונות לתת הוראות ל-AI. גרסת ביניים ששברה שלושה מקרים נפסלה.",
          "אחר כך בניתי את התהליך מחדש ב-Python, עם ניסיון חוזר בתקלות זמניות, הגבלת קצב, אימות תשובות, יומן ובדיקת דיוק אוטומטית. על 30 המיילים שכתבתי הגרסה הזו הגיעה ל-100% בקטגוריה ובעובד ול-97% בעדיפות."
        ],
        en: [
          "Heido is a fictional IT services company. The system reads each email, uses Gemini to set a category and priority, opens a monday.com task with the attachments and sends the customer a confirmation. The AI only classifies; a fixed rule picks the employee, and only the subject and body go to the AI.",
          "I started with a no-code prototype in Make and a test plan: 15 emails to improve the prompt and 15 new ones to check it, including misleading urgent wording and attempts to give the AI orders. An intermediate version that broke three cases was rejected.",
          "I then rebuilt the process in Python, with retries for temporary errors, rate limiting, answer validation, logging and an automated accuracy test. On the 30 emails I wrote, this version reached 100% for category and assignee and 97% for priority."
        ]
      },
      tech: ["Python", "Make.com", "Google Gemini", "Gmail API", "monday.com", "Pydantic"],
      demo: "demos/heido/index.html",
      code: [
        { label: { he: "גרסת קוד: Python", en: "Code version: Python" }, url: "https://github.com/AlisiyaR/heido-ai-triage-code" },
        { label: { he: "גרסה ללא קוד: Make.com", en: "No-code version: Make.com" }, url: "https://github.com/AlisiyaR/heido-ai-triage-no-code" }
      ]
    },
    {
      id: "smartcare",
      title: { he: "SmartCare: ניתוח מערכת ותכנון Agile", en: "SmartCare: systems analysis and Agile planning" },
      summary: {
        he: "אפיון פלטפורמה לקופת חולים, מהבעיה העסקית ועד תוכנית Scrum עם 123 פריטים ב-Jira.",
        en: "Analysis of a health-plan platform, from the business problem to a Scrum plan with 123 Jira items."
      },
      details: {
        he: [
          "באפליקציות של קופות חולים קשה לעקוב אחרי טיפול כתהליך אחד. SmartCare מציעה לרכז את המידע ולהציג למטופל את הצעד הבא.",
          "כתבתי מסמך ייזום, ניתוח היתכנות ו-12 סיפורי משתמש עם קריטריוני קבלה, פירקתי אותם למשימות, קבעתי עדיפויות ותכננתי שלושה ספרינטים.",
          "זהו פרויקט אקדמי של אפיון ותכנון. המערכת לא פותחה, וביצוע הספרינטים הוא סימולציה."
        ],
        en: [
          "Health-plan apps make it hard to follow care as one process. SmartCare proposes bringing the information together and showing each member the next step.",
          "I wrote the project charter, a feasibility analysis and 12 user stories with acceptance criteria, broke them into tasks, set priorities and planned three sprints.",
          "This is an academic analysis and planning project. The system was not developed, and the sprint execution is a simulation."
        ]
      },
      tech: ["Jira", "Scrum", "User Stories", "Feasibility Analysis"],
      demo: "demos/smartcare/index.html", code: "https://github.com/AlisiyaR/smartcare-systems-analysis",
      wide: true, shots: [
        { src: "assets/smartcare/01-project-overview-dashboard.png", w: 1576, h: 1382, text: { he: "סקירת הפרויקט", en: "Project overview" } },
        { src: "assets/smartcare/02-scrum-board.png", w: 1446, h: 1488, text: { he: "לוח Scrum", en: "Scrum board" } },
        { src: "assets/smartcare/03-sprint-2-active.png", w: 2306, h: 1206, text: { he: "ספרינט 2, פעיל", en: "Sprint 2, active" } },
        { src: "assets/smartcare/04-sprint-3-planned.png", w: 2294, h: 1200, text: { he: "ספרינט 3, מתוכנן", en: "Sprint 3, planned" } },
        { src: "assets/smartcare/05-project-timeline.png", w: 2332, h: 514, text: { he: "ציר הזמן", en: "Project timeline" } },
        { src: "assets/smartcare/06-user-story-smc-43.png", w: 2340, h: 1030, text: { he: "סיפור משתמש SMC-43", en: "User story SMC-43" } },
        { src: "assets/smartcare/07-epics-overview.png", w: 2340, h: 418, text: { he: "ה-Epics", en: "Epics overview" } }
      ]
    },
    {
      id: "cyber-lab",
      title: { he: "מעבדת סייבר: אוטומציה ב-Bash", en: "Cybersecurity lab: Bash automation" },
      summary: {
        he: "שלושה כלים שכתבתי בהתמחות סייבר: הדמיית תקיפות, מיפוי פגיעויות ובדיקת חשיפת SSH.",
        en: "Three tools from my cybersecurity specialization: attack simulation, vulnerability mapping and SSH exposure checks."
      },
      details: {
        he: [
          "CHECKER מריץ הדמיות תקיפה ומתעד כל פעולה, VULNER סורק רשת ומפיק דוח שאפשר לחפש בו, ו-GhostLogin בודק חשיפת SSH וסיסמאות חלשות.",
          "הסקריפטים בנויים מפונקציות נפרדות, בודקים את קלט המשתמש, ומתעדים את התוצאות ביומנים או בדוחות.",
          "הכלים נבנו והורצו למטרות לימוד, במעבדה מורשית וברשת פרטית בלבד."
        ],
        en: [
          "CHECKER runs attack simulations and logs every action, VULNER scans a network and produces a searchable report, and GhostLogin checks SSH exposure and weak passwords.",
          "The scripts are split into separate functions, validate user input and record results in logs or reports.",
          "The tools were built and run for learning, only in an authorized lab on a private network."
        ]
      },
      tech: ["Bash", "Linux", "Nmap", "Hydra", "Searchsploit"],
      demo: "demos/cyber/index.html", code: "https://github.com/AlisiyaR/cybersecurity-lab-projects"
    },
    {
      id: "weather",
      title: { he: "Worldwide Weather: מזג אוויר לאנדרואיד", en: "Worldwide Weather: Android app" },
      summary: {
        he: "אפליקציה ב-Java: מחפשים עיר בעולם ורואים את הטמפרטורה ואת פרטי מזג האוויר הנוכחיים.",
        en: "A Java app: search for a city anywhere in the world and see its current temperature and weather details."
      },
      details: {
        he: [
          "פרויקט הגמר בקורס פיתוח לאנדרואיד. מסך אחד מציג את הטמפרטורה בעיר, והשני מוסיף מינימום ומקסימום, לחות, לחץ אוויר, עננות ותיאור.",
          "הנתונים מגיעים מ-OpenWeatherMap. הקריאות לרשת רצות ברקע כדי שהמסך לא ייתקע, עיר ריקה או לא מוכרת מציגה הודעת שגיאה, ומפתח ה-API לא נשמר במאגר.",
          "במאגר יש גם תיעוד ארכיטקטורה, תרשימי UML ותוכנית בדיקות ידניות. השיפורים הבאים הם טיפול בשמות ערים עם רווחים, איחוד קוד הרשת ובדיקות אוטומטיות."
        ],
        en: [
          "The final project of my Android development course. One screen shows a city's temperature; the second adds min/max, humidity, pressure, cloudiness and a description.",
          "Data comes from OpenWeatherMap. Network calls run in the background so the screen does not freeze, an empty or unknown city shows an error message, and the API key is kept out of the repository.",
          "The repository also has architecture documentation, UML diagrams and a manual test plan. Next improvements: city names with spaces, shared network code and automated tests."
        ]
      },
      tech: ["Java", "Android Studio", "REST API", "JSON", "XML", "UML"],
      demo: "demos/weather/index.html", code: "https://github.com/AlisiyaR/worldwide-weather-android",
      shots: [
        { src: "assets/weather/01-home-screen.jpg", text: { he: "חיפוש עיר", en: "City search" } },
        { src: "assets/weather/02-current-temperature.jpg", text: { he: "הטמפרטורה הנוכחית", en: "Current temperature" } },
        { src: "assets/weather/03-detailed-weather.jpg", text: { he: "פרטי מזג האוויר", en: "Detailed weather" } }
      ]
    }
  ],

  about: {
    he: [
      "סיימתי תואר ראשון במערכות מידע ניהוליות, עם בסיס בפיתוח תוכנה ובתכנות מונחה עצמים. לצד הלימודים עבדתי בתמיכה טכנית ותפעולית: אבחון תקלות, קביעת עדיפויות ומעקב עד לפתרון.",
      "[משפט אישי: מה משך אותך לתחום, ומה את מחפשת בתפקיד הראשון.]"
    ],
    en: [
      "I hold a B.A. in Management Information Systems, with a foundation in software development and object-oriented programming. Alongside my studies I worked in technical and operational support: diagnosing problems, setting priorities and tracking issues through resolution.",
      "[One personal sentence: what drew you to the field, and what you want in a first role.]"
    ]
  },
  skills: [
    { label: { he: "תכנות (יסודות)", en: "Programming (fundamentals)" }, items: "Python, Java, Bash, SQL, C" },
    { label: { he: "פיתוח תוכנה", en: "Software development" }, items: { he: "תכנות מונחה עצמים, מבני נתונים ואלגוריתמים, REST API, Git/GitHub, OAuth 2.0", en: "OOP, data structures and algorithms, REST API, Git/GitHub, OAuth 2.0" } },
    { label: { he: "AI ואוטומציה", en: "AI and automation" }, items: { he: "מודלי שפה, כתיבת פרומפטים, Make, יסודות למידת מכונה", en: "LLMs, prompt engineering, Make, machine learning fundamentals" } },
    { label: { he: "מערכות ורשתות", en: "Systems and networking" }, items: { he: "Linux (Kali), Windows, יסודות רשתות, יסודות AWS", en: "Linux (Kali), Windows, networking fundamentals, AWS fundamentals" } },
    { label: { he: "ניתוח ותכנון", en: "Analysis and planning" }, items: { he: "ניתוח מערכות, סיפורי משתמש, UML, SDLC, Jira, Agile/Scrum", en: "Systems analysis, user stories, UML, SDLC, Jira, Agile/Scrum" } },
    { label: { he: "שפות", en: "Languages" }, items: { he: "עברית: שפת אם, אנגלית: רמה גבוהה, רוסית: רמה גבוהה", en: "Hebrew: native, English: advanced, Russian: advanced" } }
  ],
  // note: שורת הסבר, לא חובה
  experience: [
    { when: "2023–2026", what: { he: "נציגת Back Office, תמיכה טכנית ותפעולית, Bynet Semech", en: "Back Office Representative, technical and operational support, Bynet Semech" },
      note: { he: "תמיכה בלקוחות ובצוותים פנימיים, אבחון תקלות ומעקב עד לפתרון. זיהיתי ושיפרתי תהליך פנימי לטיפול בפניות לקוחות.", en: "Supported customers and internal teams, diagnosed problems and tracked them through resolution. Identified and improved an internal workflow for handling customer inquiries." } },
    { when: "2021–2023", what: { he: "מנהלת משמרת, Rebar", en: "Shift Manager, Rebar" },
      note: { he: "ניהול המשמרת והצוות, תיאום משימות וקבלת החלטות בזמן אמת.", en: "Managed the shift and team, coordinated tasks and made real-time decisions." } },
    { when: "2026", what: { he: "קורס סייבר במסגרת ההתמחות בתואר, בשיתוף ג'ון ברייס, ציון 98", en: "Cybersecurity course within the degree specialization, in collaboration with John Bryce, grade 98" } },
    { when: "2023–2026", what: { he: "תואר ראשון במערכות מידע ניהוליות, התמחות סייבר, המרכז האקדמי פרס, ממוצע 89", en: "B.A. in Management Information Systems, cybersecurity specialization, Peres Academic Center, GPA 89" } }
  ]
};
