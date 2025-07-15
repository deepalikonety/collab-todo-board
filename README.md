# 🧠 Collaborative To-Do Board

An intuitive task management application that lets teams plan, assign, and track work in real-time using drag-and-drop boards. Built with the MERN stack and deployed on **Vercel (frontend)** and **Render (backend)**.

### 🚀 Live Demo

🔗 App: [collab-todo-board.vercel.app](https://collab-todo-board.vercel.app)  
🎥 Demo Video: [Watch on Loom](https://loom.com/your-demo-link)

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

## 🧠 Unique Logic Explained

### Smart Assign
Automatically distributes tasks to users with the fewest active (non-done) tasks. This ensures load-balancing across the team without manual assignment.

- Uses MongoDB aggregation to count each user’s active tasks.
- Finds the user with the minimum count.
- Updates the task with the selected user and logs the action.

### Conflict Handling
Handles real-time editing conflicts if two users try to update the same task simultaneously.

- Each task has a `version` field.
- When editing, the version is sent along with the update.
- If the server detects a mismatch, a `409 Conflict` response is sent.
- A modal appears letting the user choose to:
  - ✅ Merge (combine their change with the latest version), or
  - ✅ Overwrite (forcefully update with their version)

---

## 🌐 Deployment Links

* **Frontend (Vercel)**: [collab-todo-board.vercel.app](https://collab-todo-board.vercel.app)
* **Backend (Render)**: [collab-todo-backend.onrender.com](https://collab-todo-backend.onrender.com)


## 🙋‍♀️ Author

**Deepali Konety**
📧 [GitHub](https://github.com/deepalikonety)

---
