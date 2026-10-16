# Implementation Plan: Doctor Appointment Booking System (MERN Stack)

This plan outlines the design and step-by-step implementation of a fully responsive, production-ready Doctor Appointment Booking System with Role-Based Access Control (RBAC) for Patients, Doctors, and Admins.

---

## Technical Stack & Architecture

- **Backend**: Node.js, Express.js, MongoDB (via Mongoose), JSON Web Tokens (JWT) for secure authentication, and bcryptjs for password hashing.
- **Frontend**: React (Vite-based Single Page Application), Tailwind CSS (slate/blue theme, glassmorphism, responsive grids), and React Context API for global state management (Auth, Appointments, and App Loading/Errors).
- **Structure**: Monorepo split into:
  - `backend/` - REST API serving routing, business logic, DB models, and authorization.
  - `frontend/` - React frontend powered by Vite and Tailwind CSS.

---

## Modular Folder Structure

We will implement the following modular workspace layout:

```text
doctor-appointment-booking-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Signup/Login for Patients/Admins/Doctors
│   │   ├── doctorController.js   # Doctor profile updates, patient views
│   │   ├── appointmentController.js # Booking, cancellation, complete, lists
│   │   └── adminController.js    # Statistics, add doctor, list transactions
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification and role checks
│   │   └── errorMiddleware.js    # Global error handler
│   ├── models/
│   │   ├── User.js               # Patient and Admin accounts
│   │   ├── Doctor.js             # Doctor profiles & availability slots
│   │   └── Appointment.js        # Appointment transactions
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── doctorRoutes.js       # /api/doctors
│   │   ├── appointmentRoutes.js  # /api/appointments
│   │   └── adminRoutes.js        # /api/admin
│   ├── package.json
│   └── server.js                 # Server entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddDoctorForm.jsx # Admin form to create new doctor
│   │   │   ├── AdminRoute.jsx    # Protected route for Admins
│   │   │   ├── AppointmentCard.jsx # Booking card details
│   │   │   ├── DoctorCard.jsx    # Doctor details and search result card
│   │   │   ├── DoctorRoute.jsx   # Protected route for Doctors
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── ProtectedRoute.jsx# General auth protected route
│   │   │   └── SlotPicker.jsx    # Dynamic booking slots helper
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # State wrapper for auth & profiles
│   │   │   └── AppContext.jsx    # State wrapper for global triggers (loading, feedback)
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx# Admin stats, doctor add, trans
│   │   │   ├── BookingPanel.jsx  # Slot selecting and booking execution
│   │   │   ├── DoctorDashboard.jsx# Doctor checklist, profile toggle, metrics
│   │   │   ├── Home.jsx          # Client homepage, specs, doctor list
│   │   │   ├── Login.jsx         # Signin page (JWT capture)
│   │   │   ├── PatientDashboard.jsx# Patient profile, appts list, cancels
│   │   │   └── Register.jsx      # Patient registration
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css             # Tailwind setup & Custom animations
│   │   ├── main.jsx
│   │   └── vite.config.js
│   ├── package.json
│   └── tailwind.config.js
```

---

## Database Schemas (Mongoose)

### 1. User Schema (`backend/models/User.js`)
Handles Patients and Admins.
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Patient', 'Admin'], default: 'Patient' },
  phone: { type: String, required: true }
}, { timestamps: true });
```

### 2. Doctor Schema (`backend/models/Doctor.js`)
Handles Doctors (including auth credentials and profile settings).
```javascript
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: Number, required: true }, // in years
  fees: { type: Number, required: true },
  slots_booked: {
    type: Map,
    of: [String], // Key is "YYYY-MM-DD", Value is array of booked times e.g., ["09:00 AM", "11:00 AM"]
    default: {}
  },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: 'Doctor' }
}, { timestamps: true });
```

### 3. Appointment Schema (`backend/models/Appointment.js`)
Tracks the booking state.
```javascript
const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  slotDate: { type: String, required: true }, // Format: "YYYY-MM-DD"
  slotTime: { type: String, required: true }, // Format: "HH:MM AM/PM"
  amount: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });
