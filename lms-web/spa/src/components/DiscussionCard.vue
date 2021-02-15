<template>
  <div class="template">
    <div v-if="!block">
      <h2>You do not have any courses.</h2>
    </div>
    <div v-else>
      <v-flex xs12 row v-if="type == 'block' && type2=='owned'">
        <v-col cols="8" class="title">
          <router-link class="link" :to="{ path: `/discussion`, query: { ref: block.reference } }">{{block.title}}</router-link>
        </v-col>
        <v-col cols="1" class="stats">
          <div>Threads</div>
          <div>{{block.threads}}</div>
        </v-col>
        <v-col cols="1" class="stats">
          <div>Messages</div>
          <div>{{block.msgs}}</div>
        </v-col>
        <v-col cols="2" class="stats">
          <div>{{block.latest.title}}</div>
          <div>{{block.latest.author}}</div>
        </v-col>
      </v-flex>

      <v-flex xs12 row v-if="type == 'block' && type2=='registered'">
        <v-col cols="8" class="title">
          <router-link class="link" :to="{ path: `/discussion`, query: { ref: block.courseRef } }">{{block.title}}</router-link>
        </v-col>
        <v-col cols="1" class="stats">
          <div>Threads</div>
          <div>{{block.threads}}</div>
        </v-col>
        <v-col cols="1" class="stats">
          <div>Messages</div>
          <div>{{block.msgs}}</div>
        </v-col>
        <v-col cols="2" class="stats">
          <div>{{block.latest.title}}</div>
          <div>{{block.latest.author}}</div>
        </v-col>
      </v-flex>

      <v-flex xs12 row v-if="type == 'thread'">
        <v-col cols="1" class="profile" @click="gotoProfile(block.author)">
          <div class="icon" :id="block._id"></div>
          <div class="name">{{userDetails.name}}</div>
          <div class="name">{{userDetails.role}}</div>
          <div>
            
          </div>
        </v-col>
        <v-col cols="8" class="title">
          <router-link class="link" :to="{path: `/discussion/thread`, query: {tRef: block.reference}}"
            >{{block.title}}</router-link
          >
          <div class="btmRow">{{block.name}}, {{new Date(block.created).toLocaleString()}}</div>
        </v-col>
        <v-col cols="1.5" class="tStats">
          <v-row>
            <div>Replies:</div>
            <v-spacer></v-spacer>
            <div>{{block.rCount}}</div>
          </v-row>
          <v-row>
            <div>Views:</div>
            <v-spacer></v-spacer>
            <div>{{block.views}}</div>
          </v-row>
        </v-col>
        <v-col cols="1.5" class="tStats">
          <div>{{new Date(block.latest.created).toLocaleString()}}</div>
          <div>{{block.latest.name}}</div>
        </v-col>
      </v-flex>

      <v-flex xs12 row v-else-if="type == 'message'">
        <v-col cols="2" class="profile" @click="gotoProfile(block.author)">
          <div class="icon" :id="block._id"></div>
          <div class="name">{{userDetails.name}}</div>
        </v-col>
        <v-col cols="10" class="title">
          <div class="topRow">{{new Date(block.created).toLocaleString()}}</div>
          <div class="content">
            <p>
              {{block.message}}
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
    type2: String
  },
  data() {
    return {
      userDetails: null,
      
    }
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  async mounted() {
    if(this.type != "block") {
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
        this.userDetails = rv.data
      } catch (e) {}
    },
    getImage() {
      let d = document.getElementById(this.block._id)
      d.innerHTML = ""
      d.innerHTML = this.userDetails.profileImage
    },
    async upvote() {},
    async downvote() {}
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
  font-size: 28px;
  text-decoration: underline;
}

.title,
.stats,
.tStats {
  border-left: 1px solid blue;
  font-family: "DarkerGrotesque-Medium";
  padding-top: 0;
  padding-bottom: 0;
}

.tStats {
  padding-top: 2%;
  font-weight: bold;
}

/* Thread */
.title .btmRow {
  font-family: "DarkerGrotesque-Medium";
  display: flex;
}

/* Message */
.title .topRow {
  font-family: "DarkerGrotesque-Medium";
  border-bottom: 1px solid lightgrey;
}

.content {
  font-family: "DarkerGrotesque-Medium";
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
}
</style>