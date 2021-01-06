<template>
  <div>
    <survey :survey="survey"></survey>
    <div id="surveyResult"></div>
  </div>
</template>

<script>
import * as SurveyVue from "survey-vue"
import { http } from "@/axios"
import "survey-vue/survey.css"
import * as widgets from "surveyjs-widgets"
import { init as customWidget } from "../components/customWidget"

widgets.select2(SurveyVue)
widgets.inputmask(SurveyVue)
//widgets.jquerybarrating(SurveyVue);
//widgets.jqueryuidatepicker(SurveyVue);
widgets.nouislider(SurveyVue)
widgets.select2tagbox(SurveyVue)
widgets.sortablejs(SurveyVue)
widgets.ckeditor(SurveyVue)
widgets.autocomplete(SurveyVue)
//widgets.bootstrapslider(SurveyVue);
customWidget(SurveyVue)

SurveyVue.StylesManager.applyTheme("winter")


export default {
  name: "survey-display",
  props: {
    Json: Object,
  },
  data() {
    const survey = new SurveyVue.Model(this.Json)

    return {
      survey: survey,
      result: [],
      reference: ''
    }
  },
  async mounted() {
    let reference = this.$route.query.reference
    console.log(typeof this.reference)
    this.survey
    .onComplete
    .add(async function (result) {
        console.log(result)
        let data = result.data
        let rv = await http.post("/api/me/survey/completed", {
            reference,
            data
        })
       
    });
  },
  methods: {
    
  },
}
</script>

<style scoped>
</style>