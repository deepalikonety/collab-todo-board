# 🧠 Collaborative To-Do Board

An intuitive task management application that lets teams plan, assign, and track work in real-time using drag-and-drop boards. Built with the MERN stack and deployed on **Vercel (frontend)** and **Render (backend)**.

### 🚀 Live Demo

🔗 [collab-todo-board.vercel.app](https://collab-todo-board.vercel.app)

---

## 📌 Features

* 🧠 **Smart Assign**: Assigns new tasks intelligently to users with the least workload.
* 📋 **Task Columns**: Organized into **Todo**, **In Progress**, and **Done** using drag-and-drop (`react-beautiful-dnd`).
* 🢑 **Collaborative Activity Log**: Real-time updates using `socket.io`.
* 🔐 **Authentication**: Secure login & register using JWT.
* ✅ **Manual Assignment**: Tasks can be manually assigned with priority levels.
* 💬 **Comments**: Add notes to tasks for better collaboration.
* 📱 **Fully Responsive**: Mobile-friendly design with fluid layout and component scaling.

---

## ⚙️ Tech Stack

**Frontend**

* React.js
* React Router
* Socket.IO Client
* Pure CSS (no frameworks)
* Vercel Deployment

**Backend**

* Node.js + Express.js
* MongoDB with Mongoose
* Socket.IO
* JWT-based Auth
* Render Deployment

---

## ⚙️ Setup Instructions

### 1. Backend

```bash
cd backend
npm install
touch .env
```

Add `.env`:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Then run:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
touch .env
```

Add `.env`:

```env
REACT_APP_BASE_URL=https://your-backend-url.onrender.com
```

Then run:

```bash
npm start
```

---

## 🌐 Deployment Links

* **Frontend (Vercel)**: [collab-todo-board.vercel.app](https://collab-todo-board.vercel.app)
* **Backend (Render)**: [collab-todo-backend.onrender.com](https://collab-todo-backend.onrender.com)


## 🙋‍♀️ Author

**Deepali Konety**
📧 [GitHub](https://github.com/deepalikonety)

---
