<template>
  <v-card class="mt-5 mx-4 card justify-space-around">
    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
      height="150px"
    ></v-img>
    <v-card-subtitle class="py-0 level"> {{ course.level }} </v-card-subtitle>
    <v-card-title class="py-0 title">{{ course.title }}</v-card-title>
    <v-rating
      v-model="rating"
      readonly
      background-color="orange lighten-3"
      color="orange"
      large
    ></v-rating>
    <v-card-actions class="btmRow">
      <v-btn color="orange lighten-2" @click="viewCourse" text> View </v-btn>
      <!-- <v-btn color="orange lighten-2" @click="editCourse" text> Edit </v-btn>
        <v-btn color="orange lighten-2" @click="survey" text> Survey </v-btn> -->
    </v-card-actions>
  </v-card>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  name: "CourseCard",
  props: {
    course: Object,
    type: String,
  },
  data() {
    return {
      rating: 3,
    }
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  mounted() {
    if(this.course.rating) {
      this.rating = this.course.rating
    }else {
      this.rating = this.course.totalRate / this.course.rateCount
    }
  },
  methods: {
    viewCourse() {
      if (this.type == "registered") {
        this.$router
          .push({ path: `/course/${this.course.courseRef}` })
          .catch((err) => {})
      } else {
        this.$router
          .push({ path: `/course/${this.course.reference}` })
          .catch((err) => {})
      }
    },
    editCourse() {
      this.$router
        .push({
          path: "/course/edit",
          query: { reference: this.course.reference },
        })
        .catch((err) => {})
    },
    survey() {
      this.$router
        .push({ path: "/survey", query: { reference: this.course.reference } })
        .catch((err) => {})
    },
  },
}
</script>

<style scoped>
.card {
  position: relative;
  min-height: 300px;
  max-width: 300px;
}

.level {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(16px + (24 - 16) * ((100vw - 300px) / (1920 - 300)));
  color: #0d47a1;
  margin-bottom: 1% !important;
  margin-top: 1% !important;
}

.title {
  font-family: "DarkerGrotesque-Medium" !important;
  font-size: calc(16px + (24 - 16) * ((100vw - 300px) / (1920 - 300))) !important;
  color: #0d47a1;
  width: 80%;
  margin-top: 2%;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis !important;
}


.btmRow {
  position: absolute;
  bottom: 0;
  padding: 0;
}

@media screen and (max-width: 1280px) {
  .card {
    position: relative;
    min-height: 350px;
  }
}
</style>