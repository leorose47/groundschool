# Orbit: an AI home screen for your phone

Orbit is a dashboard that sits on top of your phone. You talk to it by typing or by voice, and the AI bot you connect (Grok, ChatGPT, Claude, or any OpenAI-compatible service) does the work: it sets reminders, writes texts and emails, calls people, gives directions, takes notes, and opens apps.

```
orbit/
├── web/       ← the app (installable PWA, no build step)
└── android/   ← launcher shell that makes Orbit the phone's home screen
```

## Run it

```bash
cd orbit/web && python3 -m http.server 8080
# open http://localhost:8080 — on a phone, host it over HTTPS and "Add to Home Screen"
```

1. **Bots** tab → **+ Connect** → choose a provider and paste an API key (for Grok, get one at console.x.ai).
2. **Life → Contacts**: add people so "text Mom" works. Android Chrome can import them from the phone.
3. Ask from the Home bar or the Assistant tab.

## How it works

- **Bots are interchangeable.** Each one is a provider, a base URL, a model and a key. xAI, OpenAI and anything else OpenAI-compatible use `/chat/completions`. Anthropic uses `/messages`. You can connect several and switch between them in the chat.
- **Tools.** The bot can call `add_reminder`, `add_note`, `search_notes`, `list_reminders`, `find_contact`, `call`, `send_text`, `send_email`, `navigate`, `open_app` and `open_url`.
  - Anything inside Orbit (reminders, notes) runs immediately.
  - Anything that leaves Orbit (calls, texts, emails, opening apps) shows up as a **tap-to-confirm button**. The AI can't text or call anyone without your tap.
- **Privacy.** All data, including API keys, stays in the device's localStorage. Export never includes keys.

## Making it the phone's only interface (Android)

Open `android/` in Android Studio and run it on your phone. Then go to **Settings → Apps → Default apps → Home app → Orbit**. As your home screen, Orbit:

- shows **every installed app** on the dashboard, and the AI can open any of them by name
- comes back when you press the Home button, and Back never leaves it
- sends real Android notifications for reminders
- serves its UI from a real HTTPS origin

> The Android shell has **not been built or tested yet**. It was written without an Android SDK available. Expect to fix small Gradle or SDK version details on the first build.

## Platform limits

- **iPhone:** iOS doesn't let any app replace the home screen or control other apps. On iPhone, Orbit runs as a full-screen web app and uses links (`tel:`, `sms:`, `mailto:`, universal links) to hand off to other apps.
- **"Connect to every app":** no phone OS lets one app read data from inside other apps. Orbit can **launch** any app and **hand off** to it through deep links. To work *inside* other apps you need each service's own API (Spotify, Google Calendar, Gmail and so on) or, on Android, an AccessibilityService. Both are possible next steps.
- **CORS:** some AI providers block requests sent directly from a browser. Anthropic and OpenAI allow them. If a provider refuses, put a small proxy in front of it or use the Android shell.
- **Reminders** in the web version only fire while Orbit is open (or set as your launcher). Reliable background alarms need the native shell (AlarmManager), which is a planned next step.
