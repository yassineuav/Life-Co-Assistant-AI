# Life Fuel MVP

Monorepo containing a Django REST API backend and Next.js frontend for the Life Fuel "AI Fridge → Meal Generator" experience.

## Quick start with Docker

```bash
docker-compose up --build
```

Backend runs at http://localhost:8000, frontend at http://localhost:3000.

## Backend setup (manual)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

## Frontend setup (manual)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Notes
- JWT authentication via `/api/auth/login/`.
- Pantry endpoints under `/api/pantry/`.
- Meal suggestion available at `/api/meals/suggest/` (mock AI flow for now).
- OpenAPI docs served at `/api/docs/`.
