<template>
  <div style="width: 80%; margin: auto; margin-top: 2%">
    <section class="header">
      <div id="imgCol">
        <img class="imgDiv" :src="this.imageURL" />
        <div id="ratingRow">
          <div>Rating: {{this.rating}}/5</div>
          <div>Number Of Views: {{this.course.clicks +1}}</div>
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
                  <td>{{ course.time }}</td>
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
            <v-btn class="button" color="#69F0AE">Register</v-btn>
          </div>
          <div id="emailRow">
            <v-icon id="icon">mdi-email</v-icon>
            <a href="mailto:admin@ntu.edu.sg">admin@ntu.edu.sg</a>
          </div>
        </div>
      </div>
    </div>

    <br />
  </div>
</template>

<script>
import { http } from "@/axios"

export default {
  data() {
    return {
      course: [],
      category: "",
      imageURL: "",
      fee: 0,
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
  async mounted() {
    this.title = this.$route.params.title
    console.log(this.title)
    let rv = await http.get(`/api/me/course/${this.title}`)

    this.course = rv.data
    this.splited = rv.data.category.split(" ")
    this.category = this.splited[0]
    this.imageURL = "/img/" + this.category + ".svg"
    this.fee = Number(this.course.fee)
    this.rating = this.course.ratingScore / this.course.ratingCount
  },
  methods: {
  },
}
</script>

<style scoped>

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
  font-size: 30px;
  font-family: "DMSans-Bold";
  border-bottom: 3px solid lightgray;
  margin-bottom: 1%;
}

section p {
  font-family: "DarkerGrotesque-Medium";
  font-size: 24px;
}

.v-list-item__title {
  font-family: "DarkerGrotesque-Medium";
  font-size: 20px;
}

.listNum {
  font-family: "DarkerGrotesque-Medium";
  font-weight: bold;
  margin-right: 10px;
  font-size: 20px;
}

.header {
  position: relative;
  display: flex;
  border: 5px solid #1e88e5;
}

#ratingRow {
  font-family: "DarkerGrotesque-Medium";
  font-size: 26px;
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
  width: 60%;
  margin-top: 5%;
}

#btnRow .button {
  font-family: "DarkerGrotesque-Medium";
  line-height: 2.5rem;
  font-size: 24px;
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
  color: #69f0ae;
  font-family: "Allstar";
  font-size: 62px;
}

#detailsSection #table {
  font-family: "DarkerGrotesque-Medium";
  border-collapse: collapse;
  font-size: 22px;
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
  font-size: 24px;
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
  font-size: 22px;
}

#fundingSection #feeTable tr td {
  padding: 3px;
  padding-top: 5px;
  font-size: 20px;
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
</style>