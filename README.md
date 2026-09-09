# LANDWATCH

## Run locally

1. npm install
2. copy `.env.example` to `.env`
3. fill in your Supabase and Gemini keys if available
4. npm run dev

## Free hackathon stack

- Supabase: real database
- Open-Meteo: real weather data
- Gemini: real AI assistant (optional, if API key is present)
- Local fallback: works even without external keys

## Database setup

Import `SUPABASE_SCHEMA.sql` into your Supabase project.

## Notes

- If no Supabase/Gemini keys are configured, the app still works using local fallback logic.
- This is the fastest no-cost hackathon-friendly setup.
