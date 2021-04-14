<template>
  <div id="main">
    <div id="body">
      <h1>{{courseTitle}} Class</h1>
      <p>Information and quiz conducted for your ongoing courses.</p>
      <div v-if="user">
        <div id="content">
          <div v-if="type == 'block'">
            <div>
              <h1>Ongoing Courses</h1>
              <div id="imptContent">
                <div v-if="regClasses">
                  <!-- component here -->
                  <classes-card
                    v-for="course in regClasses"
                    :key="course._id"
                    :block="course"
                    :type="type"
                    :user="user"
                  ></classes-card>
                  <v-pagination
                    v-if="blockRegClassTotal > 1"
                    v-model="blockRegClassPage"
                    :length="this.blockRegClassTotal"
                    :total-visible="7"
                    circle
                    @input="blockPagination('registered')"
                  ></v-pagination>
                </div>
                <div v-else>
                  <h3>You do not have an ongoing classes</h3>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <!-- Thread -->
            <v-row>
              <h1>Notice</h1>
              <v-spacer></v-spacer>
            </v-row>

            <div id="imptContent">
              <!-- component here -->
              <classes-card
                v-for="item in notices"
                :key="item.id"
                :block="item"
                :type="type"
                :user="user"
                :courseRef="courseRef"
                :batchID="batchID"
                type2="notice"
              ></classes-card>
              <v-pagination
                v-if="noticePage > 1"
                v-model="noticePage"
                :length="this.noticeTotal"
                :total-visible="7"
                circle
                @input="noticePagination(this.classDetails.notice)"
              ></v-pagination>
            </div>
            <h1>Assessment</h1>
            <div id="discussionContent">
              <!-- component here, quiz -->
              <classes-card
                v-for="item in quizes"
                :key="item.id"
                :block="item"
                :type="type"
                type2="quiz"
                :user="user"
                :courseRef="courseRef"
                :batchID="batchID"
              ></classes-card>
              <v-pagination
                v-if="quizPage > 1"
                v-model="quizPage"
                :length="this.quizTotal"
                :total-visible="7"
                circle
                @input="quizPagination(this.classDetails.quiz)"
              ></v-pagination>
            </div>
            <div class="row">
              <h1>Discussion</h1>
              <v-spacer></v-spacer>
              <v-btn class="Btn" text outlined @click="newQuestion('feedback')"
                >New Question</v-btn
              >
            </div>
            <div id="discussionContent">
              <p>
                Ask a question here if you are unsure about certain content
                taught in class.
              </p>
              <!-- component here, feedback -->
              <classes-card
                v-for="item in feedbacks"
                :key="item.id"
                :block="item"
                :type="type"
                :courseRef="courseRef"
                :batchID="batchID"
                :user="user"
                type2="feedback"
              ></classes-card>
              <v-pagination
                v-if="feedbackPage > 1"
                v-model="feedbackPage"
                :length="this.feedbackTotal"
                :total-visible="7"
                circle
                @input="feedbackPagination(this.classDetails.feedback)"
              ></v-pagination>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div id="content">
          <div v-if="type == 'block'">
            <div>
              <h1>Your Classes</h1>
              <div id="imptContent">
                <div v-if="classes">
                  <!-- component here -->
                  <classes-card
                    v-for="course in classes"
                    :key="course._id"
                    :block="course"
                    :type="type"
                  ></classes-card>
                  <v-pagination
                    v-if="blockClassTotal > 1"
                    v-model="blockClassPage"
                    :length="this.blockClassTotal"
                    :total-visible="7"
                    circle
                    @input="blockClassPagination('owned')"
                  ></v-pagination>
                </div>
                <div v-else>
                  <h3>You do not have an ongoing classes</h3>
                </div>
              </div>
              <h1>Classes Registered</h1>
              <div id="imptContent">
                <div v-if="regClasses">
                  <!-- component here -->
                  <classes-card
                    v-for="course in regClasses"
                    :key="course._id"
                    :block="course"
                    :type="type"
                  ></classes-card>
                  <v-pagination
                    v-if="blockRegClassTotal > 1"
                    v-model="blockRegClassPage"
                    :length="this.blockRegClassTotal"
                    :total-visible="7"
                    circle
                    @input="blockRegPagination('registered')"
                  ></v-pagination>
                </div>

                <div v-else>
                  <h3>You do not have an ongoing classes</h3>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="type == 'thread'">
            <!-- Notice -->
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
            <div class="imptContent">
              <classes-card
                v-for="item in notices"
                :key="item.id"
                :block="item"
                :type="type"
                :courseRef="courseRef"
                :batchID="batchID"
                :user="user"
                type2="notice"
              ></classes-card>
              <v-pagination
                v-if="noticeTotal > 1"
                v-model="noticePage"
                :length="this.noticeTotal"
                :total-visible="7"
                circle
                @input="noticePagination(classDetails.notice)"
              ></v-pagination>
            </div>

            <!-- Quiz -->
            <div class="row">
              <h1>Assessment</h1>
              <v-spacer></v-spacer>
              <v-btn class="Btn" text outlined @click="newQuiz('quiz')"
                >Create Quiz</v-btn
              >
            </div>
            <div class="discussionContent">
              <!-- component here, quiz -->
              <classes-card
                v-for="item in quizes"
                :key="item.id"
                :block="item"
                :type="type"
                type2="quiz"
                :courseRef="courseRef"
                :batchID="batchID"
                :user="user"
              ></classes-card>
              <v-pagination
                v-if="quizTotal > 1"
                v-model="quizPage"
                :length="this.quizTotal"
                :total-visible="7"
                circle
                @input="quizPagination(this.classDetails.quiz)"
              ></v-pagination>
            </div>

            <!-- Questions -->
            <div class="row">
              <h1>Discussion</h1>
              <v-spacer></v-spacer>
              <v-btn class="Btn" text outlined @click="newQuestion('feedback')"
                >New Question</v-btn
              >
            </div>
            <div class="discussionContent">
              <p>
                Ask a question here if you are unsure about certain content
                taught in class.
              </p>
              <!-- component here, feedback -->
              <classes-card
                v-for="item in feedbacks"
                :key="item.id"
                :block="item"
                :type="type"
                type2="feedback"
                :courseRef="courseRef"
                :batchID="batchID"
                :user="user"
              ></classes-card>
              <v-pagination
                v-if="feedbackTotal > 1"
                v-model="feedbackPage"
                :length="this.feedbackTotal"
                :total-visible="7"
                circle
                @input="feedbackPagination(this.classDetails.feedback)"
              ></v-pagination>
            </div>
          </div>
        </div>
      </div>

      <!-- Dialogue-->
      <!-- Create New Thread -->
      <v-dialog v-model="cr8Thread" persistent scrollable width="50%">
        <v-card tile color="#e1f5fe">
          <v-toolbar flat dark color="primary">
            <v-btn icon dark @click="cr8Thread = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title
              >Create a new thread under
              {{ createType }} section.</v-toolbar-title
            >
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
                  <v-file-input
                    v-model="files"
                    multiple
                    small-chips
                    label="File input"
                    outlined
                    dense
                    class="fileRow"
                  ></v-file-input>
                </div>
                <v-btn text outlined @click="postThread">Submit</v-btn>
              </v-form>
            </div>
          </div>
        </v-card>
      </v-dialog>

      <!-- create Quiz -->
      <v-dialog v-model="cr8Quiz" persistent scrollable width="90%">
        <v-card tile height="100%" color="#e1f5fe">
          <v-toolbar fixed dark color="primary">
            <v-btn icon dark @click="cr8Quiz = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Create Quiz.</v-toolbar-title>
          </v-toolbar>
          <!-- Quiz component -->
          <div id="dialogContent">
            <survey-builder
              type="quiz"
              :courseRef="this.courseRef"
              :batchID="this.batchID"
            ></survey-builder>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { http } from "@/axios"
