<template>
  <div id="main">
    <h1>Update Your profile and settings</h1>
    <v-tabs v-model="tab" background-color="transparent" grow>
      <v-tab v-for="item in tabs" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      changeProfile: true,
      changePassword: false,
      changeImage: false,
      tab: "Profile",
      tabs: [
          "Profile",
          "Avatar",
          "Password"
      ],
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped>
#main {
  width: 80%;
  margin: auto;
}

#main h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: 42px;
  color: #0d47a1;
  margin-top: 2%;
  margin-bottom: 2%;
}
</style>