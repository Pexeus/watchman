import mongoose from "mongoose"

const url = "mongodb+srv://admin:sml12345@watchman.hxbqjw1.mongodb.net/?retryWrites=true&w=majority"

async function connect() {
    await mongoose.connect(url)

    console.log("connected to:", url);

    return true
}

async function tests() {
    await connect()

    const schema = new mongoose.Schema({
        key: Number,
        value: String
    }, {timestamps: true})

    const Testmodel = mongoose.model('Testmodel', schema)

    const newTestmodel = new Testmodel({
        key: 1337,
        value: 'Ligma'
    })

    await newTestmodel.save()

    const t0 = Date.now()
    const results = await Testmodel.find()

    console.log(results, Date.now() - t0);
}

tests()