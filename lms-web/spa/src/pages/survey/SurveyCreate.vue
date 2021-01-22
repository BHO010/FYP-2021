<template>
  <v-container fluid>
    <div class="main">
      <h3>Course Survey Creation</h3>
      <p>
        Create your own survey to collect information from the students after the course!
        <br />
        Click on the type of question you want from the tool box. <br />

        You will see it pop out under "Survey Template" <br />

        Type in your question in the input field. You can also delete the question by clicking on the delete icon. <br />

        Once completed, remember to click "Save Survey" button under the tool box. <br />
      </p>
      <br>
      <survey-builder></survey-builder>
    </div>
  </v-container>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {}
  },
  mounted() {},
  computed: {},
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