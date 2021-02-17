<template>
  <v-card v-if="achievement.level != 0" class="card">
    <div v-if="(type = 'profile')" class="row">
      <div class="topRow">
        <v-img class="svg" width="100px" :src="imgURL"></v-img>
      </div>

      <div class="btmRow">
        <h2>{{ achievement.title }}</h2>
      </div>
    </div>

    <div v-else class="row">
      <div class="leftCol">
        <v-img width="150px" :src="imgURL"></v-img>
      </div>
      <div class="rightCol">
        <h2>{{ achievement.title }}</h2>
        <p>{{ achievement.info }}</p>
        <div>Level: {{ achievement.level }}</div>
        <div>Points to next level: {{ achievement.nextReq }}</div>
      </div>
    </div>
  </v-card>

  <v-card v-else class="card disabled">
    <div class="row">
      <div class="leftCol">
        <v-img width="150px" :src="imgURL"></v-img>
      </div>
      <div class="rightCol">
        <h2>{{ achievement.title }}</h2>
        <p>{{ achievement.info }}</p>
        <div>Level: {{ achievement.level }}</div>
        <div>Points to next level: {{ achievement.nextReq }}</div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapState } from "vuex"
import { http } from "@/axios"

export default {
  name: "achievement-card",
  props: {
    achievement: Object,
    type: String,
  },
  data() {
    return {
      imgURL: "",
    }
  },
  async mounted() {
    this.imgURL = "/img/achievements/" + this.achievement.id + "-badge.svg"
  },
  methods: {},
}
</script>

<style scoped>
.leftCol {
  padding: 2%;
}

.rightCol {
  padding: 3%;
  padding-left: 5%;
}

.card {
  width: 100%;
  height: 200px;
  margin: 2%;
  margin-left: 3%;
}

.card .row {
  margin: 1%;
}

.card .leftCol {
  width: 30%;
}

.disabled {
  opacity: 0.3;
}

.topRow,
.btmRow {
  width: 80%;
  margin: auto;
  text-align: center;
  align-content: center;
  justify-content: center;
}

.svg {
  margin: auto;
}


</style>