<template>
  <h2>{{ title }}</h2>
    <div class="result" v-for="content of feed.content" :key="content.id">
      <img :src="`https://image.tmdb.org/t/p/w300/${content.poster_path}`" />
    </div>
</template>

<script>
import { reactive, watch } from "vue";

export default {
  props: {
    content: Object,
    title: String
  },
  setup(props, context) {
    const feed = reactive({});
    feed.isLoaded = false

    watch(
      () => props.content,
      async (content) => {
        feed.content = content
        feed.isLoaded = true
      }
    );

    return { feed };
  },
};
</script>

<style scped>
.feed {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  height: 200px;
}

.result {
  margin: 10px;
  border-radius: 5px;
  height: 100%;
  box-shadow: 0px 0px 3px gray;
  cursor: pointer;
}

.result img {
  height: 100%;
  background-size: cover;
  border-radius: 5px;
}

h2 {
  float: left;
}
</style>