const jwt = require("jsonwebtoken")
const musicModel = require("../models/music.model")
const {uploadFile} = require("../services/storage.service")
const albumModel = require("../models/album.model")

async function createMusic(req,res) {

    const {title} = req.body;
    const file = req.file;
        if (!file) {
        return res.status(400).json({ message: "File is required" })
    }
// console.log(file)
const result = await uploadFile(file.buffer.toString("base64"))

const music = await musicModel.create({
    uri:result.url,
    title,
    artist:req.user.id
})

res.status(201).json({
    message:"Music created successfully",
    music:{
        id:music._id,
        title:music.title,
        uri:music.uri,
        artist:music.artist,
    }
})
}



async function createAlbum(req,res) {

        const{title,musics} = req.body

        const album = await albumModel.create({
            title,
            artist:req.user.id,
            musics:musics
        })

        res.status(201).json({message:"Album created successfully",
            album:{
                id:album._id,
                title:album.title,
                artist:album.artist,
                music:album.musics
            }
        })

}



async function getAllMusic(req,res) {
    const allmusics = await musicModel.find().populate("artist")

    res.status(200).json({message:"All music fetched successfully",
        musics:allmusics
    })
}


async function getAllAlbums(req,res) {
    const allAlbums = await albumModel.find().populate("artist").populate("musics")

    res.status(200).json({message:"All Albums fetched successfully",
        albums:allAlbums
    })
}

module.exports = {createMusic,createAlbum,getAllMusic,getAllAlbums}