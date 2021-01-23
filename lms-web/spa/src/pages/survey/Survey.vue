<template>
  <v-container fluid>
    <div class="main">
      <h3>Course Survey</h3>
      <p>
        Kindly fill up the survey regarding the course. <br>
        We will like to hear your feedback and help the instructor improve on their delivery of the course. <br>

        Once completed, remember to click "Complete" button to submit the survey. <br />
        Thank You.
      </p>
          <survey-viewer :survey="this.survey" :reference="this.reference" ></survey-viewer>
    </div>
  </v-container>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
      survey: null,
      reference: ""
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
      this.survey = rv.data.survey
        console.log("A", this.survey)
        console.log("B", this.reference)
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
  font-size: 28px;
  margin-left: 0.5%;
}
</style>