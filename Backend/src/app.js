const express = require("express")

const cookieParser = require("cookie-parser")

// for frontend and backend communication
const cors = require("cors")

const app = express();
app.use(express.json());
app.use(cookieParser());

// middleware for frontend and backend communication
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


/**
 * Routes
 */

const authRoutes = require('./routes/auth.routes')

app.use('/api/auth', authRoutes)



module.exports  = app;