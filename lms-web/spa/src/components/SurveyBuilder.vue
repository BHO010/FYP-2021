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
        <div id="btnRow">
          <v-btn class="button" color="#69F0AE" @click="onSaved"
            >Save Survey</v-btn
          >
        </div>
      </div>
    </div>
    <div id="rightCol">
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
  data() {
    return {
      QNumber: 1,
      questions: [],
      reference: "",
    }
  },
  mounted() {
      let params = new URL(document.location).searchParams
      this.reference = params.get("reference")
  },
  methods: {
    onText() {
      let question = {
        id: this.QNumber,
        type: "text",
        title: "",
      }

      this.questions.push(question)
      this.QNumber++
    },
    onCheckBox() {
      let question = {
        id: this.QNumber,
        type: "check",
        title: "",
        options: [
          { id: 1, title: "", label: "Option 1" },
          { id: 2, title: "", label: "Option 2" },
        ],
      }

      this.questions.push(question)
      this.QNumber++
    },
    onRadio() {
      let question = {
        id: this.QNumber,
        type: "radio",
        title: "",
        options: [
          { id: 1, title: "", label: "Option 1" },
          { id: 2, title: "", label: "Option 2" },
        ],
      }

      this.questions.push(question)
      this.QNumber++
    },
    onRating() {
      let question = {
        id: this.QNumber,
        type: "rate",
        title: "",
      }

      this.questions.push(question)
      this.QNumber++
    },
    async onSaved() {
        let rv = await http.post("/api/me/survey/create", {
          reference: this.reference,
          survey: this.questions,
        }) 
         if (rv) {
          window.location.href = "/profile"
        }
    },
    addOption(index) {
      let length = this.questions[index].options.length
      let option = {
        id: length + 1,
        title: "",
        label: `Option ${length + 1}`,
      }
      this.questions[index].options.push(option)
    },
    deleteOption(index) {
      let length = this.questions[index].options.length
      if (length > 2) {
        this.questions[index].options.pop()
      }
    },
    deleteQuestion(index) {
        this.questions.splice(index,1)
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
  border: 1px solid grey;
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
  margin-top: 1%;
}

.questionDiv input {
  border: 1px solid black;
  border-radius: 10px;
  width: 50%;
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
</style>