<template>
  <div v-if="auth" id="main">
    <!-- <survey-analytics
      :key="Json.page"
      :Json="this.Json"
      :results="this.results"
    ></survey-analytics> -->
  </div>

  <div v-else class="main">
    <h3>You are not authorized to access this page.</h3>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
      results: null,
      reference: "",
      userDetails: null,
      auth: false,
    }
  },
  async mounted() {
    try {
      this.reference = this.$route.query.reference
      let rv = await http.get(`/api/me/survey/${this.reference}`)
      let user = await http.get("/api/me")
      let rv2 = await http.get(`/api/me/survey/results/${this.reference}`)

      this.userDetails = user.data
      if (this.userDetails.role == "instructor") {
        this.auth = true
      }
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