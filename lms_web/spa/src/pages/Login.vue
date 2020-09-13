<template>
  <div>
    <v-btn small color="primary">Primary</v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { http } from '@/axios'
import { APP_VERSION } from '@/config'
export default {
  //components: { VueRecaptcha }, // recaptcha
  data() {
    return {
      email: "",
      show: false,
      password: "",
      pin: "",
      snackbarColor: "success",
      snackbarShow: false,
      snackbarText: "",
      snackbarTimeout: 5000
    };
  },
  created() {
    // console.log('comment out line below to test Google Recaptcha on localhost')
    if (
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "localhost" ||
      this.sitekey === ""
    )
      this.recaptchaUnverified = false;
  },
  mounted() {
    this.$store.commit("setLayout", "layout-default");
  },
  computed: {
    ...mapState(["user", "error", "loading"])
  },
  methods: {
  }
};
</script>

<style scoped>
@media screen and (max-width: 450px) {
  #rc-imageselect,
  .g-recaptcha {
    transform: scale(0.77);
    -webkit-transform: scale(0.77);
    transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
  }
}
</style>