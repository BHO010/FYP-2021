<template>
  <div v-if="type != 'review'" id="survey">
    <div v-if="!type" id="body">
      <div class="questionDiv" v-for="(item, index) in survey" :key="item.id">
        <div class="textInput" v-if="item.type == 'text'">
          <h3>Question {{ index + 1 }}: {{ item.title }}</h3>
          <v-textarea v-model="item.answer" outlined rows="4"></v-textarea>
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
          ></v-rating>
        </div>
      </div>
      <v-row id="btnRow" align="end">
        <v-spacer></v-spacer>
        <v-btn
          class="button"
          color="#69F0AE"
          :loading="loading"
          @click="onComplete"
          >Complete</v-btn
        >
      </v-row>
    </div>

    <div v-else-if="type=='quiz'" id="body">
      <div class="questionDiv" v-for="(item, index) in quiz.content" :key="item.id">
        <div class="textInput" v-if="item.type == 'text'">
          <h3>Question {{ index + 1 }}: {{ item.title }}</h3>
          <v-textarea v-model="item.answer" outlined rows="4"></v-textarea>
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
          ></v-rating>
        </div>
      </div>
      <v-row id="btnRow" align="end">
        <v-spacer></v-spacer>
        <v-btn
          class="button"
          color="#69F0AE"
          :loading="loading"
          @click="onCompleteQuiz"
          >Complete</v-btn
        >
      </v-row>
    </div>
  </div>

  <div v-else id="review">
     <div id="body">
      <div class="reviewDiv" v-for="(item, index) in review" :key="item.id">
        <div class="textInput" v-if="item.type == 'text'">
          <h3>Question {{ index + 1 }}: {{ item.title }}</h3>
          <v-textarea v-model="item.answer" outlined rows="4"></v-textarea>
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
          ></v-rating>
        </div>
      </div>
       <v-row id="btnRow" align="end">
        <v-spacer></v-spacer>
        <v-btn
          class="button"
          color="#69F0AE"
          :loading="loading"
          @click="onCompleteReview"
          >Complete</v-btn
        >
      </v-row>
    </div>

  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  name: "survey-viewer",
  props: {
    survey: Array,
    quiz: Object,
    review: Array,
    reviewIndex: Number,
    reference: String,
    type: String,
    courseRef: String,
    batchID: String,
    quizID: String,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  mounted() {
    console.log(this.type)
    console.log("AA", this.reviewIndex,this.reference)
  },
  methods: {
    async onComplete() {
      try {
        this.$store.commit("setLoading", true)
        let rv = await http.post("/api/me/survey/completed", {
          reference: this.reference,
          survey: this.survey,
        })
        if (rv) {
          this.$store.commit("setLoading", false)
          this.$router.go().catch((err) => {})
        }
      } catch (e) {

      }
    },
    async onCompleteQuiz() {
      try {
       //this.$store.commit("setLoading", true)
        let rv = await http.post("/api/me/quiz/completed", {
          courseRef: this.courseRef,
          batchID: this.batchID,
          quizID: this.quizID,
          result: this.quiz.content
        })
        if (rv) {
          this.$store.commit("setLoading", false)
          this.$router.go().catch((err) => {})
        }
      } catch (e) {

      }
    },
    async onCompleteReview() {
      try {
        this.$store.commit("setLoading", true)
        let rv = await http.post('/api/me/review/completed', {
          reference: this.reference,
          review: this.review,
          notificationIndex: this.notificationIndex,
          courseRef: this.courseRef
        })
        if (rv) {
          this.$store.commit("setLoading", false)
          this.$router.go().catch((err) => {})
        }
      }catch(e) {}
    }
  },
}
</script>

<style>
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
#survey {
  font-family: "DarkerGrotesque-Medium";
  border: 10px solid lightgrey;
  border-radius: 80px;
  padding-top: 2%;
  padding-bottom: 2%;
}

#survey #body {
  width: 90%;
  margin: auto;
  max-height: 600px;
  overflow-y: auto;
}

#review {
  font-family: "DarkerGrotesque-Medium";
  border: 10px solid lightgrey;
  border-radius: 80px;
  padding-top: 2%;
  padding-bottom: 2%;
  width: 80%;
  margin: auto;
  margin-top: 4%;
  margin-bottom: 4%;
}

#review #body {
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

.reviewDiv {
  width: 80%;
  margin: auto;
}
</style>