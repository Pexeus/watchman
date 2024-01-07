<template>
  <div>
    <h2>{{ title }}</h2>
    <div class="feed">
      <div class="scroller" ref="scroller">
        <div
          class="item"
          :style="{ opacity: content.visible ? 1 : 0 }"
          v-for="content of feed.content"
          :key="content.id"
          @click="openPlayer(content)"
        >
          <div class="mainPoster">
            <img
              class="backdrop"
              :src="`https://image.tmdb.org/t/p/original/${content.backdrop_path}`"
              @error="coverFallback"
              @load="content.visible = true"
            />
            <div>
              <h3 v-if="content.name">{{ content.name }}</h3>
              <h3 v-if="content.title">{{ content.title }}</h3>
            </div>
          </div>
          <div class="replacementPoster" v-if="feed.coverError">
            <img
              @load="content.visible = true"
              @error="content.visible = true"
              :src="`https://image.tmdb.org/t/p/original/${content.poster_path}`"
              alt=""
            />

            <div>
              <h3 v-if="content.name">{{ content.name }}</h3>
              <h3 v-if="content.title">{{ content.title }}</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="forward" @click="forward"></div>
      <div class="backward"></div>
    </div>
  </div>
</template>

<script>
import { reactive, watch, ref } from "vue";
import config from "../config";
import fallbackCover from "@/assets/fallback-cover.jpg";

export default {
  props: {
    title: String,
    url: String,
    mediaType: String,
  },
  setup(props, context) {
    const scroller = ref(null);
    const feed = reactive({
      content: [],
      opacity: 0,
    });
    const tmdb = config.interfaces.tmdb;

    let page = 1;

    function openPlayer(content) {
      window.player.open(content);
    }

    function coverFallback(e) {
      e.target.remove();
      feed.coverError = true;
    }

    function fadeIn(id) {
      feed;
    }

    async function load() {
      if (props.url == "") {
        return;
      }

      //pagination
      let url = props.url;

      if (page != 1) {
        url = url.replace(/page=\d+/, `page=${page}`);
      }

      const res = await tmdb.get(url);
      let i = 0;

      for (let elem of res.data.results) {
        if (res.data.results[i].media_type == undefined) {
          res.data.results[i].media_type = props.mediaType;
        }

        i++;
      }

      feed.content = feed.content.concat(res.data.results);

      return true;
    }

    async function forward() {
      page += 1;
      scroller.value.scrollBy(scroller.value.offsetWidth, 0);

      await load();
    }

    watch(
      () => props.url,
      async () => {
        feed.content = [];

        load();
      }
    );

    load();

    return { feed, openPlayer, coverFallback, forward, scroller, fadeIn };
  },
};
</script>

<style scoped>
.feed {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  margin-top: 15px;
  margin-bottom: 60px;
  position: relative;

  height: 160px;
}

.scroller {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  background: transparent;
  height: 100%;
  scroll-behavior: smooth;
}

.feed .forward {
  position: absolute;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: rgba(0, 0, 0, 0.37);
  cursor: pointer;
  width: 20px;
}

.feed .backward {
  position: absolute;
  left: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.37);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 20px;
}

.item {
  border-radius: 5px;
  margin-left: 20px;
  cursor: pointer;
  height: 160px;
  width: 284px;
  position: relative;
  display: inline-block;
  vertical-align: top;
  white-space: normal;
  transition: all linear 0.3s;
  overflow: hidden;
}

.item * {
  transition: all ease-in-out 0.3s;
}

.item .backdrop {
  height: 100%;
  width: 100%;
  background-size: cover;
  border-radius: 5px;
}

.item:hover .backdrop {
  transform: scale(1.1);
  opacity: 0.3;
}

.mainPoster div {
  position: absolute;
  bottom: -100%;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  text-align: left;
}

.mainPoster:hover div {
  bottom: 0;
}

.mainPoster div h3 {
  width: 100%;
  padding: 10px;
}

.replacementPoster {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  background: rgb(255,45,85);
  background: linear-gradient(45deg, #BF5AF2 0%, rgba(0,64,221,1) 100%);
  border-radius: 5px;
}

.replacementPoster div {
  width: 100%;
}

.replacementPoster img {
  height: 90%;
  display: inline-block;
  border-radius: 5px;
  margin: 5px;
}

h2 {
  margin-left: 20px;
}
</style>