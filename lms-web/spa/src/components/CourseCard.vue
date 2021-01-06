<template>
  <v-card class="mt-5 mx-4 card" max-width="344">
    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" 
      height="200px"
    ></v-img>
     <v-card-subtitle class="py-0 level"> {{course.level}} </v-card-subtitle>
      <v-card-title class="py-0 title">{{course.title}}</v-card-title>
      <v-card-actions class="btmRow">
        <v-btn color="orange lighten-2" @click="viewCourse" text> View </v-btn>
        <v-btn color="orange lighten-2" @click="editCourse" text> Edit </v-btn>
        <v-btn color="orange lighten-2" @click="survey" text> Survey </v-btn>
      </v-card-actions>
  </v-card>
</template>
http://127.0.0.1:8080/survey/create?reference=4fbac54a-b0ab-4257-8043-2378d6035ae4
<script>
export default {
  name: "CourseCard",
  props: {
    course: Object,
  },
  mounted() {
    console.log("courseCard",this.course)
  },
  methods: {
      viewCourse() {
        this.$router
        .push({ path: `/course/${this.course.title}`})
        .catch(err => {});
      },
      editCourse() {
        this.$router
        .push({ path: "/course/edit", query: { reference: this.course.reference } })
        .catch(err => {});
      },
      survey() {
        this.$router
        .push({ path: "/survey", query: { reference: this.course.reference } })
        .catch(err => {});
      }
  }
}
</script>

<style scoped>
.card {
  position: relative;
  min-height: 350px;

}

.level {
  font-family: "DarkerGrotesque-Medium";
  font-size: 22px;
  color: #0d47a1;
  margin-bottom: 1% !important;
  margin-top: 1% !important;
}

.title {
  font-family: "DarkerGrotesque-Medium";
  color: #0d47a1;
  margin-bottom: 1% !important;
  margin-top: 3% !important;
}

.btmRow {
  position: absolute;
  bottom: 0;
  padding: 0;
}
</style>