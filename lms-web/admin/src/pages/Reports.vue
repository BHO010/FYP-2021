<template>
  <div id="reportPage">
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
      <h1 class="header">Discussion Reports</h1>
    </v-flex>

    <v-flex row xs12 class="tagRow">
      <v-data-table
        :headers="headers"
        :items="reports"
        :options.sync="options"
        :server-items-length="total"
        class="table"
      >
        <template v-slot:item="row">
          <tr class="tableRow" @click="onReportView(row.item)">
            <td>{{ row.item.author }}</td>
            <td>{{ row.item.title }}</td>
            <td></td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>

    <!-- Dialog -->
    <v-dialog v-model="reportDialog" scrollable width="70%">
      <v-card tile height="100%" class="reviewCard">
        <v-toolbar fixed dark color="primary">
          <!--  <v-btn icon dark @click="reportDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn> -->
          <v-toolbar-title>Review Report.</v-toolbar-title>
        </v-toolbar>
        <div id="dialogContent">
          <v-row>
            <h2>Reporter:</h2>
            <v-text-field
              v-model="reportContent.reporter"
              outlined
              dense
              readonly
            ></v-text-field>
          </v-row>
          <v-row>
            <h2>Message:</h2>
            <v-textarea
              v-model="reportContent.message"
              rows="3"
              row-height="40"
              no-resize
              outlined
              readonly
            ></v-textarea>
          </v-row>

          <v-row>
            <h2>Reportee:</h2>
            <v-text-field
              v-model="reportContent.reportee"
              outlined
              dense
              readonly
            ></v-text-field>
          </v-row>
          <v-row>
            <h2>Message:</h2>
            <v-textarea
              v-model="reportContent.reportedMessage"
              rows="3"
              row-height="40"
              no-resize
              outlined
              readonly
            ></v-textarea>
          </v-row>

          <v-row justify="end">
            <v-btn class="btn" text outlined color="blue" @click="deleteReport"
              >Approve</v-btn
            >
            <v-btn text outlined color="blue" @click="ignoreReport"
              >Ignore</v-btn
            >
          </v-row>
        </div>
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
      snackbarTimeout: 5000,
      reportDialog: false,
      reportContent: {
        reporter: "",
        message: "",
        reportee: "",
        reportedMessage: "",
      },
      rowItem: null,
      reports: [],
      total: 0,
      options: {},
      headers: [
        {
          text: "Email",
          align: "start",
          sortable: false,
          value: "author",
          class: "header",
        },
        {
          text: "Discussion Course",
          sortable: false,
          class: "header",
        },
        {
          text: "Manage",
          sortable: false,
          class: "header",
        },
      ],
    }
  },
  computed: {
       ...mapState(["error", "loading"]),
  },
  async mounted() {
    this.getReports()
  },
  watch: {
    options: {
      handler() {
        this.updatePages()
      },
      deep: true,
    },
  },
  methods: {
    updatePages() {
      this.getReports()
    },
    async onReportView(data) {
      try {
        this.rowItem = data
        let rv = await http.get("/api/admin/reportDetails", {
          params: {
            data: data,
          },
        })
        this.reportContent = rv.data
        this.reportDialog = true
      } catch (e) {}
    },
    async getReports() {
      try {
        let rv = await http.get("/api/admin/reports", {
          params: {
            options: this.options,
          },
        })

        this.reports = rv.data.results
        this.total = rv.data.total
      } catch (e) {}
    },
    async deleteReport() {
      try {
        this.$store.commit('setLoading', true);
        let rv = await http.post("/api/admin/report/delete", {
          data: this.rowItem,
        })
        if (rv) {
          this.snackbarText = rv.data.msg
          this.snackbarColor = "success"
          this.snackbarShow = true

          setTimeout(() => {
            this.reportDialog = false
            this.$store.commit('setLoading', false);
            this.$router.go().catch((e) => {})
          }, 2000)
        }
      } catch (e) {}
    },
    async ignoreReport() {
      try {
        this.$store.commit('setLoading', true);
        let rv = await http.post("/api/admin/report/ignore", {
          data: this.rowItem,
        })
        console.log(rv)
        if (rv) {
          this.snackbarText = rv.data.msg
          this.snackbarColor = "success"
          this.snackbarShow = true

          setTimeout(() => {
            this.reportDialog = false
            this.$store.commit('setLoading', false);
            this.$router.go().catch((e) => {})
          }, 1000)
        }
      } catch (e) {}
    },
  },
}
</script>

<style scoped>
#reportPage {
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
    16px + (22 - 16) * ((100vw - 300px) / (1800 - 300))
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

#dialogContent {
  width: 80%;
  margin: auto;
  margin-top: 2%;
  margin-bottom: 2%;
}

.v-input {
  width: 30%;
  margin-left: 2%;
  font-size: 22px;
}

.v-input__slot {
  width: 60%;
}

.btn {
  margin-right: 2%;
}
</style>