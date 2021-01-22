<template>
  <v-container fluid>
    <div class="main">
      <h3>Course Survey</h3>
      <p>
        This is the course completion survey. <br>

        Once completed, remember to click "Complete" button to submit the survey. <br />
      </p>
      <!-- <survey-display 
          :key="Json.page"
          :Json="Json"></survey-display>
          <survey-builder></survey-builder> -->
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
      Json: null,
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
     // let rv = await http.get(`/api/me/survey/${this.reference}`)
     // this.surveyJson = JSON.parse(rv.data.surveyJson)
     // this.Json = this.surveyJson
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