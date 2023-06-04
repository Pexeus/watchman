<template>
  <div>
    <input type="text" v-model="search.query" />
    <div class="results">
        <div class="result" v-for="result of search.results" :key="result.id">
            <img :src="`https://image.tmdb.org/t/p/w300/${result.poster_path}`">
        </div>
    </div>
  </div>
</template>
  
<script>
import config from "../config";
import { reactive, watch } from "vue";
import axios from "axios"


export default {
  name: "Search",
  setup() {
    console.log(config);
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

        console.log(res);

        search.results = res.data.results
      }
    );

    search.query = "iron man"

    return { search };
  },
};
</script>

<style scoped>
    .results {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        position: relative;
        height: 200px;
    }

    .result {
        margin: 10px;
        border-radius: 5px;
        height: 100%;
        box-shadow: 0px 0px 3px gray;
        cursor: pointer;
    }

    .result img {
        height: 100%;
        background-size: cover;
        border-radius: 5px;
    }
</style>
  