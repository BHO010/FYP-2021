<template>
  <div id="main">
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
              @click="gotoProfile(main.email)"
            >
              <div class="icon" :id="main.id"></div>
              <div class="name">{{ userDetails.name }}</div>
            </v-col>
            <v-col cols="9" md="9" lg="10" class="title">
              <div class="topRow">
                {{ new Date(main.created).toLocaleString() }}
              </div>
              <div class="content">
                <p v-html="main.message"></p>
              </div>
              <div v-if="files" class="fileRow">
                <div
                  class="fileCard"
                  v-for="file in main.fileName"
                  :key="file"
                  @click="downloadFile(file)"
                >
                  <v-row class="header">{{ file }}</v-row>
                  <div class="dlRow">Download</div>
                </div>
              </div>
            </v-col>
          </v-flex>
        </div>
        <div>
          <classes-card
            v-for="post in posts"
            :block="post"
            :key="post.id"
            :type="type"
          ></classes-card>
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
                  <!-- <v-textarea v-model="message" outlined rows="4"></v-textarea> -->
                  <ckeditor v-model="message" :config="editorConfig"></ckeditor>
                </div>
                <v-btn class="submitBtn" text outlined @click="postMsg">Submit</v-btn>
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
import axios from "axios"
import { saveAs } from "file-saver"

export default {
  data() {
    return {
      userDetails: null,
      title: "",
      email: "",
      message: null,
      courseRef: this.$route.query.courseRef,
      batchID: this.$route.query.batch,
      id: this.$route.query.id,
      section: this.$route.params.type,
      main: [],
      files: false,
      posts: [],
      type: "message",
      create: false,
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
    let rv = await http.get("/api/me/class", {
      params: {
        courseRef: this.courseRef,
        batchID: this.batchID,
        index: this.id,
        section: this.section,
      },
    })
    this.main = rv.data
    if (this.main.fileName) {
      if (this.main.fileName.length != 0) {
        this.files = true
      }
    }
    this.posts = rv.data.replies

    await this.getUser()
    await this.getImage()
  },
  methods: {
    async getUser() {
      try {
        let rv = await http.get("api/me/user", {
          params: {
            email: this.main.email,
          },
        })
        this.userDetails = rv.data
      } catch (e) {}
    },
    getImage() {
      let d = document.getElementById(this.main.id)
      d.innerHTML = ""
      d.innerHTML = this.userDetails.profileImage
    },
    async newPost() {
      this.create = true
    },
    async postMsg() {
      let rv = await http.post("/api/me/classes/post/thread/message", {
        courseRef: this.courseRef,
        batchID: this.batchID,
        message: this.message,
        index: this.id,
      })

      if (rv) {
        this.$router.go()
      }
    },
    async downloadFile(fileName) {
      try {
        const { data } = await http.post(`/api/gcp-sign`, {
          filename: fileName,
          action: "read",
        })
        const rv = await http.get(data.url, { withCredentials: false })
        await axios
          .get(rv.config.url, { responseType: "blob" })
          .then((response) => {
            // Log somewhat to show that the browser actually exposes the custom HTTP header
            var FileSaver = require("file-saver")
            const fileNameHeader = "x-suggested-filename"
            const suggestedFileName = response.headers[fileName]
            const effectiveFileName =
              suggestedFileName === undefined ? fileName : suggestedFileName
            FileSaver.saveAs(response.data, effectiveFileName)
          })
          .catch((response) => {
            console.error(
              "Could not Download the Excel report from the backend.",
              response
            )
          })
      } catch (e) {}
    },
    gotoProfile(email) {
      this.$router.push({path: `/profile/${email}`})
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

.title {
  padding-top: 0;
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

.submitBtn {
  margin-top: 2%;
}

#dialogBody {
  width: 80%;
  margin: auto;
  margin-top: 2%;
  margin-bottom: 2%;
}

.fileRow {
  display: flex;
}

.fileCard {
  border: 1px solid lightgrey;
  max-width: 200px;
  margin-right: 1%;
}

.fileCard:hover {
  opacity: 0.55;
}

.fileCard .header {
  font-family: "DarkerGrotesque-Medium";
  font-size: 20px;
  overflow: hidden;
  max-width: 200px;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 1%;
}

.fileCard .dlRow {
  font-family: "DarkerGrotesque-Medium";
  font-size: 14px;
  line-height: 1;
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
    margin-top: 10%;
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