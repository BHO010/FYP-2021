<template>
  <div id="main">
    <div id="body">
      <h1>Achievements List</h1>
      <div class="flex-row wrap center">
        <achievement-card v-for="achievement in achievements" :key="achievement.id" :achievement="achievement" type="null"></achievement-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { http } from "@/axios"
import AchievementCard from "../components/AchievementCard.vue"

export default {
  components: { AchievementCard },
  data() {
    return {
      achievements: []
    }
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  async mounted() {
    try {
      let rv0 = await http.get('/api/me')
      let rv = await http.post('/api/me/achievement/stats')

      rv.data.achievements.sort((a,b) => (a.level > b.level) ? -1 : ((b.level > a.level) ? 1 : 0))

      if(rv0.data.role == "user") {
        for(var item of rv.data.achievements) {
          if(item.role == "user") {
            this.achievements.push(item)
          }
        }
      }else {
        this.achievements = rv.data.achievements

      }
      
    } catch (e) {}
  },
  methods: {},
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