<template>
  <v-app class="app">
    <v-navigation-drawer v-model="drawer" app>
      <div class="flex-container">
        <div class="v-navigation-drawer__content">
          <v-col>
            <br />
            <img class="logo-private" src="../../public/img/logo.png" />
            <br />
          </v-col>
          <v-col col="3" class="navCol">
            <v-list>
              <!--Home -->
              <v-list-item-group v-model="item" color="#009cdc">
                <v-list-item
                  v-for="(item, i) in itemHome"
                  :key="i"
                  :to="item.route"
                  class="listItem hover"
                >
                  <v-list-item-content class="hover">
                    <v-list-item-title v-text="item.text" class="size-28 bold hover listText"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

              <!--Accounts -->
              <v-list-group color="#009cdc" class="margin-btm">
                <template v-slot:activator>
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="size-28 bold">Accounts</v-list-item-title>
                </template>
                <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
                  :to="item.route"
                  color="#009cdc"
                  class="listItem hover"
                  v-model="active_list"
                >
                  <v-list-item-content class="hover listText size-28">
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>

              <!--Others -->
              <v-list-item-group v-model="item" color="#009cdc">
                <v-list-item
                  v-for="(item, i) in itemOthers"
                  :key="i"
                  :to="item.route"
                  class="listItem hover"
                >
                  <v-list-item-content class="hover">
                    <v-list-item-title v-text="item.text" class="size-28 hover bold listText"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </div>

        <div class="misc">
          <div class="v-navigation-drawer__append">
            <v-list flat>
              <!-- logout -->
              <v-list-item :disabled="$store.state.loading" @click="onLogout" color="#009cdc">
                <v-list-item-content>
                  <v-list-item-title class="size-28">Logout</v-list-item-title>
                  <!-- <v-list-item :disabled="$store.state.loading" @click="onLogout"> -->
                    </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </div>
    </v-navigation-drawer>

    <v-main class="body">
      <v-flex xs12 row color class="appBar align-left" hide-on-scroll height="100">
        <v-app-bar-nav-icon class="hidden-lg-and-up" @click.stop="drawer = !drawer" />
        <v-spacer></v-spacer>
        <v-avatar color="#009cdc" size="36">
          <span class="white--text headline">A</span>
        </v-avatar>
        <div class="center-all welcome">Hi, Admin!</div>
      </v-flex>
      <router-view :key="$route.fullPath"></router-view>
    </v-main>
  </v-app>
</template>
 
<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
      userDetails: "",
      profileImage: "",
      drawer: true,
      active_list: "",
      admin: true,
      item: 1,
      items: [
         {
          id: "Users",
          text: "Users",
          icon: "",
          route: { path: "/users" }
        },
        { id: "Instructors", text: "Instructors", icon: "", route: { path: "/instructors" } },
        { text: "Awaiting Approval", icon: "", route: { path: "/applications" } }
      ],
      itemHome: [{ text: "Home", icon: "mdi-home", route: "/home" }],
      itemOthers: [
        { id: "Courses", text: "Courses", icon: "", route: { path: "/courses" } },
        { id: "Report", text: "Reports", icon: "", route: { path: "/reports" } },
      ]
    }
  },
  created() {},
  async mounted() {
   try {
     let rv = await http.get('/api/admin')
     this.userDetails = rv.data
     this.profileImage = this.userDetails.profileImage
      this.insertIcon()
   }catch(e){}
    
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
    onLogout() {},
    insertIcon() {
      let d = document.getElementById("iconImg")
      d.innerHTML = ""
      d.innerHTML = this.profileImage
    },
  },
}
</script>


<style>
#icomImg svg {
  width: 60px;
  height: 60px;
}
</style>

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

@font-face {
  font-family: "DMSans-Bold";
  src: url("../../public/fonts/DMSans-Bold.ttf");
}

@font-face {
  font-family: "DarkerGrotesque-Medium";
  src: url("../../public/fonts/DarkerGrotesque-Medium.ttf");
}

.v-navigation-drawer__content {
  max-height: 100% !important;
}

.flex-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 100%;
  height: 100%;
}
.misc {
  display: flex;
}
.logo-private {
  display: flex;
  height: 100px;
}
.v-navigation-drawer__border {
  width: null;
  height: null;
}

.bold {
  font-weight: bold;
}

.size-22 {
  font-size: 22px;
}
.size-20 {
  font-size: 20px;
}
.size-28 {
  font-size: 28px;
}
.appBar {
  margin-top: 1.5em !important;
  width: 95%;
}
.align-left {
  margin-left: 5px;
}
.divContent {
  margin-left: 4%;
  margin-right: 4%;
}
.appColor {
  background-color: #f8f8f8;
}
.center-all {
  display: flex;
  align-items: center;
  justify-content: center;
}
.margin-top {
  margin-top: 15em;
  position: fixed !important;
}
.margin-top-partner {
  margin-top: 22em;
}
.margin-btm {
  margin-bottom: 20px;
}
.margin-left {
  margin-left: 70em;
}
.align-list {
  margin-left: 3.5em;
  font-size: 20px;
}
.listItem {
  margin-bottom: 20px;
}
.listSubItem {
  padding-right: 0;
}
.listText:hover {
  color: white;
  padding: 0;
}
.listItem:hover {
  background-color: #009cdc;
  color: white !important;
}
.listSubItem:hover {
  background-color: #009cdc;
  color: white !important;
}
.drawerItems {
  color: black;
}
.drawerItems:hover {
  color: #009cdc;
}
.welcome {
  margin-left: 2em;
  font-size: 22px;
  font-weight: bolder;
}
.homeIcon {
  color: black;
}
.navCol {
  padding: 0;
  text-align: center;
}
.listItemTrial {
  background-color: grey;
  color: white;
}
.hover:hover {
  color: white;
}
.listTop {
  margin-top: 3%;
}
.listBtm {
  margin-bottom: 3%;
}
.v-list-item__content {
  padding: 0% !important;
  height: 56px;
  width: 220px !important;
}

.v-list-item__title {
  font-size: 24px;
}

.textAlign {
  padding-left: 35% !important;
}
</style>