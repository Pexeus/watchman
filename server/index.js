import hlsProxy from "./proxy/server.js";
import express from "express";
import imdb from 'imdb-api'

import stream from "./api/stream.js"
import embed from "./scrapers/embed.js";
import cors from "cors"


const port = 80
const app = express()

app.use(cors())
app.use("/api", stream)


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

hlsProxy("localhost", 8000)

app.listen(port, async () => {
    console.log(`Server online on port ${port}`);

    await embed.init()
})