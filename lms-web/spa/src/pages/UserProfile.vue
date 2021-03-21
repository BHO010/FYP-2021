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
                <h1>
                  {{ rank[index] }} Student Level
                  {{ userLevel }}
                </h1>
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
                  <h1>{{ userDetails.knowledgePoints }}</h1>
                </div>
              </v-row>
            </v-col>
          </v-row>
          <hr />
          <v-row>
            <v-col cols="6">
              <div class="leftStats">
                <v-row class="statsItem">Courses: {{ stats.registered }}</v-row>
                <v-row class="statsItem"
                  >Discussion Points: {{ stats.discussionPoints }}</v-row
                >
                <v-row class="statsItem">Accounting</v-row>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="leftStats">
                <v-row class="statsItem"
                  >Comment Upvotes: {{ stats.upvotes }}</v-row
                >
                <v-row class="statsItem"
                  >Comment Downvotes: {{ stats.downvotes }}</v-row
                >
                <v-row class="statsItem">Accounting</v-row>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <div class="courseContainer">
      <div class="topRow">
        <h1>Courses Taken</h1>
        <v-btn class="btn" color="#E1F5FE" @click="coursesAll('user')"
          >See All</v-btn
        >
      </div>
      <div v-if="courses.length > 0" class="courseRow">
        <course-card
          v-for="course in courses"
          :key="course._id"
          :course="course"
          type="registered"
        >
        </course-card>
      </div>
      <div v-else class="courseRow">
        <p>You do not have any courses yet</p>
      </div>
    </div>

    <div class="achievementContainer">
      <div class="topRow">
        <h1>Your Achievement</h1>
        <v-btn class="btn" color="#E1F5FE" @click="achieveAll()">See All</v-btn>
      </div>
      <div v-if="achievements.length > 0" class="achieveRow">
        <achievement-card
          v-for="achievement in achievements"
          :key="achievement.id"
          :achievement="achievement"
          type="profile"
        >
        </achievement-card>
      </div>
      <div v-else class="achieveRow">
        <p>You do not have nay achievements yet</p>
      </div>
    </div>
  </v-container>

  <v-container fluid v-else class="profileContainer">
    <v-row>
      <!-- avatar -->
      <v-col cols="12" md="12" lg="5">
        <div class="profileImg"></div>
      </v-col>
      <!-- Stats -->
      <v-col cols="12" md="12" lg="7">
        <div class="stats">
          <v-row>
            <v-col cols="9">
              <div class="statsContent">
                <h1>
                  {{ rank[index] }} Instructor Level
                  {{ userDetails.level }}
                </h1>
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
                  <h1>{{ this.userDetails.knowledgePoints }}</h1>
                </div>
              </v-row>
            </v-col>
          </v-row>
          <hr />
          <v-row>
            <v-col cols="6">
              <div class="leftStats">
                <v-row class="statsItem"
                  >Students: {{ stats.studentsCount }}</v-row
                >
                <v-row class="statsItem"
                  >Courses: {{ stats.courseCreated }}</v-row
                >
                <v-row class="statsItem"
                  >Registered: {{ stats.registered }}</v-row
                >
              </div>
            </v-col>
            <v-col cols="6">
              <div class="leftStats">
                <v-row class="statsItem"
                  >Rating: {{ stats.totalRate / stats.rateCount || 0 }}/5</v-row
                >
                <v-row class="statsItem"
                  >Comments: {{ stats.discussionPoints }}</v-row
                >
                <v-row class="statsItem"
                  >Discussion Points: {{ stats.discussionPoints }}</v-row
                >
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <div class="courseContainer">
      <div class="topRow">
        <h1>Courses Owned</h1>
        <v-btn class="btn" color="#E1F5FE" @click="coursesAll('instructor')"
          >See All</v-btn
        >
      </div>

      <div v-if="courses.length > 0" class="courseRow">
        <course-card
          v-for="course in courses"
          :key="course._id"
          :course="course"
        >
        </course-card>
      </div>

      <div v-else class="courseRow">
        <p>You do not have any courses yet</p>
      </div>
    </div>

    <div class="achievementContainer">
      <div class="topRow">
        <h1>Your Achievement</h1>
        <v-btn class="btn" color="#E1F5FE" @click="achieveAll()">See All</v-btn>
      </div>

      <div v-if="achievements.length > 0" class="achieveRow">
        <achievement-card
          v-for="achievement in achievements"
          :key="achievement.id"
          :achievement="achievement"
          type="profile"
        >
        </achievement-card>
      </div>

      <div v-else class="achieveRow">
        <p>You do not have any courses yet</p>
      </div>
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
      achievements: [],
      user: true,
      profileImage: "",
      userLevel: 1,
      progressValue: 0,
      reviews: [],
      reviewsCurrentPage: 1,
      reviewsPageCount: 0,
      reviewsPageSize: 5,
      reviewsTotalPages: 0,
      courses: [],
      totalCourse: "",
      rank: ["Novice", "Apprentice", "Master", "GrandMaster", "Sage"],
      index: 0,
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
      this.getRank()
      this.insertImage()
      this.getCourses()
      this.getExp(this.userDetails.role)
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
          },
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
          type: "profile"
        }
      })

      this.courses = data.courses
    },
    async getStats() {
      const rv2 = await http.get("/api/me/stats")
      const rv3 = await http.get("/api/me/achievements", {
        params: {
          type: "profile",
        },
      })
      this.stats = rv2.data.stats
      this.achievements = rv3.data
    },
    async getExp(role) {
      let maxExp = 100
      let i = this.userDetails.level
      if (role == "instructor") {
        maxExp *= this.userDetails.level * 2.5
        if (this.userDetails.knowledgePoints > maxExp) {
          for (i = i + 1; i < 100; i++) {
            let exp = 100 * i * 2.5
            if (this.userDetails.knowledgePoints < exp) {
              maxExp = exp
              break
            }
          }
        }
        //update user level
        let rv = await http.post("/api/me/level-update", {
          level: i,
        })
      } else {
        maxExp *= this.userDetails.level * 1.5
        if (this.userDetails.knowledgePoints > maxExp) {
          for (i = i + 1; i < 100; i++) {
            let exp = 100 * i * 1.5
            if (this.userDetails.knowledgePoints < exp) {
              maxExp = exp
              break
            }
          }
        }

        //update user level
        let rv = await http.post("/api/me/level-update", {
          level: i,
        })
      }
      this.userLevel = i
      this.progressValue = (this.userDetails.knowledgePoints / maxExp) * 100
    },
    getRank() {
      this.index = Math.ceil(this.userDetails.level / 10) - 1
    },
    achieveAll() {
      this.$router.push({ path: "/achievements" })
    },
    coursesAll(type) {
      if (type == "user") {
        this.$router.push({ path: "/courses-taken" })
      } else {
        this.$router.push({ path: "/courses-created" })
      }
    },
  },
}
</script>


