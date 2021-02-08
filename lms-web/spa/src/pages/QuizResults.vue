<template>
  <div id="main">
    <div id="body">
      <h1>Quiz Results Table</h1>
      <v-data-table :headers="headers" :items="quizList" class="table">
        <template v-slot:item="row">
          <tr class="tableRow" @click="onQuizView(row.item)">
            <td>{{ row.item.name }}</td>
            <td>{{ row.item.completedBy }}</td>
            <td>{{ row.item.completedOn }}</td>
            <td v-if="row.item.score">{{ row.item.score + '/' + row.item.totalScore}}</td>
            <td v-else>Not Marked</td>
          </tr>
        </template>
      </v-data-table>
    </div>

    <!-- Dialog -->
     <v-dialog v-model="viewQuizDialog" persistent scrollable>
        <v-card tile  height="100%" color="#e1f5fe">
          <v-toolbar  fixed dark color="primary">
            <v-btn icon dark @click="viewQuizDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Quiz Result</v-toolbar-title>
          </v-toolbar>
          <!-- Quiz component -->
          <div id="dialogContent">
              <quiz-marker :quiz="quizData"></quiz-marker>
          </div>
          
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"
import QuizMarker from '../components/QuizMarker.vue'

export default {
  components: { QuizMarker },
  data() {
    return {
      courseRef: this.$route.query.ref,
      batchID: this.$route.query.batchID,
      quizID: this.$route.query.quizID,
      viewQuizDialog: false,
      quizData: null,
      quizList: [],
      headers: [
          {
          text: "Name",
          align: "start",
          sortable: false,
          value: "title",
          class: "header",
        },
        {
          text: "Email",
          sortable: false,
          class: "header",
        },
        {
          text: "Completed On",
          sortable: false,
          class: "header",
        },
        {
          text: "Result",
          sortable: false,
          class: "header",
        }
      ]
    }
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  async mounted() {
    try {
      let rv = await http.get("/api/me/quiz/results", {
        params: {
          courseRef: this.courseRef,
          batchID: this.batchID,
          quizID: this.quizID,
        }
      })

      if (rv) {
        this.quizList = rv.data
      }
    } catch (e) {}
  },
  methods: {
      onQuizView(data) {
          this.quizData = data
          this.viewQuizDialog = true
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
  font-size: 30px !important;
  color: #0d47a1 !important;
}

.table >>> td{
  font-family: "DarkerGrotesque-Medium";
  font-size: 22px !important; 
  border-right: 1px solid lightgrey;
}

.table >>> td:last-child{
  border-right: 0;
}

.table >>> .tableRow:hover{
  background-color: none !important;
}

#dialogContent {
    margin-top: 2%;
    min-height: 600px;
}
</style>