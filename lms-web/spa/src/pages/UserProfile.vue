<template>
  <v-container fluid v-if="user" class="profileContainer">
    <v-row>
      <!-- avatar -->
      <v-col cols="12" xs="12" md="5">
        <div class="profileImg" id="profileImg">Hello</div>
      </v-col>
      <!-- Stats -->
      <v-col cols="12" xs="12" md="7">
        <div class="stats">
          <v-row>
            <v-col cols="9">
              <div class="statsContent">
                <h1>Student Level 1</h1>
                <div>
                  <v-progress-linear
                    v-model="progressValue"
                  ></v-progress-linear>
                </div>
              </div>
            </v-col>
            <v-col cols="3" class="expContainer">
              <v-row>
                <div class="center">
                  <v-icon size="64" color="#FF1100"
                    >mdi-book-open-variant</v-icon
                  >
                </div>
                <div class="exp">
                  <h1>200</h1>
                </div>
              </v-row>
            </v-col>
          </v-row>
          <hr />
          <v-row>
            <v-col cols="6">
              <div class="leftStats">
                <v-row class="statsItem">Courses: 2</v-row>
                <v-row class="statsItem">Accounting</v-row>
                <v-row class="statsItem">Accounting</v-row>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="leftStats">
                <v-row class="statsItem">Comments: 20</v-row>
                <v-row class="statsItem">Accounting</v-row>
                <v-row class="statsItem">Accounting</v-row>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <div class="courseContainer">
      <h1>Your Courses</h1>
      <div>course</div>
    </div>

    <div class="achievementContainer">
      <h1>Your Achievement</h1>
      <div>...</div>
    </div>
  </v-container>

  <v-container fluid v-else class="profileContainer">
    <v-row>
      <!-- avatar -->
      <v-col cols="12" xs="12" md="5">
        <div class="profileImg"></div>
      </v-col>
      <!-- Stats -->
      <v-col cols="12" xs="12" md="7">
        <div class="stats">
          <v-row>
            <v-col cols="9">
              <div class="statsContent">
                <h1>{{userDetails.rank}} Instructor Level {{ userDetails.level }}</h1>
                <div>
                  <v-progress-linear
                    v-model="progressValue"
                  ></v-progress-linear>
                </div>
              </div>
            </v-col>
            <v-col cols="3" class="expContainer">
              <v-row>
                <div class="center">
                  <v-icon size="64" color="#FF1100"
                    >mdi-book-open-variant</v-icon
                  >
                </div>
                <div class="exp">
                  <h1>{{this.userDetails.knowledgePoints}}</h1>
                </div>
              </v-row>
            </v-col>
          </v-row>
          <hr />
          <v-row>
            <v-col cols="6">
              <div class="leftStats">
                <v-row class="statsItem">Students: {{this.stats.studentsCount}}</v-row>
                <v-row class="statsItem">Courses: {{this.stats.courseTaken}}</v-row>
                <v-row class="statsItem">Accounting</v-row>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="leftStats">
                <v-row class="statsItem">Rating: 4.5/5</v-row>
                <v-row class="statsItem">Comments: {{this.stats.discussionPoints}}</v-row>
                <v-row class="statsItem">Accounting</v-row>
              </div>
            </v-col>
          </v-row>
          <v-row class="statsBtmRow">
               <v-btn class="btn" @click="achievements()">Achievements</v-btn>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <div class="courseContainer">
      <div class="topRow">
        <h1>Your Courses</h1>
        <v-btn class="btn" color="#E1F5FE" @click="coursesAll()">See All</v-btn>
      </div>
      
      <div class="courseRow">
         <course-card
          v-for="course in courses"
          :key="course._id"
          :course="course"
          >
         </course-card>
      </div>
    </div>

    <div class="achievementContainer">
      <div class="topRow">
        <h1>Your Achievement</h1>
        <v-btn class="btn" color="#E1F5FE" @click="achieveAll()">See All</v-btn>
      </div>
      
      <div>...</div>
    </div>

    <div class="reviewContainer">
         <h1 style="margin-bottom: 2%">Reviews</h1>
     
      <div>
        <review-section
          v-for="review in reviews"
          :key="review._id"
          :review="review"
        ></review-section>
      </div>
      <div class="text-center">
        <v-pagination
          v-model="reviewsCurrentPage"
          :length="this.reviewsTotalPages"
          :total-visible="7"
          circle
          @input="getReviews()"
        ></v-pagination>
      </div>
    </div>
  </v-container>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
      userDetails: "",
      stats: "",
      achievements: "",
      user: true,
      profileImage: "",
      progressValue: 0,
      reviews: [],
      reviewsCurrentPage: 1,
      reviewsPageCount: 0,
      reviewsPageSize: 5,
      reviewsTotalPages: 0,
      courses: [],
      totalCourse: ''
    }
  },
  created() {},
  computed: {
    loading() {
      return this.$store.getters.loading
    },
  },
  async mounted() {
    try {
      const rv = await http.get("/api/me")
      this.userDetails = rv.data
      this.profileImage = this.userDetails.profileImage
      if (this.userDetails.role != "user") {
        this.user = false
        this.getReviews()
      }
      this.insertImage()
      this.getCourses()
      this.getExp()
      this.getStats()
    } catch (e) {}
  },
  methods: {
    insertImage() {
      let d = document.getElementById("profileImg")
      d.innerHTML = ""
      d.innerHTML = this.profileImage
    },
    async getReviews() {
      try {
        const { data } = await http.get("/api/me/reviews", {
          params: {
              email: this.userDetails.email,
              currentPage: this.reviewsCurrentPage,
              pageSize: this.reviewsPageSize,
          }
        })
        this.reviews = data.reviews
        this.reviewsTotalPages = Math.ceil(data.total / this.reviewsPageSize)
      } catch (e) {
        console.log(e)
      }
    },
    async getCourses() {
      const { data } = await http.get("/api/me/courses", {
          params: {
              email: this.userDetails.email,
              role: this.userDetails.role,
          }
      })
      this.courses = data.courses
      this.totalCourse = data.total
    },
    async getStats() {
      const rv2 = await http.get("/api/me/stats")
      const rv3 = await http.get("/api/me/achievements")
      this.stats = rv2.data
      this.achievements = rv3.data
    },
    getExp() {
      let maxExp = 100
      if(this.userDetails.level != 1) {
        maxExp *= (this.user.userDetails.level) * 1.5
      }
      this.progressValue = (this.userDetails.knowledgePoints / maxExp) * 100
      
    }
  },
}
</script>
<style>
.profileImg svg {
  width: 600px;
  height: 380px;
}
</style>
<style scoped>
.profileContainer {
  width: 90%;
  margin: auto
}

