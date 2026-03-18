# Task Management Application 🚀

A production-ready full-stack Task Management application built to demonstrate modern backend architecture, secure authentication, frontend integration, and deployment readiness on Vercel.

## 🛠️ Tech Stack & Architecture

- **Frontend Framework:** Next.js 14 (App Router) & React
- **UI & Styling:** Tailwind CSS, `shadcn/ui`, `framer-motion` (for micro-animations), `sonner` (for toasts).
- **Backend APIs:** Next.js Route Handlers (`app/api/...`) providing monolithic tight integration with the client.
- **Database:** MongoDB coupled with `mongoose` for powerful ORM capabilities.
- **Authentication:** Custom JWT-based (`jose` library) secure flow. Passwords hashed via `bcryptjs`.
- **Validation:** Strict payload and schema validation using `zod`.
- **Security:**
  - JWT Tokens securely stored in HTTP-Only, Secure, `SameSite=Strict` cookies.
  - Next.js Edge Middleware route protection (blocks unauthorized access to `/dashboard` and backend API endpoints).
  - Mongoose to inherently prevent generic NoSQL injections.
  - Zod validation to sanitize payload endpoints.

## 📦 Core Features

1. **Authentication:** Register, Login, Logout with encrypted passwords and HTTP-Only cookies.
2. **Task CRUD APIs:** Create, Read, Update, and Delete tasks via `fetch` API.
3. **Advanced Filtering:** Pagination, Status filtering (Pending, In Progress, Completed), and live text search querying directly from the MongoDB store.
4. **Beautiful UI:** Responsive design infused with glassmorphism components, loading states, and smooth Framer Motion transitions.

## 🚀 Setup Instructions (Local & Deployment)

### 1. Prerequisites
- Node.js (v18+)
- MongoDB connection string (e.g., from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 2. Environment Variables
Rename or create a `.env` file at the root containing:

```env
# MongoDB Connection String (Required)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskapp?retryWrites=true&w=majority

# Strong Random String for JWT Signing (Required)
JWT_SECRET=your_super_secret_jwt_key_here_a2c8v3
```

### 3. Installation
```bash
npm install
```

### 4. Running Locally
```bash
npm run dev
```
Navigate to `http://localhost:3000`

## ☁️ Deployment (Vercel Recommended)

This application is strictly optimized for Vercel.

1. Push your code to a GitHub Repository.
2. Link the repository to your Vercel Dashboard.
3. In the **Environment Variables** section on Vercel, input your `MONGODB_URI` and a secure `JWT_SECRET`.
4. Deploy! Vercel will automatically build the Next.js optimized bundles and deploy serverless functions for the API routes.

## 📚 API Architecture Documentation

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create a new user account | ❌ No |
| `POST` | `/api/auth/login` | Check credentials & set HTTP-only cookie | ❌ No |
| `POST` | `/api/auth/logout` | Clear the authorization cookie | ❌ No |
| `GET`  | `/api/auth/me` | Return the logged-in user profile from the cookie | ✅ Yes |
| `GET`  | `/api/tasks` | Fetch tasks (Supports `?page`, `?limit`, `?status`, `?search`) | ✅ Yes |
| `POST` | `/api/tasks` | Create a new task tied to the user | ✅ Yes |
| `PUT`  | `/api/tasks/[id]` | Update an existing task status, title, description | ✅ Yes |
| `DELETE`| `/api/tasks/[id]` | Remove a task | ✅ Yes |

All Protected APIs validate the HTTP-Only cookie and inject the verified `userId` in edge middleware headers prior to executing the route logic.
