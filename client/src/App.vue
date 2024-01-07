<template>
  <div class="watchman" v-if="auth.user != false">
    <Nav></Nav>
    <Home></Home>
    <Player></Player>
  </div>
  <div class="watchman" v-if="auth.user == false">
    <Login></Login>
  </div>
</template>

<script>
import Home from "./components/Home.vue"
import Player from "./components/Player.vue";
import Nav from "./components/Nav.vue";
import Login from "./components/Login.vue"

import {getAuth} from "./auth"
import { reactive } from "vue";

export default {
  name: 'App',
  components: {
    Home,
    Player,
    Nav,
    Login
  },
  setup() {
    const auth = reactive({
      user: false
    })

    auth.user = getAuth()

    return { Home, auth}
  }
}
</script>

<style>
@import "vue-select/dist/vue-select.css";

* {
  margin: 0;
  padding: 0;
}

:root {
  --white: #F5F5F7;
  --gray1: #1C1C1E;
  --gray2: #1D1D1F;
  --black: rgb(0, 0, 0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    /* Start with 0 opacity */
  }

  to {
    opacity: 1;
    /* End with 1 opacity (fully visible) */
  }
}

@keyframes flyInBottom {
  from {
    opacity: 0;
    transform: translateY(100%);
      /* Start with 0 opacity */
  }

  to {
    transform: translateY(0);
    opacity: 1;
    /* End with 1 opacity (fully visible) */
  }
}

*::-webkit-scrollbar {
  display: none;
  outline: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
* {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: rgb(0, 0, 0);
  color: var(--white);
}

iframe {
  width: 100vw;
  height: 100vh;
}

.playerLoader {
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1));
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.4s ease-in-out;
}

.playerLoader * {
  animation: fadeIn 0.4s ease-in-out;
}</style>
