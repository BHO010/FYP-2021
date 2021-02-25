<template>
  <div id="main">
    <div id="body">
      <h1>Course Created List</h1>
      <v-data-table :headers="headers" :items="courses" class="table">
        <template v-slot:item="row">
          <tr class="tableRow" @click="onCourseView(row.item.reference)">
            <td>{{ row.item.title }}</td>
            <td>{{ row.item.category }}</td>
            <td>{{ row.item.views }}</td>
            <td>
              <v-btn
                class="mx-2 btn"
                text
                outlined
                color="blue"
                @click.stop="onSurveyResults(row.item.reference)"
              >
                Results
              </v-btn>
              <v-btn
                class="mx-2 btn"
                text
                outlined
                color="blue"
                @click.stop="onSurveyEdit(row.item.reference)"
              >
                Edit
              </v-btn>
            </td>
            <td>
              <v-btn
                class="mx-2 btn"
                text
                outlined
                color="blue"
                @click.stop="editCourse(row.item.reference)"
              >
                Edit
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
      userDetails: "",
      headers: [
        {
          text: "Title",
          align: "start",
          sortable: false,
          value: "title",
          class: "header",
        },
        {
          text: "Category",
          sortable: false,
          class: "header",
        },
        {
          text: "Views",
          sortable: false,
          class: "header",
        },
        {
          text: "Survey",
          sortable: false,
          class: "header",
        },
        {
          text: "Update",
          sortable: false,
          class: "header",
        },
      ],
      courses: [],
    }
  },
  async mounted() {
    try {
      const rv = await http.get("/api/me")
      this.userDetails = rv.data
      this.getCourses()
    } catch (e) {}
  },
  methods: {
    async getCourses() {
      const { data } = await http.get("/api/me/courses", {
        params: {
          email: this.userDetails.email,
          role: this.userDetails.role,
        },
      })
      this.courses = data.courses
    },
    async onSurveyResults(id) {
      this.$router
        .push({ path: "/survey/result/", query: { reference: id } })
        .catch((err) => {})
    },
    async onSurveyEdit(id) {
      this.$router
        .push({ path: "/survey/edit/", query: { reference: id } })
        .catch((err) => {})
    },
    async onCourseView(id) {
      this.$router.push({ path: `/course/${id}` }).catch((err) => {})
    },
    editCourse(data) {
      this.$router
        .push({ path: "/course/edit", query: { reference: data } })
        .catch((err) => {})
    },
  },
}
</script>


<style scoped>
#main {
  width: 80%;
  margin: auto;
}

#body h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(32px + (48 - 32) * ((100vw - 300px) / (1920 - 300)));
  color: #0d47a1;
  margin-bottom: 1%;
}

#body {
  margin-top: 2%;
}

.tableRow {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(18px + (28 - 18) * ((100vw - 300px) / (1920 - 300)));
}

.dataTable .header {
  font-size: 40px !important;
  font-weight: bold !important;
}

.btn {
  font-family: "DarkerGrotesque-Medium";
  font-size: 24px;
  text-transform: none;
}

.table {
  background-color: transparent;
  border: 5px solid lightgrey;
  border-radius: 50px;
  padding: 1%;
}

.table >>> .header {
  font-family: "DarkerGrotesque-Bold";
  font-size: calc(18px + (28 - 18) * ((100vw - 300px) / (1920 - 300))) !important;
  color: #0d47a1 !important;
}

.table >>> td {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(14px + (22 - 14) * ((100vw - 300px) / (1920 - 300))) !important;
  border-right: 1px solid lightgrey;
}

.table >>> td:last-child {
  border-right: 0;
}

.table >>> .tableRow:hover {
  background-color: none !important;
}


@media screen and (max-width: 1400px) {
  #main {
    margin-top: 10%;
  }
}

@media screen and (max-width: 1000px) {
  .table {
  background-color: transparent;
  border: none;
  border-radius: none;
  padding: 1%;
}
}

@media screen and (max-width: 600px) {
  #main {
    margin-top: 14%;
  }
}
</style>