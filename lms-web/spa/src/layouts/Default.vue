<template>
  <v-app>
    <v-main>
      <router-view :key="$route.fullPath"></router-view>
    </v-main>
  </v-app>
</template>

<script  scoped >
export default {
  data() {
    return {};
  },
  created() {},
  computed: {
    user() {
      return this.$store.state.user;
    },
    loading() {
      return this.$store.getters.loading;
    },
  },
  methods: {},
};
</script>

<style scoped>
@media screen and (max-width: 850px) {
  .logo {
    display: flex !important;
    justify-content: center !important;
    align-content: center !important;
    margin: auto !important;
    padding: 0 !important;
  }
}
.top-divider {
  border: none !important;
  height: 50px !important;
  max-height: 50px !important;
  border-bottom: 2px solid #e3e3e3 !important;
  box-shadow: 0 20px 15px -15px #e3e3e3 !important;
  margin: -50px auto 10px !important;
  overflow: visible !important;
}

</style>