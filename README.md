# Life Fuel MVP

Full-stack starter for the Life Fuel AI Meal Coach with Django REST backend and Next.js frontend.

## Getting started

1. Copy env templates:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
2. Install backend deps and run migrations locally:
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```
3. Install frontend deps and start dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Or use Docker:
```bash
docker-compose up --build
```

## Auth endpoints
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET/PATCH /api/auth/me/`

JWT tokens are returned on register and login.
