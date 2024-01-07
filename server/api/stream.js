import express from "express"
import { getHLS } from "../scrapers/vidsrc.js";
import { get } from "mongoose";

const router = express.Router()

router.get("/source", async (req, res) => {
    const imdb = req.query.id;
    const season = req.query.season
    const episode = req.query.episode

    let hls

    console.log(imdb);

    try {
        if (season != null && episode != null) {
            hls = await getHLS(`https://vidsrc.to/embed/tv/${imdb}/${season}/${episode}`)
        }
        else {
            hls = await getHLS(`https://vidsrc.to/embed/movie/${imdb}`)
        }
    }
    catch(err) {
        console.log(err);
        hls = false
    }

    console.log("HLS Ready!");

    res.end(hls)
})

export default router