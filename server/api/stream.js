import express from "express"
import embed from "../scrapers/embed.js";

const router = express.Router()

router.get("/source/:id", async (req, res) => {
    const id = req.params.id;
    console.log("getting HLS source for", id);

    const hls = await embed.hls(id)

    res.end(hls)
})

export default router