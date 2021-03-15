<template>
  <div id="main">
    <div id="body">
      <h1>Students List</h1>
      <p>
        A list of currently registered students. You can remove students from
        the course.
      </p>
      <div class="topRow">
        <v-row>
          <v-label>Course:</v-label>
          <v-select
            :items="list"
            item-text="title"
            dense
            outlined
            v-model="title"
            @change="updateSearch('title')"
          ></v-select>
          <v-spacer></v-spacer>
          <v-label>Batch:</v-label>
          <v-select v-model="batch" :items="batchList" item-text="id" dense outlined @change="updateSearch('batch')"> </v-select>
          <v-spacer></v-spacer>
          <v-label>Status:</v-label>
          <v-text-field v-model="status" readonly dense outlined></v-text-field>
        </v-row>
      </div>
      <div id="content">
        <v-data-table :headers="headers" :items="students" mobile class="table">
          <template v-slot:item="row">
            <tr class="tableRow">
              <td>{{ row.item.name }}</td>
              <td>{{ row.item.email }}</td>
              <td>{{ formatDate(row.item.regDate) }}</td>
              <td>
                <v-btn
                  v-if="checkDate(row.item.startDate)"
                  icon
                  @click.stop="removeUser(row.item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <div v-else>
                  Not able to delete student, course has started.
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
      courses: null,
      list: null,
      batchList: null,
      students: [],
      batch: "",
      title: "",
      status: "",
      courseRef: "",
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: false,
          class: "header",
        },
        {
          text: "Email",
          sortable: false,
          class: "header",
        },
        {
          text: "Registration Date",
          sortable: false,
          class: "header",
        },
        {
          text: "Remove Student",
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
    try {
      let rv = await http.get("/api/me/courses/list")
      this.list = rv.data.list
      this.title = this.list[0]
      this.batchList = this.list[0].batch
      this.batch = this.list[0].batch[0].id
      this.courseRef = this.list[0].courseRef
      this.classStatus(this.list[0].batch[0].active)

      this.updateList(0)
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async updateSearch(type) {
      let index = null
      if(type == "title") {
        index = this.list.findIndex(p => p.title == this.title)
        this.batchList = this.list[index].batch
        this.batch = this.list[index].batch[0].id
        this.classStatus(this.list[index].batch[0].active)
        this.updateList(index)
      }else {
        index = this.list.findIndex(p => p.title == this.title)
        var index2 = this.list[index].batch.findIndex(p => p.id == this.batch)
        console.log(this.list)
        console.log(index2)
        this.classStatus(this.list[index].batch[index2].active)
        this.updateList(index)
      }
      
      
      
    },
    async updateList(index) {
      try {
        let rv = await http.get("/api/me/courses/students", {
          params: {
            courseRef: this.list[index].courseRef,
            batchID: this.batch,
          },
        })

        this.students = rv.data
      } catch (e) {
        alert(e.toString())
      }
    },
    async removeUser(data) {
      try {
        let rv = await http.delete("/api/me/courses/students", {
          params: {
            courseRef: this.courseRef,
            batchID: this.batch,
            email: data.email,
          },
        })

        if (rv) {
          this.updateList()
        }
      } catch (e) {}
    },
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    checkDate(start) {
      let today = Date.now()
      let date = new Date(start).getTime()

      if (date - today > 0) {
        return true
      } else {
        return false
      }
    },
    classStatus(data) {
      if(data) {
        this.status = "Open"
      }else {
        this.status = "Closed"
      }
    }
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
  font-size: calc(34px + (48 - 34) * ((100vw - 300px) / (1920 - 300)));
  color: #0d47a1;
  margin-bottom: 1%;
}

#body {
  margin-top: 2%;
}

.topRow {
  width: 100%;
  padding-left: 1%;
  padding-top: 1%;
  
}

.row {
  flex-wrap: nowrap !important;
}

.v-label {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(24px + (32 - 24) * ((100vw - 300px) / (1920 - 300)));
  font-weight: bold;
  color: black;
  margin-right: 1%;
}

.v-input {
  max-width: 400px !important;
}

#content {
  margin-top: 2%;
}

.table {
  background-color: transparent;
  border: 5px solid lightgrey;
  border-radius: 50px;
  padding: 1%;
}

.table >>> .header {
  font-family: "DarkerGrotesque-Bold";
  font-size: calc(
    14px + (30 - 14) * ((100vw - 300px) / (1920 - 300))
  ) !important;
  color: #0d47a1 !important;
}

.table >>> td {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(
    14px + (22 - 14) * ((100vw - 300px) / (1920 - 300))
  ) !important;
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

  .row {
    display: block;
  }
}

@media screen and (max-width: 600px) {
  #main {
    margin-top: 14%;
  }
}
</style>