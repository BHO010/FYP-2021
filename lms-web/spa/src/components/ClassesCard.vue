<template>
  <div class="template">
    <v-flex xs12 row v-if="type == 'block'">
      <v-col cols="8" class="title">
        <router-link
          v-if="status"
          class="link"
          :to="{
            path: `/classes`,
            query: { ref: block.courseRef, batch: block.batchID },
          }"
          >{{ course.title }}</router-link
        >
        <div v-else>{{ course.title }}</div>
      </v-col>
      <v-col cols="3" class="stats">
        <h2>Status</h2>
        <div v-if="status">Available</div>
        <div v-else>Will be open 7 days before course start</div>
        <div v-if="ongoing">Available</div>
      </v-col>
      <v-col cols="1" class="stats" v-if="ended">
        <v-btn icon color="red" @click="deleteClass">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-col>
    </v-flex>

    <v-flex xs12 row v-if="(type == 'thread') & (type2 == 'notice')">
      <v-col cols="1" class="profile" @click="gotoProfile(block.author)">
        <div class="icon" :id="block.id"></div>
        <div class="name">{{ this.userDetails.name }}</div>
        <div></div>
      </v-col>
      <v-col cols="9" class="title">
        <router-link
          class="link"
          :to="{
            path: `/classes/thread`,
            query: { courseRef: courseRef, batch: batchID },
          }"
          >{{ block.title }}</router-link
        >
        <div class="btmRow">{{ block.author }}, {{ block.created }}</div>
      </v-col>
      <v-col cols="2" class="stats">
        <!--  <div>{{ block.latest.title }}</div>
          <div>{{ block.latest.author }}</div> -->
      </v-col>
    </v-flex>

    <v-flex xs12 row v-if="(type == 'thread') & (type2 == 'quiz')">
      <v-col cols="1" class="profile" @click="gotoProfile(block.author)">
        <div class="icon" :id="block.id"></div>
        <div class="name">{{ this.userDetails.name }}</div>
        <div></div>
      </v-col>
      <v-col cols="9" class="title">
        <v-btn text class="quizBtn" @click="quizDialog = true">{{block.title}}</v-btn>
        <div class="btmRow">{{ block.author }}, {{ block.created }}</div>
      </v-col>
      <v-col cols="1.5" class="stats">
        <div>Attempt</div>
        <div>3/3</div>
      </v-col>
    </v-flex>

    <v-flex xs12 row v-if="(type == 'thread') & (type2 == 'feedback')">
      <v-col cols="1" class="profile" @click="gotoProfile(block.author)">
        <div class="icon" id="profile"></div>
        <div class="name">{{ this.userDetails.name }}</div>
        <div></div>
      </v-col>
      <v-col cols="9" class="title">
        <router-link
          class="link"
          :to="{
            path: `/classes/thread`,
            query: { courseRef: courseRef, batch: batchID },
          }"
          >{{ block.title }}</router-link
        >
        <div class="btmRow">{{ block.author }}, {{ block.created }}</div>
      </v-col>
      <v-col cols="2" class="stats">
        <!--  <div>{{ block.latest.title }}</div>
          <div>{{ block.latest.author }}</div> -->
      </v-col>
    </v-flex>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  name: "ClassesCard",
  props: {
    block: Object,
    type: String,
    type2: String,
    courseRef: String,
    batchID: String,
  },
  data() {
    return {
      course: null,
      status: true, //more than 7 days to start = false
      ongoing: false,
      ended: false,
      userDetails: null,
      quizDialog: false
    }
  },
  async mounted() {
    if (this.type != "block") {
      await this.getUser()
      await this.getImage()
    } else {
      let rv = await http.get("/api/me/course", {
        params: {
          courseRef: this.block.courseRef,
        },
      })
      this.course = rv.data
      let currentDate = new Date().toISOString()
      let currentTime = new Date(currentDate).getTime() / 1000
      let startTime = new Date(this.block.startDate).getTime() / 1000

      let dayDiff = Math.ceil((startTime - currentTime) / 86400)

      if (this.block.startDate < currentDate) {
        this.ongoing = true
      } else if (dayDiff < 7) {
        this.status = true
      }

      if (currentDate > this.block.endDate) {
        this.ended = true
      }
    }
  },
  computed: {},
  methods: {
    async deleteClass() {},
    async getUser() {
      try {
        let rv = await http.get("api/me/user", {
          params: {
            email: this.block.author,
          },
        })
        this.userDetails = rv.data
      } catch (e) {}
    },
    getImage() {
      let d = document.getElementById(this.block.id)
      d.innerHTML = ""
      d.innerHTML = this.userDetails.profileImage
    },
  },
}
</script>


<style>
#icon svg {
  width: 80px;
  height: 80px;
}
</style>
<style scoped>
.template {
  border: 1px solid black;
  margin-bottom: 2%;
  width: 100%;
}

.row {
  margin: 0;
}

.title,
.stats {
  border-left: 1px solid blue;
  font-family: "DarkerGrotesque-Medium";
  padding-top: 0;
  padding-bottom: 0;
}

/* Thread */
.title .btmRow {
  font-family: "DarkerGrotesque-Medium";
  display: flex;
}

.stats h2 {
  line-height: 1;
}

.stats div {
  font-size: 18px;
}

.link {
  font-family: "DarkerGrotesque-Bold";
  font-size: 28px;
  text-decoration: underline;
}

.profile {
  border: 1px solid blue;
}

.profile:hover {
  opacity: 0.55;
}

.icon {
  display: flex;
  align-content: center;
  justify-content: center;
}

.name {
  font-weight: bold;
  text-align: center;
}

.quizBtn {
  font-family: "DarkerGrotesque-Bold";
  font-size: 28px;
  text-decoration: underline;
  text-transform: none;
  color: #1976d2;
  padding: 0 !important;
}

</style>