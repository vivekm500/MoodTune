const userModel = require('../models/user.model')
const blacklistModel = require('../models/blacklist.model')

const jwt = require('jsonwebtoken')

async function authUser(req, res, next){

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "token not provided"
        })
    }

    // check if the token is blacklisted
    const isTokenBlacklisted = blacklistModel.findOne({
        token
    })

    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "token invalid"
        })
    }

    try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded; // created a new property user in req

    next(); // next jo v iss function ko call krega ye new property wo req se use kr sakta h
    }
    catch(err){
        return res.status(401).json({
            message: "Invalid Token"
        })
    }


}


module.exports = {authUser}