<template>
  <div id="main">
    <div id="body">
      <h1>Discussion Board</h1>
      <p>Connect and discuss with peers that took the same course as you.</p>
      <div v-if="user">
        <v-row id="selectorRow">
          <v-col class="d-flex" cols="12" sm="6">
            <v-label>Courses:</v-label>
            <v-select
              v-model="title"
              @input="updateSearch"
              dense
              outlined
            ></v-select>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <v-row id="selectorRow">
          <v-col class="d-flex" cols="12" sm="6">
            <v-label>Courses:</v-label>
            <v-select
              v-model="title"
              :items="courses"
              item-text="title"
              @input="updateSearch"
              dense
              outlined
            ></v-select>
          </v-col>
          <v-row id="selectorRow">
            <v-col class="d-flex" cols="12" sm="6">
              <v-label>Type:</v-label>
              <v-select
                v-model="type"
                :items="types"
                @input="updateSearch"
                dense
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-row>

        <div id="content">
            <div id="leftCol">

            </div>
            <div id="rightCol">
                <h1>Important</h1>
                <div id="imptContent"></div>
                <h1>Discussion</h1>
                <div id="discussionContent"></div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { http } from "@/axios"

export default {
  data() {
    return {
      user: true,
      title: "",
      courses: [],
      type: "Owned",
      types: ["Owned", "Registered"],
    }
  },
  async mounted() {
    let user = await http.get("api/me")
    if (user.data.role == "instructor") {
      this.user = false
    }
    let rv = await http.get("/api/me/discussion/list", {
      params: {
        type: this.type,
      },
    })
    this.courses = rv.data
    this.title = rv.data[0].title

    this.updateSearch()
  },
  methods: {
    updateSearch() {
      console.log(this.title, this.type)
    },
  },
}
</script>

<style scoped>
#main {
  width: 80%;
  margin: auto;
}

#body {
  margin-top: 2%;
}

#body h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: 42px;
  color: #0d47a1;
}

#body p {
  font-family: "DarkerGrotesque-Medium";
  font-size: 24px;
  margin-left: 0%;
}

.v-label {
  font-family: "DarkerGrotesque-Medium";
  font-size: 32px;
  font-weight: bold;
  color: black;
  margin-right: 1%;
}
#content {
    display: flex;
}

#leftCol {
    border: 1px solid black;
    height: 300px;
    width: 20%
}

#rightCol {
    border: 1px solid black;
    height: 300px;
    width: 80%
}
</style>