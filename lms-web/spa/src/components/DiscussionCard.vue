<template>
  <div class="template">
    <div v-if="!block">
      <h2>You do not have any courses.</h2>
    </div>
    <div v-else>
      <v-flex xs12 row v-if="type == 'block' && type2 == 'owned'">
        <v-col cols="5" md="5" lg="8" class="title">
          <router-link
            class="link"
            :to="{ path: `/discussion`, query: { ref: block.reference } }"
            >{{ block.title }}</router-link
          >
        </v-col>
        <v-col cols="2" md="2" lg="1"  class="stats">
          <div>Threads</div>
          <div>{{ block.threads }}</div>
        </v-col>
        <v-col cols="2" md="2" lg="1" class="stats">
          <div>Messages</div>
          <div>{{ block.msgs }}</div>
        </v-col>
        <v-col cols="3" md="3" lg="2" class="stats">
          <div>{{ block.latest.title }}</div>
          <div>{{ block.latest.author }}</div>
        </v-col>
      </v-flex>

      <v-flex xs12 row v-if="type == 'block' && type2 == 'registered'">
        <v-col cols="5" md="5" lg="8" class="title">
          <router-link
            class="link"
            :to="{ path: `/discussion`, query: { ref: block.courseRef } }"
            >{{ block.title }}</router-link
          >
        </v-col>
        <v-col cols="2" md="2" lg="1" class="stats">
          <div>Threads</div>
          <div>{{ block.threads }}</div>
        </v-col>
        <v-col cols="2" md="2" lg="1" class="stats">
          <div>Messages</div>
          <div>{{ block.msgs }}</div>
        </v-col>
        <v-col cols="3" md="3" lg="2" class="stats">
          <div>{{ block.latest.title }}</div>
          <div>{{ block.latest.author }}</div>
        </v-col>
      </v-flex>

      <v-flex xs12 row v-if="type == 'thread'">
        <v-col cols="3" md="3" lg="1" class="profile" @click="gotoProfile(block.author)">
          <div class="icon" :id="block._id"></div>
          <div class="name">{{ userDetails.name }}</div>
          <div class="name">{{ userDetails.role }}</div>
          <div></div>
        </v-col>
        <v-col cols="5" md="5" lg="7" class="title">
          <router-link
            class="link"
            :to="{
              path: `/discussion/thread`,
              query: { tRef: block.reference },
            }"
            >{{ block.title }}</router-link
          >
          <div class="btmRow">
            {{ block.name }}, {{ new Date(block.created).toLocaleString() }}
          </div>
        </v-col>
        <v-col cols="2" md="2" lg="2" class="tStats">
          <v-row>
            <div>Replies:</div>
            <v-spacer></v-spacer>
            <div>{{ block.rCount }}</div>
          </v-row>
          <v-row>
            <div>Views:</div>
            <v-spacer></v-spacer>
            <div>{{ block.views }}</div>
          </v-row>
        </v-col>
        <v-col cols="2" md="2" lg="2" class="tStats">
          <div v-if="block.latest.created">{{ new Date(block.latest.created).toLocaleString()}}</div>
          <div>{{ block.latest.name }}</div>
        </v-col>
      </v-flex>

      <v-flex xs12 row v-else-if="type == 'message'">
        <v-col cols="3" md="3" lg="2" class="profile" @click="gotoProfile(block.author)">
          <div class="icon" :id="block._id"></div>
          <div class="name">{{ blockUser.name }}</div>
        </v-col>
        <v-col cols="9" md="9" lg="10" class="title">
          <div class="topRow">
            {{ new Date(block.created).toLocaleString() }}
          </div>
          <div class="content">
            <p>
              {{ block.message }}
            </p>
          </div>
          <div class="btmRow">
            <v-btn class="Btn" text @click="reportDialog = true">Report</v-btn>
            <v-spacer></v-spacer>
            <div>
              <v-btn
                v-if="this.upvote.includes(this.userDetails.name)"
                class="Btn"
                text
                color="success"
                @click="vote('upvote')"
                >Upvote {{this.upvote.length}}</v-btn
              >
              <v-btn v-else class="Btn" text @click="vote('upvote')"
                >Upvote {{this.upvote.length}}</v-btn
              >

              <v-btn
                v-if="this.downvote.includes(this.userDetails.name)"
                class="Btn"
                text
                color="error"
                @click="vote('downvote')"
                >Downvote {{this.downvote.length}}</v-btn
              >
              <v-btn v-else class="Btn" text @click="vote('downvote')"
                >Downvote {{this.downvote.length}}</v-btn
              >
            </div>
          </div>
        </v-col>
      </v-flex>
    </div>

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
                  <v-textarea v-model="reportMsg" outlined rows="4"></v-textarea>
                </div>
                <v-btn text outlined @click="postReport(block)">Submit</v-btn>
              </v-form>
            </div>
          </div>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  name: "DiscussionCard",
  props: {
    block: Object,
    type: String,
    type2: String,
  },
  data() {
    return {
      snackbarColor: "success",
      snackbarShow: false,
      snackbarText: "",
      snackbarTimeout: 5000,
      userDetails: null, // current user
      blockUser: null, // message block author
      upvote: [],
      downvote: [],
      reportDialog: false,
      reportMsg: "",
      reportTitle: ""

    }
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  async mounted() {
    if (this.type != "block") {
      this.upvote = this.block.upvote
      this.downvote = this.block.downvote

      let rv = await http.get("/api/me")
      this.userDetails = rv.data

      await this.getUser()
      await this.getImage()
    }
  },
  methods: {
    async getUser() {
      try {
        let rv = await http.get("api/me/user", {
          params: {
            email: this.block.author,
          },
        })
        this.blockUser = rv.data
      } catch (e) {}
    },
    getImage() {
      let d = document.getElementById(this.block._id)
      d.innerHTML = ""
      d.innerHTML = this.blockUser.profileImage
    },
    async vote(vote) {
      try {
        let rv = await http.post("/api/me/discussion/vote", {
          reference: this.block.reference, //message reference
          type: this.type,
          vote,
        })

        if (rv) {
          this.upvote = rv.data.upvote
          this.downvote = rv.data.downvote
        }
      } catch (e) {}
    },
    async postReport(data) {
      
      let body = {
          msgRef: data.reference,
          courseRef: data.courseRef,
          message: this.reportMsg,
          type: "message"
      }
      
      this.$emit('emit', body)

      this.reportDialog = false
      this.reportMsg = ""
    }
  },
}
</script>

