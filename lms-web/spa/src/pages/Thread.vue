<template>
  <div id="main">
    <v-snackbar
      v-model="snackbarShow"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      absolute
      top
      class="snackbar"
      >{{ snackbarText }}</v-snackbar
    >
    <div id="body">
      <div id="content">
        <div class="headRow">
          <h1>{{ main.title }}</h1>
          <v-spacer></v-spacer>
          <v-btn class="Btn" text outlined @click="newPost">Reply</v-btn>
        </div>

        <div id="mainPost">
          <v-flex xs12 row>
            <v-col
              cols="3"
              md="3"
              lg="2"
              class="profile"
              @click="gotoProfile(main.author)"
            >
              <div class="icon" :id="main._id"></div>
              <div class="name">{{ postUser.name }}</div>
            </v-col>
            <v-col cols="9" md="9" lg="10" class="title">
              <div class="topRow">
                {{ new Date(main.created).toLocaleString() }}
              </div>
              <div class="content">
                <p>
                  {{ main.message }}
                </p>
              </div>
              <div class="btmRow">
                <v-btn class="Btn" text @click="reportDialog = true"
                  >Report</v-btn
                >
                <v-spacer></v-spacer>
                <div>
                  <v-btn
                    v-if="this.upvote.includes(this.userDetails.name)"
                    class="Btn"
                    text
                    color="success"
                    @click="vote('upvote')"
                    >Upvote {{ this.upvote.length }}</v-btn
                  >
                  <v-btn v-else class="Btn" text @click="vote('upvote')"
                    >Upvote {{ this.upvote.length }}</v-btn
                  >
                  <v-btn
                    v-if="this.downvote.includes(this.userDetails.name)"
                    class="Btn"
                    text
                    color="error"
                    @click="vote('downvote')"
                    >Downvote {{ this.downvote.length }}</v-btn
                  >
                  <v-btn v-else class="Btn" text @click="vote('downvote')"
                    >Downvote {{ this.downvote.length }}</v-btn
                  >
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
            @emit="postReport"
          ></discussion-card>
        </div>
      </div>
      <!-- New Thread Dialogue-->
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

      <!-- Report Dialogue-->
      <v-dialog v-model="reportDialog" persistent scrollable width="50%">
        <v-card tile>
          <v-toolbar flat dark color="primary">
            <v-btn icon dark @click="reportDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Submit A Report</v-toolbar-title>
          </v-toolbar>
          <div id="dialogMain">
            <div id="dialogBody">
              <v-form>
                <div class="inputRow">
                  <h3 class="size-18">Message:</h3>
                  <v-textarea
                    v-model="reportMsg"
                    outlined
                    rows="4"
                  ></v-textarea>
                </div>
                <v-btn text outlined @click="postReport(null)">Submit</v-btn>
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
      snackbarColor: "success",
      snackbarShow: false,
      snackbarText: "",
      snackbarTimeout: 5000,
      postUser: null, // main post user details
      userDetails: null, // current user details
      title: "",
      email: "",
      tRef: null,
      tMsg: null,
      courseRef: "",
      main: [],
      posts: [],
      type: "message",
      create: false,
      upvote: [],
      downvote: [],
      reportDialog: false,
      reportMsg: "",
      reportTitle: "",
    }
  },
  async mounted() {
    this.tRef = this.$route.query.tRef

    let rv2 = await http.get("/api/me")
    this.userDetails = rv2.data

    let rv = await http.get("/api/me/discussion/thread", {
      params: {
        tRef: this.tRef,
      },
    })

    this.main = rv.data.mainPost
    this.upvote = this.main.upvote
    this.downvote = this.main.downvote
    this.email = this.main.author
    this.posts = rv.data.posts
    this.courseRef = rv.data.courseRef

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
        this.postUser = rv.data
      } catch (e) {}
    },
    getImage() {
      let d = document.getElementById(this.main._id)
      d.innerHTML = ""
      d.innerHTML = this.postUser.profileImage
    },
    async newPost() {
      this.create = true
    },
    async vote(vote) {
      try {
        let rv = await http.post("/api/me/discussion/vote", {
          reference: this.main.reference, //thread reference
          type: "block",
          vote,
        })

        if (rv) {
          this.upvote = rv.data.upvote
          this.downvote = rv.data.downvote
        }
      } catch (e) {}
    },
    async postMsg() {
      let rv = await http.post("/api/me/discussion/post/thread/message", {
        courseRef: this.main.courseRef,
        tRef: this.tRef,
        message: this.tMsg,
      })

      if (rv) {
        this.$router.go()
      }
    },
    async postReport(data) {
      let body = null
      if (data == null) {
        body = {
          msgRef: this.main.reference,
          courseRef: this.main.courseRef,
          message: this.reportMsg,
          type: "threads",
        }
      } else {
        body = data
      }

      let rv = await http.post("/api/me/discussion/report", body)

      if (rv) {
        this.snackbarText = "Report submited successfully"
        this.snackbarShow = true
        this.reportDialog = false
        this.reportMsg = ""
      }
    },
  },
}
</script>

<style scoped>
#main {
  width: 80%;
  margin: auto;
}

.snackbar {
  position: sticky;
  top: 70px;
}

#body {
  margin-top: 2%;
}

#body h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(34px + (42 - 34) * ((100vw - 300px) / (1920 - 300)));
  color: #0d47a1;
}

#body p {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(16px + (24 - 16) * ((100vw - 300px) / (1920 - 300)));
  margin-left: 0%;
}

.v-label {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(24px + (32 - 24) * ((100vw - 300px) / (1920 - 300)));
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
  font-size: calc(14px + (28 - 14) * ((100vw - 300px) / (1920 - 300)));
  text-decoration: underline;
}

.title .topRow {
  font-family: "DarkerGrotesque-Medium";
  border-bottom: 1px solid lightgrey;
}

.content {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(16px + (20 - 16) * ((100vw - 300px) / (1920 - 300)));
  margin-top: 1%;
  margin-bottom: 1%;
}

.btmRow {
  font-family: "DarkerGrotesque-Medium";
  display: flex;
  font-size: calc(12px + (16 - 12) * ((100vw - 300px) / (1920 - 300)));
}

.Btn {
  font-family: "DarkerGrotesque-Bold";
  text-transform: none;
  font-size: calc(12px + (16 - 12) * ((100vw - 300px) / (1920 - 300)));
}

#dialogBody {
  width: 80%;
  margin: auto;
  margin-top: 2%;
  margin-bottom: 2%;
}

@media screen and (max-width: 1400px) {
  #main {
    margin-top: 10%;
  }
}

@media screen and (max-width: 1265px) {
  #main {
    width: 95% !important;
    margin: auto;
    margin-top: 8%;
  }

  #content {
    border: none;
    border-radius: 50px;
    padding: 2%;
  }

}


@media screen and (max-width: 600px) {
   #main {
    margin-top: 14%;
  }
}
</style>