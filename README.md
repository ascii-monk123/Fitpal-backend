# 🏋️ Node Fitness API

A RESTful backend API for a fitness/workout tracking app built with **Node.js, Express, MongoDB Atlas, JWT, and Zod**.
Users can manage their own exercises, create workouts composed of multiple exercises, schedule workouts, log completed sessions, and add comments — all securely with JWT authentication.

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

- Call /api/v1/auth/login or /api/v1/auth/register

- Copy the token from response

- In Postman → Authorization tab:

  Type: Bearer Token

  Paste the token

- Call protected routes

### (Note): the server is still in development but users can access functionalities like auth, exercise creation, workout creation and workout scheduling for now.
