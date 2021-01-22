<template>
  <div id="main">
    <h1>Course Table</h1>
    <v-data-table :headers="headers" :items="courses" class="elevation-1 dataTable">
      <template v-slot:item="row">
        <tr id="tableRow">
          <td>{{ row.item.title }}</td>
          <td>{{ row.item.category }}</td>
          <td>{{ row.item.reference }}</td>
          <td>{{ row.item.clicks }}</td>
          <td>
            <v-btn class="mx-2" @click="onSurveyClick(row.item.reference)">
              Survey
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
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
          class: "header"
        },
        { 
          text: "Category",
          sortable: false,
          class: "header" 
        },
        { 
          text: "Reference ID",
          sortable: false,
          class: "header"
        },
        { 
          text: "Views",
          sortable: false,
          class: "header"
        },
        { 
          text: "Survey",
          sortable: false,
          class: "header"
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
    async onSurveyClick(id) {
        alert(id)
    }
  },
}
</script>


<style scoped>
#main {
  width: 90%;
  margin: auto;
}

#main h1 {
  margin-bottom: 3%;
}

.tableRow {
  font-family: "DarkerGrotesque-Medium";
  font-size: 28px;
}

.dataTable .header {
  font-size: 40px !important;
  font-weight: bold !important;
}
</style>