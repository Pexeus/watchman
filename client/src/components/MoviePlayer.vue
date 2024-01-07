<template>
  <div class="playerLoader" v-if="player.loading == true">
    <i class="gg-spinner-two-alt"></i>
  </div>
  <div :class="`moviePlayer ${player.visibility}`" v-if="player.loading == false">
    <video
      controls
      class="video-js vjs-default-skin vjs-16-9 player"
      id="video"
    ></video>
    <div class="overview">
      <h2>{{ player.details.original_title }}</h2>
      <div class="tags">
        <div class="tag" v-for="genre of player.details.genres" :key="genre.id">
          {{ genre.name }}
        </div>
      </div>
    </div>
    <div class="description">
      {{ player.details.overview }}
    </div>
    <div class="producers">
      <template
        v-for="producer of player.details.production_companies"
        :key="producer.id"
      >

      <div class="producer" v-if="producer.logo_path != null">
        <img
          :src="`https://image.tmdb.org/t/p/original/${producer.logo_path}`"
          alt=""
        />
      </div>
        
      </template>
    </div>
  </div>
</template>

<script>
import { reactive, watch } from "vue";
import videojs from "video.js";
import config from "../config";
import { waitForElement } from "@/helpers";

export default {
  props: {
    content: {},
  },
  setup(props, content) {
    const player = reactive({
      details: false,
      loading: false,
      visibility: "inactive",
      video: false
    });

    let video
    const api = config.interfaces.api;
    const tmdb = config.interfaces.tmdb;
    const proxy = config.proxyUrl;

    async function init() {
      player.loading = true

      const res = await tmdb.get(
        `https://api.themoviedb.org/3/movie/${player.content.id}`
      );
      player.details = res.data;

      //get player source
      const sRes = await api.get(`/source/?id=${player.details.imdb_id}`);
      player.loading = false

      await waitForElement("video");

      video = videojs("video");
      video.poster(
        `https://image.tmdb.org/t/p/original/${player.content.backdrop_path}`
      );

      video.src({
        src: `${proxy}/m3u8-proxy?url=${sRes.data}`,
        type: "application/x-mpegURL",
      });

      video.play();
    }

    watch(
      () => props.content,
      async (content) => {
        if (content == false) {
          player.visibility = "inactive";
          video.dispose()
          return;
        }

        player.content = content;
        player.visibility = "active";

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
  background-color: var(--gray2);
  width: 800px;
  max-width: 80%;
  overflow: hidden;
  border: 1px solid #333;
  margin-top: 100px;
  animation: flyInBottom 1s ease-in-out;
}

.overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.description {
  padding: 10px;
  min-height: 200px;
}

.active {
  display: inline-block;
}

.inactive {
  display: none;
}

.tag {
  background-color: var(--white);
  border-radius: 15px;
  color: var(--black);
  padding: 4px;
  padding-left: 8px;
  padding-right: 8px;
  font-weight: bold;
  display: inline-block;
  margin: 5px;
  font-size: small;
}

.producers {
  width: 100%;
  padding-top: 30px;
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.producer img {
  height: 30px;
}
</style>