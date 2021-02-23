<template>
  <div id="home">
    <!-- Top row -->
    <v-flex row xs12 class="tagRow">
      <h1 class="header">Home</h1>
    </v-flex>

    <v-flex xs12 row class="width95 tagRow align-left">
      <!-- left column -->
      <v-col col="4" class="cardColLeft">
        <v-card class="homeCard" tile outlined elevation="5">
          <v-layout class="cardLayout" row>
            <div class="imgDiv">
              <img
              class="hidden-md-and-down cardImg1"
              src="../../public/img/users.svg"
            />
            </div>
            

            <div class="cardContainer">
              <v-flex row>
                <h2 class="cardText1">Total No. Of Users</h2>
              </v-flex>
              <v-flex row>
                <h2 class="cardNumber">{{stats.userCount}}</h2>
              </v-flex>
            </div>
          </v-layout>
        </v-card>
        <br>
        <br>
        <v-card class="homeCard" tile outlined elevation="5">
          <v-layout class="cardLayout" row>
            <div class="imgDiv">
              <img
              class="hidden-md-and-down cardImg1"
              src="../../public/img/registrations.svg"
            />
            </div>
            

            <div class="cardContainer">
              <v-flex row>
                <h2 class="cardText2">Total No. Of Registration</h2>
              </v-flex>
              <v-flex row>
                <h2 class="cardNumber">{{stats.regCount}}</h2>
              </v-flex>
            </div>
          </v-layout>
        </v-card>
      </v-col>

      <!-- Center column -->
      <v-col col="4" class="cardColCenter">
        <v-card class="homeCard" tile outlined elevation="5">
          <v-layout class="cardLayout" row>
            <div class="imgDiv">
              <img
                class="hidden-md-and-down cardImg3"
                src="../../public/img/instructors.svg"
              />
            </div>
            <div class="cardContainer">
              <v-flex row>
                <h2 class="cardText3">Total No. Of Instructors</h2>
              </v-flex>
              <v-flex row wrap>
                <h2 class="cardNumber">{{stats.instructorCount}}</h2>
              </v-flex>
            </div>
          </v-layout>
        </v-card>
        <br>
        <br>
         <v-card class="homeCard" tile outlined elevation="5">
          <v-layout class="cardLayout" row>
            <div class="imgDiv">
              <img
                class="hidden-md-and-down cardImg3"
                src="../../public/img/classes.svg"
              />
            </div>
            <div class="cardContainer">
              <v-flex row>
                <h2 class="cardText3">Total No. Of Classes</h2>
              </v-flex>
              <v-flex row wrap>
                <h2 class="cardNumber">{{stats.classesCount}}</h2>
              </v-flex>
            </div>
          </v-layout>
        </v-card>
      </v-col>
    </v-flex>
  </div>
</template>

<script>
import { http } from "@/axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      stats: []
    }
  },
  async mounted() {
    this.$store.commit("setLayout", "layout-private")

    try {
      let rv = await http.get('/api/admin/stats')
      this.stats = rv.data
      console.log(this.stats)
    }catch (e) {}
  },
}
</script>

<style scoped>
#home {
  width: 80%;
  margin: auto;
  margin-top: 5%;
}

.header {
  font-size: 58px;
  color: #005072;
}

.tagRow {
  margin-top: 2em;
}

.homeCard {
  min-width: 430px;
  min-height: 220px;
  max-width: 690px;
  max-height: 200px;
}

.cardColLeft {
  padding-left: 0;
  padding-right: 0;
  min-width: 500px;
  margin-right: 4%;
}

.imgDiv {
  width: 40%;
  margin-top: 7%;
  margin-left: 2%;
}

.cardContainer {
  width: 50%;
  height: 200px;
  margin-left: 2%;
  margin-top: 8%;
}

.cardImg1 {
  max-width: 50%;
}

.cardImg3 {
  max-width: 50%;
}

.cardText1 {
  max-width: 350px;
  margin-top: 1rem;
  font-size: calc(24px + (32 - 24) * ((100vw - 300px) / (1800 - 300)));;
}

.cardText2 {
   max-width: 350px;
  margin-top: 1rem;
  font-size: calc(24px + (32 - 24) * ((100vw - 300px) / (1800 - 300)));;
}

.cardText3 {
  max-width: 350px;
  margin-top: 1rem;
  font-size: calc(24px + (32 - 24) * ((100vw - 300px) / (1800 - 300)));;
}

.cardNumber {
  color: #f92c2c;
  font-size: 50px;
}
</style>
