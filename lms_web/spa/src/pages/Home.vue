<template>
  <v-container fluid>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <h1>Banner</h1>
  </v-container>
</template>

<script>

export default {
  data() {
    return {};
  },
  created() {},
  computed: {
    user() {
      return this.$store.state.user;
    },
    loading() {
      return this.$store.getters.loading;
    },
  },
  methods: {},
};
</script>

<style>
.max-container {
  margin-right: 0 !important;
  margin-left: 0 !important;
  max-width: 2500px;
  border: 0;
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


</style>
