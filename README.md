# 🎵 MoodTune

**MoodTune** is a full-stack mood-based music streaming web application
that lets users discover and play songs based on their mood.

The project was built to understand how a complete production-oriented
application works across the frontend, backend, database,
authentication, file processing, cloud storage, security, and deployment
layers.

## 🔗 Links

-   **Live Demo:** https://mood-tune-neon.vercel.app
-   **GitHub:** https://github.com/vivekm500/MoodTune

------------------------------------------------------------------------

## ✨ Features

### 🎧 Music & Mood Discovery

-   Discover songs based on mood
-   Play songs directly from the application
-   Retrieve songs through backend REST APIs
-   Support for multiple songs per mood
-   Fallback logic when excluding the currently playing song

### 🔐 Authentication & Security

-   User registration and login
-   JWT-based authentication
-   Protected frontend routes
-   Authentication state managed with React Context API and custom hooks
-   Redis-based JWT token blacklisting for token revocation during
    logout
-   Credential-aware frontend/backend communication

### 📁 Music Upload & Processing

-   MP3 uploads using multipart/form-data
-   File handling with Multer
-   MP3 metadata extraction using ID3 tags
-   Embedded album artwork extraction
-   Audio files and posters uploaded to cloud storage
-   Song metadata and storage URLs persisted in MongoDB

### ☁️ Production Deployment

-   Frontend deployed on Vercel
-   Backend deployed on Render
-   Separate frontend/backend environment configuration
-   Production CORS configuration
-   Production API URL configuration

------------------------------------------------------------------------

## 🏗️ Architecture

MoodTune follows a layered full-stack architecture:

``` text
React + Vite Frontend
        ↓
Custom Hooks / Context / Axios
        ↓
Express REST APIs
        ↓
Routes / Controllers / Business Logic
        ↓
   ┌────┴─────┐
   ↓          ↓
MongoDB     Redis
/Mongoose   Token Blacklist
   ↓
Cloud Storage
Songs + Posters
```

### Authentication Flow

``` text
User Login
    ↓
React Login Form
    ↓
Auth Hook
    ↓
Axios API Request
    ↓
Express Authentication Route
    ↓
JWT Generation
    ↓
Authentication Cookie
    ↓
Protected API Requests
    ↓
JWT Verification
    ↓
User Access
```

### Logout / Token Revocation

``` text
User Logout
    ↓
Backend receives JWT
    ↓
Token added to Redis blacklist
    ↓
Future requests check blacklist
    ↓
Blacklisted token rejected
```

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

  Technology     Purpose
  -------------- ----------------------------
  React          User interface
  Vite           Frontend tooling and build
  React Router   Client-side routing
  Axios          API communication
  Context API    Authentication state
  SCSS           Styling

### Backend

  Technology   Purpose
  ------------ -------------------------------------
  Node.js      JavaScript runtime
  Express.js   REST API framework
  MongoDB      Database
  Mongoose     MongoDB ODM
  Redis        JWT token blacklisting
  Multer       Multipart file uploads
  JWT          Authentication
  node-id3     MP3 metadata and artwork extraction

### Deployment & Storage

  Technology      Purpose
  --------------- --------------------------
  Vercel          Frontend deployment
  Render          Backend deployment
  Cloud Storage   Audio and poster storage

------------------------------------------------------------------------

## 📂 Project Structure

``` text
MoodTune/
│
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   ├── server.js
│   ├── package.json
│   └── ...
│
└── README.md
```

> Folder names may evolve as the project grows.

------------------------------------------------------------------------

## 🔌 API Overview

MoodTune exposes REST APIs for authentication and music functionality.

### Authentication

``` text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/get-me
GET    /api/auth/logout
```

### Songs

The backend provides endpoints for:

-   Uploading songs
-   Retrieving songs by mood
-   Excluding the currently playing song when requesting another song

Example:

``` text
GET /api/songs?mood=happy
```

> API paths may evolve as the project develops.

------------------------------------------------------------------------

## 🎵 Music Upload Pipeline

``` text
MP3 Upload
    ↓
Multer
    ↓
Read File Buffer
    ↓
Extract ID3 Metadata
    ↓
Extract Embedded Artwork
    ↓
Upload Audio → Cloud Storage
    ↓
Upload Artwork → Cloud Storage
    ↓
Save Metadata + URLs → MongoDB
```

This workflow provides hands-on experience with binary files, metadata
extraction, multipart uploads, asynchronous operations, and cloud
storage.

------------------------------------------------------------------------

## 🔐 Security

MoodTune uses several mechanisms to improve application security:

-   JWT-based authentication
-   Protected API routes
-   Protected frontend routes
-   Credential-aware requests
-   Redis token blacklisting
-   Environment variables for secrets
-   CORS configuration between frontend and backend

### Redis Token Blacklisting

JWTs are normally stateless, which makes immediate token revocation
difficult.

MoodTune uses Redis to maintain a blacklist of revoked tokens.

``` text
JWT
 ↓
Redis Blacklist
 ↓
Future authentication check
 ↓
Token rejected
```

This provides a mechanism for invalidating tokens before their normal
expiration.

> Security configuration should still be reviewed and hardened before
> treating the application as a production-grade security
> implementation.

------------------------------------------------------------------------

## 🌐 Deployment

### Frontend

**Platform:** Vercel

https://mood-tune-neon.vercel.app/

### Backend

**Platform:** Render

https://moodtune-inkj.onrender.com

The production frontend communicates with the deployed backend through
`VITE_BACKEND_URL`.


------------------------------------------------------------------------

## 🧠 Key Learnings

Building MoodTune helped me understand:

-   Frontend/backend communication
-   REST API design with Express
-   Authentication state management in React
-   JWT authentication and token lifecycle
-   Redis-based token revocation
-   MongoDB and Mongoose
-   Multipart file uploads
-   MP3 metadata and artwork extraction
-   Cloud storage integration
-   CORS and environment variables
-   Local vs. production debugging
-   Separate frontend/backend deployment

The biggest takeaway was that full-stack development is less about
individual technologies and more about **how those technologies
communicate and work together**.

------------------------------------------------------------------------

## 🔮 Future Improvements

-   Improved recommendation logic
-   Better error handling
-   Performance optimization
-   More robust authorization
-   Stronger production security
-   Improved API validation
-   Better caching strategies
-   Improved UI/UX
-   Expanded music discovery features
-   More scalable backend architecture

------------------------------------------------------------------------

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

``` bash
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

Then open a Pull Request.


------------------------------------------------------------------------

## 👨‍💻 Author

**Vivek Kumar**

-   GitHub: https://github.com/vivekm500
-   Project: https://github.com/vivekm500/MoodTune
-   Live Demo: https://mood-tune-neon.vercel.app/

------------------------------------------------------------------------

## ⭐ Support

If you find MoodTune interesting, consider giving the repository a ⭐ on
GitHub.

Feedback on the **architecture, security, performance, and scalability**
of the project is especially welcome.
