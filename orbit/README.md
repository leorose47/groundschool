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

On first launch, Orbit asks your name and starts with **Orbit Demo**. This assistant is built in and runs entirely on the phone, so you need no account or key. It understands short commands such as "Remind me to stretch in 20 minutes", "Text Alex I'm running late", "Directions to the airport", "Play lo-fi beats" and "What's on today?". It also adds two sample contacts with fictional 555 numbers, a reminder and a note, so you can try things straight away.

To get full conversation:

1. **Bots** tab → **+ Connect** → choose a provider and paste an API key (for Grok, get one at console.x.ai).
2. **Life → Contacts**: add people so "text Mom" works. Android Chrome can import them from the phone.
3. Ask from the Home bar or the Assistant tab.

## Polish details

- Light and dark themes (match the system, or choose one in Settings).
- Formatted assistant replies, a typing indicator, and tap-to-edit reminders.
- App tiles are real links, and controls have labels and visible keyboard focus.
- Animations turn off when the phone asks for reduced motion.

## How it works

- **Bots are interchangeable.** Each one is a provider, a base URL, a model and a key. xAI, OpenAI and anything else OpenAI-compatible use `/chat/completions`. Anthropic uses `/messages`. You can connect several and switch between them in the chat.
- **Tools.** The bot can call `add_reminder`, `add_note`, `search_notes`, `list_reminders`, `find_contact`, `call`, `send_text`, `send_email`, `navigate`, `open_app` and `open_url`.
  - Anything inside Orbit (reminders, notes) runs immediately.
  - Anything that leaves Orbit (calls, texts, emails, opening apps) shows up as a **tap-to-confirm button**. The AI can't text or call anyone without your tap.
- **Privacy.** All data, including API keys, stays in the device's localStorage. Export never includes keys.

## Connected services

Go to **Bots → Connected services**. Each service uses your own free developer client ID, and the app walks you through getting one. After you connect, the assistant gets new tools and Home shows live cards.

| Service | What the assistant can do | Home card |
|---|---|---|
| **Google** (Calendar + Gmail) | `calendar_events`, `calendar_add_event`*, `gmail_search`, `gmail_read`, `gmail_send`* | Today's calendar |
| **Spotify** | `spotify_play` (search + play), `spotify_control` (pause/resume/skip/shuffle), `spotify_now_playing` | Now playing, with controls |

\* These show a **Confirm** button. Nothing is added to your calendar and no email is sent until you tap it.

- **Google** sign-in runs entirely in the browser (Google Identity Services). A sign-in lasts about an hour. When it expires, the assistant shows a **Reconnect** button. While your Google Cloud project is in "Testing" mode, add yourself as a test user.
- **Spotify** uses the PKCE flow, so it renews itself. Spotify only accepts `https://` or `http://127.0.0.1` redirect URIs, not `localhost`. Remote playback control requires **Spotify Premium** and Spotify open on some device.
- **Prompt injection:** emails can contain text that tries to give the AI instructions. The system prompt tells the bot to treat email and calendar content as information only. On top of that, everything that sends or changes something outside Orbit needs your tap.

## Making it the phone's only interface (Android)

Open `android/` in Android Studio and run it on your phone. Then go to **Settings → Apps → Default apps → Home app → Orbit**. As your home screen, Orbit:

- shows **every installed app** on the dashboard, and the AI can open any of them by name
- comes back when you press the Home button, and Back never leaves it
- schedules reminders with **AlarmManager**, so they fire even when Orbit is closed, and reschedules them after a reboot. On Android 12+, allow "Alarms & reminders" for Orbit to get exact timing. Without that permission, Android may deliver reminders a few minutes late.
- serves its UI from a real HTTPS origin

> The Android shell has **not been built or tested yet**. It was written without an Android SDK available. Expect to fix small Gradle or SDK version details on the first build.

## Platform limits

- **iPhone:** iOS doesn't let any app replace the home screen or control other apps. On iPhone, Orbit runs as a full-screen web app and uses links (`tel:`, `sms:`, `mailto:`, universal links) to hand off to other apps.
- **"Connect to every app":** no phone OS lets one app read data from inside other apps. Orbit can **launch** any app and **hand off** to it through deep links. To work *inside* other apps you need each service's own API (Spotify, Google Calendar, Gmail and so on) or, on Android, an AccessibilityService. Both are possible next steps.
- **CORS:** some AI providers block requests sent directly from a browser. Anthropic and OpenAI allow them. If a provider refuses, put a small proxy in front of it or use the Android shell.
- **Reminders** in the web version only fire while Orbit is open. The Android shell fires them in the background.
- **Google sign-in inside the Android shell:** Google blocks OAuth inside embedded WebViews, so the Google connection works in the web/PWA version but not yet in the shell. The fix is to sign in through a Chrome Custom Tab (needs a small backend or AppAuth) and is the next planned step. Spotify sign-in works in the shell: register `https://appassets.androidplatform.net/assets/index.html` as an extra redirect URI.
