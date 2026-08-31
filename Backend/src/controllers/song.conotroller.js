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


// get song by mood
async function getSong(req,res){
  const { mood, excludeSongId } = req.query
  const filter = { mood }

  // Prefer a different song for the same mood when the current song is known.
  if (excludeSongId && mongoose.isValidObjectId(excludeSongId)) {
    filter._id = { $ne: new mongoose.Types.ObjectId(excludeSongId) }
  }

  let [song] = await songModel.aggregate([
    { $match: filter },
    { $sample: { size: 1 } },
  ])

  // A mood with only one song should remain playable instead of returning nothing.
  if (!song && filter._id) {
    [song] = await songModel.aggregate([
      { $match: { mood } },
      { $sample: { size: 1 } },
    ])
  }

  if (!song) {
    return res.status(404).json({ message: 'No song found for this mood.' })
  }

  res.status(200).json({
    message: "song fetched successfully.",
    song
  })


}

module.exports = {
    uploadSong,
    getSong
}
