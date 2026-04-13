# Food Analyzer

Upload a food photo, get an estimated FDA-style nutrition label, and chat about the food.

## Stack

- **Next.js 16** (App Router)
- **Google Gemini** (`gemini-2.5-flash-lite` → `gemini-2.5-pro` fallback) for image analysis and chat
- **Tailwind CSS v4**
- No database, no auth — all state lives in the browser for the duration of a session

## Setup

```bash
npm install
```

Add your Gemini API key to `.env`:

```
GEMINI_API_KEY=your_key_here
```

```bash
npm run dev
```

## How it works

1. **Upload** a food photo — Gemini identifies the food and returns structured nutrition data
2. **Label** — an FDA-style nutrition facts panel renders with an "Estimated from image" badge
3. **Chat** — ask anything about the food; the model has the nutrition data and full conversation history

## API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/analyze` | POST | Accepts `FormData` with `image`, returns `{ nutrition, openingMessage }` |
| `/api/chat` | POST | Accepts `{ messages, nutrition }`, streams a plain-text reply |

## Notes

- Nutrition values are **estimates** — actual values vary with preparation, brand, and portion size
- Uploading a non-image shows an inline error; a failed analysis returns you to the upload screen with a message
- One image per session — refreshing resets everything
