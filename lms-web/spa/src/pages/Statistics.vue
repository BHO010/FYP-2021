<template>
  <div id="main">
    <h1>Statistics</h1>
    <div v-if="user" class="body">
      <div class="row section">
        <div class="leftCol">
          <v-card class="mx-auto" width="500px" height="250px">
            <v-card-text class="cardTxt">
              <div>Course Registered</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ this.userStats.registered }}
            </v-row>
          </v-card>
        </div>

        <div class="centerCol">
          <v-card class="mx-auto" width="500px" height="250px">
            <v-card-text class="cardTxt">
              <div>Discussion Activeness</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ this.userStats.discussionPoints }}
            </v-row>
          </v-card>
        </div>

        <div class="rightCol">
          <v-card class="mx-auto" width="500px" height="250px">
            <v-card-text class="cardTxt">
              <div>Course Registered</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ this.userStats.registered }}
            </v-row>
          </v-card>
        </div>
      </div>
      <div id="userRegOnMonth" class="section">
        <h1>Your Registration Per Month</h1>
        <div class="topRow">
          <v-row>
            <v-label>Year:</v-label>
            <v-select
              :items="items"
              v-model="year"
              @input="updateSearchII"
              dense
              outlined
            ></v-select>
            <v-spacer></v-spacer>
          </v-row>
        </div>
        <apexchart
          width="100%"
          height="400"
          type="line"
          :options="regOnMonthOptions"
          :series="seriesII"
        ></apexchart>
      </div>
    </div>

    <div v-else class="body">
      <div class="row section">
        <div class="leftCol">
          <v-card class="mx-auto" max-width="400px" height="250px">
            <v-card-text class="cardTxt">
              <div>No. Of Students</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ this.userStats.studentsCount }}
            </v-row>
          </v-card>
        </div>

        <div class="centerCol">
          <v-card class="mx-auto" max-width="400px" height="250px">
            <v-card-text class="cardTxt">
              <div>No. Of Reviews</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ this.userStats.reviewsCount }}
            </v-row>
          </v-card>
        </div>

        <div class="rightCol">
          <v-card class="mx-auto" max-width="400px" height="250px">
            <v-card-text class="cardTxt">
              <div>No. Of Courses</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ this.userStats.courseCreated }}
            </v-row>
          </v-card>
        </div>
      </div>

      <div id="userOnMonth" class="section">
        <h1>Students Per Month</h1>
        <div class="topRow">
          <v-row>
            <v-label>Year:</v-label>
            <v-select
              :items="items"
              v-model="year"
              @input="updateSearch"
              dense
              outlined
            ></v-select>
            <v-spacer></v-spacer>
            <v-label>Courses:</v-label>
            <v-select
              :items="courseList"
              v-model="selectCourse"
              @input="updateSearch"
              dense
              outlined
            ></v-select>
          </v-row>
        </div>

        <apexchart
          width="100%"
          height="400"
          type="line"
          :options="regOnMonthOptions"
          :series="series"
        ></apexchart>
      </div>

      <div id="regOnMonth" class="section">
        <h1>Your Registration Per Month</h1>
        <div class="topRow">
          <v-row>
            <v-label>Year:</v-label>
            <v-select
              :items="items"
              v-model="year"
              @input="updateSearchII"
              dense
              outlined
            ></v-select>
            <v-spacer></v-spacer>
          </v-row>
        </div>

        <apexchart
          width="100%"
          height="400"
          type="line"
          :options="regOnMonthOptions"
          :series="seriesII"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
      user: true,
      userDetails: null,
      userStats: null,
      courses: [],
      courseList: [],
      totalCourseStats: [],
      year: "",
      selectCourse: "All",
      regOnMonthOptions: {
        charts: {
          id: "Line chart",
        },
        type: "line",
        stroke: {
          width: [4],
          curve: "smooth",
        },
        colors: ["#DE0404"],
        xaxis: {
          categories: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        },
        title: {
          text: "Number of Registration on Month",
        },
      },
      series: [
        {
          name: "Students",
          data: [],
        },
      ],
      seriesII: [
        {
          name: "Course",
          data: [],
        },
      ],
      emptyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      items: [],
    }
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  async mounted() {
    this.$store.commit("setLoading", true)
    const rv0 = await http.get("/api/me")
    this.userDetails = rv0.data

    this.year = new Date().getFullYear()

    let rv = await http.get("/api/me/stats")
    if (rv0.data.role == "instructor") {
      this.user = false
      this.userStats = rv.data.stats
      this.courses = rv.data.courses
      this.courseList = rv.data.courseList
      this.totalCourseStats = rv.data.aggregate

      for (var item of this.totalCourseStats) {
        this.items.push(item.year)
      }

      var index = this.totalCourseStats.findIndex((p) => p.year == this.year)
      this.series[0].data = this.totalCourseStats[index].data
    } else {
      this.userStats = rv.data.stats
    }


    var index2 = this.userStats.registration.findIndex(
      (p) => p.year == this.year
    )

    if (index2 < 0) {
      this.seriesII[0].data = this.emptyData
    } else {
      for (var item2 of this.userStats.registration) {
        this.items.push(item2.year)
      }

      this.seriesII[0].data =
        this.userStats.registration[index2].data || this.emptyData
    }

    window.dispatchEvent(new Event("resize"))
    this.$store.commit("setLoading", false)
  },
  methods: {
    updateSearch() {
      let index = null
      if (this.selectCourse == "All") {
        index = this.totalCourseStats.findIndex((p) => p.year == this.year)

        this.series[0].data = this.totalCourseStats[index].data
        window.dispatchEvent(new Event("resize"))
      } else {
        index = this.courses.findIndex((p) => p.title == this.selectCourse)
        console.log(index)

        var index2 = this.courses[index].registration.findIndex(
          (a) => a.year == this.year
        )

        if (index2 < 0) {
          this.series[0].data = this.emptyData
          window.dispatchEvent(new Event("resize"))
        }
        this.series[0].data = this.courses[index].registration[index2].data
        window.dispatchEvent(new Event("resize"))
      }
    },
  },
}
</script>

<style scoped>
#main {
  width: 80%;
  margin: auto;
  margin-top: 2%;
}

.body h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(38px + (48 - 38) * ((100vw - 300px) / (1920 - 300)));
  color: #0d47a1;
  margin-bottom: 1%;
}

.body {
  margin-top: 2%;
}

.row {
  display: flex;
}

.leftCol {
  width: 33%;
  margin: auto;
}

.centerCol {
  width: 33%;
  margin: auto;
}

.rightCol {
  width: 33%;
  margin: auto;
}

.cardTxt div {
  font-family: "DarkerGrotesque-Bold";
  font-size: calc(28px + (48 - 28) * ((100vw - 300px) / (1920 - 300)));
  padding: 2%;
  color: grey;
}

.stats {
  font-family: "DarkerGrotesque-Bold";
  font-size: calc(52px + (64 - 52) * ((100vw - 300px) / (1920 - 300)));
  color: rgb(22, 9, 206);
}

.topRow {
  width: 70%;
  padding-left: 1%;
  padding-top: 1%;
}

.section {
  margin-bottom: 4%;
  padding-bottom: 4%;
  border-bottom: 5px solid lightgrey;
}

.v-label {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(28px + (32 - 28) * ((100vw - 300px) / (1920 - 300)));
  font-weight: bold;
  color: black;
  margin-right: 1%;
}

@media screen and (max-width: 1000px) {
   #main {
    margin-top: 10%;
  }
}
</style>