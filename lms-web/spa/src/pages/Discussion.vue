<template>
  <div id="main">
    <div id="body">
      <h1>Discussion Board</h1>
      <p>Connect and discuss with peers that took the same course as you.</p>
      <div v-if="user">
        <div id="content">
          <div v-if="type == 'block'">
            <div id="imptContent">
              <discussion-card
                v-for="course in regCourses"
                :key="course._id"
                :block="course"
                :type="type"
              >
              </discussion-card>
            </div>
          </div>
          <div v-else>
            <v-row>
              <h1>Notice</h1>
              <v-spacer></v-spacer>
              <v-btn class="Btn">New Thread</v-btn>
            </v-row>

            <div id="imptContent">
              <discussion-card :type="type"></discussion-card>
            </div>
            <h1>Discussion</h1>
            <div id="discussionContent"></div>
          </div>
        </div>
      </div>
      <div v-else>
        <div id="content">
          <div v-if="type == 'block'">
            <div>
              <h1>Your Courses</h1>
              <div id="imptContent">
                <discussion-card
                  v-for="course in courses"
                  :key="course._id"
                  :block="course"
                  :type="type"
                ></discussion-card>
              </div>
              <h1>Courses Registered</h1>
              <div id="imptContent">
                <discussion-card
                  v-for="course in regCourses"
                  :key="course._id"
                  :block="course"
                  :type="type"
                ></discussion-card>
              </div>
            </div>
          </div>
          <div v-else-if="type == 'thread'">
            <div class="row">
              <h1>Notice</h1>
              <v-spacer></v-spacer>
              <v-btn
                v-if="!user"
                class="Btn"
                text
                outlined
                @click="newThread('notice')"
                >New Thread</v-btn
              >
            </div>
            <div id="imptContent">
              <discussion-card
                v-for="thread in imptThreads"
                :block="thread"
                :key="thread._id"
                :type="type"
              ></discussion-card>
            </div>
            <div class="row">
              <h1>Discussion</h1>
              <v-spacer></v-spacer>
              <v-btn class="Btn" text outlined @click="newThread('discussion')"
                >New Thread</v-btn
              >
            </div>
            <div id="discussionContent">
              <discussion-card
                v-for="thread in threads"
                :block="thread"
                :key="thread._id"
                :type="type"
              ></discussion-card>
            </div>
          </div>
        </div>
      </div>
      <!-- Dialogue-->
      <v-dialog v-model="create" persistent scrollable width="50%">
        <v-card tile>
          <v-toolbar flat dark color="primary">
            <v-btn icon dark @click="create = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Create a new thread</v-toolbar-title>
          </v-toolbar>
          <div id="dialogMain">
            <div id="dialogBody">
              <v-form>
                <div class="inputRow">
                  <h3 class="size-18">Title:</h3>
                  <v-text-field
                    v-model="title"
                    type="text"
                    outlined
                    dense
                  ></v-text-field>
                </div>
                <div class="inputRow">
                  <h3 class="size-18">Message:</h3>
                  <v-textarea v-model="tMsg" outlined rows="4"></v-textarea>
                </div>
                <v-btn text outlined @click="postThread">Submit</v-btn>
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
      user: true,
      title: "",
      tMsg: "",
      ref: null,
      courses: [],
      regCourses: [],
      threads: [],
      imptThreads: [],
      type: "block",
      create: false,
      createType: null,
    }
  },
  async mounted() {
    let user = await http.get("api/me")
    if (user.data.role == "instructor") {
      this.user = false
    }

    this.ref = this.$route.query.ref

    if (this.ref) {
      this.type = "thread"
      let rv = await http.get("/api/me/discussion", {
        params: {
          reference: this.ref,
        },
      })
      this.imptThreads = rv.data.imptThreads //notice section
      this.threads = rv.data.threads  // discussion section
    } else {
      let rv = await http.get("/api/me/discussion/list")

      if (this.user) {
        this.regCourses = rv.data
      } else {
        this.courses = rv.data.courses
        this.regCourses = rv.data.regCourses
      }
    }
  },
  methods: {
    async newThread(type) {
      this.create = true
      this.createType = type
    },
    async postThread() {
      let rv = await http.post("/api/me/discussion/post/thread", {
        createType: this.createType,
        tMsg: this.tMsg,
        title: this.title,
        courseRef: this.ref,
      })

      if (rv) {
        this.$router.go()
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

.row {
  display: flex;
  margin: 0;
  margin-bottom: 1%;
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

v.application-wrap >>> .v-dialog {
  width: 50%;
}
</style>