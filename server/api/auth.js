import express from "express"
import { getHLS } from "../scrapers/vidsrc.js";

const router = express.Router()

router.post("/login", async (req, res) => {
    const credientals = req.body

    if (credientals.user == "admin" && credientals.password == "sml12345") {
        res.json({
            success: true,
            user: "admin",
            role: "admin",
            message: "Welcome, admin",
            key: "iubfawtd678d90a8lcdkmnion12123kjbnad0u92io1n"
        })
    }
    else {
        res.json({
            success: false,
            message: "⛔ Access Denied ⛔",
        })
    }
})

export default router