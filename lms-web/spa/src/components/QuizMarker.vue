<template>
  <div id="main">
    <v-snackbar
      v-model="snackbarShow"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      top
      >{{ snackbarText }}</v-snackbar
    >
    <div id="body">
      <div
        class="questionDiv"
        v-for="(item, index) in quiz.result"
        :key="item.id"
      >
        <div class="row">
          <div class="leftCol">
            <div class="textInput" v-if="item.type == 'text'">
              <h3>Question {{ index + 1 }}: {{ item.title }}</h3>
              <v-textarea
                v-model="item.answer"
                outlined
                rows="4"
                readonly
              ></v-textarea>
            </div>

            <div v-if="item.type == 'check'">
              <h3>Question {{ index + 1 }}: {{ item.title }}</h3>
              <div
                class="checkLabel"
                v-for="(option, point) in item.options"
                :key="option.id"
              >
                <v-checkbox
                  v-model="item.selected"
                  :label="option.title"
                  color="red lighten-2"
                  :value="point"
                  readonly
                ></v-checkbox>
              </div>
            </div>

            <div v-if="item.type == 'radio'">
              <h3>Question {{ index + 1 }}: {{ item.title }}</h3>
              <v-radio-group class="radioLabel" v-model="item.selected" column>
                <v-radio
                  v-for="(option, point) in item.options"
                  :key="option.id"
                  :label="option.title"
                  :value="point"
                  readonly
                ></v-radio>
              </v-radio-group>
            </div>

            <div v-if="item.type == 'rate'">
              <h3>Question {{ index + 1 }}: {{ item.title }}</h3>
              <v-rating
                v-model="item.rating"
                background-color="red lighten-2"
                color="red"
                size="64"
                hover
                length="5"
                readonly
              ></v-rating>
            </div>
          </div>

          <div class="rightCol">
            <div v-if="item.type == 'text'" class="marker">
              <h3>Score</h3>
              <v-radio-group class="radioLabel" v-model="item.score" column>
                <v-radio
                  label="Correct. Reward full points"
                  :value="item.points"
                ></v-radio>
                <v-radio
                  label="Half Correct. Reward half-points"
                  :value="item.points / 2"
                ></v-radio>
                <v-radio label="Wrong Reward no points" :value="0"></v-radio>
              </v-radio-group>
            </div>
            <div v-if="item.type == 'check'" class="marker">
              <h3>Score</h3>
              <v-radio-group class="radioLabel" v-model="item.score" column>
                <v-radio
                  label="Correct. Reward full points"
                  :value="item.points"
                ></v-radio>
                <v-radio
                  label="Half Correct. Reward half-points"
                  :value="item.points / 2"
                ></v-radio>
                <v-radio label="Wrong Reward no points" :value="0"></v-radio>
              </v-radio-group>
            </div>
            <div v-if="item.type == 'radio'" class="marker">
              <h3>Score</h3>
              <v-radio-group class="radioLabel" v-model="item.score" column>
                <v-radio
                  label="Correct. Reward full points"
                  :value="item.points"
                ></v-radio>
                <v-radio label="Wrong Reward no points" :value="0"></v-radio>
              </v-radio-group>
            </div>
            <div v-if="item.type == 'rate'" class="marker">
              <h3>Score</h3>
              <v-radio-group class="radioLabel" v-model="item.score" column>
                <v-radio
                  label="Correct. Reward full points"
                  :value="item.points"
                ></v-radio>
                <v-radio label="Wrong Reward no points" :value="0"></v-radio>
              </v-radio-group>
            </div>
          </div>
        </div>
      </div>
      <v-row id="btnRow" align="end">
        <v-spacer></v-spacer>
        <v-btn
          class="button"
          color="#69F0AE"
          :loading="loading"
          @click="onCompleteMark"
          >Confirm</v-btn
        >
      </v-row>
    </div>
  </div>
</template>


<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  name: "quiz-marker",
  props: {
    quiz: Object,
  },
  data() {
    return {
      snackbarColor: "success",
      snackbarShow: false,
      snackbarText: "",
      snackbarTimeout: 5000,
      totalScore: 0,
    }
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  mounted() {},
  methods: {
    async onCompleteMark() {
      this.$store.commit("setLoading", true)
      for (var q of this.quiz.result) {
        this.totalScore += Number(q.score)
      }
      this.quiz.score = this.totalScore
      let rv = await http.post("/api/me/quiz/result/marked", {
        quiz: this.quiz,
      })

      if (rv) {
        this.snackbarColor = "success"
        this.snackbarText = "Completed!"
        this.snackbarShow = true
        setTimeout(() => {
          this.$store.commit("setLoading", false)
          this.$router.go()
        }, 1000)
      }
    },
  },
}
</script>

<style scoped>
.checkLabel .v-label,
.radioLabel .v-label {
  font-size: 28px;
}

.textInput .v-input {
  margin-top: 1%;
  font-size: 24px;
}
</style>

<style scoped>
#main {
  font-family: "DarkerGrotesque-Medium";
  border: 10px solid lightgrey;
  border-radius: 80px;
  padding-top: 2%;
  padding-bottom: 2%;
}

#main #body {
  width: 90%;
  margin: auto;
  max-height: 600px;
  overflow-y: auto;
}

.questionDiv {
  width: 90%;
  margin-left: 5%;
  padding: 2%;
  padding-top: 0;
  font-size: 24px;
  border-bottom: 1px solid lightgrey;
}

.row {
  display: flex;
}

.row .leftCol {
  width: 70%;
}

.row .rightCol {
  width: 25%;
  margin-left: 4%;
  margin-top: 0;
  padding-left: 2%;
  border-left: 1px solid lightgrey;
}

#btnRow {
  margin: 1%;
}

.button {
  text-transform: none;
  line-height: 2rem;
  font-size: 24px;
  text-align: center;
}
</style>