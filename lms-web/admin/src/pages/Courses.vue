<template>
  <div id="userPage">
    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbarShow"
      :color="snackbarColor"
      :timeout="snackbarTimeout"
      top
      >{{ snackbarText }}</v-snackbar
    >
    <!-- Top row -->
    <v-flex row xs12 class="tagRow">
      <h1 class="header">Courses</h1>
    </v-flex>

    <v-flex row xs12 class="tagRow">
      <v-data-table
        :headers="headers"
        :items="courses"
        :options.sync="options"
        :server-items-length="total"
        :loading="loading"
        class="table"
      >
        <template v-slot:top>
          <v-row class="searchRow">
            <h2>Search By:</h2>
            <v-select
              v-model="searchCategory"
              class="mx-4"
              outlined
              dense
              :items="searchFields"
            ></v-select>
          </v-row>
          <v-row class="searchRow">
            <h2>Search:</h2>
            <v-text-field
              v-model="search"
              label="Search By Email"
              class="mx-4"
              outlined
              dense
              single-line
              hide-details
            ></v-text-field>
          </v-row>
        </template>

        <template v-slot:item="row">
          <tr class="tableRow">
            <td>{{ row.item.title }}</td>
            <td>{{ row.item.createdBy }}</td>
            <td>{{ row.item.category }}</td>
            <td>{{ rating(row.item.rateCount, row.item.totalRate) }}/5</td>
            <td>{{available(row.item.active)}}</td>
            <td>
                <v-btn
                  class="mx-2 btn"
                  text
                  outlined
                  color="blue"
                >
                  Delete
                </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
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
      snackbarTimeout: 5000,
      search: "",
      searchCategory: "Title",
      loading: false,
      courses: [],
      total: 0,
      options: {},
      headers: [
        {
          text: "Course Title",
          align: "start",
          sortable: true,
          value: "title",
          class: "header",
        },
        {
          text: "Instructor",
          sortable: false,
          value: "createdBy",
          class: "header",
        },
        {
          text: "Category",
          sortable: false,
          value: "category",
          class: "header",
        },
        {
          text: "Rating",
          sortable: false,
          class: "header",
        },
         {
          text: "Status",
          sortable: false,
          value: "active",
          class: "header",
        }, 
        {
          text: "Manage",
          sortable: false,
          class: "header",
        },
      ],
      searchFields: ["Title", "Instructor", "Category"],
    }
  },
  async mounted() {
    this.getUser()
  },
  computed: {},
  watch: {
    options: {
      handler() {
        this.updatePage()
      },
      deep: true,
    },
    search() {
      this.updatePage()
    },
  },
  methods: {
    available(data) {
      if (data) {
        return "Active"
      } else {
        return "Inactive"
      }
    },
    rating(count, rate) {
      if (count == 0) {
        return 0
      } else {
        return rate / count
      }
    },
    updatePage() {
      this.getCourses()
    },
    async getCourses() {
      try {
        this.loading = true
        let rv = await http.get("/api/admin/courses", {
          params: {
            search: this.search,
            searchCategory: this.searchCategory,
            options: this.options,
          },
        })

        this.courses = rv.data.results
        this.total = rv.data.total
        this.loading = false
      } catch (e) {}
    },
  },
}
</script>


<style scoped>
#userPage {
  width: 80%;
  margin: auto;
  margin-top: 5%;
}

.header {
  font-size: 58px;
  color: #005072;
}

.table {
  background-color: transparent;
  padding: 1%;
  width: 80%;
}

.table >>> .header {
  font-family: "DarkerGrotesque-Bold";
  font-size: calc(
    22px + (30 - 22) * ((100vw - 300px) / (1800 - 300))
  ) !important;
  color: #0d47a1 !important;
}

.table >>> td {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(
    14px + (20 - 14) * ((100vw - 300px) / (1800 - 300))
  ) !important;
  border-right: 1px solid lightgrey;
}

.table >>> td:last-child {
  border-right: 0;
}

.table >>> .tableRow:hover {
  background-color: none !important;
}

.table >>> .v-data-footer__pagination,
.table >>> .v-data-footer__select {
  font-size: calc(
    14px + (18 - 14) * ((100vw - 300px) / (1800 - 300))
  ) !important;
}

.searchRow {
  margin-top: 1%;
  margin-bottom: 3%;
}
</style>
