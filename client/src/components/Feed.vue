<template>
  <div class="feed">
    <div class="item" v-for="content of feed.content" :key="content.id" @click="openPlayer(content)">
      <img :src="`https://image.tmdb.org/t/p/w300/${content.poster_path}`" />
    </div>
  </div>
</template>

<script>
import { reactive, watch } from "vue";
import config from "../config";
import { init } from "events";

export default {
  props: {
    content: Object,
    title: String,
    url: String
  },
  setup(props, context) {
    const feed = reactive({});
    const tmdb = config.interfaces.tmdb

    function openPlayer(content) {
      window.player.open(content)
    }

    async function init(){
      let res = await tmdb.get(props.url)
      feed.content = res.data.results
    }
    
    init()

    return { feed, openPlayer};
  },
};
</script>

<style scped>
.feed {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100vw;
  position: relative;
  height: 200px;
}

.item {
  margin: 10px;
  border-radius: 5px;
  height: 100%;
  box-shadow: 0px 0px 3px gray;
  cursor: pointer;
}

.item img {
  height: 100%;
  background-size: cover;
  border-radius: 5px;
}

h2 {
  float: left;
  margin-left: 15px;
  margin-top: 20px;
}
</style>