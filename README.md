# Mini MVP – AI Learning Platform

A minimal AI-driven learning platform: users can register, select a category and subcategory, submit a prompt, and receive a lesson from the AI. Includes dashboards for users and admin.

---

## Technologies Used

- **Backend:** Node.js (Express), TypeScript, Prisma ORM, PostgreSQL, dotenv, body-parser, cors
- **Frontend:** React, React Router, fetch/axios

---

## Assumptions Made

- No advanced authentication (JWT); user is stored in localStorage.
- Any user can register; only users with role=ADMIN see the admin dashboard.
- AI is an external service (OpenAI) or a mock.
- No automated tests.
- Local run only (no deployment).

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

- Copy `.env.example` to `.env` and fill in your values (see example below).
- If using Docker for PostgreSQL:
  ```bash
  docker-compose up -d
  ```
- Run Prisma migrations:
  ```bash
  npx prisma migrate dev --name init
  ```
- Start the backend server:
  ```bash
  npm start
  ```
- The backend will run at [http://localhost:8080](http://localhost:8080)

---

### 3. Frontend Setup

```bash
cd ../fronted
npm install
npm start
```

- The frontend will open at [http://localhost:3000](http://localhost:3000)

---

## Example .env File

```env
# .env.example
DATABASE_URL=postgresql://postgres:password@localhost:5432/learning_db
OPENAI_API_KEY=your_openai_key
PORT=8080
```

---

## Project Structure

```
Backend/
  src/
    routes/
      userRoutes.ts
      promptRoutes.ts
      categoryRoutes.ts
      subCategoryRoutes.ts
    services/
    controllers/
    ...
  Prisma/
    schema.prisma
  .env

fronted/
  src/
    pages/
      HomePage.jsx
      PromptPage.jsx
      AdminPage.jsx
    component/
      RegisterForm.jsx
      LoginForm.jsx
      AdminPromptList.jsx
      UserList.jsx
    services/
      api.js
    App.js
  
```

---