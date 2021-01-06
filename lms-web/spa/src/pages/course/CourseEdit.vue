<template>
  <v-container fluid>
    <div class="main">
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step :complete="step > 1" step="1" @click="nextStep(1)">
            Course Information
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 2" step="2" @click="nextStep(2)">
            Trainers Information
          </v-stepper-step>
        </v-stepper-header>
        <br />
        <div class="formContent">
          <v-stepper-content step="1" style="height: 100%">
            <h2 id="Title">Course Title</h2>
            <v-text-field
              v-model="title"
              label="Title"
              outlined
              dense
            ></v-text-field>

            <h2 id="Description">Course Description</h2>
            <v-textarea
              v-model="description"
              rows="5"
              row-height="40"
              no-resize
              outlined
            ></v-textarea>

            <h2 id="Category">Course Category</h2>
            <v-select
              v-model="category"
              :items="tags"
              label="Category"
              outlined
              dense
            ></v-select>

            <h2>Course Level</h2>
            <v-select
              v-model="level"
              :items="levels"
              label="Level"
              outlined
              dense
            ></v-select>

            <h2>Course Type</h2>
            <v-select
              v-model="type"
              :items="types"
              label="Type"
              outlined
              dense
            ></v-select>

            <h2 id="Venue">Course Venue</h2>
            <v-text-field
              v-model="venue"
              label="Venue"
              outlined
              dense
            ></v-text-field>

            <h2 id="Timing">
              Timing
              <span style="font-weight: regular; font-size: 18px"
                >(Eg: 24 March 2020 - 24 June 2020 Mon-Fri 7pm)</span
              >
            </h2>
            <v-text-field
              v-model="time"
              label="Time"
              outlined
              dense
            ></v-text-field>

            <h2 id="Fee">Course Fee 
              <span style="font-weight: regular; font-size: 18px"
                >(Incl. GST, Numbers Only)</span
              >
            </h2>
            <v-text-field
              v-model="fee"
              label="Fee"
              outlined
              dense
            ></v-text-field>

            <h2 id="Objectives">Course Objectives</h2>
            <v-sheet class="preview" outlined>
              <div class="margin-left">
                <h3>By the end of this course, students should be able to:</h3>
                <div id="objectivePreview"></div>
              </div>
            </v-sheet>
            <v-text-field
              v-model="objectivePoint"
              label="Course Objective"
              outlined
              dense
            ></v-text-field>
            <v-btn class="formBtn" color="secondary" @click="addObjective()"
              >Add</v-btn
            >
            <v-btn class="formBtn" color="secondary" @click="deleteObjective()"
              >Delete</v-btn
            >

            <h2 id="Outlines">Course Outline</h2>
            <v-sheet class="preview" outlined>
              <div class="margin-left">
                <h3>Topics that will be covered through the course:</h3>
                <div id="outlinePreview"></div>
              </div>
            </v-sheet>
            <v-text-field
              v-model="outlinePoint"
              label="Course Outline"
              outlined
              dense
            ></v-text-field>
            <v-btn class="formBtn" color="secondary" @click="addPoint()"
              >Add</v-btn
            >
            <v-btn class="formBtn" color="secondary" @click="deletePoint()"
              >Delete</v-btn
            >

            <h2>Who Should Attend?</h2>
            <v-sheet class="preview" outlined>
              <div class="margin-left">
                <h3>Who should attend this course:</h3>
                <div id="attendPreview"></div>
              </div>
            </v-sheet>
            <v-text-field
              v-model="attendPoint"
              label="Who Should Attend?"
              outlined
              dense
            ></v-text-field>
            <v-btn class="formBtn" color="secondary" @click="addAttend()"
              >Add</v-btn
            >
            <v-btn class="formBtn" color="secondary" @click="deleteAttend()"
              >Delete</v-btn
            >

            <v-btn class="button" color="#F44336" @click="nextStep(2)" block
              >Continue</v-btn
            >
          </v-stepper-content>

          <v-stepper-content step="2" style="height: 100%">
            <h2>Trainers</h2>
            <v-sheet class="preview" outlined>
              <div class="margin-left">
                <h3>Who will be teaching the course:</h3>
                <table class="trainerTable">
                  <thead>
                    <tr>
                      <td class="tableBorder">Trainer Name</td>
                      <td class="tableBorder">Biography</td>
                    </tr>
                  </thead>
                  <tbody id="trainerPreview" class="tableBorder"></tbody>
                </table>
              </div>
            </v-sheet>

            <h2>Trainer Name</h2>
            <v-text-field
              v-model="trainer"
              label="Trainer Name"
              outlined
              dense
            ></v-text-field>
            <h2>Trainer Description</h2>
            <v-textarea
              v-model="trainerDescription"
              rows="3"
              row-height="30"
              no-resize
              outlined
            ></v-textarea>
            <v-btn class="formBtn" color="secondary" @click="addTrainer()"
              >Add</v-btn
            >
            <v-btn class="formBtn" color="secondary" @click="deleteTrainer()"
              >Delete</v-btn
            >

           <v-row justify="end"> 
               <v-btn class="button" color="#F44336" @click="updateCourse()" block
                >Update Course</v-btn
              >
            </v-row>
          </v-stepper-content>
        </div>
      </v-stepper>
    </div>
  </v-container>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
      snackbarColor: "success",
      snackbarShow: false,
      snackbarText: "",
      snackbarTimeout: 5000,
      step: 1,
      surveyJson: '',
      reference: "",
      title: "",
      description: "",
      category: "",
      level: "",
      type: "",
      venue: "",
      time: "",
      objectivePoints: [],
      outlinePoints: [],
      trainers: [],
      attendPoints: [],
      objectivePoint: "",
      outlinePoint: "",
      trainer: "",
      trainerDescription: "",
      attendPoint: "",
      types: ["Full-Time", "Part-Time"],
      contents: [
        { header: "Title", route: "./course-create#Title" },
        { header: "Description", route: "#Description" },
        { header: "Category", route: "./#Category" },
        { header: "Type", route: "#Type" },
        { header: "Venue", route: "#Venue" },
        { header: "Timing", route: "#Timing" },
        { header: "Objectives", route: "#Objectives" },
        { header: "Outlines", route: "#Outlines" },
        { header: "Attends?", route: "#Attends" },
        { header: "Trainers", route: "./course-create#Trainers" },
      ],
      tags: [
        "Business",
        "Leadership and Management",
        "Marketing",
        "Accounting",
        "Business Strategy",
        "Arts",
        "Shopping",
        "Art",
        "Finance",
        "Information Technology",
        "Economics",
        "Mechanical Engineering",
        "Chemistry",
        "Physics",
        "Electrical Engineering",
        "Biology",
        "Programming",
        "Computer Science",
        "Math",
      ],
      levels: [
        'Basic',
        'Intermediate',
        'Advance'
      ]
    }
  },
  created() {},
  async mounted() {
       this.reference = this.$route.query.reference
       let rv = await http.get(`/api/me/course/${this.reference}`)
       this.title = rv.data.title
       this.description = rv.data.description
       this.category = rv.data.category
       this.level = rv.data.level
       this.venue = rv.data.venue
       this.time = rv.data.time
       this.fee = rv.data.fee
       this.objectivePoints = rv.data.objectives
       this.attendPoints = rv.data.attends
       this.outlinePoints = rv.data.outlines
       this.trainers = rv.data.trainers

  console.log(rv.data.objectives)
       this.updateTrainers()
       this.updateOutline()
       this.updateObjective()
       this.updateAttend()

  },
  computed: {
    user() {
      return this.$store.state.user
    },
    loading() {
      return this.$store.getters.loading
    },
  },
  methods: {
    addPoint() {
      this.outlinePoints.push(this.outlinePoint)
      this.outlinePoint = ""
      this.updateOutline()
    },
    deletePoint() {
      this.outlinePoints.pop()
      this.updateOutline()
    },
    updateOutline() {
      let d = document.getElementById("outlinePreview")
      let x = "<ul>"
      for (var item of this.outlinePoints) {
        x = x + `<li>${item}</li>`
      }
      d.innerHTML = x
    },
    onSaveSurvey(value) {
      this.surveyJson = value
    },
    testSurvey() {
      console.log(this.surveyJson)
    },
    addTrainer() {
      let template = {
        name: "",
        description: "",
      }
      template.name = this.trainer
      template.description = this.trainerDescription
      this.trainer = ""
      this.trainerDescription = ""
      this.trainers.push(template)
      this.updateTrainers()
    },
    deleteTrainer() {
      this.trainers.pop()
      this.updateTrainers()
    },
    updateTrainers() {
      let d = document.getElementById("trainerPreview")
      let x = "<tbody>"
      for (var item of this.trainers) {
        x = x + `<tr>`
        x = x + `<td class"tableBorder">${item.name}</td>`
        x = x + `<td>${item.description}</td>`
        x = x + `</tr>`
      }
      x = x + "</tbody>"
      d.innerHTML = x
    },
    addAttend() {
      this.attendPoints.push(this.attendPoint)
      this.attendPoint = ""
      this.updateAttend()
    },
    deleteAttend() {
      this.attendPoints.pop()
      this.updateAttend()
    },
    updateAttend() {
      let d = document.getElementById("attendPreview")
      let x = "<ul>"
      for (var item of this.attendPoints) {
        x = x + `<li>${item}</li>`
      }
      d.innerHTML = x
    },
    addObjective() {
      this.objectivePoints.push(this.objectivePoint)
      this.objectivePoint = ""
      this.updateObjective()
    },
    deleteObjective() {
      this.objectivePoints.pop()
      this.updateObjective()
    },
    updateObjective() {
      let d = document.getElementById("objectivePreview")
      let x = "<ol>"
      for (var item of this.objectivePoints) {
        x = x + `<li>${item}</li>`
      }
      x = x + "</ol>"
      d.innerHTML = x
    },
    nextStep(i) {
      this.step = i
      console.log(this.step)
    },
    async updateCourse() {
      let rv = await http.post("/api/me/updateCourse", {
        reference: this.reference,
        title: this.title,
        description: this.description,
        category: this.category,
        level: this.level,
        type: this.type,
        venue: this.venue,
        time: this.time,
        objectives: this.objectivePoints,
        outlines: this.outlinePoints,
        trainers: this.trainers,
        attends: this.attendPoints,
      })
      if (rv) {
        this.snackbarColor = "success"
        this.snackbarText = "Course Updated"
        this.snackbarShow = true
        setTimeout(() => {
          this.$router.push("/profile")
        }, 3000)
      }
    },
  },
}
</script>


<style scoped>
.v-stepper__header,
.theme--light.v-stepper {
  box-shadow: none;
  background: #E1F5FE !important;
}

h2 {
  font-family: "DarkerGrotesque-Medium";
  font-size: 28px;
  margin-bottom: 1%;
  color: #0d47a1;
}

.main {
  width: 80%;
  margin: auto;
}

.button {
  border-radius: 10px;
  text-transform: none;
}

.formRow {
  padding: 1%;
}

.formContent {
  width: 80%;
  min-width: 1280px;
  margin: auto;
}

.formBtn {
  text-transform: none;
  width: auto;
  margin-right: 1%;
  margin-bottom: 2%;
}

.preview {
  height: 300px;
  width: 100%;
  margin-bottom: 2%;
  overflow-y: auto;
  background: #E1F5FE !important;
  border: 1px solid gray;
  border-radius: 5px;
}

.margin-left {
  margin-left: 2%;
}

.trainerTable {
  width: 80%;
}

.tableBorder {
  text-align: left;
  padding: 8px;
  border: 1px solid grey;
}

.toc {
  position: sticky;
  padding-top: 74px;
}
</style>