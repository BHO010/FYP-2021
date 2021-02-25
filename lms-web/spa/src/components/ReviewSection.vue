<template>
  <div class="template">
    <v-row class="sheetRow">
      <v-col cols="3" md="3" lg="2">
        <v-container class="user" @click="gotoProfile(review.author)">
          <div :id="review._id" class="icon"></div>
          <div>
            <div class="name">{{ userDetails.name }}</div>
            <div class="date"><b>Joined:</b> {{ review.joined }}</div>
          </div>
        </v-container>
      </v-col>
      <v-col cols="9" md="9" lg="10" class="reviewTxtContainer">
        <div class="reviewTxt">
          {{ review.review }}
        </div>
        <div class="btmDiv">
          {{ review.date }}
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { http } from "@/axios"

export default {
  name: "ReviewSection",
  props: {
    review: Object,
  },
  data() {
    return {
      userDetails: null,
      name: "",
      joined: "",
    }
  },
  created() {},
  async mounted() {
    await this.getUser()
    this.getImage()
    this.review.date = this.review.date.slice(0, 11)
    this.review.joined = this.review.joined.slice(0, 11)
  },
  methods: {
    async getUser() {
      try {
        let rv = await http.get("api/me/user", {
          params: {
            email: this.review.author,
          },
        })
        this.userDetails = rv.data
      } catch (e) {}
    },
    getImage() {
       let d = document.getElementById(this.review._id)
        d.innerHTML = ""
        d.innerHTML = this.userDetails.profileImage
    },
    gotoProfile(id) {
      console.log(id)
    },
  },
}
</script>
<style>
.icon svg {
  width: 50px;
  height: 50px;
}
</style>
<style scoped>
.template {
  margin-bottom: 2%;
  width: 100%;
}

.sheetRow {
  margin-left: 1%;
  margin-right: 1%;
  outline: 4px solid green;
}

.user {
  margin: 5px;
  border: 1px solid blue;
}

.user:hover {
  opacity: 0.55;
}

.icon {
  display: flex;
  align-content: center;
  justify-content: center;
}

.name {
  font-weight: bold;
  text-align: center;
}

.date {
  text-align: center;
}

.reviewTxtContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.reviewTxt {
  display: flex;
  align-content: center;
  font-size: calc(20px + (22 - 20) * ((100vw - 300px) / (1600 - 300)));;
  max-height: 100px;
  overflow-y: auto;
}

.btmDiv {
  font-style: italic;
}
</style>
