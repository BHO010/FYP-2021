<template>
   <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script>
import LayoutDefault from "./layouts/Default";
import LayoutPrivate from "./layouts/Private"; 

export default {
  components: {
    "layout-default": LayoutDefault,
    "layout-private": LayoutPrivate,
  },
  computed: {
    layout() {
      return this.$store.state.layout;
    }
  }
};
</script>

<style>
@font-face {
  font-family: "Allstar";
  src: url("../public/fonts/AllStar.ttf");
}

@font-face {
  font-family: "DMSans-Bold";
  src: url("../public/fonts/DMSans-Bold.ttf");
}

@font-face {
  font-family: "DarkerGrotesque-Medium";
  src: url("../public/fonts/DarkerGrotesque-Medium.ttf");
}

@font-face {
  font-family: "DarkerGrotesque-Bold";
  src: url("../public/fonts/DarkerGrotesque-Bold.ttf");
}

#app {
  font-family: "DarkerGrotesque-Medium";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
