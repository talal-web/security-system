# Security Management System

A full-stack security company management system for managing employees, attendance, payroll, salaries, locations, sectors, users, and related financial records.

The project contains:

- `frontend/`: Next.js 16 application using React, TypeScript, TanStack Query, and Tailwind CSS.
- `backend/`: Express API using MongoDB/Mongoose, JWT authentication, Cloudinary uploads, and Winston logging.

## Features

- Employee records and salary history
- Attendance sessions, reports, shifts, leave, and absences
- Payroll, advances, bonuses, deductions, fines, and invoices
- Sector and location management
- User administration and role-based access
- Export and printable reporting workflows

## Requirements

- Node.js 20.19.0 or newer
- npm
- MongoDB database
- Cloudinary account for production image uploads

## Configuration

### Backend

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/security-app
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URLS=http://localhost:3000

# Required in production for Cloudinary uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional
USE_CUSTOM_DNS=false
```

`MONGO_URI` and `JWT_SECRET` are required in every environment. In production, `FRONTEND_URLS` and the three Cloudinary variables are also required.

### Frontend

Create `frontend/.env.local` when the API is not using the default local address:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_COMPANY_PHONE=+92 335 5111150
```

`NEXT_PUBLIC_API_URL` defaults to `http://localhost:5000/api` in development and `/api` in production. For a separately hosted production frontend, set it to the public backend URL including `/api` (for example, `https://api.example.com/api`) in the frontend build environment before building. Next.js embeds `NEXT_PUBLIC_*` values into the client bundle at build time, so setting this variable only when starting the standalone server will not change the API URL. The `/api` fallback is suitable only when the hosting platform or reverse proxy forwards `/api` requests to the backend. The company phone variable is optional.

## Installation

Install dependencies in both applications:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

## Development

Start the backend in one terminal:

```powershell
cd backend
npm run dev
```

Start the frontend in another terminal:

```powershell
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API runs at [http://localhost:5000](http://localhost:5000).

The backend includes seed scripts for local accounts:

```powershell
node scripts/seedAdmin.js
node scripts/seedDeveloper.js
node scripts/seedSupervisor.js
```

Run only the seed script required for your local environment and keep credentials out of source control.

## Testing and Quality Checks

Run frontend linting:

```powershell
cd frontend
npm run lint
```

Run backend tests:

```powershell
cd backend
npm test
```

## Production

Build and run the backend:

```powershell
cd backend
npm ci
npm start
```

Build and run the standalone frontend:

```powershell
cd frontend
npm ci
npm run build
npm run start
```

The frontend starts on port `3000` by default. To use another port:

```powershell
npm run start -- -p 3001
```

Set production environment variables in the hosting platform rather than committing `.env` files. Configure the backend `FRONTEND_URLS` value to include the deployed frontend origin.

For the frontend, provide `NEXT_PUBLIC_API_URL` during the build unless the frontend host proxies `/api` to the backend. Ensure the deployed backend allows the frontend origin through `FRONTEND_URLS` and is reachable over HTTPS.

## Project Structure

```text
security-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── scripts/
│   └── tests/
└── frontend/
	├── app/
	├── components/
	├── hooks/
	├── services/
	├── types/
	└── utils/
```
