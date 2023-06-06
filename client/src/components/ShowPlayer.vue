<template>
  <div :class="`showPlayer ${player.visibility}`">
    <video
      controls
      class="video-js vjs-sublime-skin vjs-16-9"
      id="video-show"
    ></video>
    <div class="overview">
      <h1>{{ player.details.original_name }}</h1>
    </div>
    <div class="seasons">
      <div
        class="season"
        v-for="season of player.seasons"
        :key="season.season_number"
      >
        <template v-if="season.season_number != 0">
          <h2>{{ season.name }}</h2>
          <div class="episodes">
            <div
              class="episode"
              @click="playEpisode(season, episode)"
              v-for="episode of season.episodes"
              :key="episode.id"
            >
              <p>{{ episode.name }}</p>
            </div>
          </div>
        </template>
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
      details: false,
      visibility: "inactive",
    });

    let video;

    const api = config.interfaces.api;
    const tmdb = config.interfaces.tmdb;
    const proxy = config.proxyUrl;

    async function playEpisode(season, episode) {
      video.poster(`https://image.tmdb.org/t/p/original/${episode.still_path}`);

      const res = await api.get(
        `/source/?id=${player.details.imdb_id}&season=${season.season_number}&episode=${episode.episode_number}`
      );

      console.log(res.data);

      if (res.data != "") {
        video.src({
          src: `${proxy}/m3u8-proxy?url=${res.data}`,
          type: "application/x-mpegURL",
        });
      }
      else {
        alert("No Source Available")
      }

      video.play();
    }

    async function init() {
      video = videojs("video-show");

      const res = await tmdb.get(
        `https://api.themoviedb.org/3/tv/${player.content.id}`
      );

      const details = res.data;

      const idRes = await tmdb.get(
        `https://api.themoviedb.org/3/tv/${details.id}/external_ids`
      );

      details.imdb_id = idRes.data.imdb_id;

      let i = 0;
      for (const season of details.seasons) {
        const res = await tmdb.get(
          `https://api.themoviedb.org/3/tv/${details.id}/season/${season.season_number}`
        );

        details.seasons[i].episodes = res.data.episodes;

        i++;
      }

      video.poster(
        `https://image.tmdb.org/t/p/original/${details.backdrop_path}`
      );

      console.log(details);

      player.details = details;
      player.seasons = details.seasons;
    }

    watch(
      () => props.content,
      async (content) => {
        if (content == false) {
          player.visibility = "inactive";
          return;
        }

        player.content = content;
        player.visibility = "active";

        init();
      }
    );

    return { player, playEpisode };
  },
};
</script>
  
  <style scoped>
.showPlayer {
  border-radius: 10px;
  background-color: white;
  margin-top: 5vh;
  box-shadow: 0px 0px 50px gray;
  width: 60%;
  overflow: hidden;
  min-height: 100vh;
}

.episode {
  padding: 5px;
  margin: 5px;
  cursor: pointer;
}

.overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.active {
  display: inline-block;
}

.inactive {
  display: none;
}
</style>