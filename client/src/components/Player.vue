<template>
  <div class="player" :style="`visibility: ${player.visibility};`">
    <MoviePlayer :content="player.movie"></MoviePlayer>
  </div>
</template>

<script>
import MoviePlayer from "./MoviePlayer.vue";
import { reactive, watch } from "vue";

export default {
  components: {
    MoviePlayer,
  },
  setup() {
    const player = reactive({
      movie: false,
      visibility: "hidden"
    });

    window.player = {
      open: (content) => {
        if (content.media_type == "movie") {
          player.movie = content;
          player.visibility = "visible"
        }
      },
    };

    return {
      player,
    };
  },
};
</script>

<style>
    .player {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        background-color: transparent;
        visibility: hidden;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        overflow: scroll;
    }
</style>