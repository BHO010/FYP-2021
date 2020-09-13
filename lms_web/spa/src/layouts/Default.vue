<template>
  <v-app>
    <v-main class="max-container">
      <v-overlay :value="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-layout row wrap class="navbar center-all">
        <!-- Top bar -->
        <a href="/">
          <h1 class="logo">NTU - LMS</h1>
        </a>
        <v-spacer class="spaceWidth"></v-spacer>
        <a href="/" class="navItems">Courses</a>
        <a href="/" class="navItems">Categories</a>
        <v-btn class="navBtn" small>Log in</v-btn>
        <v-btn class="navBtn navSign" small>Sign up</v-btn>
      </v-layout>
      <br/>
      <v-divider class="top-divider"></v-divider>
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
.navbar {
  margin-top:1%;
}

.logo {
  width: 200px;
  margin-left: 2%;
}

.navItems {
  font-size: 16px !important;
}

.navBtn{
  margin-left:1%;
}

.navSign{
  margin-right:1%;
}

.spaceWidth {
  width: 600px;
}

.center-all {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>