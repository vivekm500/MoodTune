const userModel = require('../models/user.model')

const bcrypt = require('bcryptjs')


const jwt = require('jsonwebtoken')

const blacklistModel = require('../models/blacklist.model')

const redis = require("../config/cache");


// register controller

async function registerController(req,res){

    const {username, email, password} = req.body;

    const isAlreadyExist = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(isAlreadyExist){
        return res.status(400).json({
            message: "user already exist with this email or username"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    // save hashed password into the password field (model expects `password`)
    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    // create JWT token with user id and username
    const payload = { id: user._id, username: user.username }
    const jwtSecret = process.env.JWT_SECRET
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '3d' })

    // set token in an httpOnly cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    // respond with created user (exclude password/hash)
    const userResponse = { id: user._id, username: user.username, email: user.email }
    return res.status(201).json({ message: 'user registered', user: userResponse })
}

// login

async function loginController(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  }).select("+password")

  if (!user) {
    return res.status(400).json({
      message: "Invalid credential",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  // create JWT token with user id and username
  const payload = { id: user._id, username: user.username };
  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, jwtSecret, { expiresIn: "3d" });

  // set token in an httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  return res.status(200).json({
    message: "user loggedIn successfully",
    userResponse
  })
}



// getMeController
async function getMeController(req, res){
  
   const user = await userModel.findById(req.user.id)

   return res.status(201).json({
    message: "user fetched successfully",
    user
   })
}


// logOutController
async function logOutController(req, res){

  const token = req.cookies.token

  res.clearCookie("token")

  // token is set in redis as key time as value and it will expire in 1 hour
  await redis.set(token, Date.now().toString(), "EX", 60*60)

  // await blacklistModel.create({
  //   token
  // })

  res.status(201).json({
    message: "loggedout successfully"
  })
}

module.exports = { 
  registerController,
  loginController,
  getMeController,
  logOutController
 }