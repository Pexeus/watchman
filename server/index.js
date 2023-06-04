import hlsProxy from "./proxy/server.js";
import express from "express";
import imdb from 'imdb-api'

import stream from "./api/stream.js"
import embed from "./scrapers/embed.js";


const port = 80

const app = express()
app.use("/stream", stream)

hlsProxy("0.0.0.0", 8000)

app.listen(port, async () => {
    console.log(`Server online on port ${port}`);
    
    await embed.init()
})