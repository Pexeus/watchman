<template>
  <div class="content">
    <Search></Search>
      <Feed v-for="feed of data.feeds" :key="data.feeds.indexOf(feed)" :content="feed" title="TITLE"></Feed>
    



  </div>
</template>
  
  <script>
import config from "../config";
import Search from "./Search.vue";
import Feed from "./Feed.vue"
import { reactive } from "vue"

export default {
  name: "Home",
  components: {
    Search,
    Feed
  },
  setup() {
    const data = reactive({
                        feeds:[],
                        genres: {},
                        max_feeds: 0
                      })

    let baseUrl = "https://api.themoviedb.org/3/"
    let tmdb = config.interfaces.tmdb

    const params = ["tv","movie"]

    let max = 9 // max. amount of feeds generated
    data.max_feeds = max

    // t = target
    // ( 1 => movies, 0 => tv shows)
    function getPopular(t) {
      return new Promise(async resolve => {
        let url = baseUrl + `${params[t]}/popular`
        let res = await tmdb.get(url)
        resolve(res.data.results)
      })
    }

    // t = target
    // f = filter 
    // ex.  getFeed(0, {genres:[]})
    //      getFeed(0, {popular:true})
    function getFeed(t, f) {
      return new Promise(async resolve => {
        let url = baseUrl + `discover/${params[t]}`

        let res = await tmdb.get(url)

        resolve(res.data.results)
      })
    }

    function getGenres(t) {
      return new Promise(async resolve => {
        let mode
        let url
        let res

        url = baseUrl+`genre/${params[t]}/list`
        res = await tmdb.get(url)
        resolve(res.data.genres)
      })
      
    }

    async function prepareFeeds() {
      for(let i=0;i<max;i++) {
        if(i == 0) {
          // popular feed
          let popular = await getPopular(r())
          data.feeds.push(popular)

          console.log(data)
        }
        else {
          // genre based feeds (very much unfinished)
          let rndm = r()
          let filters = rElemsFromArr(data.genres[params[rndm]], 3)
          let f = await getFeed(rndm, filters)
          data.feeds.push(f)
        }
      }
    }

    function r() {
      return Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    }

    function rElemsFromArr(a, n) {
      const result = []
      const length = a.length

      if (n >= length) {
        return a.slice()
      }

      for (let i = 0; i < n; i++) {
        const randomIndex = Math.floor(Math.random() * length)
        result.push(a[randomIndex])
      }

      return result
    }

    window.onload = async () => {
      // init
      data.genres["movie"] = await getGenres(1)
      data.genres["tv"] = await getGenres(0)
      prepareFeeds()
      
      
    }

  

    
    
    return { data }
  },
};
</script>
  
  <style>
</style>
  