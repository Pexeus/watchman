<template>
  <div class="playerLoader" v-if="player.loading">
    <i class="gg-spinner-two-alt"></i>
  </div>
  <div :class="`showPlayer ${player.visibility}`" v-if="!player.loading">
    <video
      controls
      class="video-js vjs-sublime-skin vjs-16-9"
      id="video-show"
    ></video>
    <div class="overview">
      <h2>{{ player.details.original_name }}</h2>
      <div class="tags">
        <div class="tag" v-for="genre of player.details.genres" :key="genre.id">
          {{ genre.name }}
        </div>
      </div>
    </div>
    <div class="description">
      {{ player.details.overview }}
    </div>
    <div class="seasonSelection">
      <div class="tags">
        <template v-for="season of player.seasons" :key="season.season_number" >
          <div class="tag" v-if="season.season_number != 0" @click="scrollToSeason(season.season_number)">
            Season {{ season.season_number }}
          </div>
        </template>
      </div>
    </div>
    <div class="seasons">
      <template
        v-for="season of player.seasons"
        :key="season.season_number"
      >
        <div class="season"  :id="`season_${season.season_number}`" v-if="season.season_number != 0">
          <h2>| {{ season.name }}</h2>
          <div class="episodes">
            <div
              class="episode"
              @click="playEpisode(season, episode)"
              v-for="episode of season.episodes"
              :key="episode.id"
            >
              <div class="episodeThumbnail">
                <img :src="`https://image.tmdb.org/t/p/original/${episode.still_path}`" alt="">
                <div>
                  <h1>{{ episode.episode_number }}</h1>
                </div>
              </div>
              <div class="episodeOverview">
                <h3>{{ episode.name }}</h3>
                <p>{{ episode.overview }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
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
      visibility: "inactive",
      loading: false
    });

    let video;
    const api = config.interfaces.api;
    const tmdb = config.interfaces.tmdb;
    const proxy = config.proxyUrl;

    async function playEpisode(season, episode) {
      video.pause()
      video.poster(`https://image.tmdb.org/t/p/original/${episode.still_path}`);
      video.posterImage.show();

      const res = await api.get(
        `/source/?id=${player.details.imdb_id}&season=${season.season_number}&episode=${episode.episode_number}`
      );


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
      player.loading = true

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

      player.loading = false

      await waitForElement("video");
      
      video = videojs("video-show");
      video.poster(
        `https://image.tmdb.org/t/p/original/${details.backdrop_path}`
      );

      player.details = details;
      player.seasons = details.seasons;
    }

    function scrollToSeason(season_number) {
      const season = document.querySelector(`#season_${season_number}`)
      season.scrollIntoView({ behavior: 'smooth'})
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

        await init();
      }
    );

    return { player, playEpisode, scrollToSeason };
  },
};
</script>
  
  <style scoped>
.showPlayer {
  border-radius: 10px;
  background-color: var(--gray2);
  width: 800px;
  max-width: 80%;
  overflow: hidden;
  border: 1px solid #333;
  margin-top: 100px;
  animation: flyInBottom 1s ease-in-out;
}

.playerLoader {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  scale: 1;
  flex-direction: column;
}

.showPlayer * {
  transition: all ease-in-out 0.3s;
}

.overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.description {
  padding: 20px;
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
  cursor: pointer;
}

.seasonSelection {
  padding: 20px;
}

.seasons {
  max-height: 70vh;
  overflow: scroll;
}

.season {
  padding: 20px;
}

.episode {
  margin-top: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 5px;
  position: relative;
}

.episode:hover {
  background-color: rgba(0, 0, 0, 0.548);
}

.episodeThumbnail {
  position: relative;
  height: 120px;
}

.episodeThumbnail img {
  height: 100%;
  border-radius: 5px;
}

.episodeThumbnail div {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: larger;
  text-shadow: 0px 0px 20px black, 0px 0px 20px  black, 0px 0px 10px black, 0px 0px 10px black;
}

.episodeOverview {
  padding: 10px;
  padding-left: 20px;
}

.episodeOverview h3 {
  padding-bottom: 10px;
}

.active {
  display: inline-block;
}

.inactive {
  display: none;
}

.producers {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.producer img {
  height: 20px;
}
</style>