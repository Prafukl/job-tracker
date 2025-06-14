# 🚀 JobTrack - Comprehensive Job Application Tracker

A modern, full-featured job application tracking system built with React and Firebase. JobTrack helps job seekers organize their applications, prepare for interviews, and manage their career development journey all in one place.

![JobTrack Dashboard](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-11.7.3-orange?style=flat-square&logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Components Overview](#-components-overview)
- [Firebase Setup](#-firebase-setup)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality
- **Job Application Tracking**: Comprehensive tracking of job applications with status management
- **Interactive Dashboard**: Visual analytics with charts showing application statistics and trends
- **Company Directory**: Browse and manage information about potential employers
- **Notes System**: Keep detailed notes about interviews, companies, and applications

### 📚 Learning & Development
- **Video Tutorials**: Curated career development and technical skill videos
- **Knowledge Tools**: Collection of useful career resources and tools
- **Interview Preparation**: Custom question sets and practice materials
- **Knowledge Base**: Helpful articles and guides for job seekers

### 🔐 User Management
- **Firebase Authentication**: Secure user registration and login
- **Protected Routes**: Role-based access control for different sections
- **User Profiles**: Personalized user experience with profile management
- **Admin Features**: Administrative controls for content management

### 📊 Analytics & Reporting
- **Application Statistics**: Track response rates, interview conversion, and success metrics
- **Visual Charts**: Bar charts and doughnut charts for data visualization
- **Monthly Trends**: Track application patterns over time
- **Status Distribution**: Visualize application statuses and outcomes

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** - Modern JavaScript library for building user interfaces
- **React Router DOM 7.6.0** - Declarative routing for React applications
- **Framer Motion 12.12.1** - Production-ready motion library for React
- **Lucide React 0.510.0** - Beautiful & consistent icon toolkit
- **Chart.js 4.4.9** & **React-ChartJS-2 5.3.0** - Interactive charts and data visualization
- **Recharts 2.15.3** - Composable charting library built on React components

### Backend & Database
- **Firebase 11.7.3** - Complete backend-as-a-service platform
  - **Firebase Authentication** - User authentication and authorization
  - **Cloud Firestore** - NoSQL document database
  - **Firebase Storage** - File storage for media uploads
  - **Firebase Hosting** - Web hosting service

### Development Tools
- **React Scripts 5.0.1** - Configuration and scripts for Create React App
- **TailwindCSS 4.1.7** - Utility-first CSS framework
- **PostCSS 8.5.3** & **Autoprefixer 10.4.21** - CSS processing tools

### Additional Libraries
- **HTML2PDF.js 0.10.3** - Generate PDFs from HTML content
- **Web Vitals 2.1.4** - Essential metrics for user experience

## 📁 Project Structure

```
src/
├── component/                  # React Components
│   ├── Header.jsx             # Navigation header with dropdowns
│   ├── Footer.jsx             # Application footer
│   ├── Dashboard.jsx          # Main dashboard with analytics
│   ├── Joblist.jsx           # Job applications management
│   ├── Notes.jsx             # Notes and documentation system
│   ├── Knowledge.jsx         # Knowledge tools and resources
│   ├── Tutorial.jsx          # Video tutorials management
│   ├── InterviewPrep.jsx     # Interview preparation tools
│   ├── CompanyDirectory.jsx  # Company information management
│   ├── KnowledgeBaseArticle.jsx # Knowledge base articles
│   └── ITSupportPage.jsx     # IT support resources
├── context/                   # React Context Providers
│   └── AuthContext.js        # Authentication context and state management
├── styles/                    # CSS Stylesheets
│   ├── index.css             # Global styles
│   ├── Header.css            # Header component styles
│   └── Dashboard.css         # Dashboard component styles
├── firebase.js               # Firebase configuration and initialization
├── App.js                   # Main application component and routing
└── index.js                 # Application entry point

public/
├── index.html               # HTML template
├── favicon.ico             # Application favicon
└── manifest.json           # Progressive Web App manifest
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account for backend services

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/job-tracker.git
   cd job-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## ⚙️ Configuration

### Firebase Configuration

The application uses Firebase for authentication and data storage. Update the `src/firebase.js` file with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### Firestore Database Structure

The application uses the following Firestore collections:

```
/users/{userId}
  - displayName: string
  - email: string
  - createdAt: timestamp
  - lastLogin: timestamp
  - applications: number

/applications/{applicationId}
  - userId: string
  - jobTitle: string
  - companyName: string
  - status: string
  - appliedDate: date
  - followUpCompleted: boolean
  - notes: string
  - createdAt: timestamp
  - updatedAt: timestamp

/companies/{companyId}
  - companyName: string
  - description: string
  - location: string
  - serviceType: string
  - website: string
  - createdAt: timestamp

/tutorials/{tutorialId}
  - title: string
  - description: string
  - category: string
  - subcategory: string
  - videoType: string
  - videoUrl: string
  - thumbnailUrl: string
  - createdAt: timestamp
```

## 📖 Usage

### Getting Started

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Dashboard**: View your application statistics and trends
3. **Add Applications**: Track new job applications with detailed information
4. **Manage Companies**: Browse and add company information
5. **Take Notes**: Keep detailed records of interviews and interactions
6. **Learn**: Access tutorials and knowledge resources

### Key Features Usage

#### Job Application Management
- Add new applications with company details, job titles, and status
- Update application status (Not Applied, Applied, Interview, Offer, Rejected)
- Set follow-up reminders and track completion
- Search and filter applications by various criteria

#### Dashboard Analytics
- View application statistics and success rates
- Monitor monthly application trends
- Analyze status distribution with interactive charts
- Track response rates and interview conversion

#### Knowledge Tools
- Access curated career development resources
- Browse tools by category (Development, Learning, Interview Prep)
- Click on tools to access external resources
- Filter tools by type and relevance

## 🧩 Components Overview

### Core Components

**Header.jsx**
- Navigation with dropdown menus
- User authentication controls
- Mobile-responsive design
- Admin and user role management

**Dashboard.jsx**
- Analytics dashboard with Chart.js integration
- Real-time statistics from Firestore
- Monthly trend visualization
- Application status distribution

**Joblist.jsx**
- Comprehensive job application management
- Advanced search and filtering
- Status updates and follow-up tracking
- Export functionality for applications

**AuthContext.js**
- Centralized authentication state management
- Firebase Auth integration
- User profile management
- Protected route handling

### Feature Components

**Tutorial.jsx**
- Video tutorial management system
- Category-based organization
- YouTube and file upload support
- Admin controls for content management

**Knowledge.jsx**
- Curated tool and resource database
- Category filtering and search
- External link management
- Resource recommendations

**CompanyDirectory.jsx**
- Company information management
- Service type categorization
- Location-based filtering
- Admin controls for company data


## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication, Firestore, and Storage

### 2. Configure Authentication
```javascript
// Enable Email/Password authentication
// Set up authentication rules in Firebase Console
```

### 3. Set Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Applications are user-specific
    match /applications/{applicationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Companies are readable by all authenticated users
    match /companies/{companyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Restrict to admins in production
    }
  }
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or
yarn build
```

### Deploy to Cloudflare Hosting ##

### Deploy to Other Platforms
- **Netlify**: Connect your GitHub repository for automatic deployments
- **Vercel**: Import project and deploy with zero configuration
- **Heroku**: Use the Node.js buildpack for deployment

## 🤝 Contributing

We welcome contributions to JobTrack! Here's how you can help:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



### Bug Reports
- Use the GitHub Issues template
- Include steps to reproduce
- Provide browser and system information
- Include screenshots if applicable

## 📄 License

This project is licensed under the SCT  file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/job-tracker/issues) page
2. Create a new issue with detailed information
3. Join our community discussions
4. Contact the maintainers

## 🙏 Acknowledgments

- **Firebase** for providing excellent backend services
- **React Team** for the amazing frontend framework
- **Chart.js** for beautiful data visualization
- **Lucide** for the clean and consistent icon set
- **TailwindCSS** for the utility-first styling approach


🎯 THE COMPLETE PICTURE - How Everything Connects
🔵 LAYER 1: YOU (The User)

What you do: Open your web browser and visit the JobTrack website
What happens: Your browser loads the React application from Firebase Hosting
Who you talk to: The main App.js component becomes your gateway to everything


🔵 LAYER 2: FRONTEND - React Components (What You See & Click)
🏠 App.js - The Master Controller

Role: Like the main receptionist who directs you to different departments
Who it talks to:

Router system (decides which page to show you)
AuthContext (checks if you're logged in)
All other components (Header, Dashboard, etc.)


What it does: Protects certain pages (you can't see Dashboard without logging in)

🧭 Header.jsx - The Navigation Bar

Role: Like the menu bar in a restaurant - shows you all available options
Who it talks to:

AuthContext (to know if you're logged in)
Login/Register modals (when you click login)
All page components (when you click navigation links)


What it shows: Different menus for regular users vs admins

📊 Dashboard.jsx - Your Command Center

Role: Like your personal control panel showing all your job hunt statistics
Who it talks to:

AuthContext (to know whose data to show)
Applications Collection in Firebase (to count your applications)
Chart.js library (to draw pretty graphs)


What it calculates:

Total applications you've submitted
How many interviews you got
Your success rate month by month
Visual charts showing your progress



📋 Joblist.jsx - Your Application Manager

Role: Like a filing cabinet for all your job applications
Who it talks to:

Applications Collection (to save/load your applications)
Companies Collection (to link applications to companies)
AuthContext (to make sure you only see YOUR applications)


What you can do:

Add new job applications
Update status (Applied → Interview → Offer)
Mark follow-ups as complete
Search and filter your applications



🏢 CompanyDirectory.jsx - The Company Database

Role: Like a phone book of companies you might want to work for
Who it talks to:

Companies Collection (to load company information)
AuthContext (admins can add/edit, users can only view)


What it shows: Company details, locations, what services they offer

🎥 Tutorial.jsx - Your Learning Library

Role: Like Netflix but for career development videos
Who it talks to:

Tutorials Collection (to load video information)
Firebase Storage (where video files and thumbnails are stored)
YouTube API (for YouTube videos)
AuthContext (admins can upload, users can watch)



🛠️ Knowledge.jsx - Your Tool Box

Role: Like a curated list of useful websites and tools
Who it talks to:

External websites (when you click on tool links)
Built-in database of tool information


What it provides: Links to coding tools, interview prep sites, learning platforms

📝 Notes.jsx - Your Personal Journal

Role: Like a private diary for your job search thoughts
Who it talks to:

Notes Collection (to save your notes)
AuthContext (to make sure you only see YOUR notes)




🔵 LAYER 3: AUTHENTICATION SYSTEM - The Security Guard
🔐 AuthContext.js - The Identity Manager

Role: Like a security guard who remembers who you are
Who it talks to:

Firebase Authentication (to verify your login)
Every component that needs to know who you are
Users Collection (to store your profile information)


What it tracks:

Whether you're logged in or not
Your user information (name, email, role)
Whether you're an admin or regular user



🚪 Login/Register Modals - The Entry Points

Role: Like the front door registration desk
Who they talk to:

Firebase Authentication (to create accounts or verify logins)
AuthContext (to update your login status)
Users Collection (to save your profile)




🔵 LAYER 4: FIREBASE BACKEND - The Behind-the-Scenes Workers
🔐 Firebase Authentication Service

Role: Like a bank that verifies your identity
Who it talks to:

Your login forms
AuthContext
Users Collection (to create profiles for new users)


What it manages:

Account creation
Password verification
Forgot password emails
Login sessions



📊 Cloud Firestore Database - The Filing System
This is like a giant digital filing cabinet with separate drawers:
👥 Users Collection (Your Profile Drawer)

What's stored: Your name, email, when you joined, last login
Who can access: Only you can see your profile
Connected to: All your applications, notes, and activities

📋 Applications Collection (Your Job Hunt Drawer)

What's stored: Every job you've applied to with all details
Who can access: Only you can see your applications
Connected to: Your user profile and company information

🏢 Companies Collection (The Company Directory Drawer)

What's stored: Information about companies (name, location, services)
Who can access: Everyone can read, only admins can add/edit
Connected to: Your job applications reference companies here

🎥 Tutorials Collection (The Learning Library Drawer)

What's stored: Video information, descriptions, categories
Who can access: Everyone can watch, only admins can upload
Connected to: Video files stored in Firebase Storage

📝 Notes Collection (Your Personal Thoughts Drawer)

What's stored: All your private notes and thoughts
Who can access: Only you can see your notes
Connected to: Your user profile

📁 Firebase Storage - The Media Warehouse

Role: Like a warehouse for storing files
What it stores:

Video files uploaded by admins
Thumbnail images for videos
Any documents or images users upload


Who it talks to:

Tutorial component (when displaying videos)
Upload forms (when saving new files)



🌐 Firebase Hosting - The Web Server

Role: Like the post office that delivers your website to users
What it does: Serves your entire React application to users' browsers


🔵 LAYER 5: EXTERNAL SERVICES - The Outside World
📺 YouTube API

Role: Connects to YouTube to display embedded videos
When used: When tutorials reference YouTube videos instead of uploaded files

🌍 External Career Tools

Role: Various websites and tools linked from the Knowledge section
Examples: LinkedIn, coding platforms, interview prep sites


🔄 THE DATA FLOW - Step by Step Journey
When You Log In:

You type email/password → Login Modal
Login Modal → Firebase Authentication (verifies credentials)
Firebase Auth → AuthContext (updates your login status)
AuthContext → Users Collection (loads your profile)
AuthContext → All Components (tells them you're logged in)
Header updates to show your name and logout option

When You Add a Job Application:

You fill out the form → Joblist Component
Joblist → AuthContext (gets your user ID)
Joblist → Applications Collection (saves new application with your ID)
Applications Collection → Dashboard (updates your statistics)
Dashboard → Chart.js (redraws your progress charts)

When You View Your Dashboard:

Dashboard → AuthContext (gets your user ID)
Dashboard → Applications Collection (loads all your applications)
Dashboard → Chart.js (processes data into visual charts)
Charts display your job hunt statistics

When Admin Uploads a Tutorial:

Admin fills form → Tutorial Component
Tutorial → AuthContext (verifies admin status)
Tutorial → Firebase Storage (uploads video file)
Firebase Storage → Tutorial Component (returns file URL)
Tutorial → Tutorials Collection (saves video info with file URL)
All users can now see the new tutorial


🔒 SECURITY & PERMISSIONS - Who Can Do What
🔐 Authentication Rules:

Not logged in: Can only see login/register pages
Logged in user: Can see dashboard, manage their own applications/notes
Admin user: Can upload tutorials, manage company directory

📊 Database Security:

Your applications: Only YOU can see and edit them
Your notes: Only YOU can see and edit them
Companies: Everyone can read, only admins can modify
Tutorials: Everyone can watch, only admins can upload


Think of it like a smart office building: You (the user) enter through the front door (login), the receptionist (App.js) directs you to different departments (components), each department has its own filing system (Firebase collections), and security guards (AuthContext) make sure you only access what you're allowed to see!
---

**Built with ❤️ by the JobTrack Team**

*Happy job hunting! 🎯*
