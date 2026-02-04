# Anything Ai Assessment 

---

```md
# Frontend Developer Intern Assignment – Anything.ai

This project is a **full-stack web application** built as part of the **Frontend Developer Intern shortlisting assignment**.  
The primary focus is on **frontend development**, with a **minimal backend** to support authentication and dashboard functionality.

---

## 🚀 Features

### 🔐 Authentication
- User Signup & Login
- Password hashing using **bcrypt**
- JWT-based authentication
- Protected routes (dashboard accessible only after login)

### 👤 User Profile
- Fetch logged-in user profile
- Update User profile

### 📋 Dashboard (Tasks CRUD)
- Create, Read, Update, Delete tasks
- Task status management (todo / in-progress / done)
- User-specific data (each user sees only their own tasks)
- Logout functionality

### 🎨 UI / UX
- Responsive UI using **Tailwind CSS**
- Client-side form validation
- Loading, success, and error states
- Clean and scalable component structure

---

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- bcrypt (Password hashing)

---

## 📁 Project Structure

```

root/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── seeds/
│   ├── app.js
│   ├── server.js
│   └── .env
│
└── frontend/
├── src/
|   ├── api/
│   ├── pages/
│   ├── components/
│   ├── context/
│   ├── App.jsx
│   └── main.jsx

````

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone <your-github-repo-url>
cd <repo-folder>
````

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

### Create `.env` file in `backend/`

```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/anything_ai
JWT_SECRET=your_jwt_secret
```

### Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Run backend

```bash
npm run dev
```

Backend will run on:

```
http://localhost:8080
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🔑 API Overview

### Auth

* `POST /api/v1/auth/signup`
* `POST /api/v1/auth/login`

### Profile

* `GET /api/v1/user/profile`
* `PUT /api/v1/user/profile`

### Tasks

* `POST /api/v1/tasks`
* `GET /api/v1/tasks`
* `PUT /api/v1/tasks/:id`
* `DELETE /api/v1/tasks/:id`

> All protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🧪 API Testing

* APIs tested using **Postman** (included in repository)
* Authentication required for all dashboard routes

## 📦 Seeding Data

To seed the database with demo users and tasks:

```bash
npm run seed
```

## 🔒 Security Features

* Input validation on both frontend and backend
* Password hashing with bcrypt
* JWT authentication with proper validation
* Rate limiting to prevent abuse
* Helmet.js for HTTP header security
* SQL injection and XSS prevention

## 🚀 Additional Features

* User profile management
* Search and filter functionality for tasks
* Responsive UI with Tailwind CSS
* Loading, success, and error states
* Clean and scalable component structure

---

## 📌 Demo Credentials (Optional)

After running the seed script:

```
Admin User:
Email: admin@example.com
Password: password123

Regular Users:
Email: john@example.com / jane@example.com
Password: password123
```

---

## 📈 Scaling for Production (Short Note)

To scale this application for production:

* Use environment-based configurations
* Add refresh tokens for authentication
* Enable proper CORS configuration
* Implement pagination for task listing
* Add database indexes for performance
* Use rate limiting and request validation
* Introduce caching (Redis)
* Deploy frontend and backend separately using Docker & CI/CD pipelines
* Add monitoring and logging for better observability
* Implement automated testing and deployment workflows
* Optimize database queries and add proper indexing
* Set up proper backup and disaster recovery procedures

---

##  Author

**Piyush Singh Chauhan**
Frontend Developer Intern Applicant

```

Just tell me 👍
```
