<template>
  <div style="width: 80%; margin: auto; margin-top: 2%">
    <v-snackbar
      v-model="snackbarShow"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      absolute
      top
      class="snackbar"
      >{{ snackbarText }}</v-snackbar
    >
    <section class="header">
      <div id="imgCol">
        <img class="imgDiv" :src="this.imageURL" />
        <div id="ratingRow">
          <div>Rating: {{ this.rating || 0 }}/5</div>
          <div>Number Of Views: {{ this.course.views + 1 }}</div>
        </div>
      </div>
      <div id="titleCol">
        <div id="title">
          <h1>{{ course.title }}</h1>
        </div>
      </div>
    </section>

    <div class="main">
      <div id="content">
        <section id="overviewSection">
          <span class="anchor" id="overview"></span>
          <h2>OVERVIEW</h2>
          <div id="content">
            <p>{{ course.description }}</p>
          </div>
        </section>

        <section id="detailsSection">
          <span class="anchor" id="details"></span>
          <h2>DETAILS</h2>
          <div style="margin: auto">
            <table id="table">
              <tbody>
                <tr>
                  <th>NEXT COURSE STARTS ON</th>
                  <td>{{ course.startDate }}</td>
                </tr>
                <tr>
                  <th>Duration</th>
                  <td>{{ this.course.duration }}</td>
                </tr>
                <tr>
                  <th>Fees</th>
                  <td>S${{ this.fee }}</td>
                </tr>
                <tr>
                  <th>Level</th>
                  <td>{{ course.level }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="objectiviesSection">
          <span class="anchor" id="objectives"></span>
          <h2>OBJECTIVES</h2>
          <div id="objList">
            <v-list>
              <v-list-item v-for="(item, i) in this.course.objectives" :key="i">
                <div class="listNum">{{ i + 1 }})</div>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </section>

        <section id="outlinesSection">
          <span class="anchor" id="outlines"></span>
          <h2>OUTLINES</h2>
          <div id="outlineList">
            <v-list>
              <v-list-item v-for="(item, i) in this.course.outlines" :key="i">
                <div class="listNum">{{ i + 1 }})</div>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </section>

        <section id="trainersSection">
          <span class="anchor" id="trainers"></span>
          <h2>TRAINER(S)</h2>
          <v-simple-table id="trainerTable">
            <thead>
              <tr id="tableHead">
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in this.course.trainers" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.description }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </section>

        <section id="fundingSection">
          <span class="anchor" id="funding"></span>
          <h2>FEES & FUNDING</h2>
          <div>
            <table id="feeTable">
              <tbody>
                <tr class="tableBorder">
                  <th>Standard Course Fee</th>
                  <td>S${{ this.fee }}</td>
                </tr>
                <tr>
                  <th>
                    Course fee payable after SSG funding, if eligible under
                    various schemes
                  </th>
                  <td></td>
                </tr>
                <tr>
                  <td>Cat-A-SSG Funded Course<b>¹</b></td>
                  <td>S${{ this.fee * 0.3 }}</td>
                </tr>
                <tr>
                  <td>Enhanced Training Support for SMEs<b>²</b></td>
                  <td>S${{ (this.fee * 0.113084).toFixed(1) }}</td>
                </tr>
                <tr class="tableBorder">
                  <td>Mid-Career Enhanced Subsidy (MCES)<b>³</b></td>
                  <td>S${{ (this.fee * 0.113084).toFixed(1) }}</td>
                </tr>
                <tr>
                  <th>Course fee payable after Discount^</th>
                  <td></td>
                </tr>
                <tr>
                  <td>Group of 3 pax and above</td>
                  <td>S${{ this.fee * 0.9 }}</td>
                </tr>
                <tr>
                  <td>NTU/NIE Alumni, Staff & Students</td>
                  <td>S${{ this.fee * 0.8 }}</td>
                </tr>
                <tr>
                  <td>NTUC Member</td>
                  <td>S${{ this.fee * 0.9 }}</td>
                </tr>
              </tbody>
            </table>
            <br />
            <p>
              - All fees stated are inclusive of 7% GST <br />
              - SkillsFuture Credit can be used to offset course fees payable.
              <br />
              With effect from 1 April 2020, eligible Singaporeans can start
              using their one-off SkillsFuture Credit top-up (up to S$500
              credit), claimable for full range of SkillsFuture Credit-eligible
              courses offered by PaCE@NTU. <br />
              For more information, please visit
              <a href="https://www.skillsfuture.sg/credit"
                >https://www.skillsfuture.sg/credit</a
              >
              <br />
              <b>1 Cat-A SSG Funded Courses -</b> Eligible Singapore Citizens
              and PRs may enjoy up to 70% of the course fee. <br />
              For more information, visit
              <a href="http://www.ssg-wsg.gov.sg">http://www.ssg-wsg.gov.sg</a>
              <br />
              <b>2 Enhanced Training Support for SMEs (ETSS) -</b> SME-sponsored
              employees (Singapore Citizens and PRs) may enjoy subsidies up to
              90% of the course fee. <br />
              For more information, visit
              <a
                href="http://www.ssg.gov.sg/programmes-and-initiatives/funding/enhanced-training-support-for-smes1.html"
                >http://www.ssg.gov.sg/programmes-and-initiatives/funding/enhanced-training-support-for-smes1.html</a
              >
              <br />
              <b>3 Mid-Career Enhanced Subsidy (MCES) -</b> Singaporeans aged 40
              and above may enjoy subsidies up to 90% of the course fee. <br />
              For more information, visit
              <a href="http://www.skillsfuture.sg/enhancedsubsidy"
                >http://www.skillsfuture.sg/enhancedsubsidy</a
              >
              <br />
              <b>^ Discount</b> cannot be used in conjunction with other SSG
              funding scheme or NTU Alumni Course Credit. Participants are
              eligible for only ONE of the discount schemes.
            </p>
          </div>
        </section>

        <section id="attendSection">
          <span class="anchor" id="attend"></span>
          <h2>WHO SHOULD ATTEND?</h2>
          <div id="attendList">
            <v-list>
              <v-list-item v-for="(item, i) in this.course.attends" :key="i">
                <div class="listNum">{{ i + 1 }})</div>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </section>
      </div>

      <div id="tocDiv">
        <div id="toc">
          <div id="tocList">
            <v-list-item-group
              active-class="red lighten-5--text text--accent-4"
              mandatory
            >
              <v-list-item
                v-for="tocItem in tocItems"
                :key="tocItem.title"
                :href="tocItem.href"
              >
                <v-list-item-title>{{ tocItem.title }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </div>
          <div id="btnRow">
            <v-btn
              v-if="regWindow && available"
              class="button"
              color="#69F0AE"
              @click="register()"
              >Register</v-btn
            >
            <v-btn
              v-else
              class="button"
              color="#69F0AE"
              disabled
              @click="register"
              >Register</v-btn
            >
          </div>
          <div id="vacancyRow">Vacancy: {{ this.vacancy() }}</div>
          <div id="emailRow">
            <v-icon id="icon">mdi-email</v-icon>
            <a href="mailto:admin@ntu.edu.sg">admin@ntu.edu.sg</a>
          </div>
        </div>
      </div>
    </div>

    <br />

    <!-- Dialog -->
    <v-dialog v-model="regDialog" persistent max-width="600">
      <v-card>
        <v-container id="dialogMain">
          <h2>Register</h2>
          <p>Are you sure you want to register for this course?</p>
          <v-card-actions id="dialogAction">
            <v-row class="center-all" justify="center">
              <a @click="regDialog = false">Cancel</a>
              <v-btn
                type="button"
                class="btn"
                color="#69F0AE"
                @click="confirmReg"
                :loading="loading"
                >Confirm</v-btn
              >
            </v-row>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
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
      snackbarTimeout: 3000,
      regDialog: false,
      regWindow: false,
      vacancyLeft: 0,
      available: true,
      course: [],
      category: "",
      imageURL: "",
      fee: 0,
      reference: "",
      rating: 0,
      objectives: [],
      outlines: [],
      trainers: [],
      splited: [],
      tocItems: [
        { title: "Overview", href: "#overview" },
        { title: "Details", href: "#details" },
        { title: "Objectives", href: "#objectives" },
        { title: "Outlines", href: "#outlines" },
        { title: "Fees & Funding", href: "#funding" },
        { title: "Requirements", href: "#attend" },
      ],
    }
  },
  computed: {
    ...mapState(["user", "error", "loading"]),
  },
  async mounted() {
    this.reference = this.$route.params.reference
    let rv = await http.get(`/api/me/course/${this.reference}`)

    this.course = rv.data
    this.splited = rv.data.category.split(" ")
    this.category = this.splited[0]
    this.imageURL = "/img/" + this.category + ".svg"
    this.fee = Number(this.course.fee)
    this.rating = this.course.totalRate / this.course.rateCount

    let regStart = new Date(this.course.regStart).getTime() / 1000
    let regEnd = new Date(this.course.regEnd).getTime() / 1000
    let now = new Date().getTime() / 1000
    if (now < regEnd && now > regStart) {
      this.regWindow = true
    }
    this.checkAvailability()
  },
  methods: {
    register() {
      this.regDialog = true
    },
    vacancy() {
      let max = this.course.vacancy
      return this.vacancyLeft + "/" + max
    },
    async confirmReg() {
      try {
        this.$store.commit("setLoading", true)
        let rv = await http.post("/api/me/register", {
          title: this.course.title,
          courseRef: this.reference,
          batchID: this.course.batchID,
          startDate: this.course.startDate,
          endDate: this.course.endDate,
          instructor: this.course.createdBy,
        })

        if (rv.data.success) {
          this.snackbarColor = "success"
          this.snackbarText = rv.data.msg
          this.snackbarShow = true
          this.regDialog = false
          this.$store.commit("setLoading", false)
        } else {
          this.regDialog = false
          this.$store.commit("setLoading", false)
          this.snackbarColor = "error"
          this.snackbarText = rv.data.msg
          this.snackbarShow = true
        }
      } catch (e) {
        this.$store.commit("setLoading", false)
        this.regDialog = false
        this.snackbarColor = "error"
        this.snackbarText = "Error, please try again"
        this.snackbarShow = true
      }
    },
    async checkAvailability() {
      try {
        let rv = await http.get("/api/me/register/count", {
          params: {
            courseRef: this.course.reference,
            batchID: this.course.batchID,
          },
        })
        this.vacancyLeft = this.course.vacancy - rv.data.count
        if (this.vacancyLeft <= 0) {
          this.available = false
        }
      } catch (e) {}
    },
  },
}
</script>

