# Food Portal

A simple food ordering system for schools/colleges with separate portals for owners and students.

## Features
- Owner: View and serve orders, see daily profit
- Student: View menu, place orders, quick order
- Modern, responsive UI (React)
- PostgreSQL backend (Node.js/Express)

## Quick Start
1. **Clone & Install**
   ```sh
   git clone <repo-url>
   cd bellrings/backend && npm install
   cd ../frontend && npm install
   ```
2. **Configure Database**
   - Set up PostgreSQL with the schema below
   - Add `.env` in `backend/` with your PG_URI
3. **Run**
   - Backend: `cd backend && npm start`
   - Frontend: `cd frontend && npm start`

## Tech Stack
- Node.js, Express, PostgreSQL, React