```

---

## Auth & Access Control Middleware (`backend/middleware/authMiddleware.js`)

- `protect`: Extracts JWT from the Bearer Token in authorization headers. Decodes the token, checks the database (`User` or `Doctor` based on identity) to verify existence, and appends the user context (`req.user`) to the request.
- `restrictTo(...roles)`: Verifies if the requester's role (extracted during `protect`) is permitted to proceed. Denies with a `403 Forbidden` status code if not.

---

## Prevent Double-Booking Validation

During appointment creation, the backend will perform a transactional validation:
1. Verify if the doctor is active.
2. Query `Doctor` by `docId` and inspect `slots_booked` for key `slotDate`.
3. If `slots_booked.get(slotDate)` contains the requested `slotTime`, return `400 Bad Request` ("This slot has already been booked").
4. If not booked, save the appointment, append the `slotTime` to the array for `slotDate`, and save the updated doctor record.

---

## Frontend Layout & Design System

- **Color Palette**: Sophisticated Slate base (`bg-slate-50`, `text-slate-800`), Primary Blue (`bg-blue-600`, `hover:bg-blue-700`) and modern Glassmorphism (semi-transparent blur panels for dashboard stats and cards).
- **Navigation Layout**:
  - Patient Mode: Top navigation bar for easy access to Home, Appointments, Profile.
  - Doctor / Admin Mode: Fixed side navigation bar layout showing key statistics and action panels.
- **Dynamic Slots Visualizer**: Calendar date picker with visual feedback, displaying color-coded slot grids (green for available, red/disabled for booked times).

---

## Proposed Changes

We will build the application starting with the backend, configuring databases, creating controllers and routers, verifying with an in-memory/local database configuration, followed by scaffolding the Vite React app, adding Tailwind, and writing the pages and context wrappers.

### Backend Files
1. [NEW] [db.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/config/db.js) - Mongoose configuration.
2. [NEW] [User.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/models/User.js) - User Model.
3. [NEW] [Doctor.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/models/Doctor.js) - Doctor Model.
4. [NEW] [Appointment.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/models/Appointment.js) - Appointment Model.
5. [NEW] [authMiddleware.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/middleware/authMiddleware.js) - Auth protection & RBAC.
6. [NEW] [errorMiddleware.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/middleware/errorMiddleware.js) - Global error handling.
7. [NEW] [authController.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/controllers/authController.js) - Auth endpoints.
8. [NEW] [doctorController.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/controllers/doctorController.js) - Profile/Appointments.
9. [NEW] [appointmentController.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/controllers/appointmentController.js) - Booking logic.
10. [NEW] [adminController.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/controllers/adminController.js) - Admin panel operations.
11. [NEW] [authRoutes.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/routes/authRoutes.js)
12. [NEW] [doctorRoutes.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/routes/doctorRoutes.js)
13. [NEW] [appointmentRoutes.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/routes/appointmentRoutes.js)
14. [NEW] [adminRoutes.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/routes/adminRoutes.js)
15. [NEW] [server.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/server.js) - Entry point.
16. [NEW] [package.json](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/backend/package.json) - Backend dependencies.

### Frontend Files
1. [NEW] [package.json](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/package.json) - React + Tailwind packages.
2. [NEW] [vite.config.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/vite.config.js)
3. [NEW] [tailwind.config.js](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/tailwind.config.js)
4. [NEW] [index.html](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/index.html)
5. [NEW] [index.css](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/index.css)
6. [NEW] [main.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/main.jsx)
7. [NEW] [App.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/App.jsx)
8. [NEW] [AppContext.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/context/AppContext.jsx)
9. [NEW] [AuthContext.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/context/AuthContext.jsx)
10. [NEW] [Navbar.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/components/Navbar.jsx)
11. [NEW] [ProtectedRoute.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/components/ProtectedRoute.jsx)
12. [NEW] [AdminRoute.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/components/AdminRoute.jsx)
13. [NEW] [DoctorRoute.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/components/DoctorRoute.jsx)
14. [NEW] [Home.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/pages/Home.jsx)
15. [NEW] [Login.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/pages/Login.jsx)
16. [NEW] [Register.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/pages/Register.jsx)
17. [NEW] [BookingPanel.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/pages/BookingPanel.jsx)
18. [NEW] [PatientDashboard.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/pages/PatientDashboard.jsx)
19. [NEW] [DoctorDashboard.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/pages/DoctorDashboard.jsx)
20. [NEW] [AdminDashboard.jsx](file:///d:/Hemant%20kunal/Downloads/doctor%20appointment%20booking%20system/frontend/src/pages/AdminDashboard.jsx)

---

## Verification Plan

### Automated/Unit Testing Simulation
- Create a server-side seed script (`backend/seed.js`) that creates:
  - An Admin user (`admin@system.com`)
  - A Patient user (`patient@system.com`)
  - Two Doctor users (`cardio@system.com`, `derm@system.com`)
- Test standard endpoint behavior using an automated Node script that performs the following HTTP tests:
  - Log in as patient, book an appointment on a specific date/slot.
  - Log in again, try to book the *same* date/slot (must fail with double-booking error).
  - Log in as Doctor, view checklist, complete appointment.
  - Log in as Admin, check statistics and view all transactions.

### Manual Verification
- Launch backend on port `5000` (backed by a MongoDB instance or MongoMemoryServer/Atlas).
- Launch frontend on Vite dev server (port `5173`).
- Visually test booking a slot:
  - Verify booking disables the chosen slot immediately.
  - Check role redirects (e.g., patient trying to access `/admin` or `/doctor` dashboards redirects or shows unauthorized).
  - Toggle doctor active/inactive and verify availability changes.