<style>
@media screen and (max-width: 1480px) {
  .profileImg {
    width: 70%;
    margin: auto;
    height: 300px;
  }
}

.profileImg svg {
  width: 85%;
  height: 98%;
}
</style>
<style scoped>
.profileContainer {
  width: 90%;
  margin: auto;
}

.border {
  border: 1px solid black;
}

.profileImg {
  width: 90%;
  margin: auto;
  height: 400px;
  min-width: 400px;
  background-color: burlywood;
  outline: 15px solid brown;
  text-align: center;
}

.stats {
  font-family: "DarkerGrotesque-Medium";
  border: 1px solid black;
  margin: auto;
  height: 400px;
  min-width: 600px;
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
  margin: 2%;
}

.statsBtnRow .btn .v-btn__content {
  text-transform: none;
}

.courseContainer,
.achievementContainer {
  margin-top: 4%;
}

.achievementContainer {
  margin-bottom: 5%;
}

.reviewContainer {
  height: auto;
  margin-top: 4%;
}

.courseContainer h1,
.achievementContainer h1,
.reviewContainer h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(32px + (46 - 32) * ((100vw - 300px) / (1920 - 300)));
  color: #0d47a1;
  margin-left: 1%;
}

.courseContainer p,
.achievementContainer p {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(24px + (30 - 24) * ((100vw - 300px) / (1920 - 300)));
  color: black;
  margin-left: 1%;
}

.courseRow,
.achieveRow {
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
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

.achieveRow .card {
  width: auto;
  margin: 2%;
  margin-left: 3%;
  padding-top: 1%;
  border-radius: 50px;
}

.achieveRow .card .row {
  margin: 1%;
}

.achieveRow .card .leftCol {
  width: 30%;
}

@media screen and (max-width: 1600px) {
  .profileContainer {
    width: 100% !important;
  }
}

@media screen and (max-width: 1000px) {
  .profileContainer {
    margin-top: 14%;
  }
}
</style>