<template>
  <div v-if="auth" id="main">
    <div id="body">
      <h1>Survey Results</h1>
    </div>
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
  computed: {
    ...mapState(["error", "loading"]),
  },
  async mounted() {
    try {
      this.$store.commit("setLoading", true)
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
  width: 80%;
  margin: auto;
}

#body h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: 48px;
  color: #0d47a1;
  margin-bottom: 1%;
}

#body {
  margin-top: 2%;
}
</style>