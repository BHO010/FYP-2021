<template>
  <div class="template">
    <h1>Question {{ Number(this.title[1]) + 1 }} : {{this.question.title}}</h1>
    <div class="row">
      <div class="charts leftCol">
        <apexchart
          width="100%"
          height="400"
          type="bar"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>

      <div class="rightCol">
        <div id="content">
          <v-card class="mx-auto card">
            <v-card-text class="cardTxt">
              <div>Average Percent</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ average }}%
            </v-row>
            <v-card-text class="cardTxt">
              <div>Average Score</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ averagePoints }}
            </v-row>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  name: "QuizAnalysis",
  props: {
    question: Object,
    count: Number,
  },
  data() {
    return {
      title: "",
      average: 0,
      averagePoints: 0,
      chartOptions: {
        chart: {
          id: "quizChart",
        },
        xaxis: {
          categories: ["Full Mark", "Half Mark", "Zero Mark"],
        },
      },
      series: [
        {
          name: "Numbe of user",
          data: [],
        },
      ],
    }
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  async mounted() {
    console.log("AA", this.question)
    this.title = this.question.id.split("-")

    this.average =
      (Number(this.question.totalScore) / (this.count * Number(this.question.points))) * 100

    this.averagePoints = Number(this.question.totalScore) / this.count

    
    this.series[0].data.push(this.question.full)
    this.series[0].data.push(this.question.half)
    this.series[0].data.push(this.question.zero)

    window.dispatchEvent(new Event("resize"))
    this.$store.commit("setLoading", false)
  },
  methods: {},
}
</script>

<style scoped>
.template {
  margin-top: 2%;
  margin-bottom: 2%;
  padding-bottom: 2%;
  width: 100%;
  border-bottom: 5px solid lightgrey;
}

.template h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: 48px;
  color: #0d47a1;
  margin-bottom: 1%;
}

#body {
  display: flex;
}

.row {
  width: 100%;
  display: flex;
}

.leftCol {
  width: 60%;
  margin-right: 4%;
}

.rightCol {
  width: 35%;
}

.rightCol #content {
  width: 80%;
  margin: auto;
}

.rightCol .card {
  width: 500px;
  margin-top: 10%;
  padding: 2%;
}

.cardTxt div {
  font-family: "DarkerGrotesque-Bold";
  font-size: 32px;
  color: grey;
}

.stats {
  font-family: "DarkerGrotesque-Bold";
  font-size: 64px;
  color: rgb(22, 9, 206);
}
</style>