<template>
  <div id="main">
    <div id="body">
      <div id="content">
        <div class="headRow">
          <h1>{{ main.title }}</h1>
          <v-spacer></v-spacer>
          <v-btn class="Btn" text outlined @click="newPost">New Post</v-btn>
        </div>

        <div id="mainPost">
          <v-flex xs12 row>
            <v-col cols="2" class="profile" @click="gotoProfile(main.author)">
              <div class="icon" :id="main._id"></div>
              <div class="name">{{ userDetails.name }}</div>
            </v-col>
            <v-col cols="10" class="title">
              <div class="topRow">{{ main.created }}</div>
              <div class="content">
                <p>
                  {{ main.message }}
                </p>
              </div>
              <div class="btmRow">
                <v-btn class="Btn" text>Report</v-btn>
                <v-spacer></v-spacer>
                <div>
                  <v-btn class="Btn" text @click="upVote">Upvote</v-btn>
                  <v-btn class="Btn" text @click="downVote">Downvote</v-btn>
                </div>
              </div>
            </v-col>
          </v-flex>
        </div>
        <div id="imptContent">
          <discussion-card
            v-for="post in posts"
            :block="post"
            :key="post._id"
            :type="type"
          ></discussion-card>
        </div>
      </div>
      <!-- Dialogue-->
      <v-dialog v-model="create" persistent scrollable width="50%">
        <v-card tile>
          <v-toolbar flat dark color="primary">
            <v-btn icon dark @click="create = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <div id="dialogMain">
            <div id="dialogBody">
              <v-form>
                <div class="inputRow">
                  <h3 class="size-18">Message:</h3>
                  <v-textarea v-model="tMsg" outlined rows="4"></v-textarea>
                </div>
                <v-btn text outlined @click="postMsg">Submit</v-btn>
              </v-form>
            </div>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { http } from "@/axios"

export default {
  data() {
    return {
      userDetails: null,
      title: "",
      email: "",
      tRef: null,
      main: [],
      posts: [],
      type: "message",
      create: false
    }
  },
  async mounted() {
    this.tRef = this.$route.query.tRef
    let rv = await http.get("/api/me/discussion/thread", {
      params: {
        tRef: this.tRef,
      },
    })

    this.main = rv.data.mainPost
    this.email = this.main.author
    this.posts = rv.data.posts
    await this.getUser()
    await this.getImage()
  },
  methods: {
    async getUser() {
      try {
        let rv = await http.get("api/me/user", {
          params: {
            email: this.email,
          },
        })
        this.userDetails = rv.data
      } catch (e) {}
    },
    getImage() {
      let d = document.getElementById(this.main._id)
      d.innerHTML = ""
      d.innerHTML = this.userDetails.profileImage
    },
    async newPost() {
      this.create = true
    },
    async upVote() {},
    async downVote() {},
    async postMsg() {}
  },
}
</script>

<style scoped>
#main {
  width: 80%;
  margin: auto;
}

#body {
  margin-top: 2%;
}

#body h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: 42px;
  color: #0d47a1;
}

#body p {
  font-family: "DarkerGrotesque-Medium";
  font-size: 24px;
  margin-left: 0%;
}

.v-label {
  font-family: "DarkerGrotesque-Medium";
  font-size: 32px;
  font-weight: bold;
  color: black;
  margin-right: 1%;
}

#content {
  border: 8px solid lightgrey;
  border-radius: 50px;
  padding: 2%;
}

.headRow {
  display: flex;
  margin: 0;
  margin-bottom: 1%;
}

.row {
  margin: 0;
}

#mainPost {
  border: 1px solid black;
  margin-bottom: 1%;
  width: 100%;
}

.profile {
  border: 1px solid blue;
}

.profile:hover {
  opacity: 0.55;
}

.icon {
  display: flex;
  align-content: center;
  justify-content: center;
  margin: auto;
}

.name {
  font-weight: bold;
  text-align: center;
}

.link {
  font-family: "DarkerGrotesque-Bold";
  font-size: 28px;
  text-decoration: underline;
}

.title .topRow {
  font-family: "DarkerGrotesque-Medium";
  border-bottom: 1px solid lightgrey;
}

.content {
  font-family: "DarkerGrotesque-Medium";
  margin-top: 1%;
  margin-bottom: 1%;
}

.btmRow {
  font-family: "DarkerGrotesque-Medium";
  border-top: 1px solid lightgrey;
  display: flex;
}

.Btn {
  font-family: "DarkerGrotesque-Bold";
  text-transform: none;
}

#dialogBody {
  width: 80%;
  margin: auto;
  margin-top: 2%;
  margin-bottom: 2%;
}
</style>