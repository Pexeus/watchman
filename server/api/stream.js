import express from "express"
import embed from "../scrapers/embed.js";

const router = express.Router()

router.get("/source/:id", async (req, res) => {
    const id = req.params.id;
    const hls = await embed.hls(id)

    res.end(hls)
})

export default router