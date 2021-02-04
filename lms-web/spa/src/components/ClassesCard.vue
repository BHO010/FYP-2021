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
            query: { courseRef: this.courseRef,batch: this.batchID,id:this.block.id },
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

    <v-flex xs12 row v-else-if="type == 'message'">
        <v-col cols="2" class="profile" @click="gotoProfile(block.email)">
          <div class="icon" :id="block.id"></div>
          <div class="name">{{userDetails.name}}</div>
        </v-col>
        <v-col cols="10" class="title">
          <div class="topRow">{{block.created}}</div>
          <div class="content">
            <p>
              {{block.message}}
            </p>
          </div>
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
        <v-btn icon color="indigo" @click="quizEditDialog(block.id)"><v-icon>mdi-pencil</v-icon></v-btn>
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

    <!-- Dialog -->
    <!-- View Quiz -->
    <v-dialog v-model="quizDialog" persistent scrollable>
        <v-card tile  height="100%" color="#e1f5fe">
          <v-toolbar  fixed dark color="primary">
            <v-btn icon dark @click="quizDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Complete The Quiz.</v-toolbar-title>
          </v-toolbar>
          <!-- Quiz component -->
          <div id="dialogContent">
              <survey-viewer type="quiz"></survey-viewer>
          </div>
        </v-card>
    </v-dialog>

     <!-- Edit Quiz -->
    <v-dialog v-model="quizEdit" persistent scrollable>
        <v-card tile  height="100%" color="#e1f5fe">
          <v-toolbar  fixed dark color="primary">
            <v-btn icon dark @click="quizEdit = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Update The Quiz.</v-toolbar-title>
          </v-toolbar>
          <!-- Quiz component -->
          <div id="dialogContent">
              <survey-builder type="quizEdit" :quiz="this.block" :quizID='this.quizID' :courseRef='this.courseRef' :batchID='this.batchID'></survey-builder>
          </div>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"
import SurveyViewer from './SurveyViewer.vue'

export default {
  components: { SurveyViewer },
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
      quizDialog: false,
      quizEdit: false,
      quizID: null
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
            email: this.block.email,
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
    quizEditDialog(id) {
        this.quizID = id
        this.quizEdit = true
    }
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

.title .topRow {
  font-family: "DarkerGrotesque-Medium";
  border-bottom: 1px solid lightgrey;
}

.content {
  font-family: "DarkerGrotesque-Medium";
  margin-top: 1%;
  margin-bottom: 1%;
}

.quizBtn {
  font-family: "DarkerGrotesque-Bold";
  font-size: 28px;
  text-decoration: underline;
  text-transform: none;
  color: #1976d2;
  padding: 0 !important;
}

#dialogContent {
    width: 80%;
    margin: auto;
    margin-top: 2%;
    margin-bottom: 2%;
}

</style>