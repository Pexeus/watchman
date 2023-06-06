<template>
  <div>
    <h2>{{ title }}</h2>
    <div class="feed">
      <div class="item" v-for="content of feed.content" :key="content.id">
        <img
          :src="`https://image.tmdb.org/t/p/w300/${content.poster_path}`"
          @error="coverFallback"
          @click="openPlayer(content)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from "vue";
import config from "../config";
import fallbackCover from "@/assets/fallback-cover.jpg";

export default {
  props: {
    title: String,
    url: String,
    mediaType: String,
  },
  setup(props, context) {
    const feed = reactive({});
    const tmdb = config.interfaces.tmdb;

    function openPlayer(content) {
      console.log(content);
      window.player.open(content);
    }

    function coverFallback(e) {
      e.target.src = fallbackCover
    } 

    async function init() {
      if (props.url == "") {
        return
      }

      const res = await tmdb.get(props.url);
      let i = 0;

      for (let elem of res.data.results) {
        if (res.data.results[i].media_type == undefined) {
          res.data.results[i].media_type = props.mediaType;
        }

        i++;
      }
      feed.content = res.data.results;
    }

    watch(
      () => props.url,
      async () => {
        init()
      }
    );

    init()

    return { feed, openPlayer, coverFallback };
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