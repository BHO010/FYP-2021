<template>
  <v-card class="mt-5 mx-4" max-width="344">
    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" 
      height="200px"
    ></v-img>
     <v-card-subtitle class="py-0"> {{course.level}} </v-card-subtitle>
      <v-card-title class="py-0">{{course.title}}</v-card-title>
      <v-card-actions>
        <v-btn color="orange lighten-2" @click="viewCourse" text> View </v-btn>
      </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "CourseCard",
  props: {
    course: Object,
  },
  mounted() {

  },
  methods: {
      viewCourse() {
        this.$router
        .push({ path: "/course", query: { title: this.course.title } })
        .catch(err => {});
      }
  }
}
</script>

<style scoped>
.card {
  margin-right:5%;

}
</style>