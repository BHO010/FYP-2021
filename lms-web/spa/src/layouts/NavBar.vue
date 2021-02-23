<template>
  <v-app>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <div class="topBar">
      <v-app-bar height="74" elevation="1">
        <v-menu offset-y>
          <v-list class="hidden-md-and-up">
            <v-list-item v-for="item in menu" :key="item.icon">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-toolbar-title class="color logo">NTU-LMS</v-toolbar-title>

       <!--  <v-text-field
          class="searchInput"
          type="text"
          label="Search"
          dense
          outlined
          prepend-inner-icon="mdi-magnify"
        ></v-text-field> -->

        <v-spacer></v-spacer>

        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn v-for="(item, i) in menu" :key="i" :to="item.route" text>{{
            item.title
          }}</v-btn>
        </v-toolbar-items>

        <v-btn class="navBtn" to="/login" outlined medium>Log in</v-btn>
        <v-btn class="navBtn navSign" color="#FF733C" to="/signup" medium
          >Sign up</v-btn
        >
      </v-app-bar>
    </div>

    <div class="body">
      <v-main>
        <router-view :key="$route.fullPath"></router-view>
      </v-main>
    </div>
  </v-app>
</template>
 
<script>
export default {
  data() {
    return {
      menu: [
        { title: "Browse", route: "/" },
        { title: "About Us", route: "/" },
        { title: "Help", route: "/" },
      ],
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    loading() {
      return this.$store.getters.loading
    },
  },
  methods: {
    menuItems() {
      return this.menu
    },
  },
}
</script>

<style scoped>
@media screen and (max-width: 850px) {
  .logo2 {
    display: flex !important;
    justify-content: center !important;
    align-content: center !important;
    margin: auto !important;
    padding: 0 !important;
  }
}

.body {
  display: flex;
}

.topBar {
  height: 74px;
  width: 100%;
}

.main {
  width: 85%;
}

.bgColor {
  background-color: #f5f6f7;
}

.header {
  color: white;
  font-size: 30px;
  margin-left: 2%;
}

.color {
  color: black !important;
}

.navbar {
  margin-top: 1%;
}

.theme--light.v-btn--active::before {
  opacity: 0;
}

.sideBar {
  height: 100%;
}

.logo {
  width: 150px;
  margin-left: 2%;
}

.searchInput {
  height: 40px;
  width: 220px;
}

.navItems {
  font-size: 16px !important;
  margin-left: 1%;
  text-decoration: none;
}

.navBtn {
  margin-left: 1%;
  text-transform: none;
  color: black !important;
}

.navSign {
  margin-right: 1%;
}

.spaceWidth {
  width: 600px;
}

.center-all {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mainContainer {
  align-items: inherit !important;
  margin: 0;
  padding: 0;
}
</style>