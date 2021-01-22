<template>
  <div id="main">
    <survey-analytics
      :key="Json.page"
      :Json="this.Json"
      :results="this.results"
    ></survey-analytics>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
        Json: null,
        results: null,
        reference: ""
    }
  },
  async mounted() {
    try {
      this.reference = this.$route.query.reference
      let rv = await http.get(`/api/me/survey/${this.reference}`)
      let rv2 = await http.get(`/api/me/survey/results/${this.reference}`)
      this.surveyJson = JSON.parse(rv.data.surveyJson)
      this.Json = this.surveyJson
      this.results = rv2.data
    } catch (e) {}
  },
}
</script>

<style scoped>
#main {
  width: 90%;
  margin: auto;
}
</style>