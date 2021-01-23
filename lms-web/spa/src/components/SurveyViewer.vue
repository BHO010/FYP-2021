<template>
  <div id="survey">
    <div id="body">
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
        <v-btn class="button" color="#69F0AE" @click="onComplete"
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
    reference: String,
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    async onComplete() {
      let rv = await http.post("/api/me/survey/completed", {
        reference: this.reference,
        survey: this.survey,
      })
      if (rv) {
        window.location.href = "/profile"
      }
    },
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
</style>