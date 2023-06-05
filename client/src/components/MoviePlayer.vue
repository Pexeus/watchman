<template>
  <div class="moviePlayer">
    <video controls class="video-js vjs-default-skin vjs-16-9" id="video"></video>
    <div class="overview">
      <h1>{{ player.details.original_title }}</h1>
      <div class="tags">
        <div class="genre" v-for="genre of player.details.genres" :key="genre.id">
        {{ genre.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from "vue";
import videojs from "video.js";
import config from "../config";

export default {
  props: {
    content: {},
  },
  setup(props, content) {
    const player = reactive({
      details: false

    });

    const api = config.interfaces.api;
    const tmdb = config.interfaces.tmdb;
    const proxy = config.proxyUrl

    console.log(api);


    async function init() {
      const video = videojs("video");

      const res = await tmdb.get(`https://api.themoviedb.org/3/movie/${player.content.id}`)
      player.details = res.data

      //debug
      console.log(res.data);

      //get player source
      const sRes = await api.get(`/source/${player.details.imdb_id}`)

      console.log(proxy);

      video.src({
        src: `${proxy}/m3u8-proxy?url=${sRes.data}`,
        type: "application/x-mpegURL",
      });

      video.play()
    }

    watch(
      () => props.content,
      async (content) => {
        player.content = content;

        init();
      }
    );

    return { player };
  },
};
</script>

<style scoped>
.moviePlayer {
  border-radius: 10px;
  background-color: white;
  margin-top: 5vh;
  box-shadow: 0px 0px 50px gray;
  width: 60%;
  overflow: hidden;
  min-height: 100vh;
}

.overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>