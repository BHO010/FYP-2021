<template>
  <v-container fluid v-if="user">
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
                  <v-icon size="64" color="orange"
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
                <v-row class="statsItem">Accounting</v-row>
                <v-row class="statsItem">Accounting</v-row>
                <v-row class="statsItem">Accounting</v-row>
                <v-row class="statsItem">Accounting</v-row>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="leftStats">
                <v-row class="statsItem">Accounting</v-row>
                <v-row class="statsItem">Accounting</v-row>
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

  <v-container fluid v-else>
    <v-row>
      <!-- avatar -->
      <v-col cols="12" xs="12" md="5">
        <div class="profileImg">Hello</div>
      </v-col>
      <!-- Stats -->
      <v-col cols="12" xs="12" md="7">
        <div class="stats">
          <v-row>
            <v-col cols="9">
              <div class="statsContent">
                <h1>Instructor Level 1</h1>
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
                  <v-icon size="64" color="orange"
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
                <v-row class="statsItem">Accounting</v-row>
                <v-row class="statsItem">Accounting</v-row>
                <v-row class="statsItem">Accounting</v-row>
                <v-row class="statsItem">Accounting</v-row>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="leftStats">
                <v-row class="statsItem">Accounting</v-row>
                <v-row class="statsItem">Accounting</v-row>
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
          v-model="currentPage"
          :length="this.totalPages"
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
      user: true,
      profileImage: "",
      progressValue: 30,
      reviews: [],
      currentPage: 1,
      pageCount: 0,
      pageSize: 5,
      totalPages: 0,
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
              currentPage: this.currentPage,
              pageSize: this.pageSize,
          }
        })
        this.reviews = data.reviews
        this.totalPages = Math.ceil(data.total / this.pageSize)
        console.log("AA", this.totalPages)
      } catch (e) {
        console.log(e)
      }
    },
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

.courseContainer,
.achievementContainer {
  border: 1px solid black;
  height: 450px;
  margin-top: 4%;
}

.reviewContainer {
  height: auto;
  margin-top: 4%;
}
</style>