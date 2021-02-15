<template>
    <div id="main">
        <div id="body">
            <h1>Achievements List</h1>
            <div class="flex-row wrap center">
                <v-card
                  v-for="item in achievements.achievements"
                  :key="item.id"
                  class="card"
                >
                <div class="row">
                    <div class="leftCol">
                        ICON
                    </div>
                    <div class="rightCol">
                        <h2>{{item.title}}</h2>
                        <div>Level: {{item.level}}</div>
                        <div>Points: {{item.points}}</div>
                    </div>
                    
                </div>
                   
                
                    
                </v-card>
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
            achievements: null
        }
    },
    computed: {
        ...mapState(["error", "loading"]),
    },
    async mounted() {
        let rv = await http.get('/api/me/achievements')
        
        this.achievements = rv.data
        console.log(rv.data)
    },
    methods: {}
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

#body .flex-row {
  display: flex;
}

#body .wrap {
  flex-wrap: wrap;
}

.center {
    margin: auto;
}

.card {
    width: 40%;
    height: 200px;
    margin: 2%;
    margin-left: 3%;
}

.card .row {
    margin: 1%;
}

.card .leftCol {
    width: 30%;
}
</style>