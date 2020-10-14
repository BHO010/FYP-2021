<template>
  <div class="template">
    <v-row class="sheetRow">
      <v-col cols="2">
        <v-container class="user" @click="gotoProfile(review.author)">
          <div :id="review._id" class="icon"></div>
          <div>
            <div class="name">{{ review.name }}</div>
            <div class="date"><b>Joined:</b> {{ review.joined }}</div>
          </div>
        </v-container>
      </v-col>
      <v-col cols="10" class="reviewTxtContainer">
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
export default {
  name: "ReviewSection",
  props: {
    review: Object,
  },
  created() {

  },
  mounted() {
        this.getImage()
        this.review.joined = this.review.joined.slice(0, 11)
        this.review.date = this.review.date.slice(0, 11)
  },
  methods: {
    getImage() {
      let d = document.getElementById(this.review._id)
      d.innerHTML = ""
      d.innerHTML = this.review.authorImg
    },
    gotoProfile(id) {
        console.log(id)
    }
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
  outline: 4px solid green
}

.user {
    margin:5px;
    border:1px solid blue;
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
  max-height: 100px;
  overflow-y: auto;
}

.btmDiv {
    font-style: italic;
}
</style>
