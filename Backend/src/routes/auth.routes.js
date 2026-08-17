const express = require("express")

const {Router} = require('express')

const router = Router();

const authController = require('../controllers/auth.controller')

/**
 * @route - 
 * @description register user
 * 
 */
router.post('/register', authController.registerController)

/**
 * @route 
 * @description
 */
router.post('/login', authController.loginController)

module.exports = router