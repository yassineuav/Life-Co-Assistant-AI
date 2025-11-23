You are a senior full-stack engineer (Django + Next.js) building the first module of a startup called LIFE FUEL.

GOAL
-----
Build a working MVP web app with:
- Django backend (REST API)
- Next.js frontend (React + TypeScript + Tailwind)
- The core feature: "AI Fridge → Meal Generator / Healthy Meal Coach"

Users:
- Busy workers and families who want:
  - To eat healthier
  - Quickly generate recipes from the ingredients in their fridge/pantry
  - Get smart shopping lists
  - Stay within a budget
  - See nutrition info for meals (approximate is OK)

We only build the "Food & Meals" part now, but the codebase must be clean and modular so later we can add:
- Energy tracking
- Family routines
- Weekend planning
- Budget optimization

HIGH-LEVEL ARCHITECTURE
------------------------
Monorepo style:

- /backend  → Django + DRF + Celery
- /frontend → Next.js (App Router) + TypeScript + Tailwind

Use Docker + docker-compose for local development.

TECH CHOICES
-------------
Backend:
- Python 3.11+
- Django 5+
- Django REST Framework
- django-environ or similar for env vars
- PostgreSQL as DB
- Celery for background tasks
- Redis as Celery broker + cache
- Simple JWT (or djangorestframework-simplejwt) for auth

Frontend:
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack Query) for data fetching and caching
- Axios or fetch wrapper

AI / External:
- Use OpenAI API (but DON’T hardcode keys; use env variables)
- Design a clean AI service that can be swapped later
- Add easy extension points for a future Nutrition API (e.g., Edamam, Spoonacular, etc.), but you can mock it for now with dummy macros.

DOCKER:
- One docker-compose.yml at repo root to run:
  - backend
  - frontend
  - postgres
  - redis
  - celery worker
  - (optional) celery beat

BACKEND DESIGN (DJANGO)
------------------------
Create a Django project and structure like this:

- backend/
  - core/                # Django project settings, Celery config
  - users/               # user auth & profile
  - pantry/              # pantry & fridge items
  - meals/               # meals, recipes, meal plans, shopping lists
  - ai/                  # AI integration, prompt building, logging
  - requirements.txt or pyproject.toml

Set up Django REST Framework + JWT auth + simple browsable API for development.

### MODELS

1) users app

User:
- Inherit from AbstractUser or use one-to-one profile.
- Fields:
  - email (unique)
  - first_name, last_name
  - is_active, is_staff, etc.
  - time_zone (string)
  - country (string)
  - diet_type (choices: OMNIVORE, VEGETARIAN, VEGAN, HALAL, KOSHER, OTHER)
  - cooking_skill (choices: BEGINNER, INTERMEDIATE, ADVANCED)
  - budget_level (choices: LOW, MEDIUM, HIGH)
  - calorie_goal (integer, nullable)

Expose endpoints:
- POST /api/auth/register/
- POST /api/auth/login/ (JWT)
- GET /api/me/
- PATCH /api/me/

2) pantry app

Ingredient:
- name (string, unique or at least indexed)
- category (e.g., produce, dairy, protein, grains, spices)
- default_unit (string, e.g., "g", "ml", "piece")

UserIngredient:
- user (FK to User)
- ingredient (nullable FK to Ingredient) and/or free_text_name
- quantity (float)
- unit (string)
- expires_at (nullable datetime)
- source (choices: MANUAL, IMAGE_DETECTED)
- created_at, updated_at

Endpoints:
- GET /api/pantry/ → list current user ingredients
- POST /api/pantry/ → add ingredient
- PATCH /api/pantry/{id}/
- DELETE /api/pantry/{id}/

Also support:
- POST /api/pantry/bulk/ → create/update multiple ingredients at once

(For now, just design placeholder endpoint for image upload)
- POST /api/pantry/upload-image/
  - Accepts image
  - Saves to storage (local in dev)
  - Enqueues Celery task to process image and detect items
  - For now, the Celery task can just mock detected ingredients.

3) meals app

Meal:
- title (string)
- description (text)
- instructions (text)
- prep_time_minutes (int)
- difficulty (choices: EASY, MEDIUM, HARD)
- calories (int, nullable)
- protein (float, nullable)
- carbs (float, nullable)
- fat (float, nullable)
- ai_generated (bool)
- created_by (FK to user, nullable)
- created_at, updated_at

MealIngredient:
- meal (FK)
- name (string) or FK to Ingredient if you want
- quantity (float, nullable)
- unit (string, nullable)
- is_optional (bool)

MealPlan:
- user (FK)
- date (date)
- meal (FK to Meal)
- meal_type (choices: BREAKFAST, LUNCH, DINNER, SNACK)
- servings (int)