import ClassesCard from "../components/ClassesCard.vue"
import SurveyBuilder from "../components/SurveyBuilder.vue"

export default {
  components: { ClassesCard, SurveyBuilder },
  data() {
    return {
      user: true,
      title: "",
      tMsg: "",
      files: [],
      fileName: [],
      classDetails: [],
      courseRef: this.$route.query.ref,
      batchID: this.$route.query.batch,
      courseTitle: this.$route.query.title,
      classes: null, //block
      blockClassTotal: 0,
      blockClassPage: 1,
      regClasses: null, //block
      blockRegClassTotal: 0,
      blockRegClassPage: 1,
      notices: null, //Threads
      quizes: null, //array to push to component
      quizContent: null, //array to push to component
      feedbacks: null, //array to push to component
      type: "block",
      cr8Thread: false,
      cr8Quiz: false,
      createType: null,
      noticePage: 1, //current page
      noticeTotal: 0, //total pages
      quizPage: 1,
      quizTotal: 0,
      feedbackPage: 1,
      feedbackTotal: 0,
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

    if (this.courseRef) {
      this.type = "thread"
      let rv = await http.get("/api/me/class", {
        params: {
          courseRef: this.courseRef,
          batchID: this.batchID,
        },
      })

      this.classDetails = rv.data
      await this.getNotice(rv.data.notice)
      await this.getQuiz(rv.data.quiz)
      await this.getFeedback(rv.data.feedback)
    } else {
      let rv = await http.get("/api/me/classes/list")

      if (this.user) {
        this.blockRegClassTotal = rv.data.total
        this.regClasses = rv.data.regClasses
      } else {
        this.blockClassTotal = rv.data.totalClass
        this.classes = rv.data.classes
        this.blockRegClassTotal = rv.data.totalRegClass
        this.regClasses = rv.data.regClasses
      }
    }
  },
  methods: {
    newThread(type) {
      this.createType = type
      this.cr8Thread = true
    },
    newQuiz(type) {
      this.cr8Quiz = true
      this.createType = type
    },
    newQuestion(type) {
      this.createType = type
      this.cr8Thread = true
    },
    getNotice(data) {
      this.noticePage = 1
      this.noticeTotal = Math.ceil(data.length / 4)
      this.notices = []
      for (var i = 0; i < 4; i++) {
        if (data[i]) {
          this.notices.push(data[i])
        }
      }
    },
    getQuiz(data) {
      this.quizPage = 1
      this.quizTotal = Math.ceil(data.length / 4)
      this.quizes = []
      for (var i = 0; i < 4; i++) {
        if (data[i]) {
          this.quizes.push(data[i])
        }
      }
    },
    getFeedback(data) {
      this.feedbackPage = 1
      this.feedbackTotal = Math.ceil(data.length / 4)
      this.feedbacks = []
      for (var i = 0; i < 4; i++) {
        if (data[i]) {
          this.feedbacks.push(data[i])
        }
      }
    },
    async postThread(type) {
      this.$store.commit("setLoading", true)
      for (var i = 0; i < this.files.length; i++) {
        await this.uploadFile(this.files[i])
      }
      let rv = await http.post("/api/me/classes/post/thread", {
        createType: this.createType,
        tMsg: this.tMsg, //For Notice section & question section
        title: this.title,
        courseRef: this.courseRef,
        batchID: this.batchID,
        fileName: this.fileName,
      })  

      if (rv) {
        this.$store.commit("setLoading", false)
        this.$router.go()
      }
    },
    async uploadFile(JSfile) {
        let name = JSfile.name
        let date = new Date().getTime()
        name = name.split('.')
        name[0] = name[0].concat(date)
        name = name.join('.')
        this.fileName.push(name)
      try {
         const { data } = await http.post(`/api/gcp-sign`, {
          filename: name,
          action: "write",
        })

        const rv = await http.put(data.url, JSfile, {
          withCredentials: false,
          headers: { "Content-Type": "application/octet-stream" },
        })
        
        if (rv) {
          return
        } 
      } catch (e) {}
    },
    async noticePagination(data) {
      let end = this.noticePage * 4
      let start = end - 4
      this.notices = []
      for (var i = start; i < end; i++) {
        if (data[i]) {
          this.notices.push(data[i])
        }
      }
    },
    async quizPagination(data) {
      let end = this.quizPage * 4
      let start = end - 4
      this.quizes = []
      for (var i = start; i < end; i++) {
        if (data[i]) {
          this.quizes.push(data[i])
        }
      }
    },
    async feedbackPagination(data) {
      let end = this.feedbackPage * 4
      let start = end - 4
      this.feedbacks = []
      for (var i = start; i < end; i++) {
        if (data[i]) {
          this.feedbacks.push(data[i])
        }
      }
    },
    async blockRegPagination(data) {
      try {
        let rv = await http.get('/api/me/classes/list/update', {
          params: {
            currentPage: this.blockRegClassPage,
            type: data,
          }
        })

        this.regClasses = rv.data
      }catch(e) {}
    },
    async blockClassPagination(data) {
      try {
        let rv = await http.get('/api/me/classes/list/update', {
          params: {
            currentPage: this.blockClassPage,
            type: data,
          }
        })
        console.log("AA", rv.data)

        if(rv) {
            this.classes = rv.data
        }
      }catch(e) {}
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
  font-size: 42px;
  color: #0d47a1;
}

#body p {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(16px + (24 - 16) * ((100vw - 300px) / (1920 - 300)));
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

.fileRow {
  margin-top: 2%;
}

#dialogBody {
  width: 80%;
  margin: auto;
  margin-top: 2%;
  margin-bottom: 2%;
}

#dialogContent {
  margin-top: 2%;
  min-height: 600px;
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
    margin-top: 8%;
  }
}

@media screen and (max-width: 600px) {
  #content {
    border: none;
    border-radius: 50px;
    padding: 2%;
  }

  #body {
    margin-top: 14%;
  }
}
</style>