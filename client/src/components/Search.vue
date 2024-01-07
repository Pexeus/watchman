<template>
  <div>
    <div class="input">
      <input type="text" v-model="search.query" placeholder="search" />
    </div>
    <Feed v-if="search.query != ''" :title="`Results for ${search.query}`" :url="search.url"></Feed>
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
      }
    );

    search.query = ""

    return { search };
  },
};
</script>

<style scoped>
.input {
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input input {
  border: 0;
  background-color: var(--gray1);
  color: var(--white);
  padding: 15px;
  padding-left: 50px;
  padding-right: 50px;
  font-size: large;
  outline: none;
  border-radius: 5px;
  min-width: 40%;
  text-align: center;
}
</style>
  