ShoppingList:
- user (FK)
- title (string)
- from_date (date, nullable)
- to_date (date, nullable)
- created_at

ShoppingListItem:
- shopping_list (FK)
- ingredient_name (string)
- quantity (float, nullable)
- unit (string, nullable)
- is_in_pantry (bool)
- is_checked (bool)

### AI app

PromptTemplate:
- key (string, unique) e.g. "FRIDGE_TO_RECIPES_V1"
- template_text (text)
- created_at, updated_at

AIRequestLog:
- user (FK, nullable)
- prompt_key (string)
- input_payload (JSON)
- output_payload (JSON)
- created_at
- model_name (string, nullable)
- tokens_used (int, nullable)
- cost_estimate (decimal, nullable)

### CORE BACKEND FEATURES

Implement these main API endpoints:

1) POST /api/meals/suggest/
   Input JSON:
   {
     "ingredients": [
       {"name": "egg", "quantity": 4, "unit": "pcs"},
       {"name": "tomato", "quantity": 2, "unit": "pcs"},
       ...
     ],
     "servings": 1-6,
     "time_limit_minutes": 10-60,
     "diet_type": "OMNIVORE" or null (fallback to user profile),
     "calorie_goal_per_meal": optional,
     "budget_level": optional (fallback to user profile)
   }

   Behavior:
   - Build a well-structured prompt to OpenAI (through a service class/function, NOT inside the view directly).
   - Ask the AI to return a JSON array of recipes with fields:
     - title
     - description
     - prep_time_minutes
     - ingredients (name, quantity, unit)
     - instructions
     - approximate_calories
     - macros (protein, carbs, fat)
   - Parse the AI response safely and validate it.
   - Save each recipe as a Meal + MealIngredient records with ai_generated=True.
   - Return the created meals as JSON to the client.

   Use a Celery task for the OpenAI call:
   - The API view can either:
     - a) be synchronous initially and call the AI directly, or
     - b) enqueue a task and have the frontend poll. For now, keep it simple: just call AI directly, but structure the code so later we can offload to Celery.

2) POST /api/meals/plan-week/
   Input JSON:
   {
     "start_date": "YYYY-MM-DD",
     "days": 7,
     "meals_per_day": ["LUNCH", "DINNER"],
     "budget_level": optional,
     "calorie_goal_per_day": optional
   }

   Behavior:
   - Use existing meals or call AI to generate meals.
   - Create MealPlan entries for the user.
   - Return the weekly plan grouped by date.

3) GET /api/meals/plan/
   Query params:
   - start_date
   - end_date
   Return the user’s MealPlan entries in that range grouped by day.

4) POST /api/shopping-lists/from-plan/
   Input:
   {
     "start_date": "YYYY-MM-DD",
     "end_date": "YYYY-MM-DD"
   }

   Behavior:
   - Look at all MealPlan entries in that range.
   - Combine MealIngredient quantities by name.
   - Compare with current UserIngredient pantry items.
   - Mark which ingredients are already in pantry (is_in_pantry = true).
   - Create a ShoppingList + ShoppingListItems.
   - Return the list.

GENERAL BACKEND REQUIREMENTS
-----------------------------
- Use DRF serializers and viewsets where appropriate.
- Add basic permissions: only access own data.
- Use DRF SimpleJWT for authentication.
- Add simple logging for AI calls.
- Expose OpenAPI/Swagger docs using drf-spectacular or drf-yasg.

FRONTEND DESIGN (NEXT.JS)
--------------------------
Create a Next.js app in /frontend with:

- App Router
- TypeScript
- Tailwind CSS configured
- Axios or fetch wrapper
- React Query (TanStack) for data fetching

Pages (App Router paths):

/auth/login
/auth/register
/onboarding
/dashboard
/fridge
/meals/suggest
/meals/plan
/shopping-list

HIGH LEVEL UI DESCRIPTION

1) Auth:
- Basic email/password login + register forms.
- After login, redirect to /onboarding if profile incomplete; else /dashboard.

2) Onboarding:
- Multi-step form:
  - Step 1: basic profile (name, time_zone, country)
  - Step 2: diet_type, cooking_skill, budget_level
  - Step 3: calorie_goal and household size (for servings)
- Save via /api/me/ PATCH.

3) Dashboard:
- Show:
  - "Quick actions" section:
    - Add pantry items
    - Generate meals from pantry
    - View this week's meal plan
  - Simple summary:
    - Number of items in pantry
    - Number of planned meals this week

