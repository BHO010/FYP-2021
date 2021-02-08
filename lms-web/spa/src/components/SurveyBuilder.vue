<template>
  <div id="main">
    <div id="leftCol">
      <div id="toolContent">
        <v-list id="toolList">
          <h3>ToolBox</h3>
          <v-list-item @click="onText()">
            <v-list-item-icon>
              <v-icon size="30" class="toolIcon">mdi-format-text</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="toolInput"
                >Text Input</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="onCheckBox('check')">
            <v-list-item-icon>
              <v-icon size="30" class="toolIcon"
                >mdi-checkbox-marked-outline</v-icon
              >
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="toolInput">Checkbox</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="onRadio('radio')">
            <v-list-item-icon>
              <v-icon size="30" class="toolIcon">mdi-radiobox-marked</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="toolInput"
                >Radio Group</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="onRating('rate')">
            <v-list-item-icon>
              <v-icon size="30" class="toolIcon">mdi-star-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="toolInput">Rating</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div id="btnRow" v-if="type == 'quiz'">
          <v-btn
            class="button"
            color="#69F0AE"
            :loading="loading"
            @click="onSavedQuiz"
            >Save Quiz</v-btn
          >
        </div>

         <div id="btnRow" v-else-if="type == 'quizEdit'">
          <v-btn
            class="button"
            color="#69F0AE"
            :loading="loading"
            @click="onSavedQuiz"
            >Save Quiz</v-btn
          >
        </div>

        <div id="btnRow" v-else-if="type == 'Edit'">
          <v-btn
            class="button"
            color="#69F0AE"
            :loading="loading"
            @click="onSaved"
            >Update Survey</v-btn
          >
        </div>

        <div id="btnRow" v-else>
          <v-btn
            class="button"
            color="#69F0AE"
            :loading="loading"
            @click="onSaved"
            >Save Survey</v-btn
          >
        </div>
      </div>
    </div>

    <!-- If Editing Survey -->
    <div v-if="type == 'Edit'" id="rightCol">
      <div id="surveyContent">
        <h3>Survey Template</h3>
        <div
          class="questionDiv"
          v-for="(question, index) in survey"
          :key="question.id"
        >
          <!-- Text question -->
          <div v-if="question.type == 'text'">
            <div class="header">
              <h2>Text Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>

            <label :for="question.id"> Question: </label>
            <input v-model="question.title" />
          </div>
          <!-- CheckBox question -->
          <div v-if="question.type == 'check'">
            <div class="header">
              <h2>CheckBox Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>

            <div class="properties"></div>
            <label :for="question.id">Question: </label>
            <input v-model="question.title" /><br />
            <div
              class="multi"
              v-for="option in question.options"
              :key="option.id"
            >
              <label :for="option.id">{{ option.label }}: </label>
              <input v-model="option.title" /><br />
            </div>
            <v-row class="optionRow">
              <v-btn @click="addOption(index)">Add Option</v-btn>
              <v-btn @click="deleteOption(index)">Delete Option</v-btn>
            </v-row>
          </div>
          <!-- RadioGroup question -->
          <div v-if="question.type == 'radio'">
            <div class="header">
              <h2>RadioGroup Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>
            <div class="properties"></div>
            <label :for="question.id">Question: </label>
            <input v-model="question.title" /><br />
            <div
              class="multi"
              v-for="option in question.options"
              :key="option.id"
            >
              <label :for="option.id">{{ option.label }}: </label>
              <input v-model="option.title" /><br />
            </div>
            <v-row class="optionRow">
              <v-btn @click="addOption(index)">Add Option</v-btn>
              <v-btn @click="deleteOption(index)">Delete Option</v-btn>
            </v-row>
          </div>
          <!-- Rating question -->
          <div v-if="question.type == 'rate'">
            <div class="header">
              <h2>Rating Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>

            <div class="properties"></div>
            <label :for="question.id">Question: </label>
            <input v-model="question.title" /><br />
          </div>
        </div>
      </div>
    </div>

    <!-- If Creating Quiz -->
    <div v-else-if="type == 'quiz'" id="rightCol">
      <div id="surveyContent">
        <h3>Quiz Template</h3>
        <div class="questionDiv" id="quizTitle">
          <div class="header">
            <h2>Quiz Title</h2>
          </div>
          <label for="quizTitle"> Title: </label>
          <input id="quizTitle" v-model="quizTitle" /> <br />
        </div>
        <div
          class="questionDiv"
          v-for="(question, index) in questions"
          :key="question.id"
        >
          <!-- Text question -->
          <div v-if="question.type == 'text'">
            <div class="header">
              <h2>Text Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>
            <div class="question">
              <label :for="question.id"> Question: </label>
              <input :id="question.id" v-model="question.title" /> <br />
              <label :for="question.id"> Points: </label>
              <input :id="question.id" v-model="question.points" />
            </div>
          </div>
          <!-- CheckBox question -->
          <div v-if="question.type == 'check'">
            <div class="header">
              <h2>CheckBox Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>

            <div class="properties"></div>
            <div class="question">
              <label :for="question.id">Question: </label>
              <input :id="question.id" v-model="question.title" /><br />
              <label :for="question.id">Points: </label>
              <input :id="question.id" v-model="question.points" /><br />
            </div>

            <div
              class="multi"
              v-for="option in question.options"
              :key="option.id"
            >
              <label :for="option.id">{{ option.label }}: </label>
              <input :id="option.id" v-model="option.title" /><br />
            </div>
            <v-row class="optionRow">
              <v-btn @click="addOption(index)">Add Option</v-btn>
              <v-btn @click="deleteOption(index)">Delete Option</v-btn>
            </v-row>
          </div>
          <!-- RadioGroup question -->
          <div v-if="question.type == 'radio'">
            <div class="header">
              <h2>RadioGroup Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>
            <div class="properties"></div>
            <div class="question">
              <label :for="question.id">Question: </label>
              <input :id="question.id" v-model="question.title" /><br />
              <label :for="question.points">Points: </label>
              <input :id="question.points" v-model="question.points" /><br />
            </div>

            <div
              class="multi"
              v-for="option in question.options"
              :key="option.id"
            >
              <label :for="option.id">{{ option.label }}: </label>
              <input :id="option.id" v-model="option.title" /><br />
            </div>
            <v-row class="optionRow">
              <v-btn @click="addOption(index)">Add Option</v-btn>
              <v-btn @click="deleteOption(index)">Delete Option</v-btn>
            </v-row>
          </div>
          <!-- Rating question -->
          <div v-if="question.type == 'rate'">
            <div class="header">
              <h2>Rating Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>

            <div class="properties"></div>
            <div class="question">
              <label :for="question.id">Question: </label>
              <input :id="question.id" v-model="question.title" /><br />
              <label :for="question.id">Points: </label>
              <input :id="question.id" v-model="question.points" /><br />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- If Editing Quiz -->
    <div v-else-if="type == 'quizEdit'" id="rightCol">
      <div id="surveyContent">
        <h3>Quiz Template</h3>
        <div class="questionDiv" id="quizTitle">
          <div class="header">
            <h2>Quiz Title</h2>
          </div>
          <label for="quizTitle"> Title: </label>
          <input id="quizTitle" v-model="quiz.title" /> <br />
        </div>
        <div
          class="questionDiv"
          v-for="(question, index) in quiz.content"
          :key="question.id"
        >
          <!-- Text question -->
          <div v-if="question.type == 'text'">
            <div class="header">
              <h2>Text Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>

            <label :for="question.id"> Question: </label>
            <input v-model="question.title" />
          </div>
          <!-- CheckBox question -->
          <div v-if="question.type == 'check'">
            <div class="header">
              <h2>CheckBox Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>

            <div class="properties"></div>
            <label :for="question.id">Question: </label>
            <input v-model="question.title" /><br />
            <div
              class="multi"
              v-for="option in question.options"
              :key="option.id"
            >
              <label :for="option.id">{{ option.label }}: </label>
              <input v-model="option.title" /><br />
            </div>
            <v-row class="optionRow">
              <v-btn @click="addOption(index)">Add Option</v-btn>
              <v-btn @click="deleteOption(index)">Delete Option</v-btn>
            </v-row>
          </div>
          <!-- RadioGroup question -->
          <div v-if="question.type == 'radio'">
            <div class="header">
              <h2>RadioGroup Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>
            <div class="properties"></div>
            <label :for="question.id">Question: </label>
            <input v-model="question.title" /><br />
            <div
              class="multi"
              v-for="option in question.options"
              :key="option.id"
            >
              <label :for="option.id">{{ option.label }}: </label>
              <input v-model="option.title" /><br />
            </div>
            <v-row class="optionRow">
              <v-btn @click="addOption(index)">Add Option</v-btn>
              <v-btn @click="deleteOption(index)">Delete Option</v-btn>
            </v-row>
          </div>
          <!-- Rating question -->
          <div v-if="question.type == 'rate'">
            <div class="header">
              <h2>Rating Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>

            <div class="properties"></div>
            <label :for="question.id">Question: </label>
            <input v-model="question.title" /><br />
          </div>
        </div>
      </div>
    </div>

    <!-- If Creating Survey -->
    <div v-else id="rightCol">
      <div id="surveyContent">
        <h3>Survey Template</h3>
        <div
          class="questionDiv"
          v-for="(question, index) in questions"
          :key="question.id"
        >
          <!-- Text question -->
          <div v-if="question.type == 'text'">
            <div class="header">
              <h2>Text Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>

            <label :for="question.id"> Question: </label>
            <input :id="question.id" v-model="question.title" />
          </div>
          <!-- CheckBox question -->
          <div v-if="question.type == 'check'">
            <div class="header">
              <h2>CheckBox Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>

            <div class="properties"></div>
            <label :for="question.id">Question: </label>
            <input :id="question.id" v-model="question.title" /><br />
            <div
              class="multi"
              v-for="option in question.options"
              :key="option.id"
            >
              <label :for="option.id">{{ option.label }}: </label>
              <input :id="option.id" v-model="option.title" /><br />
            </div>
            <v-row class="optionRow">
              <v-btn @click="addOption(index)">Add Option</v-btn>
              <v-btn @click="deleteOption(index)">Delete Option</v-btn>
            </v-row>
          </div>
          <!-- RadioGroup question -->
          <div v-if="question.type == 'radio'">
            <div class="header">
              <h2>RadioGroup Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>
            <div class="properties"></div>
            <label :for="question.id">Question: </label>
            <input :id="question.id" v-model="question.title" /><br />
            <div
              class="multi"
              v-for="option in question.options"
              :key="option.id"
            >
              <label :for="option.id">{{ option.label }}: </label>
              <input :id="option.id" v-model="option.title" /><br />
            </div>
            <v-row class="optionRow">
              <v-btn @click="addOption(index)">Add Option</v-btn>
              <v-btn @click="deleteOption(index)">Delete Option</v-btn>
            </v-row>
          </div>
          <!-- Rating question -->
          <div v-if="question.type == 'rate'">
            <div class="header">
              <h2>Rating Type Question</h2>
              <v-btn icon color="indigo" @click="deleteQuestion(index)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </div>

            <div class="properties"></div>
            <label :for="question.id">Question: </label>
            <input :id="question.id" v-model="question.title" /><br />
            <!-- <label>Rating: </label>
            <v-rating
              v-model="question.rating"
              background-color="red lighten-2"
              color="red lighten-3"
              half-increments
              hover
              size="50"
            ></v-rating> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  name: "survey-builder",
  props: {
    survey: Array,
    type: String,
    //For quiz
    courseRef: String,
    batchID: String,
    quiz: Object,
    quizID: null,
  },
  data() {
    return {
      QNumber: 1,
      questions: [],
      reference: "",
      quizTitle: "",
    }
  },
  conputed: {
    ...mapState(["error", "loading"]),
  },
  mounted() {
    let params = new URL(document.location).searchParams
    this.reference = params.get("reference")
    if (this.type == "Edit") {
      this.QNumber = this.survey.length + 1
    }
    if (this.type == "quizEdit") {
      this.QNumber = this.quiz.content.length + 1
    }
  },
  methods: {
    onText() {
      let question = {
        id: this.QNumber,
        type: "text",
        title: "",
        points: 0,
        answer: "",
      }
      if (this.type == "Edit") {
        this.survey.push(question)
        this.QNumber++
      } else if (this.type == "quizEdit") {
        this.quiz.content.push(question)
        this.QNumber++
      } else {
        this.questions.push(question)
        this.QNumber++
      }
    },
    onCheckBox() {
      let question = {
        id: this.QNumber,
        type: "check",
        title: "",
        selected: [],
        points: 0,
        options: [
          { id: 1, title: "", label: "Option 1" },
          { id: 2, title: "", label: "Option 2" },
        ],
      }

      if (this.type == "Edit") {
        this.survey.push(question)
        this.QNumber++
      } else if (this.type == "quizEdit") {
        this.quiz.content.push(question)
        this.QNumber++
      } else {
        this.questions.push(question)
        this.QNumber++
      }
    },
    onRadio() {
      let question = {
        id: this.QNumber,
        type: "radio",
        title: "",
        selected: "",
        points: 0,
        options: [
          { id: 1, title: "", label: "Option 1" },
          { id: 2, title: "", label: "Option 2" },
        ],
      }

      if (this.type == "Edit") {
        this.survey.push(question)
        this.QNumber++
      } else if (this.type == "quizEdit") {
        this.quiz.content.push(question)
        this.QNumber++
      } else {
        this.questions.push(question)
        this.QNumber++
      }
    },
    onRating() {
      let question = {
        id: this.QNumber,
        type: "rate",
        title: "",
        points: 0,
        rating: 0,
      }

      if (this.type == "Edit") {
        this.survey.push(question)
        this.QNumber++
      } else if (this.type == "quizEdit") {
        this.quiz.content.push(question)
        this.QNumber++
      } else {
        this.questions.push(question)
        this.QNumber++
      }
    },
    async onSaved() {
      try {
        let rv = null
        if (this.type == "Edit") {
          this.$store.commit("setLoading", true)
          rv = await http.post("/api/me/survey/update", {
            reference: this.reference,
            survey: this.survey,
          })
        } else {
          this.$store.commit("setLoading", true)
          rv = await http.post("/api/me/survey/create", {
            reference: this.reference,
            survey: this.questions,
          })
        }
        if (rv) {
          this.$store.commit("setLoading", false)
          this.$router.push("/profile").catch((err) => {})
        }
      } catch (e) {
        this.snackbarColor = "error"
        this.snackbarText = e.response.data.e
        this.snackbarShow = true
        this.$store.commit("setLoading", false)
      }
    },
    async onSavedQuiz() {
      try {
        let rv = null
        if (this.type == "quizEdit") {
          this.$store.commit("setLoading", true)
          alert(this.quiz.title)
          rv = await http.post("/api/me/quiz/update", {
            courseRef: this.courseRef,
            batchID: this.batchID,
            quiz: this.quiz.content,
            title: this.quiz.title,
            quizID: this.quizID,
          })
        } else {
          this.$store.commit("setLoading", true)
          rv = await http.post("/api/me/quiz/create", {
            courseRef: this.courseRef,
            batchID: this.batchID,
            quiz: this.questions,
            quizTitle: this.quizTitle,
          })
        }

        if (rv) {
          this.$store.commit("setLoading", false)
          this.$router.go().catch((err) => {})
        }
      } catch (e) {
        this.snackbarColor = "error"
        this.snackbarText = e.response.data.e
        this.snackbarShow = true
        this.$store.commit("setLoading", false)
      }
    },
    addOption(index) {
      let option = {
        id: 0,
        title: "",
        label: "",
      }
      if (this.type == "Edit") {
        let length = this.survey[index].options.length
        option.id = length + 1
        option.label = "Option " + (length + 1)
        this.survey[index].options.push(option)
      } else if (this.type == "quizEdit") {
        let length = this.quiz.content[index].options.length
        option.id = length + 1
        option.label = "Option " + (length + 1)
        this.quiz.content[index].options.push(option)
      } else {
        let length = this.questions[index].options.length
        option.id = length + 1
        option.label = "Option " + (length + 1)
        this.questions[index].options.push(option)
      }
    },
    deleteOption(index) {
      if (this.type == "Edit") {
        let length = this.survey[index].options.length
        if (length > 2) {
          this.survey[index].options.pop()
        }
      } else if (this.type == "quizEdit") {
        let length = this.quiz.content[index].options.length
        if (length > 2) {
          this.quiz.content[index].options.pop()
        }
      } else {
        let length = this.questions[index].options.length
        if (length > 2) {
          this.questions[index].options.pop()
        }
      }
    },
    deleteQuestion(index) {
      if (this.type == "Edit") {
        this.survey.splice(index, 1)
      } else if (this.type == "quizEdit") {
        this.quiz.content.splice(index, 1)
      } else {
        this.questions.splice(index, 1)
      }
    },
  },
}
</script>

