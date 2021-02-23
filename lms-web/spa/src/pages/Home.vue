<template>
  <v-container fluid class="background">
   <section id="sectionI">
     <div class="leftCol">
       <div class="content">
           <h1 class="header">
         Life Long Learning
       </h1>
       </div>
     </div>
     <div class="rightCol">

     </div>
   </section>

  </v-container>
</template>

<script>
export default {
  data() {
    return {
   
    }
  },
  created() {},
  mounted() {
    this.$store.commit("setLayout", "layout-navbar")
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    loading() {
      return this.$store.getters.loading
    },
  },
  methods: {},
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: grey !important;
  font-size: 12px !important;
  margin-left: 1%;
  margin-right: 1%;
}

.background {
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  background: url('../../public/img/background.jpg') no-repeat center center fixed;
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

#sectionI {
  display: flex;
}

#sectionI .leftCol {
  width: 50%;
  border: 1px solid black;
}

.leftCol .content {
  width: 60%;
  margin: auto;
  border: 1px solid black;
}

#sectionI .rightCol {
  width: 50%;
  border: 1px solid black;
}

#sectionI .header {
  font-family: "DarkerGrotesque-Medium";
  font-size: 100px !important;
}
</style>
