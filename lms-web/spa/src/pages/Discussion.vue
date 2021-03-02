<template>
  <div id="main">
    <div id="body">
      <h1>Discussion Board</h1>
      <p>Connect and discuss with peers that took the same course as you.</p>
      <div v-if="user">
        <div id="content">
          <div v-if="type == 'block'">
            <h1>Courses Registered</h1>
            <div id="imptContent">
              <discussion-card
                v-for="course in regCourses"
                :key="course._id"
                :block="course"
                :type="type"
                type2="registered"
              >
              </discussion-card>
            </div>
          </div>
          <!-- Thread -->
          <div v-else>
            <v-row>
              <h1>Notice</h1>
              <v-spacer></v-spacer>
            </v-row>

            <div id="imptContent">
              <discussion-card
                v-for="thread in imptThreads"
                :block="thread"
                :key="thread._id"
                :type="type"
              ></discussion-card>
              <v-pagination
                v-if="blockRegTotal > 1"
                v-model="blockRegPage"
                :length="this.blockRegTotal"
                :total-visible="7"
                circle
                @input="blockRegPagination('registered')"
              ></v-pagination>
            </div>
            <v-row>
              <h1>Discussion</h1>
              <v-spacer></v-spacer>
              <v-btn class="Btn" text outlined @click="newThread('discussion')"
                >New Thread</v-btn
              >
            </v-row>
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
      <!-- instructor -->
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
                  type2="owned"
                ></discussion-card>
                <v-pagination
                  v-if="blockTotal > 1"
                  v-model="blockPage"
                  :length="this.blockTotal"
                  :total-visible="7"
                  circle
                  @input="blockPagination('owned')"
                ></v-pagination>
              </div>
              <h1>Courses Registered</h1>
              <div id="imptContent">
                <discussion-card
                  v-for="course in regCourses"
                  :key="course._id"
                  :block="course"
                  :type="type"
                  type2="registered"
                ></discussion-card>
                <v-pagination
                  v-if="blockRegTotal > 1"
                  v-model="blockRegPage"
                  :length="this.blockRegTotal"
                  :total-visible="7"
                  circle
                  @input="blockRegPagination('registered')"
                ></v-pagination>
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
              <v-pagination
                v-if="imptPageCount > 1"
                v-model="imptCurrentPage"
                :length="this.imptPageCount"
                :total-visible="7"
                circle
                @input="getImptThreads()"
              ></v-pagination>
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
              <v-pagination
                v-if="threadsPageCount > 1"
                v-model="threadsCurrentPage"
                :length="this.threadsPageCount"
                :total-visible="7"
                circle
                @input="getDscussionThreads()"
              ></v-pagination>
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
                  <!-- <v-textarea v-model="tMsg" outlined rows="4"></v-textarea> -->
                  <ckeditor v-model="tMsg" :config="editorConfig"></ckeditor>
                </div>
                <v-btn class="submitBtn" text outlined @click="postThread"
                  >Submit</v-btn
                >
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
      blockTotal: 0,
      blockPage: 1,
      blockRegTotal: 0,
      blockRegPage: 1,
      threads: [],
      threadsCurrentPage: 1,
      threadsPageCount: 0,
      imptThreads: [],
      imptCurrentPage: 1,
      imptPageCount: 0,
      type: "block",
      create: false,
      createType: null,
      editorConfig: {
        toolbar: [
          {
            name: "basicstyles",
            groups: ["basicstyles"],
            items: ["Bold", "Italic", "Underline", "-", "TextColor", "BGColor"],
          },
          { name: "styles", items: ["Format", "Font", "FontSize"] },
          { name: "scripts", items: ["Subscript", "Superscript"] },
          {
            name: "justify",
            groups: ["blocks", "align"],
            items: [
              "JustifyLeft",
              "JustifyCenter",
              "JustifyRight",
              "JustifyBlock",
            ],
          },
          {
            name: "paragraph",
            groups: ["list", "indent"],
            items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent"],
          },
          { name: "links", items: ["Link", "Unlink"] },
          // { name: 'insert', items: [ 'Image'] },
          { name: "spell", items: ["jQuerySpellChecker"] },
          { name: "table", items: ["Table"] },
        ],
      },
    }
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  async mounted() {
    let user = await http.get("api/me")
    if (user.data.role == "instructor") {
      this.user = false
    }

    this.ref = this.$route.query.ref

    if (this.ref) {
      this.type = "thread"
      this.getImptThreads()
      this.getDscussionThreads()
    } else {
      let rv = await http.get("/api/me/discussion/list", {
        params: {
          currentPage: 1,
          pageSize: 4
        }
      })

      if (this.user) {
        this.regCourses = rv.data.rv
        this.blockRegTotal = rv.data.total
      } else {
        this.courses = rv.data.courses
        this.blockTotal = rv.data.totalCourse
        this.regCourses = rv.data.regCourses
        this.blockRegTotal = rv.data.totalRegCourse
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
    async getImptThreads() {
      let rv = await http.get("/api/me/discussion", {
        params: {
          type: "imptThreads",
          reference: this.ref,
          currentPage: this.imptCurrentPage,
        },
      })

      this.imptThreads = rv.data.imptThreads
      this.imptPageCount = Math.ceil(rv.data.imptThreadsCount / 4)
    },
    async getDscussionThreads() {
      let rv = await http.get("/api/me/discussion", {
        params: {
          type: "threads",
          reference: this.ref,
          currentPage: this.threadsCurrentPage,
        },
      })

      this.threads = rv.data.threads
      this.threadsPageCount = Math.ceil(rv.data.threadsCount / 4)
    },
    async blockRegPagination(data) {
      try {
        let rv = await http.get('/api/me/discussion/list/update', {
          params: {
            currentPage: this.blockRegPage,
            type: data
          }
        })
        if(rv) {
          this.regCourses = rv.data
        }
      }catch(e) {

      }
    },
    async blockPagination(data) {
      try {
        let rv = await http.get('/api/me/discussion/list/update', {
          params: {
            currentPage: this.blockPage,
            type: data
          }
        })
        
        this.courses = rv.data
        
      }catch(e) {

      }
    }
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
  font-size: calc(34px + (42 - 34) * ((100vw - 300px) / (1920 - 300)));
  color: #0d47a1;
}

#body p {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(18px + (24 - 18) * ((100vw - 300px) / (1920 - 300)));
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

.row {
  display: flex;
  margin: 0;
  margin-bottom: 1%;
}

.Btn {
  font-family: "DarkerGrotesque-Bold";
  text-transform: none;
}

.submitBtn {
  margin-top: 2%;
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

@media screen and (max-width: 1280px) {
  #main {
    width: 95% !important;
    margin: auto;
  }
  #body {
    margin-top: 5%;
  }
}

@media screen and (max-width: 600px) {
  #content {
    border: none;
    border-radius: 50px;
    padding: 2%;
  }

  #body {
    margin-top: 10%;
  }
}
</style>