<style scoped>
.snackbar {
  position: sticky;
  top: 70px;
}

.center-all {
  display: flex;
  margin: auto;
  align-items: center;
  justify-content: center;
}

.v-list-item >>> .v-list-item__title {
  white-space: normal;
}

#dialogMain {
  font-family: "DarkerGrotesque-Medium";
  width: 90%;
  margin: auto;
}

#dialogMain h2 {
  font-size: calc(36px + (48 - 36) * ((100vw - 300px) / (1920 - 300)));
  color: #0d47a1;
}

#dialogMain p {
  font-size: 28px;
}

#dialogAction a {
  font-family: "DarkerGrotesque-Medium";
  text-decoration: none;
  font-size: calc(14px + (20 - 14) * ((100vw - 300px) / (1920 - 300)));
  color: #f92c2c;
  margin-right: 2%;
}

#dialogAction .btn {
  font-family: "DarkerGrotesque-Medium";
  text-transform: none;
  line-height: 2em;
  font-size: calc(16px + (24 - 16) * ((100vw - 300px) / (1920 - 300)));
  height: auto;
}

section {
  position: relative;
  margin-bottom: 4%;
}

.anchor {
  position: absolute;
  top: -80px;
}

section h2 {
  color: #0d47a1;
  font-size: calc(24px + (30 - 24) * ((100vw - 300px) / (1920 - 300)));
  font-family: "DMSans-Bold";
  border-bottom: 3px solid lightgray;
  margin-bottom: 1%;
}

