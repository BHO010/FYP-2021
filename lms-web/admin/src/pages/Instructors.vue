<template>
  <div id="userPage">
    <!-- Top row -->
    <v-flex row xs12 class="tagRow">
      <h1 class="header">Instructors</h1>
    </v-flex>

    <v-flex row xs12 class="tagRow">
      <v-data-table :headers="headers" :items="users" :options.sync="options" :server-items-length="total" class="table">
        <template v-slot:item="row">
          <tr class="tableRow">
            <td>{{ row.item.email }}</td>
            <td>{{ row.item.name }}</td>
            <td>{{ row.item.contactNumber }}</td>
            <td>{{ available(row.item.active) }}</td>
            <td>
              <v-btn class="mx-2 btn" text outlined color="blue"> Edit </v-btn>
              <v-btn class="mx-2 btn" text outlined color="blue">
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
      users: [],
      total: 0,
      options: {},
      headers: [
        {
          text: "Email",
          align: "start",
          sortable: false,
          value: "email",
          class: "header",
        },
        {
          text: "Name",
          sortable: false,
          class: "header",
        },
        {
          text: "Contact Number",
          sortable: false,
          class: "header",
        },
        {
          text: "Account status",
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
  async mounted() {
    this.getUser()
  },
  computed: {
  },
  watch: {
      options: {
        handler () {
         console.log("HERE")
          this.updatePage()
        },
        deep: true,
      },
  },
  methods: {
      available(data) {
          if(data) {
              return "Active"
          }else {
              return "Inactive"
          }
      },
      updatePage() {
          this.getUser()
      },
      async getUser() {
          let rv = await http.get('/api/admin/user', {
              params: {
                 role: "instructor",
                  options: this.options 
              }
          })

          this.users = rv.data.results
          this.total = rv.data.total
      }
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
  font-size: calc(22px + (30 - 22) * ((100vw - 300px) / (1800 - 300))) !important;
  color: #0d47a1 !important;
}

.table >>> td {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(16px + (22 - 16) * ((100vw - 300px) / (1800 - 300))) !important;
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
    font-size: calc(14px + (18 - 14) * ((100vw - 300px) / (1800 - 300))) !important;
}
</style>
