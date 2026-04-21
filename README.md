# 🎓 Smart LMS (Learning Management System)

A premier, fully-featured Learning Management System designed with the **MERN** stack (MongoDB, Express, React, Node.js). Smart LMS empowers educational institutions with a dynamic, role-based platform that securely handles everything from course creation and interactive assignments to real-time socket notifications and global attendance tracking.

---

## 🌟 Core Functionality & Program Flow

The application is structured around a strict **Role-Based Access Control (RBAC)** architecture. Upon registration, users are assigned a specific role which drastically changes their dashboard and capabilities.

### 🔄 The Standard System Flow:
1. **System Initialization:** An administrator or the deployment script boots the database and provisions the root instructors.
2. **Curriculum Deployment (Teacher):** Instructors log in to create modular **Courses**. They can seamlessly upload **Lectures** (with attached video resources) and construct global **Assignments**.
3. **Student Onboarding:** Students browse the universal **Course Catalog** and hit **Enroll**. Once enrolled, the Course is natively mounted to their personal dashboard.
4. **Active Learning (Student):** Students watch Lectures, track their due dates via the centralized **My Assignments** hub, and upload `.pdf` submissions directly from their local machine.
5. **Evaluation (Teacher):** Instructors open the **Grading** panel to review connected student PDFs, entering scores and feedback. 
6. **Real-time Feedback:** The moment a grade is published—or an Admin schedules a lecture time—a **Socket.io** event is fired, instantly dropping a badge into the target user's Notification Bell!

---

## 🛡️ Role-Specific Features

### 👑 Administrator
- **Global User Management**: Approve, edit, or remove ecosystem users (Teachers and Students).
- **Automated Lecture Scheduler**: An advanced modal allowing Admins to designate strict Lecture timings for specific Courses. Triggering this silently securely interfaces with root WebSockets to instantly push an Alert to the designated Instructor.

### 👨‍🏫 Teacher
- **Course & Module Architecture**: Build, edit, and delete comprehensive Subject Modules.
- **Assignment & Submission Mechanics**: Generate timeframe-bound homework questions. Dynamically fetch Student `.pdf` uploads, review them natively, and push mathematical Grades back to the student profile.
- **Attendance Verification**: Monitor the daily "Check-In" logs of all actively enrolled students.

### 👨‍🎓 Student
- **Global Catalog**: Browse courses and instantly dynamically enroll without blockers.
- **Universal Assignments Tracker**: A specifically tuned Dashboard component that organically fetches *every single assignment* natively mapped to any course the student is currently enrolled in, warning them of Due Dates.
- **PDF Uploading**: Push valid file configurations securely through Multer to interface with the database.
- **Active Attendance**: Navigate to the daily Attendance node to flag their presence for the day.

---

## 🚀 Setup & Installation Instructions

### 1. Backend Initialization `(/server)`
Navigate to the server directory and configure your environment:
```bash
cd server
npm install
```
Confirm your `.env` is initialized (a default runs locally at port 5000):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_lms
JWT_SECRET=supersecretjwtsecret555
```
Boot the backend engine:
```bash
npm run dev
```

### 2. Frontend Initialization `(/client)`
Open a second terminal pointing to your React UI layer:
```bash
cd client
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your web browser.

---

## 🗄️ Database Seeding & Dummy Credentials

We have provided an automated configuration script that instantly deletes ghost data and injects a clean, fully-approved testing environment bridging all 3 platform roles!

### How to execute the Dummy Data Script:
Inside the `server` directory, run:
```bash
node seed.js
```
*Output text will confirm the secure insertion of the database profiles.*

### Default Accounts

You can immediately log in to test the diverse Dashboard configurations using the seeded credentials below:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@lms.com` | `password123` |
| **Teacher** | `teacher@lms.com` | `password123` |
| **Student** | `student@lms.com` | `password123` |

Enjoy navigating the Smart LMS ecosystem!
# LMS