section p {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(16px + (24 - 16) * ((100vw - 300px) / (1920 - 300)));
}

.v-list-item__title {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(14px + (20 - 14) * ((100vw - 300px) / (1920 - 300)));
}

.listNum {
  font-family: "DarkerGrotesque-Medium";
  font-weight: bold;
  margin-right: 10px;
  font-size: calc(14px + (20 - 14) * ((100vw - 300px) / (1920 - 300)));
}

.header {
  position: relative;
  display: flex;
  border: 5px solid #1e88e5;
}

#ratingRow {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(16px + (26 - 16) * ((100vw - 300px) / (1920 - 300)));
  position: absolute;
  bottom: 5px;
}

#overview #content {
  margin: 1%;
}

.main {
  display: flex;
}

.main #content {
  width: 80%;
}

.main #tocDiv {
  position: relative;
  padding-left: 3%;
  width: 20%;
}

#tocDiv #toc {
  position: sticky;
  top: 80px;
  width: 100%;
  height: auto;
  border: 4px solid gray;
  border-radius: 10px;
}

#tocList {
  margin: 2%;
}

#toc #btnRow {
  margin: auto;
  margin-top: 5%;
  text-align: center;
}

#toc #vacancyRow {
  text-align: center;
  margin-top: 2%;
  font-size: calc(14px + (18 - 14) * ((100vw - 300px) / (1920 - 300)));
}

