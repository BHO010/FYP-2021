<template>
  <v-container fluid>
    <div v-if="auth" class="main">
      <h3>Course Survey Edit</h3>
     <p>
        Create your own survey to collect information from the students after
        the course!
        <br />
        Click on the type of question you want from the tool box. <br />

        You will see it pop out under "Survey Template" <br />

        Type in your question in the input field. You can also delete the
        question by clicking on the delete icon. <br />

        Once completed, remember to click "Save Survey" button under the tool
        box. <br />
      </p>
      <survey-builder :survey="this.survey" :type="this.type"></survey-builder>
    </div>

    <div v-else class="main">
      <h3>You are not authorized to access this page.</h3>
    </div>
  </v-container>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
      survey: [],
      reference: "",
      type: "Edit",
      auth: false,
    }
  },
  async mounted() {
    try {
      this.reference = this.$route.query.reference
      const rv2 = await http.get("/api/me")
      this.userDetails = rv2.data
      if (this.userDetails.role == "instructor") {
        this.auth = true
      }
      const rv = await http.get(`/api/me/survey/${this.reference}`)
      console.log("AA", rv.data)
      if(rv.data == null) {
        this.type = ""
      }
      this.survey = rv.data.survey
    } catch (e) {}
  },
  computed: {
     ...mapState(["error", "loading"]),
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