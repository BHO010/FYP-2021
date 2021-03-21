<template>
  <v-container fluid class="mainBody">
   <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
     
    <v-container class="bannerContainer">
  <!--     <v-carousel
        cycle
        height="400"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item
          v-for="(item, i) in slides"
          :key="i"
          :src="item.src"
        ></v-carousel-item>
      </v-carousel>-->
    </v-container>

   <div class="tempBox">
      <div class="section">
        <h1>Recommended</h1>
        <div class="row">
          <course-card
            v-for="course in recCourses"
            :key="course._id"
            :course="course"
          >
          </course-card>
        </div>
      </div>

      <div v-for="interest in interested" :key="interest.index" class="section">
        <h1>{{interest.category}}</h1>
        <div class="row">
          <course-card
            v-for="course in interest.courses"
            :key="course._id"
            :course="course"
          >
          </course-card> 
        </div>
      </div>
    </div> 
  </v-container>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"
import { getTags } from "../../public/js/settings"

export default {
  data() {
    return {
      userDetails: null,
      recCourses: [],
      interested: [],
      tags: getTags(),
      slides: [
        {
          src: "/img/carousell-1.png",
        },
        {
          src: "/img/carousell-2.png",
        },
        {
          src: "/img/carousell-3.png",
        },
        {
          src: "/img/carousell-4.png",
        },
      ],
    }
  },
  created() {},
  async mounted() {
    this.$store.commit("setLayout", "layout-private")
    let rv = await http.get("/api/me/")
    this.userDetails = rv.data
    await this.getRecommended()
    await this.getInterested()
  },
  computed: {
    ...mapState(["error", "loading"]),
  },
  methods: {
    async getRecommended() {
      try {
        let rv = await http.get("/api/me/course/recommended")
        this.recCourses = rv.data
      } catch (e) {}
    },
    async getInterested() {
      for (var index of this.userDetails.activeTags) {
        let category = this.tags[index]
        let template = {
          id: index,
          category: category,
          courses: [],
        }
        
        let rv = await http.get("/api/me/course/interested", {
          params: {
            category: category
          }
        })
        if(rv.data.length > 0) {
          template.courses = rv.data
          this.interested.push(template)
        }
        
      }
      console.log(this.interested)
    },
  },
}
</script>

<style scoped>
.mainBody {
  width: 90%;
  margin: auto;
}
a {
  text-decoration: none;
  color: grey !important;
  font-size: 12px !important;
  margin-left: 1%;
  margin-right: 1%;
}

.logo {
  display: flex;
  padding-left: 13%;
}

.top-divider {
  border: none !important;
  height: 50px !important;
  max-height: 50px !important;
  border-bottom: 2px solid #e3e3e3 !important;
  box-shadow: 0 20px 15px -15px #e3e3e3 !important;
  margin: -50px auto 10px !important;
  overflow: visible !important;
}

.center-all {
  display: flex;
  align-items: center;
  justify-content: center;
}

.section {
  margin-bottom: 2%;
}

.section h1 {
  font-size: calc(34px + (42 - 34) * ((100vw - 300px) / (1920 - 300)));
  color: #0d47a1;
}

.row {
  display: flex;
}
</style>
