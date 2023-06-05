<template>
  <div>
    <input type="text" v-model="search.query" />
    <Feed :content="search.results"></Feed>
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
      results: []
    });

    const key = config.tmbdKey;

    watch(
      () => search.query,
      async (query, old) => {
        const url = `https://api.themoviedb.org/3/search/multi?query=${query}`;
        const res = await tmdb.get(url)


        search.results = res.data.results
      }
    );

    //search.query = "iron man"

    return { search };
  },
};
</script>
  