<style>
#icon svg {
  width: 80px;
  height: 80px;
}
</style>
<style scoped>
.template {
  border: 1px solid black;
  margin-bottom: 2%;
  width: 100%;
}

.snackbar {
  position: sticky;
  top: 70px;
}

.row {
  margin: 0;
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
}

.name {
  font-weight: bold;
  text-align: center;
}

.link {
  font-family: "DarkerGrotesque-Bold";
  font-size: calc(18px + (28 - 18) * ((100vw - 300px) / (1920 - 300)));
  text-decoration: underline;
}

.title,
.stats,
.tStats {
  border-left: 1px solid blue;
  font-family: "DarkerGrotesque-Medium";
  padding-top: 0;
  padding-bottom: 0;
  
  font-size: calc(12px + (16 - 12) * ((100vw - 300px) / (1920 - 300)));
}

.tStats {
  padding-top: 2%;
  font-weight: bold;
  
}

/* Thread */
.title .btmRow {
  font-family: "DarkerGrotesque-Medium";
  display: flex;
  font-size: calc(12px + (16 - 12) * ((100vw - 300px) / (1920 - 300)));
}

/* Message */
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

.message .btmRow {
  font-family: "DarkerGrotesque-Medium";
  border-top: 1px solid lightgrey;
  display: flex;
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
</style>