<style scoped>
#main {
  font-family: "DarkerGrotesque-Medium";
  display: flex;
}

#leftCol {
  width: 15%;
}

#rightCol {
  margin-left: 3%;
  width: 80%;
}

#toolList {
  background: #e1f5fe;
}

#toolList h3 {
  border-bottom: 1px solid grey;
}

#toolContent {
  border: 1px solid black;
  width: 100%;
  position: sticky;
  top: 80px;
}

#toolContent #btnRow {
  margin: auto;
  width: 75%;
  margin-bottom: 5%;
}

#btnRow .button {
  text-transform: none;
  line-height: 2rem;
  font-size: 24px;
  text-align: center;
}

#toolList h3 {
  text-align: center;
  color: #0d47a1;
  font-size: 42px;
}

#toolList .v-list-item__icon {
  margin-right: 10%;
}

#toolList .toolIcon {
  size: 25;
}

#toolList .toolInput {
  font-size: 28px;
}

#rightCol h3 {
  color: #0d47a1;
  font-size: 42px;
}

#surveyContent h3 {
  margin-left: 3%;
  margin-bottom: 1%;
}

.questionDiv {
  border: 5px solid lightgrey;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  width: 90%;
  margin-left: 5%;
  margin-bottom: 2%;
  padding: 2%;
  padding-top: 0;
  font-size: 24px;
}

.questionDiv .properties {
  display: flex;
}

.questionDiv label {
  display: inline-block;
  width: 140px;
  text-align: left;
  margin-right: 1%;
}

.questionDiv .multi {
  margin-top: 2%;
}

.questionDiv input {
  border: 1px solid black;
  border-radius: 10px;
  width: 50%;
}

.question label {
  margin-top: 1%;
}

.optionRow {
  margin-top: 2%;
}

.optionRow .v-btn {
  margin-right: 2%;
}

.header {
  display: flex;
}

.header h2 {
  margin-bottom: 1%;
  margin-right: 5px;
  font-size: 28px;
}

.header .v-btn {
  margin-top: 5px;
}

input {
  padding-left: 1%;
}
</style>