<template>
  <div id="main">
    <div id="header">
      <h1>Courses Created</h1>
    </div>
    <div id="body">
      <div v-if="!courses" class="message">
          <p>
              You have not created any courses <br>

              Get started by <router-link to="/course/create">creating</router-link> your courses.
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
            courses: [],
        }
    },
    async mounted() {
        const rv = await http.get('/api/me/courses/created')
        this.courses = rv.data.courses
        console.log("here",this.courses)
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

.v-sheet.v-card {
  margin-right: 8% !important;
  margin-bottom: 4% !important;
}
</style>