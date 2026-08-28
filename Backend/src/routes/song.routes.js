const express = require("express")

const {Router} = require("express")

const router = Router()

const songController = require('../controllers/song.conotroller')

const upload = require('../middleware/upload.middleware')

/**
 * post -> '/api/songs'
 * 
 */
router.post('/', upload.single("song"), songController.uploadSong )

/**
 * @route get -> "/api/songs"
 * @description get songs by mood
 */
router.get('/', songController.getSong)

module.exports = router