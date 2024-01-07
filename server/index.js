import hlsProxy from "./proxy/server.js";
import express from "express";
import bodyParser from "body-parser";

import stream from "./api/stream.js"
import auth from "./api/auth.js"

import {initiateBrowser} from "./scrapers/vidsrc.js";
import cors from "cors"

const port = 80
const app = express()

app.use(bodyParser.json());

app.use(cors())
app.use("/api", stream)
app.use("/api/auth", auth)
app.use("/",express.static("../client/dist"));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.listen(port, async () => {
    hlsProxy("localhost", 8000)
    await initiateBrowser()

    console.log(`Server online on port ${port}`);
})