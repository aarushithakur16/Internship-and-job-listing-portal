# InternHub — Internship & Job Listing Portal

An intuitive, modern, full-stack **Internship and Job Listing Portal** built with **React (Vite)**, **Node.js**, **Express**, and **MongoDB**. The platform provides candidates with a sleek, pastel-themed interface to discover, filter, and apply for career opportunities, while equipping recruiters and administrators with a dedicated dashboard to manage listings and review applicant submissions in real time.

---

## 🌟 Key Features

### For Candidates & Job Seekers
- **Curated Opportunity Grid**: Browse internship and full-time listings styled with pastel tags, company avatars, experience tiers, and location indicators.
- **Debounced Instant Search**: Search listings dynamically with a 350ms debounce across title, company, description, domain, and experience.
- **Domain Filter Chips & Dropdown**: Seamlessly switch between domains (*Web Development*, *Design*, *Data Science*, *Marketing*, *Cloud Computing*, *Quality Assurance*, *Product Management*) using responsive chips or a quick dropdown.
- **Detailed Opportunity View (`/opportunities/:id`)**: Rich role breakdown featuring key meta badges, comprehensive job description, role requirements, direct external links, and an "Apply Now" CTA.
- **Interactive Application Form (`/apply/:id`)**: Clean modal card with client-side validation for full name, email format, phone digits, and optional resume link.
- **Submission Confirmation (`/confirmation`)**: Animated pastel success card providing an application receipt summary with an instant return route to listings.

### For Administrators
- **Pastel Analytics Dashboard (`/admin`)**: Metric indicator cards calculating total active opportunities, candidate applications, and diverse domain counts.
- **Full Opportunities CRUD**:
  - **Create**: Add new roles with all 7 required fields via a styled modal dialog.
  - **Read**: Live searchable listings table.
  - **Update**: Edit existing listings with auto-populated form fields.
  - **Delete**: Safe removal with confirmation prompt.
- **Candidate Applications Center (`/admin/applications`)**: Comprehensive applicant table displaying candidate details, contact info, linked opportunity titles, clickable resume URLs, and submission timestamps with keyword search.

### Reliability & User Experience
- **Zero-Config Resilient Fallback**: If an external MongoDB instance is not connected, the server automatically operates using a high-fidelity in-memory seeded store, ensuring zero development friction.
- **WCAG-Compliant Pastel Palette**: High-contrast, accessible pastel design tokens with active `:focus-visible` accessibility indicators.
- **Fully Responsive Layout**: Tested and optimized for mobile (`360px`), tablet (`768px`), and desktop (`1280px`).

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 18
  - Vite
  - React Router DOM (v7)
  - Axios
  - Lucide React (Icons)
  - Vanilla CSS (Custom Design System with Pastel Tokens)
- **Backend**:
  - Node.js (v18+)
  - Express.js (v5)
  - Mongoose (v9)
  - CORS & Dotenv
  - Nodemon (Development)
- **Database**:
  - MongoDB (with automatic in-memory fallback for development)

---

## 📋 Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v18.x or later recommended)
- **npm** (v9.x or later)
- **MongoDB** (Optional for local persistent storage; in-memory fallback is included)

---

## 📂 Folder Structure

