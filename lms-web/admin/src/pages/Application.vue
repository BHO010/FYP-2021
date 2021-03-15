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
      <h1 class="header">Instructors Application</h1>
    </v-flex>

    <v-flex row xs12 class="tagRow">
      <v-data-table
        :headers="headers"
        :items="applications"
        :options.sync="options"
        :server-items-length="total"
        :loading="loading"
        class="table"
      >
        <template v-slot:top>
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
          <tr class="tableRow" @click="viewApplication(row.item)">
            <td>{{ row.item.email }}</td>
            <td>{{ status(row.item) }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>

    <!-- Dialog -->
    <v-dialog v-model="applicationDialog" scrollable width="70%">
      <v-card tile height="100%" class="reviewCard">
        <v-toolbar fixed dark color="primary">
          <v-toolbar-title>Application.</v-toolbar-title>
        </v-toolbar>
        <div id="dialogContent">
          <div class="inputRow">
            <h2>Email:</h2>
            <v-text-field
              v-model="email"
              type="email"
              outlined
              dense
              readonly
            ></v-text-field>
          </div>
          <div class="inputRow">
            <h2>Documents:</h2>
            <div v-if="documents" class="fileRow">
              <div
                class="fileCard"
                v-for="file in documents"
                :key="file"
                @click="downloadFile(file)"
              >
                <v-row class="header">{{ file }}</v-row>
                <div class="dlRow">Download</div>
              </div>
            </div>
          </div>
          <div class="inputRow">
            <v-row justify="end">
              <v-btn class="button" color="#009bdc" @click="approve"
                >Approve</v-btn
              >
              <v-btn text outlined color="#009bdc" @click="ignore"
                >Ignore</v-btn
              >
            </v-row>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"
import axios from "axios"

export default {
  data() {
    return {
      snackbarColor: "success",
      snackbarShow: false,
      snackbarText: "",
      snackbarTimeout: 5000,
      search: "",
      loading: false,
      email: "",
      documents: [],
      applications: [],
      applicationDialog: false,
      total: 0,
      options: {},
      headers: [
        {
          text: "Email",
          align: "start",
          sortable: true,
          value: "email",
          class: "header",
        },
        {
          text: "Application status",
          sortable: false,
          value: "active",
          class: "header",
        },
      ],
    }
  },
  async mounted() {
    this.getApplications()
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
    status(data) {
      if (data.active && !data.approved) {
        return "Pending"
      } else if(!data.active && data.approved) {
        return "Approved"
      } else if(!data.active && !data.approved) {
        return "Ignored"
      }
    },
    updatePage() {
      this.getApplications()
    },
    async getApplications() {
      this.loading = true
      let rv = await http.get("/api/admin/applications")

      this.applications = rv.data.results
      this.total = rv.data.total
      this.loading = false
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
    viewApplication(data) {
      if(data.active) {
        this.email = data.email
        this.documents = data.documents
        this.applicationDialog = true
      } else {
        this.snackbarColor = 'error'
        this.snackbarText = "Application is closed"
        this.snackbarShow = true
      }
      
    },
    async approve() {
      try {
        let rv = await http.post("/api/admin/application/approve", {
          email: this.email,
        })

        if (rv) {
          this.snackbarText = rv.data.msg
          this.snackbarColor = "success"
          this.snackbarShow = true
          setTimeout(() => {
            this.$router.go()
          }, 500)
        }
      } catch (e) {}
    },
    async ignore() {
      try {
        let rv = await http.post("/api/admin/application/ignore", {
            email: this.email,
        })
        if (rv) {
          this.snackbarText = rv.data.msg
          this.snackbarColor = "success"
          this.snackbarShow = true
          setTimeout(() => {
            this.$router.go()
          }, 500)
        }
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

.searchRow {
  margin-top: 1%;
  margin-bottom: 3%;
}

.btn {
  text-decoration: none;
  text-transform: none;
  font-size: calc(
    16px + (20 - 16) * ((100vw - 300px) / (1800 - 300))
  ) !important;
}

.row {
  display: flex;
  margin: unset;
}

#dialogContent {
  width: 80%;
  margin: auto;
  margin-top: 2%;
  margin-bottom: 2%;
  text-align: left;
}

.submitBtn {
  margin-top: 2%;
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
  font-size: calc(
    16px + (20 - 16) * ((100vw - 300px) / (1800 - 300))
  ) !important;
  overflow: hidden;
  max-width: 200px;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 1%;
}

.button {
  margin-right: 2%;
  color: white;
}
</style>
