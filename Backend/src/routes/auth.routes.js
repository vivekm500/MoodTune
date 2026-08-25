const express = require("express")

const {Router} = require('express')

const router = Router();

const authController = require('../controllers/auth.controller')

const authMidleware = require('../middleware/auth.middleware')

/**
 * @route - post -> /api/auth/register
 * @description register user
 * @access private
 */
router.post('/register', authController.registerController)

/**
 * @route post -> /api/auth/login
 * @description user login
 * @access private
 */
router.post('/login', authController.loginController)


/**
 * @route get -> /api/auth/get-me
 * @description get the details of currently logged in user
 * @acess private
 */
router.get('/get-me', authMidleware.authUser, authController.getMeController)


/**
 * @route get -> /api/auth/logout
 * @description logout the currently loggedin user
 * @access private
 */
router.get('/logout', authMidleware.authUser, authController.logOutController)



module.exports = router