```
Internship-and-job-listing-portal/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & fallback handler
│   ├── controllers/
│   │   ├── applicationController.js # Application handlers (submit & list)
│   │   └── opportunityController.js # Opportunity CRUD handlers
│   ├── models/
│   │   ├── Application.js        # Mongoose Application schema
│   │   └── Opportunity.js        # Mongoose Opportunity schema
│   ├── routes/
│   │   ├── applicationRoutes.js  # /api/applications router
│   │   └── opportunityRoutes.js  # /api/opportunities router
│   ├── .env.example              # Sample backend environment variables
│   ├── package.json              # Backend dependencies and scripts
│   ├── seed.js                   # Database seeding utility
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── DomainFilter.jsx  # Domain filter chips and dropdown
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── OpportunityCard.jsx # Listing card with pastel badge
│   │   │   ├── SearchBar.jsx     # Search input with clear button
│   │   │   ├── SkeletonCard.jsx  # Shimmer loading skeleton
│   │   │   └── Toast.jsx         # Notification alert popup
│   │   ├── hooks/
│   │   │   └── useDebounce.js    # Debounce hook for smooth search
│   │   ├── pages/                # Application views
│   │   │   ├── AdminApplications.jsx # Admin applicant viewer
│   │   │   ├── AdminDashboard.jsx    # Admin CRUD & metrics dashboard
│   │   │   ├── ApplyForm.jsx         # Candidate application page
│   │   │   ├── Confirmation.jsx      # Post-application success page
│   │   │   ├── OpportunityDetails.jsx# Detailed opportunity overview
│   │   │   └── OpportunityList.jsx   # Homepage / listings directory
│   │   ├── services/
│   │   │   └── api.js            # Axios client configuration
│   │   ├── App.jsx               # Route definitions
│   │   ├── index.css             # Pastel design system styles
│   │   └── main.jsx              # React DOM render entry
│   ├── .env.example              # Sample frontend environment variables
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite configuration
└── README.md                     # Project documentation
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory by copying `.env.example`:

```bash
cp backend/.env.example backend/.env
```

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/internship_portal
```
*(Note: If `MONGO_URI` is omitted or MongoDB is offline, the backend gracefully runs in seeded memory mode).*

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend/` directory (optional):

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Running

### 1. Clone the Repository
```bash
git clone https://github.com/aarushithakur16/Internship-and-job-listing-portal.git
cd Internship-and-job-listing-portal
```

### 2. Setup & Run the Backend Server
Open a terminal in the root folder:

```bash
cd backend
npm install
npm run dev
```
The backend will start at: **`http://localhost:5000`**

### 3. Setup & Run the Frontend Client
Open a second terminal in the root folder:

```bash
cd frontend
npm install
npm run dev
```
The frontend will start at: **`http://localhost:5173`**

---

## 🗄️ Database Seeding

To populate MongoDB with sample opportunities, run:

```bash
cd backend
npm run seed
```

This populates 8 curated opportunities spanning *Web Development*, *Design*, *Data Science*, *Marketing*, *Cloud Computing*, and *Product Management*.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Request Body / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/opportunities` | List opportunities | Optional Query: `?search=keyword&domain=Design` |
| `GET` | `/api/opportunities/:id` | Fetch single opportunity | URL Param: `:id` |
| `POST` | `/api/opportunities` | Create new opportunity (Admin) | JSON body (all 7 fields required) |
| `PUT` | `/api/opportunities/:id` | Update opportunity (Admin) | URL Param: `:id`, JSON body with fields to update |
| `DELETE` | `/api/opportunities/:id` | Remove opportunity (Admin) | URL Param: `:id` |
| `POST` | `/api/applications` | Submit application | JSON: `{ opportunityId, applicantName, email, phone, resumeLink }` |
| `GET` | `/api/applications` | View all applications (Admin) | Returns array of populated applications |

---

## 💾 Database Schemas

### 1. Opportunity Model (`backend/models/Opportunity.js`)
```javascript
{
  title: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  domain: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  experience: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  applicationLink: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### 2. Application Model (`backend/models/Application.js`)
```javascript
{
  opportunityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Opportunity', 
    required: true 
  },
  applicantName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    trim: true, 
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ 
  },
  phone: { type: String, required: true, trim: true },
  resumeLink: { type: String, default: '', trim: true },
  submittedAt: { type: Date, default: Date.now }
}
```

---

## 📸 Screenshots

| Feature | Preview |
| :--- | :---: |
| **Home & Opportunities Explorer** | ![Home Listings](/docs/screenshots/home-listings.png) |
| **Opportunity Details View** | ![Opportunity Details](/docs/screenshots/opportunity-details.png) |
| **Application Submission Form** | ![Application Form](/docs/screenshots/apply-form.png) |
| **Submission Confirmation** | ![Confirmation Page](/docs/screenshots/confirmation.png) |
| **Admin Analytics & CRUD** | ![Admin Dashboard](/docs/screenshots/admin-dashboard.png) |
| **Admin Candidate Applications** | ![Admin Applications](/docs/screenshots/admin-applications.png) |

*(Note: Replace image paths above with your captured screenshot files in `docs/screenshots/`).*

---

## 📄 License
This project is open-source and available under the [ISC License](file:///c:/Users/AARUSHI/OneDrive/Desktop/internship%20and%20job%20listing%20portal/Internship-and-job-listing-portal/backend/package.json).
