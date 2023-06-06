<template>
  <div>
    <input type="text" v-model="search.query" />
    <Feed :title="`Results for ${search.query}`" :url="search.url"></Feed>
  </div>
</template>
  
<script>
import config from "../config";
import { reactive, watch } from "vue";
import Feed from "./Feed.vue";


export default {
  name: "Search",
  components: {
    Feed
  },
  setup() {
    const tmdb = config.interfaces.tmdb
    const search = reactive({
      query: "",
      url: ""
    });

    const key = config.tmbdKey;

    watch(
      () => search.query,
      async (query, old) => {
        search.url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}`;
        const res = await tmdb.get(search.url)

        console.log(res);
      }
    );

    search.query = "mr robot"

    return { search };
  },
};
</script>
  