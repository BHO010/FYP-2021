<template>
  <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script>
import LayoutDefault from "./layouts/Default";
import LayoutNavBar from "./layouts/NavBar";

export default {
  components: {
    "layout-default": LayoutDefault,
    "layout-navbar": LayoutNavBar,
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

.v-input__slot {
  max-height: 35px 
}

</style>
