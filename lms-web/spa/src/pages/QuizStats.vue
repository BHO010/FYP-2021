<template>
  <div id="main">
    <div id="body">
      <h1>Overall Stats</h1>
      <div class="row">
        <div class="leftCol">
          <v-card class="mx-auto" width="500px" height="250px">
            <v-card-text class="cardTxt">
              <div>Total Count</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ count }}
            </v-row>
          </v-card>
        </div>

        <div class="rightCol">
          <v-card class="mx-auto" width="500px" height="250px">
            <v-card-text class="cardTxt">
              <div>Average Percent</div>
            </v-card-text>
            <v-row justify="center" align="center" class="stats">
              {{ average }}%
            </v-row>
          </v-card>
        </div>
      </div>
      <br />
      <!-- Component for each question /bar chart -->
      <div>
        <quiz-analysis
          v-for="item in quizData"
          :key="item.id"
          :question="item"
          :count="count"
        ></quiz-analysis>
      </div>
    </div>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"
import QuizAnalysis from "../components/QuizAnalysis.vue"

export default {
  components: { QuizAnalysis },
  data() {
    return {
      courseRef: this.$route.query.ref,
      batchID: this.$route.query.batchID,
      quizID: this.$route.query.quizID,
      quizData: null,
      count: 0,
      average: 0,
    }
  },
  computed: {},
  async mounted() {
    try {
      this.$store.commit("setLoading", true)
      let rv = await http.get("/api/me/quiz/stats", {
        params: {
          courseRef: this.courseRef,
          batchID: this.batchID,
          quizID: this.quizID,
        },
      })

      if (rv) {
        this.count = rv.data.count
        this.average = Math.round(
          (rv.data.aggregate.totalScore / rv.data.aggregate.totalPoints) * 100
        )
        this.quizData = rv.data.aggregate.Qstats
      }
    } catch (e) {}
  },
  methods: {},
}
</script>

<style scoped>
#main {
  width: 80%;
  margin: auto;
}

#body h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: 48px;
  color: #0d47a1;
  margin-bottom: 1%;
}

#body {
  margin-top: 2%;
}

.row {
  display: flex;
  margin-top: 2%;
}

.leftCol {
  width: 50%;
}

.rightCol {
  width: 50%;
}

.cardTxt div {
  font-family: "DarkerGrotesque-Bold";
  font-size: 48px;
  color: grey;
}

.stats {
  font-family: "DarkerGrotesque-Bold";
  font-size: 64px;
  color: rgb(22, 9, 206);
}
</style>