#btnRow .button {
  font-family: "DarkerGrotesque-Medium";
  line-height: 2.5rem;
  font-size: calc(16px + (24 - 16) * ((100vw - 300px) / (1920 - 300)));
  text-transform: none;
  height: auto;
}

#emailRow {
  margin: auto;
  width: 70%;
  margin-top: 10%;
  margin-bottom: 10%;
}

#emailRow #icon {
  margin-right: 4%;
}

#imgCol {
  width: 50%;
  padding: 5px;
}

#imgCol img {
  width: 100%;
  max-height: 350px;
}

#imgCol .imgDiv {
  margin: auto;
}

#titleCol {
  width: 50%;
  padding: 5px;
}

#title {
  width: 80%;
  margin: auto;
  font-family: "Allstar";
  font-size: calc(36px + (48 - 36) * ((100vw - 300px) / (1920 - 300)));
}

#detailsSection #table {
  font-family: "DarkerGrotesque-Medium";
  border-collapse: collapse;
  font-size: calc(14px + (22 - 14) * ((100vw - 300px) / (1920 - 300)));
  border: 2px solid black;
}

#detailsSection #table th {
  width: 250px;
  text-align: left;
  padding: 1%;
  border: 1px solid black;
  background: #e57373;
}

#detailsSection #table td {
  width: 350px;
  text-align: left;
  padding: 1%;
  border: 1px solid black;
  background: #eceff1;
}

#outlineList .v-list,
#objList .v-list,
#attendList .v-list {
  background: #e1f5fe;
}

#trainersSection #trainerTable {
  font-family: "DarkerGrotesque-Medium";
}

#trainersSection #trainerTable th {
  font-size: 28px;
  font-weight: bold;
  color: black;
  background: #e57373;
}

#trainersSection #trainerTable td {
  font-size: calc(16px + (24 - 16) * ((100vw - 300px) / (1920 - 300)));
  background: #eceff1;
}

#fundingSection #feeTable {
  font-family: "DarkerGrotesque-Medium";
  border-collapse: collapse;
  border: 3px solid black;
}

#fundingSection #feeTable th {
  width: 440px;
  text-align: left;
  padding: 3px;
  border-bottom: 2px solid grey;
  background: #e57373;
  font-size: calc(14px + (22 - 14) * ((100vw - 300px) / (1920 - 300)));
}

#fundingSection #feeTable tr td {
  padding: 3px;
  padding-top: 5px;
  font-size: calc(14px + (20 - 14) * ((100vw - 300px) / (1920 - 300)));
  background: #ffcdd2;
}

#fundingSection #feeTable tr td:nth-child(2) {
  width: 150px;
  text-align: center;
  border-left: 1px solid black;
  background: #eceff1;
  font-weight: bold;
}
#fundingSection #feeTable .tableBorder {
  border-bottom: 3px solid black;
}

#fundingSection p {
  font-family: "DarkerGrotesque-Medium";
  font-size: 18px;
}

@media screen and (max-width: 1600px) {
  .main #content {
    width: 70%;
  }

  .main #tocDiv {
    width: 30%;
  }
}
</style>