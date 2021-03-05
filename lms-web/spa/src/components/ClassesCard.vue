<template>
  <div class="template">
    <v-flex xs12 row v-if="type == 'block'">
      <v-col cols="5" md="5" lg="7" class="title">
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
      <v-col cols="2" md="2" lg="2" class="stats">
        <h2>Batch</h2>
        <div>{{this.block.batchID}}</div>
        <div>Start Date: {{dateFormat(this.block.startDate)}}</div>
      </v-col>
      <v-col cols="4" md="2" lg="2" class="stats">
        <h2>Status</h2>
        <div v-if="status && !ended">Available</div>
        <div v-else-if ="!status && !ended">Will be open 7 days before course start</div>
        <div v-else-if ="status && ended && !user">Course have ended. Click on the red cross to closed the class.</div>
        <div v-else-if ="status && ended && user">Course have ended.</div>
      </v-col>
      <v-col cols="1" md="2" lg="1" class="btnCol" v-if="ended && !user">
        <v-btn class="closeBtn" icon color="red" @click="deleteClass">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-col>
    </v-flex>

    <v-flex xs12 row v-else-if="(type == 'thread') & (type2 == 'notice')">
      <v-col cols="2" md="2" lg="1" class="profile" @click="gotoProfile(block.author)">
        <div class="icon" :id="block.id"></div>
        <div class="name">{{ this.userDetails.name }}</div>
        <div></div>
      </v-col>
      <v-col cols="7" md="7" lg="9" class="title">
        <router-link
          class="link"
          :to="{
            path: `/classes/thread/notice`,
            query: {
              courseRef: this.courseRef,
              batch: this.batchID,
              id: this.block.id,
            },
          }"
          >{{ block.title }}</router-link
        >
        <div class="btmRow">
          {{ block.author }}, {{ new Date(block.created).toLocaleString() }}
        </div>
      </v-col>
      <v-col cols="3" md="3" lg="2" class="tStats padTop">
        <div>{{ latest.author }}</div>
        <div>{{ latest.date }}</div>
      </v-col>
    </v-flex>

    <v-flex xs12 row v-else-if="type == 'message'">
      <v-col cols="3" md="3" lg="2" class="profile" @click="gotoProfile(block.email)">
        <div class="icon" :id="block.id"></div>
        <div class="name">{{ userDetails.name }}</div>
      </v-col>
      <v-col cols="9" md="9" lg="10" class="title">
        <div class="topRow">{{ new Date(block.created).toLocaleString() }}</div>
        <div class="content">
          <p v-html="block.message">
          </p>
        </div>
      </v-col>
    </v-flex>

    <v-flex xs12 row v-else-if="(type == 'thread') & (type2 == 'quiz')">
      <v-col cols="2" md="2" lg="1" class="profile" @click="gotoProfile(block.author)">
        <div class="icon" :id="block.id"></div>
        <div class="name">{{ this.userDetails.name }}</div>
        <div></div>
      </v-col>
      <v-col cols="7" md="7" lg="9" class="title">
        <v-btn text class="quizBtn" @click="quizDialog = true">{{
          block.title
        }}</v-btn>
        <v-btn
          v-if="!user"
          icon
          color="indigo"
          @click="quizEditDialog(block.id)"
          ><v-icon>mdi-pencil</v-icon></v-btn
        >
        <div class="btmRow">
          {{ block.author }}, {{ new Date(block.created).toLocaleString() }}
        </div>
      </v-col>
      <v-col v-if="user" cols="3" md="3" lg="2" class="tStats">
        <div>Status</div>
        <div>{{ quizStatus }}</div>
      </v-col>
      <v-col v-else cols="3" md="3" lg="2" class="tStats">
        <div>
          <v-btn text @click="viewQuizResults">View</v-btn>
          <v-btn text @click="viewQuizStats">Statistics</v-btn>
        </div>
      </v-col>
    </v-flex>

    <v-flex xs12 row v-else-if="(type == 'thread') & (type2 == 'feedback')">
      <v-col cols="2" md="2" lg="1" class="profile" @click="gotoProfile(block.author)">
        <div class="icon" :id="block.id"></div>
        <div class="name">{{ this.userDetails.name }}</div>
        <div></div>
      </v-col>
      <v-col cols="7" md="7" lg="9" class="title">
        <router-link
          class="link"
          :to="{
            path: `/classes/thread/question`,
            query: {
              courseRef: this.courseRef,
              batch: this.batchID,
              id: this.block.id,
            },
          }"
          >{{ block.title }}</router-link
        >
        <div class="btmRow">
          {{ block.author }}, {{ new Date(block.created).toLocaleString() }}
        </div>
      </v-col>
      <v-col cols="3" md="3" lg="2"  class="tStats padTop">
        <div>{{ latest.title }}</div>
        <div>{{ latest.author }}</div>
      </v-col>
    </v-flex>

    <!-- Dialog -->
    <!-- View Quiz -->
    <v-dialog v-model="quizDialog" persistent scrollable>
      <v-card tile height="100%" color="#e1f5fe">
        <v-toolbar fixed dark color="primary">
          <v-btn icon dark @click="quizDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Complete The Quiz.</v-toolbar-title>
        </v-toolbar>
        <!-- Quiz component -->
        <div id="dialogContent">
          <survey-viewer
            type="quiz"
            :quiz="this.block"
            :quizID="this.quizID"
            :courseRef="this.courseRef"
            :batchID="this.batchID"
          ></survey-viewer>
        </div>
      </v-card>
    </v-dialog>

    <!-- Edit Quiz -->
    <v-dialog v-model="quizEdit" persistent scrollable>
      <v-card tile height="100%" color="#e1f5fe">
        <v-toolbar fixed dark color="primary">
          <v-btn icon dark @click="quizEdit = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Update The Quiz.</v-toolbar-title>
        </v-toolbar>
        <!-- Quiz component -->
        <div id="dialogContent">
          <survey-builder
            type="quizEdit"
            :quiz="this.block"
            :quizID="this.quizID"
            :courseRef="this.courseRef"
            :batchID="this.batchID"
          ></survey-builder>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"
