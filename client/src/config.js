import axios from "axios"

const config = {
    tmbdKey: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjRhZWI3Y2RjYzg1YjEyNjk4MTI1M2IxZTIwZWI3NCIsInN1YiI6IjY0N2I5OGEzY2FlZjJkMDExOWJmYjMxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jg6SVNttYN64_emD9BG37QTl65u_Zdhhp7mrSicltd8",
    proxyUrl: 'http://localhost:8000',
    interfaces: {
        tmdb: false,
        api: false,
    }
}

config.interfaces.tmdb = createTmbdInterface()
config.interfaces.api = createApiInterface()

function createTmbdInterface() {
    return axios.create({
        headers: {
            Authorization: `Bearer ${config.tmbdKey}`,
        }
    })
}

function createApiInterface() {
    return axios.create({
        baseURL: 'http://localhost/api'
    })
}

export default config