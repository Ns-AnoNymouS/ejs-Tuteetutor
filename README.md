# TuteeTutor

**TuteeTutor** is a web application built using Node.js and Express on the MVC framework, with EJS as the templating engine. The application is designed to cater to the needs of educational institutions, providing various roles such as Student, Faculty, HOD (Head of Department), and Admin with specific functionalities.

## Table of Contents

- [Features](#features)
- [Roles and Functionalities](#roles-and-functionalities)
- [Installation](#installation)
- [Usage](#usage)

## Features

- **Role-based Access:** Different functionalities available for Students, Faculty, HODs, and Admins.
- **Class Management:** Users can view their next class and upcoming holidays.
- **Communication:** Easy contact between students and faculty for announcements.
- **Attendance Management:** Faculty can share attendance details with students.
- **Admin Controls:** Comprehensive admin panel for managing users and overseeing the platform.

## Roles and Functionalities

### 1. Student
- View upcoming classes and holidays.
- Receive announcements from faculty and HODs.
- View attendance records.

### 2. Faculty
- Manage class schedules and share them with students.
- Send announcements to students.
- Record and share attendance.

### 3. HOD
- Oversee faculty activities.
- Manage department-level announcements.
- Monitor student and faculty performance.

### 4. Admin
- Manage users (Students, Faculty, HODs).
- Oversee all activities across the platform.
- Manage system-wide settings and configurations.

## Installation

1. **Clone the repository:**

   ```bash
   git clone Ns-AnoNymouS/ejs-Tuteetutor
   cd ejs-Tuteetutor

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**
    ```bash
    PORT=3000
    DATABASE=your-database-url
    SESSION_SECRET=your-session-secret
    ```

4. **Run the application:**

    ```bash
    npm start
    ```
