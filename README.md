# 🏋️ Node Fitness API

A RESTful backend API for a fitness/workout tracking app built with **Node.js, Express, MongoDB Atlas, JWT, and Zod**.
Users can manage their own exercises, create workouts composed of multiple exercises, schedule workouts, log completed sessions, and add comments — all securely with JWT authentication.

## 📌 Project Roadmap

This project is inspired by the following roadmap:

👉 https://roadmap.sh/projects/fitness-workout-tracker

---

## 🚀 Tech Stack

- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication
- Zod for input validation
- dotenv for environment variables
- morgan for logging
- cors for CORS handling

---

## ✨ Features

- 🔐 User Authentication (Register & Login)
- 🏋️ Exercise Library (CRUD) — private per user
- 📋 Workout Templates with multiple embedded exercises
- 🗓️ Schedule upcoming workouts
- 📊 Log workout sessions (history & progress)
- 💬 Comments on workouts
- 🛡️ Ownership checks (users only access their own data)
- ✅ Zod + Mongoose validation

---

## 📁 Project Structure
```
project-name/
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   `-- server.js
|-- package.json
`-- README.md


```

---

## ⚙️ Setup & Installation

### 1️⃣ Install dependencies
- npm install

### 2️⃣ Create .env file in project root
- PORT=8080
- MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbName>
- JWT_SECRET=super_secret_change_me
- JWT_EXPIRES_IN=7d

### 3️⃣ Run the server
- npm run dev

### 🔐 Authentication (JWT)

After login/register, the server returns a token:

<code>{ "token": "eyJhbGciOiJIUzI1NiIs..." } </code>

### Send it with protected requests:

<code>Authorization: Bearer <JWT> </code>
The token contains:

- sub → user id

- role → user role

- exp → expiry time

### 🧪 Using Postman

- Call /api/v1/users/login or /api/v1/users/register

- Copy the token from response

- In Postman → Authorization tab:

  Type: Bearer Token

  Paste the token

- Call protected routes


## 📚 API Routes

### 🔐 Auth
- login: POST /api/v1/users/login  
- register: POST /api/v1/users/register  

---

### 🏋️ Exercises
- create: POST /api/v1/exercises/create  
- list: GET /api/v1/exercises/list  
- get one: GET /api/v1/exercises/exercise/:id  
- update: PATCH /api/v1/exercises/:id  
- delete: DELETE /api/v1/exercises/:id  

---

### 📝 Workouts
- create: POST /api/v1/workouts/create  
- list: GET /api/v1/workouts  
- get one: GET /api/v1/workouts/:id  
- update: PATCH /api/v1/workouts/:id  
- delete: DELETE /api/v1/workouts/:id  

---

### 📅 Schedules
- create: POST /api/v1/schedules/create  
- list: GET /api/v1/schedules/list  
- get one: GET /api/v1/schedules/:id  
- update: PATCH /api/v1/schedules/:id  
- delete: DELETE /api/v1/schedules/:id  

---

### ⏱️ Workout Sessions
- create: POST /api/v1/workout-sessions/create  
- list: GET /api/v1/workout-sessions/list  
- get one: GET /api/v1/workout-sessions/:id  
- update: PATCH /api/v1/workout-sessions/:id  
- delete: DELETE /api/v1/workout-sessions/:id  

---

### 📄 Reports
- generate user workout report (PDF): GET /api/v1/users/report  



## 🛠️ TODO / Future Improvements

- ⏳ Add comments/notes system for exercises  
  > Allow users to attach personal comments, tips, or form cues to each exercise (e.g., “keep elbows tucked”, “slow negatives”).  
  - Support create, edit, and delete comments  
  - Link comments to both exercise templates and workout sessions  
  - Expose via new API routes (e.g., `/api/v1/exercises/:id/comments`)  

- 📊 Enhance reports with summaries  
  - Weekly/monthly volume and PRs  
  - Average RPE and duration trends  