4) Fridge (/fridge):
- Table or list of user's pantry items (GET /api/pantry/).
- Form to add new ingredient (name, quantity, unit, category optional).
- Edit/delete buttons.
- Button: "Generate meals from what I have" → navigates to /meals/suggest.

5) Meal Suggestion (/meals/suggest):
- Show:
  - Current pantry items with checkboxes so user can pick which to use.
  - Inputs:
    - servings
    - time_limit_minutes
  - Button: "Generate meals".
- On submit:
  - Call POST /api/meals/suggest/.
  - Show loading state.
- Display results as cards:
  - Title
  - Prep time
  - Calories (if available)
  - Tag if "Uses mostly your pantry ingredients"
- Button on each card:
  - "Add to weekly plan" → open a modal to choose date + meal_type; post to backend.

6) Meal Plan (/meals/plan):
- Weekly calendar view:
  - Columns = days (Mon-Sun)
  - Rows = meal types (Breakfast, Lunch, Dinner, Snack)
- For each slot:
  - Show assigned meal if exists.
  - Buttons to:
    - View recipe
    - Remove or replace meal
- Button at top:
  - "Generate full week plan" → uses POST /api/meals/plan-week/.

7) Shopping List (/shopping-list):
- Fetch active shopping list or allow user to create from a date range.
- Display items grouped by category (if available) or just plain list:
  - Ingredient name
  - Quantity + unit
  - Badge if "In pantry"
  - Checkbox to mark item bought.

FRONTEND IMPLEMENTATION REQUIREMENTS
-------------------------------------
- Use React Query for:
  - /api/pantry
  - /api/meals/suggest
  - /api/meals/plan
  - /api/shopping-lists
- Use an API client file to handle baseURL and auth token injection.
- Store JWT access token in memory or httpOnly cookies (choose a simple but reasonably secure approach for MVP).
- Show basic error handling and toast messages (you can use a lightweight toast library or minimal custom solution).

STYLING:
- Use Tailwind for layout and styling.
- Implement a simple, clean, modern UI (not fancy, but not ugly).
- Use a neutral color palette and clear hierarchy.

DOCKER & DEV EXPERIENCE
------------------------
Create a docker-compose.yml at repo root that runs:

- db: postgres:15
- redis:7
- backend:
  - Build from /backend
  - Expose port 8000
- worker:
  - Celery worker for backend
- frontend:
  - Build from /frontend
  - Expose port 3000

Set up .env.example files for:
- backend/.env.example:
  - DJANGO_SECRET_KEY=
  - DJANGO_DEBUG=
  - DB_NAME=
  - DB_USER=
  - DB_PASSWORD=
  - DB_HOST=
  - DB_PORT=
  - REDIS_URL=
  - OPENAI_API_KEY=
  - ALLOWED_HOSTS=
- frontend/.env.example:
  - NEXT_PUBLIC_API_BASE_URL=

Provide basic README instructions:
- How to run locally with Docker.
- How to apply migrations.
- How to create a superuser.

CODING STYLE
-------------
- Clean, modular, well-documented code.
- Small, single-responsibility functions.
- Clear folder structure.
- Add comments where necessary, especially around AI prompt building and parsing.

DELIVERABLES
-------------
1) All necessary Django models, serializers, views, urls, settings.
2) All necessary Next.js pages, components, hooks, and API helpers to:
   - Register, log in, complete onboarding.
   - Manage pantry items.
   - Call AI to generate meals from pantry.
   - See weekly meal plan.
   - Generate a shopping list from the meal plan.
3) Docker and README to run the stack locally.

Start by:
1. Scaffolding the backend project & apps.
2. Scaffolding the frontend project.
3. Wiring up one end-to-end flow:
   - Create user → add pantry items → generate meals from pantry.
Then fill in the rest.


mermaid:
flowchart LR
    subgraph Client
        A[Web App - Next.js]
    end

    subgraph Backend[Django Backend]
        B1[API Gateway / DRF]
        B2[(PostgreSQL)]
        B3[(Redis)]
        B4[AI Service]
        B5[Meal Service]
        B6[Pantry Service]
    end

    subgraph Workers[Celery Workers]
        C1[AI Recipe Task]
        C2[Pantry Image Processing]
        C3[Nutrition Lookup]
    end

    subgraph External
        D1[OpenAI API]
        D2[Nutrition API]
        D3[Object Storage S3]
    end

    A -->|HTTPS/JSON| B1
    B1 --> B6
    B1 --> B5
    B1 --> B4
    B1 --> B2
    B1 --> B3

    B4 -->|async tasks| C1
    B6 -->|async tasks| C2
    B5 -->|async tasks| C3

    C1 --> D1
    C3 --> D2
    C2 --> D3

    C1 --> B2
    C2 --> B2
    C3 --> B2


