<template>
  <v-app class="app">
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <div class="topBar">
      <v-app-bar height="74" fixed color="blue darken-4">
        <v-app-bar-nav-icon @click="toggle"></v-app-bar-nav-icon>
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

        <!-- <v-text-field
          class="searchInput"
          type="text"
          label="Search"
          background-color="blue accent-2"
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

        <!-- user icon + notification bell -->
        <v-icon large color="green darken-2" class="notification">
          mdi-bell
        </v-icon>
        <v-menu :nudge-width="200" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on" class="avatar">
              <v-avatar size="48" id="icomImg"> </v-avatar>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, i) in items" :key="i" :to="item.route">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>

            <v-list-item @click="onLogout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
    </div>

    <div class="body">
      <div v-if="isUser">
        <v-navigation-drawer
          class="sideBar"
          v-model="drawer"
          color="#ededed"
          fixed
          clipped
          style="padding-top: 74px"
        >
          <v-list nav dense>
            <v-list-item-group
              active-class="red lighten-5--text text--accent-4"
            >
              <h3 class="listTitle">Account</h3>
              <v-list-item
                v-for="actItem in accountItems"
                :key="actItem.title"
                :to="actItem.route"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ actItem.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <h3 class="listTitle">Course</h3>
              <v-list-item
                v-for="courseItem in userCourseItems"
                :key="courseItem.title"
                :to="courseItem.route"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ courseItem.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <h3 class="listTitle">Community</h3>
              <v-list-item
                v-for="item in communityItems"
                :key="item.title"
                :to="item.route"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <h3 class="listTitle">Classes</h3>
              <v-list-item
                v-for="item in classesItems"
                :key="item.title"
                :to="item.route"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </div>

      <div v-else>
        <v-navigation-drawer
          class="sideBar"
          color="#ededed"
          style="padding-top: 74px"
          v-model="drawer"
          fixed
          clipped
        >
          <v-list nav dense>
            <v-list-item-group
              active-class="red lighten-5--text text--accent-4"
            >
              <h3 class="listTitle">Account</h3>
              <v-list-item
                v-for="actItem in accountItems"
                :key="actItem.title"
                :to="actItem.route"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ actItem.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <h3 class="listTitle">Course</h3>
              <v-list-item
                v-for="courseItem in instructorCourseItems"
                :key="courseItem.title"
                :to="courseItem.route"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ courseItem.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <h3 class="listTitle">Community</h3>
              <v-list-item
                v-for="item in communityItems"
                :key="item.title"
                :to="item.route"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <h3 class="listTitle">Ongoing</h3>
              <v-list-item
                v-for="item in ongoingItems"
                :key="item.title"
                :to="item.route"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </div>

      <div id="main" class="main">
        <v-main>
          <router-view :key="$route.fullPath"></router-view>
        </v-main>
      </div>
    </div>
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
      isUser: true,
      menu: [
        { title: "Browse", route: "/browse" },
        { title: "About Us", route: "/home" },
        { title: "Help", route: "/home" },
      ],
      items: [
        { title: "Profile", route: "/profile" },
        { title: "Settings", route: "/settings" },
      ],
      accountItems: [
        { title: "Profile", route: "/profile" },
        { title: "Achievement", route: "/achievements" },
        { title: "Statistics", route: "/statistics" },
        { title: "Settings", route: "/settings" },
      ],
      instructorCourseItems: [
        { title: "Browse", route: "/browse" },
        { title: "Course Taken", route: "/courses-taken" },
        { title: "Your Course", route: "/courses-created" },
        { title: "Course Creation", route: "/course/create" },
      ],
      userCourseItems: [
        { title: "Browse", route: "/browse" },
        { title: "Course Taken", route: "/courses-taken" },
      ],
      communityItems: [{ title: "Discussion", route: "/discussion" }],
      ongoingItems: [{ title: "Classes", route: "/classes" }],
      drawer: true,
    }
  },
  created() {},
  async mounted() {
    try {
      const rv = await http.get("/api/me")
      this.userDetails = rv.data
      if (this.userDetails.role != "user") {
        this.isUser = false
      }
      this.profileImage = this.userDetails.profileImage
      this.insertIcon()
    } catch (e) {}
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
    toggle() {
      if (this.drawer == false) {
        this.drawer = true
        let d = document.getElementById("main")
        d.style.transform = "translate3d(0px, 0px, 0px)"
      } else {
        this.drawer = false
        let d = document.getElementById("main")
        d.style.transform = "translate3d(-100px, 0px, 0px)"
      }
    },
    onLogout() {
      this.$store.dispatch("logout", { user: this.$store.state.user })
    },
    insertIcon() {
      let d = document.getElementById("icomImg")
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

input:-internal-autofill-selected {
  background-color: transparent !important;
}

.body {
  position: relative;
  display: flex;
  background-color: #e1f5fe;
}

.theme--light.v-btn--active::before {
  opacity: 0;
}

.header {
  color: white;
  font-size: 30px;
  margin-left: 2%;
}

.main {
  transform: translate3d(0px, 0px, 0px);
  transition-duration: 300ms;
  background-color: #e1f5fe;
  z-index: 0;
  order: 1;
  flex: 1 1 0%;
  padding-left: 260px;
}

.color {
  color: white !important;
}

.topBar {
  height: 74px;
  width: 100%;
}

.topBar .v-btn,
.topBar .v-text-field {
  color: white;
}

.topBar .theme--light.v-input input,
.theme--light.v-input textarea {
  color: white !important;
}

.notification {
  margin-right: 1%;
  margin-left: 1%;
}

.avatar {
  margin-right: 1% !important;
}

.logo {
  width: 150px;
  margin-left: 2%;
  color: white;
}

.searchInput {
  height: 40px;
  width: 220px;
  color: white;
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

.sideBar {
  padding-left: 1%;
  padding-right: 1%;
  background: #ededed;
  padding-top: 74px !important;
  border: 2px solid black;
}

.sideBar .v-list-item__title {
  font-family: "DarkerGrotesque-Medium";
  font-size: 20px;
  line-height: 1.5rem;
}

.sideBar .listTitle {
  font-family: "DarkerGrotesque-Medium";
  font-size: 32px;
  color: #0d47a1;
}
</style>