.border {
  border: 1px solid black;
}

.profileImg {
  width: 90%;
  margin: auto;
  height: 400px;
  background-color: burlywood;
  outline: 15px solid brown;
}

.stats {
  font-family: "DarkerGrotesque-Medium";
  border: 1px solid black;
  margin: auto;
  height: 400px;
  background-color: white;
}

.statsContent {
  margin-left: 1%;
}

.progress {
  width: 80%;
}

.expContainer {
  padding-left: 3%;
}

.exp {
  margin: 5%;
}

.leftStats {
  margin-left: 4%;
}

.statsItem {
  font-size: 24px;
  margin-bottom: 8%;
  margin-left: 1%;
}

.statsBtmRow {
  margin:2%;
}

.statsBtnRow .btn .v-btn__content {
  text-transform: none;
}

.courseContainer,
.achievementContainer {
  margin-top: 4%;
}

.reviewContainer {
  height: auto;
  margin-top: 4%;
}

.courseContainer h1,
.achievementContainer h1,
.reviewContainer h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: 46px;
  color: #0d47a1;
  margin-left: 1%;
}

.courseRow {
  display:flex;
  flex-direction: row;
  width: 90%;
  margin: auto;
}

.topRow h1 {
  float: left;
}

.topRow .btn {
  text-transform: none;
  text-decoration: underline;
  float: right;
  color: #0d47a1;
}

.topRow .v-btn--contained {
  box-shadow: none;
}
</style>