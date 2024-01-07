import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    token: String
})

const User = new mongoose.model('User', userSchema)

module.exports = User