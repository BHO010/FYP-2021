<template>
  <div id="main">
    <div id="body">
      <h1>Course Created List</h1>
      <v-data-table
        :headers="headers"
        :items="courses"
        class="elevation-1 dataTable"
      >
        <template v-slot:item="row">
          <tr id="tableRow" @click="onCourseView(row.item.reference)">
            <td>{{ row.item.title }}</td>
            <td>{{ row.item.category }}</td>
            <td>{{ row.item.reference }}</td>
            <td>{{ row.item.clicks }}</td>
            <td>
              <v-btn
                class="mx-2 btn"
                color="#FF5252"
                @click.stop="onSurveyResults(row.item.reference)"
              >
                Results
              </v-btn>
              <v-btn
                class="mx-2 btn"
                color="#FF5252"
                @click.stop="onSurveyEdit(row.item.reference)"
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
          text: "Reference ID",
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
  font-size: 48px;
  color: #0d47a1;
  margin-bottom: 1%;
}

#body {
  margin-top: 2%;
}

.tableRow {
  font-family: "DarkerGrotesque-Medium";
  font-size: 28px;
}

.dataTable .header {
  font-size: 40px !important;
  font-weight: bold !important;
}

.btn {
  font-family: "DarkerGrotesque-Medium";
  font-size: 22px;
  color: white;
  text-transform: none;
}
</style>