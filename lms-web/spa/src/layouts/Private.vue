<template>
  <v-app class="app">
    <!-- <v-navigation-drawer
      v-if="isUser"
      class="sideBar"
      v-model="drawer"
      color="#ededed"
      fixed
      temporary
    >
      <v-list nav dense>
        <v-list-item-group active-class="red lighten-5--text text--accent-4">
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
    </v-navigation-drawer> -->

    <v-navigation-drawer v-model="drawer" app v-if="isUser">
      <div class="flex-container">
        <div class="v-navigation-drawer__content">
          <!-- logo -->
          <v-col id="logoCol">
            <br />
            <img class="logo-private" src="../../public/img/logo.png" />
            <br />
          </v-col>
          <v-col col="3" class="navCol">
            <v-list>
              <!--Accounts -->
              <v-list-item-group color="#009cdc" class="margin-btm">
                <h2 class="sideHeader">Account</h2>
                <v-list-item
                  v-for="(item, i) in accountItems"
                  :key="i"
                  :to="item.route"
                  color="#009cdc"
                  v-model="active_list"
                  class="listItem"
                >
                  <v-list-item-content class="hover listText size-28">
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

              <!--Courses -->
              <v-list-item-group v-model="item2" color="#009cdc">
                <h2 class="sideHeader">Courses</h2>
                <v-list-item
                  v-for="(item, i) in userCourseItems"
                  :key="i"
                  :to="item.route"
                  color="#009cdc"
                  v-model="course_active_list"
                  class="listItem"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

              <!--Community -->
              <v-list-item-group v-model="item3" color="#009cdc">
                <h2 class="sideHeader">Community</h2>
                <v-list-item
                  v-for="(item, i) in communityItems"
                  :key="i"
                  :to="item.route"
                  v-model="community_active_list"
                  color="#009cdc"
                  class="listItem"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

              <!--Ongoing -->
              <v-list-item-group v-model="item4">
                <h2 class="sideHeader">Ongoing</h2>
                <v-list-item
                  v-for="(item, i) in ongoingItems"
                  :key="i"
                  :to="item.route"
                  v-model="ongoing_active_list"
                  color="#009cdc"
                  class="listItem"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </div>
      </div>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="drawer" app v-else>
      <div class="flex-container">
        <div class="v-navigation-drawer__content">
          <!-- logo -->
          <v-col id="logoCol">
            <br />
            <img class="logo-private" src="../../public/img/logo.png" />
            <br />
          </v-col>
          <v-col col="3" class="navCol">
            <v-list>
              <!--Accounts -->
              <v-list-item-group color="#009cdc" class="margin-btm">
                <h2 class="sideHeader">Account</h2>
                <v-list-item
                  v-for="(item, i) in accountItems"
                  :key="i"
                  :to="item.route"
                  color="#009cdc"
                  v-model="active_list"
                  class="listItem"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

              <!--Courses -->
              <v-list-item-group v-model="item2" color="#009cdc">
                <h2 class="sideHeader">Courses</h2>
                <v-list-item
                  v-for="(item, i) in instructorCourseItems"
                  :key="i"
                  :to="item.route"
                  color="#009cdc"
                  v-model="course_active_list"
                  class="listItem"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

              <!--Community -->
              <v-list-item-group v-model="item3" color="#009cdc">
                <h2 class="sideHeader">Community</h2>
                <v-list-item
                  v-for="(item, i) in communityItems"
                  :key="i"
                  :to="item.route"
                  v-model="community_active_list"
                  class="listItem"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

              <!--Ongoing -->
              <v-list-item-group v-model="item4" color="#009cdc">
                <h2 class="sideHeader">Ongoing</h2>
                <v-list-item
                  v-for="(item, i) in ongoingInstructorItems"
                  :key="i"
                  :to="item.route"
                  v-model="ongoing_active_list"
                  class="listItem"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </div>
      </div>
    </v-navigation-drawer>

    <!--   <v-navigation-drawer
      v-else-if=""
      class="sideBar"
      color="#ededed"
      v-model="drawer"
      fixed
      temporary
    >
      <v-list nav dense>
        <v-list-item-group active-class="red lighten-5--text text--accent-4">
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
            v-for="item in ongoingInstructorItems"
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
 -->
    <v-main class="body">
      <v-app-bar
        xs12
        row
        color="blue darken-4"
        fixed
        class="appBar"
        height="60%"
      >
        <v-app-bar-nav-icon
          @click="drawer = !drawer"
          class="hidden-lg-and-up"
        ></v-app-bar-nav-icon>
        <v-menu offset-y>
          <v-list class="hidden-md-and-up" color="#009cdc">
            <v-list-item v-for="item in menu" :key="item.icon" color="#009cdc" class="listItem">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-toolbar-title class="logo"
          ><router-link to="/home" class="logoLink"
            >NTU-LMS</router-link
          ></v-toolbar-title
        >

        <v-spacer></v-spacer>

        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn v-for="(item, i) in menu" :key="i" :to="item.route" text>{{
            item.title
          }}</v-btn>
        </v-toolbar-items>

        <!-- user icon + notification bell -->
        <v-menu v-if="isNoticfication" :nudge-width="200" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-badge
              color="error"
              :content="notificationCount"
              overlap
              offset-x="22"
              offset-y="26"
            >
              <v-btn v-bind="attrs" v-on="on" icon>
                <v-icon large color="green darken-2" class="notification">
                  mdi-bell
                </v-icon>
              </v-btn>
            </v-badge>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in notificationsList"
              :key="i"
              @click="selectNotification(item, i)"
            >
              <v-list-item-content class="listItem">
                <v-list-item-title id="header">{{
                  item.header
                }}</v-list-item-title>
                <v-list-item-subtitle id="content">{{
                  item.content
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-icon v-else large color="green darken-2" class="notification">
          mdi-bell
        </v-icon>

        <v-menu :nudge-width="200" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on" class="avatar">
              <v-avatar size="48" id="iconImg"> </v-avatar>
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

      <div id="main">
        <router-view :key="$route.fullPath"></router-view>
      </div>

      <!-- Notification dialog -->
      <v-dialog v-model="notificationReview" persistent scrollable width="70%">
        <v-card tile height="100%" color="#e1f5fe" class="reviewCard">
          <v-toolbar fixed dark color="primary">
            <v-btn icon dark @click="notificationReview = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Submit Review.</v-toolbar-title>
          </v-toolbar>
          <!-- Survey component -->
          <div id="dialogContent">
            <survey-viewer
              :review="this.review"
              type="review"
              :reviewIndex="reviewIndex"
              :courseRef="courseRef"
              :reference="reference"
            ></survey-viewer>
          </div>
        </v-card>
      </v-dialog>

      <v-dialog v-model="notificationSurvey" persistent scrollable width="70%">
        <v-card tile height="100%" color="#e1f5fe" class="reviewCard">
          <v-toolbar fixed dark color="primary">
            <v-btn icon dark @click="notificationSurvey = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Submit Review.</v-toolbar-title>
          </v-toolbar>
          <!-- Survey component -->
          <div id="dialogContent">
            <survey-viewer
              :review="this.review"
              type="review"
              :notificationIndex="notificationIndex"
              :courseRef="courseRef"
              :reference="reference"
            ></survey-viewer>
          </div>
        </v-card>
      </v-dialog>
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
      active_list: "",
      course_active_list: "",
      ongoing_active_list: "",
      community_active_list: "",
      item: 1,
      item2: 1,
      item3: 1,
      item4: 1,
      isUser: true,
      isNoticfication: false,
      notificationReview: false,
      notificationSurvey: false,
      review: [],
      reviewIndex: 0,
      notificationIndex: 0,
      survey: [],
      reference: "",
      courseRef: "",
      notificationCount: 5,
      notificationsList: [],
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
        { title: "Registered", route: "/courses-taken" },
        { title: "Your Course", route: "/courses-created" },
        { title: "Course Creation", route: "/course/create" },
      ],
      userCourseItems: [
        { title: "Browse", route: "/browse" },
        { title: "Course Taken", route: "/courses-taken" },
      ],
      communityItems: [{ title: "Discussion", route: "/discussion" }],
      ongoingItems: [{ title: "Classes", route: "/classes" }],
      ongoingInstructorItems: [
        { title: "Classes", route: "/classes" },
        { title: "Students", route: "/students" },
      ],
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
      if (this.userDetails.notifications.length > 0) {
        this.isNoticfication = true
        this.notificationCount = this.userDetails.notifications.length
        this.notificationsList = this.userDetails.notifications
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
        d.style.transform = "translate3d(100px, 0px, 0px)"
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
      let d = document.getElementById("iconImg")
      d.innerHTML = ""
      d.innerHTML = this.profileImage
    },
    async selectNotification(data, index) {
      console.log("JJ", data, index)
      if (data.type == "survey") {
        this.$router
          .push({ path: "/survey", query: { reference: data.reference } })
          .catch((err) => {})
      } else {
        let rv = await http.get("/api/me/review", {
          params: {
            reference: data.instructor,
          },
        })
        this.courseRef = data.courseRef
        this.reference = data.instructor
        this.notificationIndex = index
        this.review = rv.data.survey
        this.notificationReview = true
      }
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

.appBar {
  margin-left: 250px;
  border-bottom: 1px solid lightgrey;
}

.appBar .v-btn,
.appBar .v-text-field {
  color: white;
}

.appBar .theme--light.v-input input,
.theme--light.v-input textarea {
  color: white !important;
}

input:-internal-autofill-selected {
  background-color: transparent !important;
}

.body {
  position: relative;
  display: flex;
}

.theme--light.v-btn--active::before {
  opacity: 0;
}

.header {
  color: white;
  font-size: 30px;
  margin-left: 2%;
}

#main {
  margin-top: 5%;
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

.avatar {
  margin-right: 1% !important;
  margin-left: 1% !important;
}

/* .listItem {
  padding-top: 0;
  border-bottom: 1px solid lightgrey;
}

.listItem #header {
  font-family: "DarkerGrotesque-Medium";
  font-size: 28px;
  color: darkblue;
}

.listItem #content {
  font-family: "DarkerGrotesque-Medium";
  font-size: 20px;
} */

.logo {
  width: 150px;
  margin-left: 2%;
}

.logoLink {
  color: white;
  text-decoration: none;
}

.logo-private {
  display: flex;
  height: 100px;
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

/* .sideBar {
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
} */

.navCol,
#logoCol {
  padding: 0;
  text-align: center;
}

.sideHeader {
  color: #0d47a1;
  font-size: 30px;
}

.listItem:hover {
  background-color: #009cdc;
  color:white !important;
}


.v-list-item__title {
  font-size: calc(14px + (20 - 14) * ((100vw - 300px) / (1920 - 300)));
}

.v-list-item__content {
  padding: 0% !important;
  height: 56px;
  width: 220px !important;
}

@media screen and (max-width: 1264px) {
  .appBar {
    width: 100%;
    margin-left: 0;
    border-bottom: 1px solid lightgrey;
  }
}
</style>