# Alisiya Rabinovich – Portfolio

My portfolio site, in Hebrew and English, with a demo of each project that runs in the browser.

**Live site: [alisiyar.github.io](https://alisiyar.github.io)**

## Demos

| Project | What you can do in the demo | Source |
|---|---|---|
| [Heido: AI support inquiry triage](https://alisiyar.github.io/project.html?id=heido-code) | Send a ready-made customer email and watch it become a task on the support team's board | [Python](https://github.com/AlisiyaR/heido-ai-triage-code) · [No-code (Make.com)](https://github.com/AlisiyaR/heido-ai-triage-no-code) |
| [SmartCare: systems analysis and Agile planning](https://alisiyar.github.io/project.html?id=smartcare) | Browse a view-only Scrum workspace with all 123 work items | [Repository](https://github.com/AlisiyaR/smartcare-systems-analysis) |
| [Cybersecurity lab: Bash automation](https://alisiyar.github.io/project.html?id=cyber-lab) | Run three lab tools in a simulated terminal | [Repository](https://github.com/AlisiyaR/cybersecurity-lab-projects) |
| [Worldwide Weather: Android app](https://alisiyar.github.io/project.html?id=weather) | Search for a city in a browser version of the app | [Repository](https://github.com/AlisiyaR/worldwide-weather-android) |

## How it is built

- Plain HTML, CSS and JavaScript, with no framework and no build step
- Hosted on GitHub Pages
- All site text is in one file, in both languages, with right-to-left and left-to-right layouts
- Light and dark mode, and layouts for desktop and mobile

## Design decisions

- **No API keys.** A static site cannot hide a secret, so no demo uses one.
- **Live weather without a key.** The weather demo uses Open-Meteo. The Android app itself uses OpenWeatherMap.
- **No real scans.** The terminal demo prints results for a fictional network, based on the scripts and their lab screenshots. No network is scanned.
- **Saved AI answers.** The Heido demo shows the answers Gemini returned during testing, including two wrong ones. Only the routing rule runs live.
- **A snapshot, not a connection.** The SmartCare demo is a copy of the project data and is not connected to Jira. The project is an academic simulation, and the system was not developed.

Every demo states on the page what is simulated.

## Project structure

```
├── index.html         # home page
├── project.html       # project page, chosen by ?id=
├── css/style.css      # design and color palette
├── js/
│   ├── content.js     # all site text, links and projects
│   ├── site.js        # renders the pages
│   ├── art.js         # line illustrations of the projects
│   ├── palette.js     # color editor (local preview only)
│   └── edit.js        # text editor (local preview only)
├── demos/             # one folder per demo
└── assets/            # CV and screenshots
```

## Run locally

Requires Python 3.

```bash
python -m http.server 8123
```

Then open http://localhost:8123.

## Credits

Built with the help of Claude, Anthropic's AI assistant. Weather data by [Open-Meteo](https://open-meteo.com/). Product names belong to their owners; the demos are simulations and are not affiliated with Atlassian, monday.com or Google.
