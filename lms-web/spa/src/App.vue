<template>
  <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script>
import LayoutDefault from "./layouts/Default";
import LayoutNavBar from "./layouts/NavBar"; 
import LayoutPrivate from "./layouts/Private"; 

export default {
  components: {
    "layout-default": LayoutDefault,
    "layout-navbar": LayoutNavBar,
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
@media screen and (max-width: 1920px) {
  .v-messages__message {
    font-size: calc(
      10px + (16 - 10) * ((100vw - 320px) / (1920 - 320))
    ) !important ;
    color: rgb(222, 4, 4);
    line-height: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
}

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

.v-application--wrap {
  background-color: #E1F5FE
}


</style>
