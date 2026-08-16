# Claudio — Sprechhilfe

A speech-assistance tool for a physiotherapist with aphasia. The therapist taps
pictograms and a body diagram; the app turns those keywords into one clear
German sentence and speaks it to the patient.

Built at [HackaHealth](https://hackahealth.ch/). Runs as a single Cloudflare
Worker: the React app and the API share one origin and one deploy.

---

## Quick start

```sh
npm run setup                 # installs root + frontend dependencies
cp .dev.vars.example .dev.vars   # then fill in your API keys
npm run dev:api               # backend on http://127.0.0.1:8787
npm run dev                   # frontend on http://localhost:5173
```

`npm run dev` proxies `/api/*` to the Worker, so the frontend always talks to a
same-origin API — locally and in production alike.

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm run dev:api` | The Worker, locally, reading `.dev.vars` |
| `npm test` | Unit tests for the German template layer |
| `npm run lint` | ESLint over the frontend |
| `npm run build` | Builds the frontend into `frontend/dist` |
| `npm run deploy` | Builds and deploys everything to Cloudflare |

---

## Environment variables

Local values live in `.dev.vars` (git-ignored). See `.dev.vars.example` for the
full list with comments.

| Name | Required | Notes |
| --- | --- | --- |
| `LLM_PROVIDER` | no | `groq_fast` (default), `openai`, `xai_grok`, `gemini`, `anthropic` |
| `GROQ_API_KEY` etc. | yes | Only the key for the chosen provider |
| `LLM_MODEL` | no | Overrides the provider's default model |
| `CARTESIA_API_KEY` | yes | Text-to-speech |
| `CARTESIA_VOICE_ID` | no | Defaults to Claudio's own cloned voice |
| `CARTESIA_SPEED` | no | `0.8` — deliberately slow, easier to follow |
| `ALLOWED_ORIGINS` | no | Only needed if a frontend on another domain calls this API |

---

## Deploying

The whole app — static files and API — is one Cloudflare Worker.

```sh
npx wrangler login                        # once, per machine
npx wrangler secret put GROQ_API_KEY      # once, per secret
npx wrangler secret put CARTESIA_API_KEY
npm run deploy
```

That prints a `https://claudio-apphasia.<subdomain>.workers.dev` URL. To use a
custom domain, add a route in the Cloudflare dashboard under the Worker's
settings.

To change a non-secret setting (`LLM_PROVIDER`, `ALLOWED_ORIGINS`), edit `vars`
in `wrangler.jsonc` and redeploy.

### Keeping the frontend on Render

The Worker serves the frontend itself, so deploying it is enough. If you would
rather keep the frontend as a Render **static site** (those are CDN-served and
never spin down — it was only the Python *web service* that cold-started), point
it at the Worker instead:

1. Render → the static site → Settings:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment variable: `VITE_API_URL=https://claudio-apphasia.<subdomain>.workers.dev`
2. In `wrangler.jsonc`, set `ALLOWED_ORIGINS` to the Render URL
   (e.g. `"https://claudio-apphasia.onrender.com"`), then `npm run deploy`.

`VITE_API_URL` is read at build time, so a change to it needs a Render rebuild.
Leave it unset to keep the same-origin behaviour.

### Why Cloudflare

The backend is ~600 lines of stateless glue with no database, so it does not
need a server that stays up. On Render's free tier the service was spun down
after 15 minutes idle and the next therapist to press the speaker button waited
through a cold boot — sometimes minutes, in the middle of a session.

Cloudflare's free plan covers this app comfortably:

| | Free plan |
| --- | --- |
| Worker requests | 100,000 / day |
| CPU time | 10 ms per request — waiting on an API does not count, so this is not a constraint here |
| Static assets | Unlimited, and served without waking the Worker |
| Cold start | None (V8 isolates, not containers) |

Only `/api/*` invokes the Worker; every image, script and stylesheet is served
from the edge for free.

**Alternatives, if you would rather not use Cloudflare:** Vercel's Hobby plan
and Netlify's free tier both host static files plus functions and would work
with modest changes (the Worker uses only standard `fetch`, `Request` and
`Response`). Both have short cold starts, measured in hundreds of milliseconds
rather than minutes. Staying on Render means paying ~$7/month for an instance
that never sleeps — the smallest change, but the largest recurring cost.

The API keys never reach the browser in any of these setups.

---

## How a sentence gets built

```
tap → typed token → /api/sentence → template?  →  yes → done (instant, free)
                                        ↓ no
                                       LLM → one German sentence
                                        ↓
                                  /api/speak → Cartesia → audio
```

**Typed tokens.** Every button knows what it is. Tapping "Knie links" sends
`{type: "bodypart", value: "Knie links"}`, not the bare string `"Knie links"`.
The backend therefore never has to guess whether "links" is a body part or a
direction, or whether a `7` means seven repetitions or pain level seven. This is
the single biggest lever on sentence quality — see `frontend/src/data/vocabulary.js`
for the word list and `worker/prompt.js` for how the types are explained to the
model.

**Templates first.** `worker/templates.js` handles the most common patterns —
body part + movement + direction + `!`, pain questions, fixed question words —
with real German declension rules. Those sentences are instant, free, and
identical every time, which matters more than variety when a therapist has to
trust what a button will say. Anything the templates do not recognise falls
through to the model. `npm test` pins the template output down.

**Generated ahead of time.** The sentence is generated in the background about
400 ms after the last tap, shown in the phrase bar, and its audio is prefetched.
By the time the speaker button is pressed the audio is usually already in
memory. The therapist reads the sentence before the patient hears it — a wrong
sentence can be corrected silently rather than out loud, and the ↻ button cycles
to an alternative reading of the same keywords.

**If anything fails**, the browser's own speech synthesis reads the sentence
instead. Worse audio, but the session continues.

### Changing the model

The provider layer is in `worker/llm.js`; model ids there were verified
2026-08-16. Switching is one environment variable — no code changes:

```sh
npx wrangler secret put ANTHROPIC_API_KEY
# then set LLM_PROVIDER=anthropic in wrangler.jsonc and redeploy
```

**On Groq, the default is deliberately not the newest model.** Measured on this
app's own prompt across six real keyword combinations, `llama-3.3-70b-versatile`
was both the fastest (~385 ms average) and the only one that never failed;
`openai/gpt-oss-120b` was slower and misread a pain level as a repetition count,
and `qwen/qwen3.6-27b` failed JSON validation outright. Re-measure before
changing it — `LLM_MODEL` lets you A/B without touching code.

The single most valuable improvement to sentence quality is not a bigger model:
it is adding real sentences from real sessions to the `EXAMPLES` array in
`worker/prompt.js`.

---

## Project layout

```
wrangler.jsonc          Cloudflare config: one Worker, serving the built frontend
worker/
  index.js              Router: /api/health, /api/sentence, /api/speak
  sentence.js           Templates first, model second
  templates.js          German grammar for the common button combinations
  prompt.js             System prompt + few-shot examples
  llm.js                Provider abstraction (Groq / OpenAI / xAI / Gemini / Anthropic)
  tts.js                Cartesia text-to-speech
  test/                 Unit tests for the template layer
frontend/
  src/data/             The vocabulary and the body-diagram coordinates
  src/api/client.js     The only place that talks to the backend
  src/hooks/            Sentence generation, speech playback, custom words
  src/Components/       UI
  src/Pages/            The single page
```

## Adding a word

Add one line to the right list in `frontend/src/data/vocabulary.js`, drop the
icon into `frontend/src/assets/icons/`, and set the `type` so the sentence
builder knows what kind of word it is (`action`, `symptom`, `bodypart`,
`direction`, `speed`, `topic`, `question`, `mood`, `operator`, `number`).

A therapist can also add words at runtime on the "Zusätzliche Wörter" tab; those
live in the browser and can be exported to a JSON file and imported on another
tablet.

## Choosing a voice

The default is Claudio's own voice, cloned into this Cartesia account from a
31-second recording (`f4790968-50f6-451f-be13-f1fa2d47ac47`, Swiss German).

Cartesia has no Swiss-German male voice in its public library, and its
`swiss-standard` accent is not available for localizing an existing voice — so
cloning is the only way to get one. To clone another:

```sh
curl -X POST https://api.cartesia.ai/voices/clone \
  -H "Cartesia-Version: 2026-08-14" -H "Authorization: Bearer $CARTESIA_API_KEY" \
  -F "clip=@recording.wav" -F "name=Name" -F "language=de" \
  -F "accent=swiss-standard" -F "access=private"
```

Roughly 30 seconds of clear speech is enough. Keep `access=private`: an owned
voice cannot be withdrawn from the catalogue, which is how the app lost its
original voice — it was a public-library id that started returning
`404 Voice not found` mid-session.

To hear the library alternatives, list what the account can use:

```sh
curl -s "https://api.cartesia.ai/voices/?limit=100" \
  -H "Cartesia-Version: 2026-08-14" -H "Authorization: Bearer $CARTESIA_API_KEY"
```

Then set `CARTESIA_VOICE_ID` to the id you want. Voices in Cartesia's public
library can be withdrawn — that is what happened to the app's original voice,
which started returning `404 Voice not found` mid-session. A voice cloned into
your own Cartesia account cannot disappear like that, so clone the one you
settle on if it matters.

## Notes and limits

- Custom words are stored per browser (localStorage). Pictures are downscaled to
  256 px WebP first, because full-size photos fill the ~5 MB quota fast. Use
  export/import to move them between devices.
- Rate limiting is per Worker isolate — a speed bump against a runaway loop, not
  a hard quota. For a real limit, add Cloudflare's rate-limiting binding or a KV
  namespace.
- The app is installable (web manifest + service worker): "Add to Home Screen"
  on the tablet gives it its own icon, and it opens with no network.
- Body diagram taps snap to the nearest labelled point within a radius; a tap
  far from any of them selects nothing, and the marker shows what is about to be
  selected before it is added.
