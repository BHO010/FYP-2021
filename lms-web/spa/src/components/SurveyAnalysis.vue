<template>
  <div>
    <div id="surveyAnalysis"></div>
  </div>
</template>


<script>
import * as SurveyVue from "survey-vue"
import * as SurveyAnalytics from "survey-analytics";
import "survey-analytics/survey.analytics.css";
import { http } from "@/axios"


SurveyVue.StylesManager.applyTheme("winter")


export default {
  name: "survey-analytics",
  props: {
    Json: Object,
    results: Array,
  },
  data() {
    const survey = new SurveyVue.Model(this.Json)
    
    return {
      survey: survey,
      result: [],
      reference: ''
    }
  },
  mounted() {
    var surveyAnalyticsDataTables = new SurveyAnalytics.VisualizationPanel(
      this.survey.getAllQuestions(),
      this.results
    );
    SurveyAnalytics.VisualizationManager.unregisterVisualizerForAll(SurveyAnalytics.WordCloud);
    surveyAnalyticsDataTables.render(
      document.getElementById("surveyAnalysis")
    );
    
  },
  methods: {
    
  },
}
</script>
<script>

</script>

<style scoped>
.sa-commercial, .sa-toolbar__button {
  display: none !important;
}
</style>