# UTOPIA | you-ጦቢያ

### Where Ethiopia Comes Alive.

> What if there was an Ethiopian Encarta, but instead of reading it, you could explore it?

UTOPIA is an interactive Ethiopian knowledge universe. You explore Ethiopia's places, people, stories and heritage, ask a voice guide questions, play through history, and collect what you discover in your own **መዝገብ** (Mezgeb, "the record").

**The knowledge exists. The experience is missing.** UTOPIA turns it into a world you can walk through.

- **Live demo:** https://utopia-taupe-seven.vercel.app
- **STARK project:** https://stark.et/project/utopia-you-3852

---

## What you can do

| Area | What it is |
|---|---|
| **Explore** | 14 categories and 29 discovery entries, with search (`Ctrl + K`) and a map |
| **Journey** | Your XP, level, achievements and discovery path |
| **Time Portal** | A map of journeys through Ethiopian history, with an animated portal transition |
| **Game** | Game cards: Aksum (playable), Lalibela, Gondar and Adwa (coming soon), the Main Game slot, mini-games |
| **Time Journey: Aksum** | A 2.5D walkable scene (see below) with an NPC, a quest, a mini-game and a knowledge question |
| **Today's Challenge** | A daily question with hints, XP and a streak. Practice mode afterwards |
| **Mini-Games** | 8 short knowledge games |
| **መዝገብ** | Your personal archive. Each unlocked entry lists its sources |
| **Voice guide** | A Voxide voice assistant that knows which page or game moment you are in |
| **Accounts and onboarding** | Register, sign in, reset password, a 4-step onboarding (**demo mode**, see Limitations) |
| **Personalisation** | English / አማርኛ navigation, dark / light theme, profile photo editor, golden Ge'ez letters on every tap |

---

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling and motion:** Tailwind CSS v4, `motion`, `next/font` (Cinzel, Figtree, Noto Ethiopic)
- **3D:** Three.js, React Three Fiber, drei (procedural stone textures, hand-built characters and stelae)
- **Voice:** Voxide (`@voxide/react`)
- **UI:** lucide-react, sonner
- **State:** browser `localStorage` (see Limitations)
- **Hosting:** Vercel. EthioDeploy: [add link if deployed]

---

## Getting started

Requires Node.js 20 or newer.

```bash
git clone https://github.com/YordanosBisrat/utopia.git
cd utopia
npm install
```

Create `.env.local` in the project root:

```env
# Public (safe in the browser; protected by Voxide's domain whitelist)
NEXT_PUBLIC_VOXIDE_PUBLIC_KEY=vox_pub_your_key_here

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_MAIN_GAME_URL=
```

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # run the production build
```

**Never commit `.env.local`.** It is already in `.gitignore`.

### Voxide setup

1. Create a Voxide project and copy its **publishable key** into `.env.local`.
2. Paste the agent instructions above into the project's agent prompt.
3. Add your deployed domain to the project's **domain whitelist** (`localhost` works without it).
4. Allow the microphone in the browser.

---

## Project structure

```text
src/
  app/
    (site)/        Pages with the navbar and footer: home, explore, journey, game, challenge, minigames, mezgeb, profile, settings
    (auth)/        login, register, forgot-password, onboarding
    (immersive)/   Full-screen pages: portal, game/aksum
  components/
    Assistant.tsx  Voxide client, state binding and actions (mounted in the root layout)
    TapEffect.tsx  Golden Ge'ez letters on every tap
    game/          Aksum scene, characters, stelae, dialogue, mini-game, portal hub
    utopia/        Navbar, search, avatar editor, shared UI
  game/            Aksum quest data, knowledge facts, መዝገብ store, game cards, voice bridge
  lib/             Site data, player store, demo auth, theme, i18n
public/            art/, brand/, encyclopedia/ images and the favicon
docs/              Ideation document and the Scholarxiv research brief
```

---

## Research (Scholarxiv)

The product decisions are backed by six Scholarxiv queries, kept in `docs/`. The brief covers interactive storytelling for heritage learning, voice interaction for children, grounded AI answers, hint-based scaffolding, multilingual voice support and gamification.

---


## Roadmap

1. Verify every voice fact against sources, then add sources to all discovery entries.
2. A real backend (accounts, progress sync), replacing the browser demo.
3. Voice tested on the production domain, with Amharic recognition if supported.
4. More journeys (Lalibela, Gondar, Adwa) and the Main Game.
5. More languages (Afaan Oromo, Tigrinya).


## Credits

- Voice: [Voxide](https://voxide.app). Research: Scholarxiv. Hackathon: STARK.
- Fonts: Cinzel, Figtree, Noto Serif / Sans Ethiopic.
- Knowledge reference: [UNESCO World Heritage Centre: Aksum](https://whc.unesco.org/en/list/15).


