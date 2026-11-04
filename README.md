# LearnHub Client – E-Learning Management System Frontend

LearnHub is a full-featured, modern **E-Learning Management System (LMS)** frontend built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Redux Toolkit**. It provides an intuitive, responsive, and role-tailored user experience for **Students**, **Instructors**, and **Administrators**.

---

## 🌟 Key Features

### 🎓 1. Student Portal
- **Course Discovery & Filtering:** Browse, search by keyword, filter by categories and difficulty levels, and sort by price/rating.
- **Detailed Course Previews:** View full curricula, lesson breakdowns, requirements, instructor bios, and enroll with a single click.
- **Interactive Video Lesson Player:**
  - Dynamic video playback with collapsible lesson sidebar.
  - Automatic progress updates and lesson completion tracking.
  - Next/Previous lesson navigation.
- **Integrated Quizzes:** Complete interactive multiple-choice quizzes per course with instant score calculation, passing feedback, and answer review.
- **"My Learning" Dashboard:** Track enrolled courses with real-time visual progress bars and quick continue links.
- **Student Profile Management:** Update profile information, change password securely, and submit formal applications for an Instructor role.
- **Dark / Light Theme Toggle:** Clean and accessible dark mode support with instant toggle in the navbar and persistent `localStorage` storage.

### 👨‍🏫 2. Instructor Portal
- **Dedicated Instructor Dashboard:** Overview of total courses created, total enrolled students, and key performance metrics.
- **Course Management:** Full CRUD operations to create courses, edit course titles, descriptions, categories, pricing, and thumbnails, and toggle courses between Draft and Published.
- **Curriculum & Lesson Builder:** Add, edit, reorder, and delete video lessons with duration tracking.
- **Quiz Creator & Manager:** Create, edit, and delete multiple-choice quizzes with custom questions, options, and designated correct answers.

### 🛡️ 3. Admin Portal
- **Analytics Overview:** High-level platform statistics including total users, courses, total enrollments, and revenue metrics.
- **User Management & Moderation:** View all registered users, update roles (`student`, `instructor`, `admin`), and toggle user status (`active` / `blocked`).
- **Course Governance:** Review all courses across the entire platform, toggle visibility/status, or delete violating courses.
- **Instructor Request Moderation:** Review applications submitted by students wishing to become instructors, view applicant reasons, and approve or reject requests with admin notes.

### 🔒 4. Security & Routing
- **Secure Cookie Authentication:** HTTP-only cookies with Axios `withCredentials: true` preventing XSS token theft.
- **Role-Based Protected Routes:** Dedicated `ProtectedRoute` wrapper guarding Student, Instructor, and Admin views with automatic redirects for unauthorized access.
- **Client-Side Form Validation:** Formik and Yup schema validation across registration, login, profile, and course creation forms.

---

## 🛠️ Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing:** React Router v7 (`react-router-dom`)
- **HTTP Client:** Axios (configured with baseURL and credentials)
- **Form Handling & Validation:** Formik + Yup
- **Icons:** Lucide React
- **Linter:** Oxlint

---

## 📁 Project Structure

```text
learnhub-client/
├── public/
├── src/
│   ├── assets/             # Static images and icons
│   ├── components/
│   │   ├── admin/          # Admin tables, user detail modals, request moderation
│   │   ├── common/         # LoadingState, ErrorState, EmptyState
│   │   ├── courses/        # CourseCard, CourseQuiz, filter controls
│   │   ├── instructor/     # CreateCourseModal, ManageLessonsModal, ManageQuizModal
│   │   └── layout/         # Public, Student, Instructor & Admin Navbars and Sidebars
│   ├── context/
│   │   └── ThemeContext.jsx# Dark/light theme provider and hook
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── InstructorLayout.jsx
│   │   ├── PublicLayout.jsx
│   │   └── StudentLayout.jsx
│   ├── pages/
│   │   ├── AdminCourses.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── Courses.jsx
│   │   ├── Home.jsx
│   │   ├── InstructorCourses.jsx
│   │   ├── InstructorDashboard.jsx
│   │   ├── LessonPlayer.jsx
│   │   ├── Login.jsx
│   │   ├── MyLearning.jsx
│   │   ├── Register.jsx
│   │   └── StudentProfile.jsx
│   ├── services/
│   │   └── api.js          # Centralized Axios client instance
│   ├── store/
│   │   ├── slices/         # authSlice, courseSlice, adminSlice
│   │   └── store.js        # Configured Redux store
│   ├── App.jsx             # Main routing and auth initialization
│   ├── index.css           # Tailwind base styles and theme tokens
│   └── main.jsx            # React root with Redux & Theme providers
├── .env.example            # Sample environment variables
├── package.json
└── vite.config.js
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js (v18 or higher)** and **npm** installed.

### 2. Clone the Repository
```bash
git clone https://github.com/deekshith0803/LearnHub-E-Learning-Management-System.git
cd LearnHub-E-Learning-Management-System
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root of `learnhub-client` (or copy from `.env.example`):
```bash
cp .env.example .env
```

Set the backend API URL:
```env
VITE_API_URL=http://localhost:5002/api
```

> **Note:** If your backend runs on a different port (e.g. 5001 or a remote host), update `VITE_API_URL` accordingly.

### 5. Run the Development Server
```bash
npm run dev
```
The application will start on `http://localhost:5173`.

### 6. Build for Production
```bash
npm run build
```
Build output will be bundled in the `dist/` directory.

### 7. Run Code Linter
```bash
npm run lint
```

---

## 🔄 Redux State Management

The frontend state is centralized using Redux Toolkit:

- **`authSlice`**: Stores the authenticated user profile, authentication status (`isAuthenticated`), loading states, and error messages.
- **`courseSlice`**: Manages the public course catalog, selected course details, and instructor-specific courses.
- **`adminSlice`**: Handles admin dashboard metrics, user tables, and pending instructor role applications.

---

## 👨‍💻 Author

**Deekshith M**
- GitHub: [@deekshith0803](https://github.com/deekshith0803)
- Portfolio: [deekshith-five.vercel.app](https://deekshith-five.vercel.app/)
