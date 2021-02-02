<template>
  <div id="main">
    <div id="header">
      <h1>Courses Registered</h1>
    </div>
    <div id="body">
      <div class="message" v-if="!courses">
          <p>
              You do not have any courses registered! <br>

              Get started by <router-link to="/browse">browsing</router-link> for courses.
          </p>
      </div>
      <div v-else class="flex-row wrap">
          <course-card
          v-for="course in courses"
          :key="course._id"
          :course="course"
          >
         </course-card>
      </div>
    </div>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
    data() {
        return {
            courses: null,
        }
    },
    async mounted() {
        const rv = await http.get('/api/me/courses/taken')
        this.courses = rv.data.courses
    },
    methods: {

    },
}
</script>

<style scoped>
#main {
  width: 80%;
  margin: auto;
  margin-top: 1%;
}

#body {
  min-height: 200px;
}

#body .flex-row {
  display: flex;
}

#body .wrap {
  flex-wrap: wrap;
}

#header h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: 48px;
  color: #0d47a1;
}

.message {
  font-family: "DarkerGrotesque-Medium";
  font-size: 28px;
}

.card {
    margin: auto;
}
</style>