<template>
  <div class="template">
    <h1>{{ this.item.title }}</h1>

    <div v-if="this.item.type == 'text'" class="charts">
      <v-data-table :headers="headers" :items="this.item.data" class="table">
        <template v-slot:item="row">
          <tr class="tableRow">
            <td>{{ row.item }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>

    <div v-else-if="this.item.type == 'check'" class="charts">
      <apexchart
        width="80%"
        height="400"
        type="bar"
        :options="barOptions"
        :series="bSeries"
      ></apexchart>
    </div>

    <div v-else-if="this.item.type == 'radio'" class="charts">
      <apexchart
        width="80%"
        height="400"
        type="bar"
        :options="barOptions"
        :series="bSeries"
      ></apexchart>
    </div>

    <div v-else-if="this.item.type == 'rate'" class="charts">
      <apexchart
        width="100%"
        height="400"
        type="bar"
        :options="rateOptions"
        :series="rateSeries"
      ></apexchart>
    </div>
  </div>
</template>


<script>
import { mapState } from "vuex"
import { http } from "@/axios"

export default {
  name: "survey-analysis",
  props: {
    item: Object,
  },
  data() {
    return {
      headers: [
        {
          text: "Answer",
          align: "start",
          sortable: false,
          class: "header",
        },
      ],
      barOptions: {
        chart: {
          id: "Chart",
        },
        colors: ['#41B883', '#E46651', '#E46651'],
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true
          }
        },
        xaxis: {
          categories: [],
        },
      },
      bSeries: [
        {
          name: "Numbe of user",
          data: [],
        },
      ],
    }
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  async mounted() {
    console.log(this.item)
    if (this.item.type != "text") {
      this.barOptions = {
        chart: {
          id: "Chart",
        },
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        xaxis: {
          categories: this.item.categories,
        },
      }
      this.bSeries[0].data = this.item.data
    }

    window.dispatchEvent(new Event("resize"))

    this.$store.commit("setLoading", false)
  },
  methods: {},
}
</script>

<style scoped>
.template {
  margin-top: 2%;
  margin-bottom: 2%;
  padding-bottom: 2%;
  width: 100%;
  border-bottom: 5px solid lightgrey;
}

.table {
  background-color: transparent;
  border: 5px solid lightgrey;
  border-radius: 50px;
  padding: 1%;
  margin: 1%;
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
</style>