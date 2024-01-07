<template>
  <div class="player" :style="`visibility: ${player.visibility};`" @click="closePlayer">
    <MoviePlayer :content="player.movie"></MoviePlayer>
    <ShowPlayer :content="player.show"></ShowPlayer>
  </div>
</template>

<script>
import MoviePlayer from "./MoviePlayer.vue";
import ShowPlayer from "./ShowPlayer.vue";
import { reactive, watch } from "vue";

export default {
  components: {
    MoviePlayer,
    ShowPlayer
  },
  setup() {
    const player = reactive({
      movie: false,
      show: false,
      visibility: "hidden"
    });

    window.player = {
      open: (content) => {
        player.movie = false
        player.show = false
        if (content.media_type == "movie") {
          player.movie = content;
          player.visibility = "visible"
        }

        if (content.media_type == "tv") {
          player.show = content;
          player.visibility = "visible"
        }
      },
      close: () => {
        player.movie = false
        player.show = false
        
        setTimeout(() => {
          player.visibility = "hidden"
        }, 100);
      }
    };

    function closePlayer(e) {
      const $player = document.querySelector(".player")

      if (e.target == $player) {
        window.player.close()
      }
    }

    return {
      player,
      closePlayer
    };
  },
};
</script>

<style scoped>
    .player {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        visibility: hidden;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        overflow: scroll;
        scroll-behavior: smooth;
        background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1));
    }
</style>