# 🕓 SlotSwapper — Peer-to-Peer Time Slot Exchange Platform

SlotSwapper is a **full-stack scheduling web app** that allows users to **swap calendar events** with others.  
Each user can mark a calendar slot as “Swappable,” view other users’ open slots, and exchange events seamlessly in real time.

Built with a **Next.js + Tailwind CSS frontend**, **Express + TypeScript backend**, and **PostgreSQL database**,  
SlotSwapper demonstrates a clean, scalable architecture for modern full-stack development.

---

## 🚀 Features

### 🔐 Authentication
- Secure sign-up and login using JWT (JSON Web Tokens).  
- Protected routes on both frontend and backend.

### 🗓️ Event Management
- Create, view, and manage events from your personal calendar.  
- Toggle between **BUSY** and **SWAPPABLE** states.

### 🔁 Slot Swapping
- View other users’ available swappable slots.  
- Request to swap your slot with someone else’s.  
- Accept or reject incoming swap requests.

### 🧭 Real-Time State Updates
- UI dynamically refreshes after creating events, toggling swap states, or completing a swap — no page reloads needed.

---

## 🏗️ Architecture Overview

slotSwapper/
│
├── slotswapper-frontend/ # Next.js 14 + Tailwind UI
│ ├── app/ # App Router pages (Next.js)
│ ├── components/ # Reusable UI components
│ ├── context/ # Auth context
│ ├── hooks/ # SWR-based event fetchers
│ ├── lib/ # Axios instance for API calls
│ └── types/ # Shared TypeScript types
│
├── slotswapper-backend/ # Express + TypeScript API server
│ ├── src/
│ │ ├── controllers/ # Route logic (auth, events, swaps)
│ │ ├── middleware/ # JWT authentication
│ │ ├── routes/ # Express routers
│ │ ├── services/ # Core business logic
│ │ └── prisma/ # Database schema and client
│ ├── prisma/schema.prisma
│ └── package.json
│
├── docker-compose.yml # Multi-service Docker setup
└── README.md # You are here


---

## 🧩 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | [Next.js 14](https://nextjs.org/) + [Tailwind CSS](https://tailwindcss.com/) |
| Backend | [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/) |
| Database | [PostgreSQL](https://www.postgresql.org/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Auth | [JWT](https://jwt.io/) |
| Containerization | [Docker](https://www.docker.com/) + Docker Compose |

---

## ⚙️ Setup & Installation

### 🧠 Prerequisites
Make sure you have:
- Node.js ≥ 20.x  
- PostgreSQL ≥ 14.x  
- Docker & Docker Compose (optional but recommended)  
- npm or yarn

---

### 🧩 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/slotSwapper.git
cd slotSwapper

🧱 2️⃣ Backend Setup
cd slotswapper-backend
npm install


Create a .env file:

DATABASE_URL="postgresql://user:password@localhost:5432/slotswapper"
JWT_SECRET="supersecretkey"
PORT=8080


Then:

npx prisma migrate dev --name init
npm run dev


➡ API will be available at: http://localhost:8080

🖥️ 3️⃣ Frontend Setup
cd ../slotswapper-frontend
npm install


Create a .env.local:

NEXT_PUBLIC_API_BASE_URL=http://localhost:8080


Then run:

npm run dev


➡ Frontend runs at: http://localhost:3000

🐳 Docker Setup (Recommended)

Run everything in containers:

docker compose up --build


This spins up:

PostgreSQL (on port 5432)

Backend (on port 8080)

Frontend (on port 3000)

To stop:

docker compose down

🧪 API Endpoints Summary
Method	Endpoint	Description
POST	/auth/signup	Register a new user
POST	/auth/login	Log in and receive JWT
GET	/events/me	Get my events
POST	/events	Create a new event
PATCH	/events/:id	Update event status (SWAPPABLE/BUSY)
GET	/events/swappable	Get all other users’ swappable slots
POST	/swap-request	Request a swap
GET	/swap-requests/incoming	View incoming swap requests
GET	/swap-requests/outgoing	View outgoing swap requests
POST	/swap-response/:id	Accept/Reject swap
💾 Database Schema (Prisma)
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  events    Event[]
  sentRequests     SwapRequest[] @relation("SentRequests")
  receivedRequests SwapRequest[] @relation("ReceivedRequests")
}

model Event {
  id        String   @id @default(uuid())
  title     String
  startTime DateTime
  endTime   DateTime
  status    String
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id])
}

model SwapRequest {
  id          String   @id @default(uuid())
  fromUserId  String
  toUserId    String
  mySlotId    String
  theirSlotId String
  status      String   @default("PENDING")
  createdAt   DateTime @default(now())
}

🎨 Frontend Highlights

Built using the Next.js App Router.

Fully responsive Tailwind CSS UI.

Context API for auth + token management.

SWR hooks for API state synchronization.

🔒 Security

All API routes use JWT-based authentication middleware.

Events & swap actions restricted to authenticated users.

Passwords securely hashed using bcrypt before storage.

📦 Deployment
🧭 Deploy to Vercel (Frontend)

1️⃣ Push your repo to GitHub.
2️⃣ Go to Vercel
.
3️⃣ Import the frontend directory (slotswapper-frontend).
4️⃣ Add environment variable:

NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com

🐳 Deploy Backend

Options:

Render: connect repo → add env vars → auto-build.

Railway / Fly.io: good for small-scale hosting.

Or host both backend + PostgreSQL via Docker on a VPS.

🧠 Design Decisions
Concern	Solution
Scalability	Decoupled frontend & backend, containerized services
Maintainability	Layered architecture (Controller → Service → ORM)
State Sync	SWR for auto revalidation
Security	JWT Auth + Role-based route guards
Portability	Docker Compose orchestration
🧰 Development Scripts
Command	Description
npm run dev	Start dev server
npm run build	Build project
npm run start	Run production server
npm run lint	Lint code
docker compose up --build	Run full stack via Docker
🧑‍💻 Author

Naitik Nayak
💼 Full-Stack Developer (React, Next.js, Node.js, TypeScript)
📧 [your-email@example.com
]
🌐 [LinkedIn / GitHub / Portfolio]

🏁 License

MIT License © 2025 Naitik Nayak
Free to use, modify, and distribute with attribution.