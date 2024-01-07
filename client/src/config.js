import axios from "axios"
import { getAuth } from "./auth"

const config = {
    tmbdKey: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjRhZWI3Y2RjYzg1YjEyNjk4MTI1M2IxZTIwZWI3NCIsInN1YiI6IjY0N2I5OGEzY2FlZjJkMDExOWJmYjMxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jg6SVNttYN64_emD9BG37QTl65u_Zdhhp7mrSicltd8",
    backendUrl: `http://verion.ch:3000`,
    proxyUrl: `http://verion.ch:8000`,
    interfaces: {
        tmdb: false,
        api: false,
    }
}

config.interfaces.tmdb = createTmbdInterface()
config.interfaces.api = createApiInterface()
config.auth = getAuth()

function createTmbdInterface() {
    return axios.create({
        headers: {
            Authorization: `Bearer ${config.tmbdKey}`,
        }
    })
}

function createApiInterface() {
    console.log(config);
            
    return axios.create({
        baseURL: `${config.backendUrl}/api`
    })
}

export default config