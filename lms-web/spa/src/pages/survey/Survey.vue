<template>
  <v-container fluid>
    <div class="main">
      <h3>Course Survey</h3>
      <p>
        This is the course completion survey. <br>

        Once completed, remember to click "Complete" button to submit the survey. <br />
      </p>
      <survey-display 
          v-for="Json in Jsons"
          :key="Json._id"
          :Json="Json"></survey-display>
    </div>
  </v-container>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
      surveyJson: null,
      Jsons: [],
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    },
  },
  async mounted() {
    try {
      this.reference = this.$route.query.reference
      let rv = await http.get(`/api/me/survey/${this.reference}`)
     this.surveyJson = rv.data.surveyJson.replace(/(?:\\[rn])+/g, "")
    this.surveyJson = JSON.parse(JSON.parse(this.surveyJson))
      this.Jsons.push(this.surveyJson)
    } catch (e) {}
  },
  methods: {},
}
</script>

<style scoped>

.main {
  width: 80%;
  margin: auto;
}

.main h3 {
  font-family: "DarkerGrotesque-Medium";
  font-size: 42px;
  margin-bottom: 1%;
  color: #0d47a1;
}

.main p {
  font-family: "DarkerGrotesque-Medium";
  font-size: 22px;
  margin-left: 0.5%;
}
</style>