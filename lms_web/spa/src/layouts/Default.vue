<template>
  <v-app>
    <v-main>
      <v-container class="max-container">
        <v-overlay :value="loading">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
          <router-view :key="$route.fullPath"></router-view>
      </v-container>
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
    }
  },
  methods: {}
};
</script>

<style scooped>
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
.logo {
  display: flex;
  padding-left: 13%;
}
.image {
  margin-top: 10%;
  margin-left: 20%;
}
.center-all {
  display: flex;
  align-items: center;
  justify-content: center;
}
.max-container {
  margin-right: 0 !important;
  margin-left: 0 !important;
  max-width: 2500px;
  border: 0;
}
.column {
  max-width: 892.5px;
}
</style>