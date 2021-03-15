<template>
  <v-container fluid>
    <v-snackbar
      v-model="snackbarShow"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      top
      >{{ snackbarText }}</v-snackbar
    >
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

          <v-divider></v-divider>

          <v-stepper-step :complete="step > 3" step="3" @click="nextStep(3)">
            Registration Info
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

            <!-- <h2>Course Type</h2>
            <v-select
              v-model="type"
              :items="types"
              label="Type"
              outlined
              dense
            ></v-select> -->

            <h2 id="Venue">Course Venue</h2>
            <v-text-field
              v-model="venue"
              label="Venue"
              outlined
              dense
            ></v-text-field>

            <h2>Course Start Date</h2>
            <v-date-picker
              class="calendar"
              v-model="startDate"
              width="100%"
            ></v-date-picker>
            <v-text-field
              v-model="startDateText"
              label="Start Date"
              prepend-inner-icon="mdi-calendar"
              readonly
              outlined
              dense
            ></v-text-field>

            <h2 id="Duration">Duration</h2>
            <v-text-field
              v-model="duration"
              label="Duration"
              outlined
              dense
            ></v-text-field>

            <h2 id="Fee">
              Course Fee
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

            <v-btn class="button" color="#0078ab" @click="nextStep(2)" block
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

            <v-btn class="button" color="#0078ab" @click="nextStep(3)" block
              >Continue</v-btn
            >
          </v-stepper-content>

          <v-stepper-content step="3" style="height: 100%">
            <v-form ref="form" v-model="valid" @submit.prevent="addCourse">
              <h2>Batch Id</h2>
              <v-text-field
                v-model="batchID"
                label="Batch ID"
                readonly
                outlined
                dense
              >
              </v-text-field>

              <h2>Course Vacancy</h2>
              <v-text-field
                v-model="vacancy"
                label="Vacancy"
                :rules="numberRule"
                outlined
                dense
              >
              </v-text-field>

              <h2 id="regPeriod">Registration Period</h2>
              <v-date-picker
                class="calendar"
                v-model="regDates"
                width="100%"
                range
              ></v-date-picker>
              <v-text-field
                v-model="dateRangeText"
                label="Date range"
                prepend-icon="mdi-calendar"
                :rules="requiredRule"
                readonly
                outlined
                dense
              ></v-text-field>

              <h2>Are you updating the course for a new batch of intakes?</h2>
              <v-checkbox
                class="checkbox"
                v-model="newBatch"
                :label="`${newBatch.toString()}`"
              ></v-checkbox>

              <h2>What files do you wish to port to the next batch?</h2>
              <v-checkbox
                v-for="(item, index) in fileName"
                :key="index"
                class="checkbox"
                v-model="fileSelected"
                :value="item"
                :label="item"
                @change="check()"
              ></v-checkbox>

              <v-btn
                class="button"
                color="#0078ab"
                @click="updateCourse()"
                block
                >Update Course</v-btn
              >
            </v-form>
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
      valid: true,
      step: 1,
      course: null,
      reference: "",
      title: "",
      description: "",
      category: "",
      level: "",
      type: "",
      venue: "",
      duration: "",
      fee: "",
      batchID: "",
      vacancy: "",
      newBatch: false,
      regDates: [],
      startDate: "",
      objectivePoints: [],
      outlinePoints: [],
      trainers: [],
      attendPoints: [],
      fileName: [],
      fileSelected: [],
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
      levels: ["Basic", "Intermediate", "Advance"],
      requiredRule: [(v) => !!v || "This is required"],
      numberRule: [
        (v) => !!v || "This is required",
        (v) => !v || /^([0-9]*)$/.test(v) || "Numbers Only",
      ],
    }
  },
  async mounted() {
    this.reference = this.$route.query.reference
    let rv = await http.get(`/api/me/course/${this.reference}`)
    this.course = rv.data
    this.title = rv.data.title
    this.description = rv.data.description
    this.category = rv.data.category
    this.level = rv.data.level
    this.venue = rv.data.venue
    this.startDate = rv.data.startDate
    this.duration = rv.data.duration
    this.fee = rv.data.fee
    this.objectivePoints = rv.data.objectives
    this.attendPoints = rv.data.attends
    this.outlinePoints = rv.data.outlines
    this.trainers = rv.data.trainers
    this.regDates.push(rv.data.regStart)
    this.regDates.push(rv.data.regEnd)
    this.batchID = rv.data.batchID
    this.fileName = rv.data.uploadedFiles
    this.vacancy = rv.data.vacancy

    this.updateTrainers()
    this.updateOutline()
    this.updateObjective()
    this.updateAttend()
  },
  computed: {
    dateRangeText() {
      return this.regDates.join(" ~ ")
    },
    startDateText() {
      return this.startDate
    },
    ...mapState(["error", "loading"]),
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
    check() {
      console.log(this.fileSelected)
    },
    async updateCourse() {
      try {
        this.$store.commit("setLoading", true)
        if (this.$refs.form.validate()) {
          let rv = await http.post("/api/me/updateCourse", {
            reference: this.reference,
            title: this.title,
            description: this.description,
            category: this.category,
            level: this.level,
            venue: this.venue,
            startDate: this.startDate,
            duration: this.duration,
            objectives: this.objectivePoints,
            outlines: this.outlinePoints,
            trainers: this.trainers,
            attends: this.attendPoints,
            fee: this.fee,
            regDates: this.regDates,
            batchID: this.batchID,
            vacancy: this.vacancy,
            newBatch: this.newBatch,
            fileName: this.fileSelected,
          })
          if (rv) {
            this.snackbarColor = "success"
            this.snackbarText = "Course Updated"
            this.snackbarShow = true
            setTimeout(() => {
              this.$store.commit("setLoading", false)
              this.$router.push("/profile")
            }, 3000)
          }
        }
      } catch (e) {}
    },
  },
}
</script>


<style scoped>
.v-stepper__header,
.theme--light.v-stepper {
  box-shadow: none;
  background: white !important;
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
  border-radius: 10px !important;
  text-transform: none;
  color: white;
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
  background: #e1f5fe !important;
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

.calendar {
  margin-bottom: 2%;
}

.checkbox {
  margin-left: 2% !important;
}
</style>