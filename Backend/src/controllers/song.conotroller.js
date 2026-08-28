const mongoose = require('mongoose')

const songModel = require('../models/song.model')

// need to install node-id3 package to read the tags from the uploaded song file
const id3 = require('node-id3')

const storageService = require('../services/storage.sevice')

// upload song
async function uploadSong(req, res){

    const {mood} = req.body

    const songBuffer = req.file.buffer
    // read the tags from the uploaded song file using node-id3
    const tags = id3.read(songBuffer)

    console.log(tags)

    const [songFile, posterFile] = await Promise.all([
      storageService.uploadFile({
        buffer: songBuffer,
        filename: tags.title + ".mp3",
        folder: "/cohort-2/MoodTune/songs",
      }),

      storageService.uploadFile({
        buffer: tags.image.imageBuffer,
        filename: tags.title + ".jpeg",
        folder: "cohort-2/MoodTune/posters",
      }),
    ]);

    const song = await songModel.create({
        title: tags.title,
        url: songFile.url,
        posterUrl: posterFile.url,
        mood
    })

    res.status(201).json({
        message: "song created successfully",
        song
    })
}


// get song bu mood
async function getSong(req,res){

  const {mood} = req.query

  const song  = await songModel.findOne({mood})

  res.status(200).json({
    message: "song fetched successfully.",
    song
  })


}

module.exports = {
    uploadSong,
    getSong
}
