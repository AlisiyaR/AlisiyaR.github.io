// כל התוכן של האתר נמצא כאן. עורכים רק את הקובץ הזה.
// טקסט שמתחיל ב-"[" הוא זמני ומסומן באתר במסגרת מקווקוות.
// קישור ריק ("") מוצג ככפתור לא פעיל עד שממלאים אותו.
window.SITE = {
  name: { he: "אליסיה רבינוביץ", en: "Alisiya Rabinovich" },
  headline: {
    he: "פיתוח, ניתוח מערכות ו-AI",
    en: "Development, systems analysis and AI"
  },
  intro: {
    he: "אני בונה אוטומציות ואינטגרציות ב-Python, ב-Bash ובכלי No-Code, מהבנת התהליך ועד בדיקת התוצאה. תואר ראשון בניהול מערכות מידע (ממוצע 89), בהתמחות סייבר.",
    en: "I build automations and integrations in Python, Bash and no-code tools, from understanding the process to testing the result. B.A. in Management Information Systems (GPA 89), with a cybersecurity specialization."
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
      title: { he: "Heido: מיון מיילים של תמיכה עם AI", en: "Heido: AI support email triage" },
      summary: {
        he: "מערכת שקוראת מיילים של לקוחות, מסווגת אותם עם AI ופותחת משימה לעובד המתאים. התחילה כאב-טיפוס ללא קוד ב-Make.com, ונבנתה מחדש ב-Python.",
        en: "Reads customer emails, classifies them with AI and opens a task for the right employee. Started as a no-code prototype in Make.com, then rebuilt in Python."
      },
      details: {
        he: [
          "בצוותי תמיכה רבים ממיינים כל מייל ידנית, וזה איטי ולא אחיד. עבור Heido, חברת שירותי IT בדיונית, המערכת קובעת לכל מייל עם Google Gemini כותרת, תקציר, קטגוריה ועדיפות, פותחת משימה ב-monday.com עם הקבצים המצורפים ושולחת ללקוח אישור עם מספר פנייה. ה-AI רק מסווג: כלל קבוע בוחר את העובד, ורק הנושא והתוכן נשלחים ל-AI.",
          "התחלתי באב-טיפוס ללא קוד ב-Make.com ובתוכנית בדיקות: 15 מיילים לשיפור הפרומפט ו-15 מיילים חדשים לבדיקה, כולל מיילים בעברית, ניסוח דחוף מטעה וניסיונות לתת ל-AI הוראות. פסלתי גרסת ביניים ששברה שלושה מקרים.",
          "אחר כך בניתי את המערכת מחדש ב-Python עם Gmail API (OAuth 2.0), והוספתי ניסיון חוזר בתקלות זמניות, הגבלת קצב, אימות של תשובות ה-AI, יומן ובדיקת דיוק אוטומטית. על 30 מיילי בדיקה שכתבתי בעצמי היא הגיעה ל-100% בקטגוריה ובעובד ול-97% בעדיפות.",
          "את גרסת ה-Python בניתי עם Claude Code, לפי כללי עבודה שהגדרתי: אישור התוכנית לפני שנכתב קוד, שינויים קטנים ובדיקה של כל שינוי. במאגר מתועדות 16 החלטות תכנון."
        ],
        en: [
          "Many support teams sort every email by hand, which is slow and inconsistent. For Heido, a fictional IT services company, the system uses Google Gemini to give each email a title, summary, category and priority, opens a monday.com task with the attachments, and sends the customer a confirmation with a ticket number. The AI only classifies: a fixed rule picks the employee, and only the subject and body are sent to the AI.",
          "I started with a no-code prototype in Make.com and a test plan: 15 emails to improve the prompt and 15 new ones to check it, including emails in Hebrew, misleading urgent wording and attempts to give the AI instructions. I rejected an intermediate version that broke three cases.",
          "I then rebuilt it in Python with the Gmail API (OAuth 2.0), adding retries for temporary errors, rate limiting, validation of the AI's answers, logging and an automated accuracy test. On 30 test emails I wrote myself, it reached 100% for category and assignee and 97% for priority.",
          "I built the Python version with Claude Code, under working rules I defined: approve the plan before any code is written, keep changes small and review every change. The repository documents 16 design decisions."
        ]
      },
      tech: ["Python", "Make.com", "Google Gemini", "Gmail API", "OAuth 2.0", "monday.com", "Pydantic", "Claude Code"],
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
        he: "ניתוח ותכנון של פלטפורמה מוצעת לקופת חולים, מהבעיה העסקית ועד תוכנית Scrum עם 123 פריטים ב-Jira.",
        en: "Systems analysis and planning for a proposed health-plan platform, from the business problem to a Scrum plan with 123 Jira items."
      },
      details: {
        he: [
          "אפליקציות של קופות חולים תומכות בפעולות בודדות, כמו קביעת תור או צפייה בתוצאות בדיקה, אבל לא בטיפול כתהליך אחד. SmartCare היא פלטפורמה מוצעת שמרכזת את המידע ומציגה לכל מטופל את הצעד הבא. הרופאים רואים את אותה תמונה.",
          "הגדרתי את הבעיה, את המצב הקיים והרצוי ואת בעלי העניין, וכתבתי מסמך ייזום, ניתוח היתכנות ו-12 סיפורי משתמש עם קריטריוני קבלה. פירקתי את הסיפורים ל-24 משימות ו-72 תתי-משימות, קבעתי עדיפויות לפי ערך עסקי ותלויות, ותכננתי שלושה ספרינטים ב-Jira.",
          "זהו פרויקט אקדמי שעשיתי באופן עצמאי בקורס ניהול פרויקטי תוכנה. המערכת נותחה ותוכננה, אך לא פותחה, והתקדמות הספרינטים והבאגים הם סימולציה."
        ],
        en: [
          "Health-plan apps support single actions, such as booking an appointment or viewing test results, but not a member's care as one process. SmartCare is a proposed platform that brings the information together and shows each member the next step. Physicians see the same view.",
          "I defined the problem, the current and target state and the stakeholders, and wrote a project charter, a feasibility analysis and 12 user stories with acceptance criteria. I broke the stories into 24 tasks and 72 sub-tasks, set priorities by business value and dependencies, and planned three sprints in Jira.",
          "This is an academic project I did independently in a Software Project Management course. The system was analyzed and planned, not developed, and the sprint progress and bugs are simulated."
        ]
      },
      tech: ["Systems Analysis", "Jira", "Scrum", "User Stories", "Feasibility Analysis"],
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
        he: "שלושה כלים ב-Bash, כ-2,200 שורות בסך הכול, שמבצעים במעבדה הדמיית תקיפות, מיפוי פגיעויות ובדיקת חשיפת SSH באופן אוטומטי.",
        en: "Three Bash tools, about 2,200 lines in total, that automate attack simulation, vulnerability mapping and SSH exposure checks in a lab."
      },
      details: {
        he: [
          "CHECKER מאתר מחשבים ברשת, מריץ אחת מחמש פעולות תקיפה מבוקרות ומתעד כל פעולה ביומן. VULNER סורק רשת, בודק סיסמאות חלשות, ממפה פגיעויות אפשריות ומפיק דוח שאפשר לחפש בו. GhostLogin מאתר מחשבים עם SSH חשוף, בודק סיסמאות נפוצות ואוסף מידע בסיסי על המערכת אחרי כניסה מוצלחת.",
          "כל כלי בנוי מפונקציות נפרדות ומחבר כמה כלי שורת פקודה לתהליך אחד. הסקריפטים בודקים את קלט המשתמש, בודקים אם חסרים כלים ומתעדים את התוצאות ביומנים או בדוחות.",
          "בניתי את הכלים למטרות לימוד בהתמחות הסייבר, והרצתי אותם רק במעבדה מורשית וברשת פרטית."
        ],
        en: [
          "CHECKER finds hosts on the network, runs one of five controlled attack operations and logs every action. VULNER scans a network, tests for weak passwords, maps potential vulnerabilities and produces a searchable report. GhostLogin finds hosts with exposed SSH, tests common passwords and gathers basic system information after a successful login.",
          "Each tool is split into separate functions and combines several command-line tools into one workflow. The scripts validate user input, check for missing tools and record results in logs or reports.",
          "I built the tools for learning during my cybersecurity specialization and ran them only in an authorized lab on a private network."
        ]
      },
      tech: ["Bash", "Linux", "Nmap", "Hydra", "Searchsploit"],
      demo: "demos/cyber/index.html", code: "https://github.com/AlisiyaR/cybersecurity-lab-projects"
    },
    {
      id: "weather",
      title: { he: "Worldwide Weather: מזג אוויר לאנדרואיד", en: "Worldwide Weather: Android app" },
      summary: {
        he: "אפליקציית אנדרואיד ב-Java שמציגה את הטמפרטורה ואת פרטי מזג האוויר הנוכחיים בעיר בכל מקום בעולם.",
        en: "An Android app in Java that shows the current temperature and weather details for a city anywhere in the world."
      },
      details: {
        he: [
          "פרויקט הגמר בקורס פיתוח לאנדרואיד. המסך הראשון מציג את הטמפרטורה בעיר; השני מוסיף מינימום ומקסימום, לחות, לחץ אוויר, עננות ותיאור.",
          "האפליקציה מקבלת את הנתונים ב-JSON מה-REST API של OpenWeatherMap. הקריאות לרשת רצות ברקע כדי שהמסך לא ייתקע, עיר ריקה או לא מוכרת מציגה הודעת שגיאה, ומפתח ה-API לא נשמר במאגר.",
          "במאגר יש תיעוד ארכיטקטורה, שישה תרשימי UML ותוכנית בדיקות ידניות. מה הייתי משפרת בהמשך: שמות ערים עם רווחים, קוד רשת משותף ובדיקות אוטומטיות."
        ],
        en: [
          "The final project in my Android development course. The first screen shows a city's temperature; the second adds minimum and maximum, humidity, pressure, cloudiness and a description.",
          "The app gets its data in JSON from the OpenWeatherMap REST API. Network calls run in the background so the screen doesn't freeze, an empty or unknown city shows an error message, and the API key is kept out of the repository.",
          "The repository includes architecture documentation, six UML diagrams and a manual test plan. What I would improve next: city names with spaces, shared network code and automated tests."
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
      "אני אוהבת להבין איך מערכות ותהליכים עובדים, למצוא איפה הם נתקעים ולבנות פתרונות טובים יותר. ב-Bynet Semech נכנסתי לתפקיד שלא היה מאויש ובניתי את תהליכי העבודה והנהלים שלו מאפס, תוך כדי התואר.",
      "התואר והתמחות הסייבר נתנו לי בסיס בתכנות מונחה עצמים, SQL, Linux ורשתות. אני לומדת מהר ובאופן עצמאי, ופתוחה לתפקידי ג'וניור בפיתוח, באוטומציה, ב-AI ובניתוח מערכות."
    ],
    en: [
      "I enjoy understanding how systems and processes work, finding where they break and building better solutions. At Bynet Semech, I stepped into an unstaffed role and built its workflows and procedures from scratch while studying for my degree.",
      "My degree and cybersecurity specialization gave me a foundation in object-oriented programming, SQL, Linux and networking. I learn fast and independently, and I'm open to junior roles in development, automation, AI and systems analysis."
    ]
  },
  how: [
    { label: { he: "מתחילה מהבעיה", en: "I start with the problem" },
      text: { he: "ב-Bynet Semech חיפשתי דפוסים בפניות לפני שתכננתי איך לטפל בהן. ב-SmartCare הגדרתי את הבעיה ואת מצב היעד לפני הדרישות.", en: "At Bynet Semech, I looked for patterns in the inquiries before designing how to handle them. In SmartCare, I defined the problem and the target state before the requirements." } },
    { label: { he: "בודקת לפני שסומכת", en: "I test before I trust" },
      text: { he: "ל-Heido כתבתי 30 מיילי בדיקה, השארתי חצי מהם מחוץ לשיפור הפרומפט, ופסלתי גרסת פרומפט ששברה מקרים שכבר עבדו.", en: "For Heido, I wrote 30 test emails, kept half of them out of prompt tuning, and rejected a prompt version that broke cases that already worked." } },
    { label: { he: "משתמשת ב-AI איפה שהוא מתאים", en: "I use AI where it fits" },
      text: { he: "ב-Heido ה-AI רק מסווג: כלל קבוע בוחר את העובד. כשאני בונה עם Claude Code, אני מאשרת את התוכנית לפני שנכתב קוד ובודקת כל שינוי.", en: "In Heido, the AI only classifies: a fixed rule picks the employee. When I build with Claude Code, I approve the plan before any code is written and review every change." } },
    { label: { he: "מתעדת, גם את המגבלות", en: "I document, including the limits" },
      text: { he: "בכל מאגר של פרויקט מוסבר מה נבנה ומה המגבלות. ב-Heido מתועדות גם 16 החלטות תכנון.", en: "Every project repository explains what was built and what its limitations are. Heido also documents 16 design decisions." } }
  ],
  skills: [
    { label: { he: "תכנות (יסודות)", en: "Programming (fundamentals)" }, items: "Python, Java, Bash, SQL, C" },
    { label: { he: "פיתוח תוכנה", en: "Software development" }, items: { he: "תכנות מונחה עצמים, מבני נתונים ואלגוריתמים, אינטגרציה עם REST API, OAuth 2.0, מסדי נתונים יחסיים, יסודות בדיקות תוכנה, Git/GitHub", en: "OOP, data structures and algorithms, REST API integration, OAuth 2.0, relational databases, software testing fundamentals, Git/GitHub" } },
    { label: { he: "AI ואוטומציה", en: "AI and automation" }, items: { he: "Generative AI, מודלי שפה (LLM), כתיבת פרומפטים, בדיקת תוצאות של AI, Make.com, Claude Code, יסודות למידת מכונה", en: "Generative AI, LLMs, prompt engineering, testing AI output, Make.com, Claude Code, machine learning fundamentals" } },
    { label: { he: "מערכות ורשתות", en: "Systems and networking" }, items: { he: "Linux (Kali), Windows, יסודות רשתות, יסודות AWS", en: "Linux (Kali), Windows, networking fundamentals, AWS fundamentals" } },
    { label: { he: "ניתוח ותכנון", en: "Analysis and planning" }, items: { he: "ניתוח מערכות, דרישות, סיפורי משתמש, UML, SDLC, Jira, Agile/Scrum", en: "Systems analysis, requirements, user stories, UML, SDLC, Jira, Agile/Scrum" } },
    { label: { he: "שפות", en: "Languages" }, items: { he: "עברית: שפת אם, אנגלית: רמה גבוהה, רוסית: רמה גבוהה", en: "Hebrew: native, English: advanced, Russian: advanced" } }
  ],
  // note: שורת הסבר, לא חובה
  education: [
    { when: "2023–2026", what: { he: "תואר ראשון בניהול מערכות מידע, התמחות סייבר, המרכז האקדמי פרס, ממוצע 89", en: "B.A. in Management Information Systems, cybersecurity specialization, Peres Academic Center, GPA 89" },
      note: { he: "קורסים רלוונטיים: ניתוח ועיצוב מערכות, מסדי נתונים ו-SQL, תכנות מונחה עצמים (Java), מבני נתונים ואלגוריתמים, בדיקות תוכנה, רשתות מחשבים, מערכות הפעלה, בינה מלאכותית ולמידת מכונה, ניהול פרויקטים.", en: "Relevant coursework: systems analysis and design, databases and SQL, OOP (Java), data structures and algorithms, software testing, computer networks, operating systems, AI and machine learning, project management." } },
    { when: "2026", what: { he: "קורס סייבר במסגרת ההתמחות בתואר, בשיתוף ג'ון ברייס, ציון 98", en: "Cybersecurity course within the degree specialization, in collaboration with John Bryce, grade 98" },
      note: { he: "סריקת רשתות, בדיקות חדירה, מיפוי פגיעויות והדמיית תקיפות. במהלך ההתמחות בניתי שלושה כלי אוטומציה ב-Bash.", en: "Network scanning, penetration testing, vulnerability mapping and attack simulation. I built three Bash automation tools during the specialization." } }
  ],
  experience: [
    { when: "2023–2026", what: { he: "נציגת Back Office, תמיכה טכנית ותפעולית, Bynet Semech (משרה חלקית)", en: "Back Office Representative, technical and operational support, Bynet Semech (part-time)" },
      note: { he: "נכנסתי לתפקיד שלא היה מאויש, עם עומס פניות ובלי נהלים, ובניתי מאפס את נהלי התפקיד ואת העברת הטיפול בין הצוותים. מצאתי דפוסים חוזרים ותכננתי תהליך טיפול לכל סוג פנייה, זירזתי את תור הפניות של הרוקחים באמצעות הסרת כפילויות והפניית בקשות, וקישרתי בין מטופלים לצוות הרפואי. נתתי גם תמיכה טכנית ותפעולית ללקוחות ולצוותים פנימיים, מאבחון ועד פתרון.", en: "Stepped into an unstaffed role with a heavy inquiry backlog and no procedures, and built the role's procedures and team handoffs from scratch. Found recurring patterns and designed a handling workflow for each inquiry type, sped up the pharmacists' inquiry queue by removing duplicates and redirecting requests, and served as the liaison between patients and medical staff. Also provided technical and operational support to customers and internal teams, from diagnosis to resolution." } },
    { when: "2021–2023", what: { he: "מנהלת משמרת, Rebar", en: "Shift Manager, Rebar" },
      note: { he: "ניהלתי את המשמרת והצוות: חלוקת משימות, קביעת עדיפויות, פתרון בעיות תפעוליות וקבלת החלטות בזמן אמת.", en: "Managed the shift and the team: assigned tasks, set priorities, solved operational problems and made decisions in real time." } }
  ]
};