import SurveyViewer from "./SurveyViewer.vue"

export default {
  components: { SurveyViewer },
  name: "ClassesCard",
  props: {
    block: Object,
    type: String,
    type2: String,
    courseRef: String,
    batchID: String,
    user: Boolean,
  },
  data() {
    return {
      course: null,
      status: false, //more than 7 days to start = false
      ongoing: false,
      ended: false,
      userDetails: null,
      quizStatus: "Incomplete",
      quizDialog: false,
      quizEdit: false,
      quizID: null,
      latest: {
        author: "No Post",
        date: "",
      },
    }
  },
  async mounted() {
    if (this.type != "block") {
      await this.getUser()
      await this.getImage()
    } else {
      //type=block
      let rv = await http.get("/api/me/course", {
        params: {
          courseRef: this.block.courseRef,
        },
      })
      this.course = rv.data
      let currentDate = new Date().toISOString()
      let currentTime = new Date(currentDate).getTime() / 1000
      let startTime = new Date(this.block.startDate).getTime() / 1000
      let endTime = new Date(this.block.endDate).getTime() / 1000
      let dayDiff = Math.ceil((startTime - currentTime) / 86400)

      if (dayDiff < 7) {
        this.status = true
      } 
      if (endTime < currentTime) {
        this.ended = true
      }

      if (currentDate > this.block.endDate) {
        this.ended = true
      }
    }

    if (this.type2 == "quiz") {
      console.log(this.type2, this.courseRef, this.batchID)
      let result = await http.get("/api/me/quizResult", {
        params: {
          courseRef: this.courseRef,
          batchID: this.batchID,
          quizID: this.block.id,
        },
      })

      if (result.data.found) {
        this.quizStatus = "Completed"
      } else {
        this.quizStatus = "Incomplete"
      }
    } else if ((this.type2 == "notice")) {
      let index = this.block.replies.length
      if (index > 0) {
        this.latest.author = this.block.replies[index - 1].author
        let date = this.block.replies[index - 1].created

        this.latest.date = new Date(date).toLocaleString()
      }
    }
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  methods: {
    async deleteClass() {
      try {
        let rv = await http.post("/api/me/classes/closed", {
          courseRef: this.block.courseRef,
          batchID: this.block.batchID,
        })
        if (rv) [this.$router.go()]
      } catch (e) {}
    },
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
    },
    viewQuizResults() {
      this.$router.push({
        path: "/classes/quiz/list",
        query: {
          ref: this.courseRef,
          batchID: this.batchID,
          quizID: this.block.id,
        },
      })
    },
    viewQuizStats() {
      this.$router.push({
        path: "/classes/quiz/stats",
        query: {
          ref: this.courseRef,
          batchID: this.batchID,
          quizID: this.block.id,
        },
      })
    },
    dateFormat(date) {
      return new Date(date).toLocaleString().split(',')[0]
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
.stats,
.tStats {
  border-left: 1px solid blue;
  font-family: "DarkerGrotesque-Medium";
  padding-bottom: 0;
  padding-top: 0;
}

.btnCol {
  border-left: 1px solid blue;
  font-family: "DarkerGrotesque-Medium";
  padding: 0;
}

.padTop {
  padding-top: 1%;
}

/* Thread */
.title .btmRow {
  font-family: "DarkerGrotesque-Medium";
  display: flex;
}

.tStats {
  font-weight: bold;
}

.stats h2 {
  line-height: 1;
}

.stats div {
  font-size:calc(12px + (18 - 12) * ((100vw - 300px) / (1920 - 300)));
}

.link {
  font-family: "DarkerGrotesque-Bold";
   font-size:calc(16px + (28 - 16) * ((100vw - 300px) / (1920 - 300)));
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

.content p {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(16px + (24 - 16) * ((100vw - 300px) / (1920 - 300)));
  margin-left: 0%;
}

.quizBtn {
  font-family: "DarkerGrotesque-Bold";
   font-size:calc(14px + (28 - 14) * ((100vw - 300px) / (1920 - 300)));
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

.fileRow {
  display: flex;
}
</style>