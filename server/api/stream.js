import express from "express"
import embed from "../scrapers/embed.js";

const router = express.Router()

router.get("/source", async (req, res) => {
    const imdb = req.query.id;
    const season = req.query.season
    const episode = req.query.episode

    let id

    console.log(episode);

    if (season != undefined && episode != undefined) {
        id = `/tv?id=${imdb}&s=${season}&e=${episode}`
    }
    else {
        id = `/movie?id=${imdb}`
    }

    console.log(id);

    console.log("getting HLS source for", id);

    const hls = await embed.hls(id)

    res.end(hls)
})

export default router