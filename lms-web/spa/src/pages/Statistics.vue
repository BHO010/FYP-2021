<template>
  <div id="main">
    <h1>Statistics</h1>
    <div v-if="user" class="body">
      <div class="row">
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
    </div>

    <div v-else class="body">
      <div class="row section">
        <div class="leftCol">
          <v-card class="mx-auto" width="450px" height="250px">
            <v-card-text class="cardTxt">
              <div>No. Of Students</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ this.userStats.studentsCount }}
            </v-row>
          </v-card>
        </div>

        <div class="centerCol">
          <v-card class="mx-auto" width="450px" height="250px">
            <v-card-text class="cardTxt">
              <div>No. Of Reviews</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ this.userStats.reviewsCount }}
            </v-row>
          </v-card>
        </div>

        <div class="rightCol">
          <v-card class="mx-auto" width="450px" height="250px">
            <v-card-text class="cardTxt">
              <div>No. Of Courses</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ this.userStats.courseCreated }}
            </v-row>
          </v-card>
        </div>
      </div>

      <div id="regOnMonth" class="section">
        <h1>Registration Per Month</h1>
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
          text: "Students on Month",
        },
      },
      series: [
        {
          name: "Students",
          data: [],
        },
      ],
      emptyData: [0,0,0,0,0,0,0,0,0,0,0,0],
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

    if (rv0.data.role == "instructor") {
      this.user = false
    }

    let rv = await http.get("/api/me/stats")
    this.userStats = rv.data.stats
    this.courses = rv.data.courses
    this.courseList = rv.data.courseList

    for (var item of this.userStats.registration) {
      this.items.push(item.year)
    }

    this.year = new Date().getFullYear()
    var index = this.userStats.registration.findIndex(
      (p) => p.year == this.year
    )

    this.series[0].data = this.userStats.registration[index].data

    window.dispatchEvent(new Event("resize"))
    this.$store.commit("setLoading", false)
  },
  methods: {
    updateSearch() {
        let index = null
      if (this.selectCourse == "All") {
        index = this.userStats.registration.findIndex(
          (p) => p.year == this.year
        )

        this.series[0].data = this.userStats.registration[index].data
        window.dispatchEvent(new Event("resize"))
      } else {
        index = this.courses.findIndex((p) => p.title == this.selectCourse)
        console.log(index)

        var index2 = this.courses[index].registration.findIndex(
          (a) => a.year == this.year
        )
        
        if(index2 < 0) {
            this.series[0].data =  this.emptyData
            window.dispatchEvent(new Event("resize"))
        }
        this.series[0].data = this.courses[index].registration[index2].data || this.emptyData
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
  font-size: 48px;
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
  font-size: 48px;
  padding: 2%;
  color: grey;
}

.stats {
  font-family: "DarkerGrotesque-Bold";
  font-size: 64px;
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
  font-size: 32px;
  font-weight: bold;
  color: black;
  margin-right: 1%;
}
</style>