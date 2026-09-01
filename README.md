# LeetLab

A Docker-based online code execution platform for solving programming problems, submitting code, and tracking execution results.

## 🚀 Overview

LeetLab is a full-stack web application designed to provide a secure and consistent environment for writing, compiling, and executing code.

The platform allows users to browse programming problems, write solutions in an integrated code editor, execute their code, and view compilation or execution results in real time.

Code execution is handled through the Judge0 API and isolated containerized environments, while PostgreSQL and Prisma are used for persistent data management.

## ✨ Features

- 🔐 User registration and authentication
- 💻 Integrated code editor
- ▶️ Real-time code execution
- 🌐 Support for 3+ programming languages
- 🐳 Docker-based sandboxed execution
- ⏱️ Execution timeouts and memory limits
- 📝 Programming problem management
- 📊 Submission history and execution results
- 📚 Custom playlists for organizing problems
- 👤 User profile and solved-problem tracking
- ⚡ RESTful backend APIs
- 🧹 Automated container cleanup to prevent resource leaks

## 🛠 Tech Stack

### Frontend

- React.js
- Tailwind CSS
- JavaScript

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- PostgreSQL
- Prisma ORM

### Code Execution

- Docker
- Judge0 API

## 🏗️ Architecture

LeetLab follows a full-stack architecture consisting of:

```text
User
  │
  ▼
React.js Frontend
  │
  ▼
Node.js + Express REST API
  │
  ├──────────────► PostgreSQL
  │                  │
  │                  ▼
  │               Prisma ORM
  │
  ▼
Judge0 API
  │
  ▼
Docker Sandbox
  │
  ▼
Execution Result
  │
  ▼
Submission History
