<template>
  <div class="content">
    <!--<Search></Search>-->
      <div class="feeds" v-if="data.feeds.length > 1">
        <Feed :title="data.popular_feed.title" :url="data.popular_feed.url"></Feed>
        <Feed v-for="feed of data.feeds" :url="feed.url" :title="feed.title" :key="data.feeds.indexOf(feed)"></Feed>
      </div>



    



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
    //Search,
    Feed
  },
  setup() {
    const data = reactive({
                        feeds:[],
                        popular_feed: {
                          title: "",
                          url: ""
                        },
                        genres: {},
                        max_feeds: 0,
                        url: {
                          base: "https://api.themoviedb.org/3/",
                          defaultParams: "?language=en-US&page=1&sort_by=vote_average.desc"
                        },
                        api_params: ["tv","movie"],
                        ui_params: ["TV-Shows", "Movies"]
                      })

    let tmdb = config.interfaces.tmdb

    let max = 9 // max. amount of feeds generated
    data.max_feeds = max

    function getGenres(t) {
      return new Promise(async resolve => {
        let url
        let res

        url = data.url.base+`genre/${data.api_params[t]}/list`
        res = await tmdb.get(url)
        resolve(res.data.genres)
      })
      
    }

    function r() {
      return Math.floor(Math.random() * 2)
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

    function isEven(number) {
      if (number % 2 === 0) return 1
      else return 0
    }

    function buildPopularFeed() {
      let r_num = r()
      let obj = {
        title: "Popular " + data.ui_params[r_num],
        url : data.url.base + data.api_params[r_num]+'/popular' + data.url.defaultParams
      }
      data.popular_feed = obj
    }

    window.onload = async () => {
      // init
      buildPopularFeed()
      console.log(data)

      data.genres["movie"] = await getGenres(1)
      data.genres["tv"] = await getGenres(0)

      // loop through max feed count
      let b_elem
      for(let i=1;i<max;i++) {
        let r_elem = rElemsFromArr(data.genres[data.api_params[isEven(i)]],1)
        if(r_elem == b_elem) {
          r_elem = rElemsFromArr(data.genres[data.api_params[isEven(i)]],1)
        }
        b_elem = r_elem
        console.log(r_elem, b_elem)
        
        let obj = {
          url: data.url.base + data.api_params[isEven(i)] + "/popular" + data.url.defaultParams + "&with_genres=" + r_elem[0].id,
          title:  r_elem[0].name + " " + data.ui_params[isEven(i)]
        }

        data.feeds.push(obj)
      }

    }

  

    
    
    return { data, r }
  },
};
</script>
  
  <style>
</style>
  