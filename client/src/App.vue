<template>
  <div class="watchman">
    <Home></Home>
    <Player></Player>
  </div>
</template>

<script>
import Home from "./components/Home.vue"
import Player from "./components/Player.vue";

export default {
  name: 'App',
  components: {
    Home,
    Player
  },
  setup() {
    

    return {Home}
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

*::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
* {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

iframe {
  width: 100%;
  height: 100vh;
}
</style>
