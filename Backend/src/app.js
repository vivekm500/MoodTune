const express = require("express")

const cookieParser = require("cookie-parser")

require('dotenv').config()

// for frontend and backend communication
const cors = require("cors")

const app = express();
app.use(express.json());
app.use(cookieParser());

// middleware for frontend and backend communication
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));


/**
 * Routes
 */

const authRoutes = require('./routes/auth.routes')

app.use('/api/auth', authRoutes)

/**
 * song Routes
 */

const songRoutes = require('./routes/song.routes')

app.use('/api/songs', songRoutes)

module.exports  = app;