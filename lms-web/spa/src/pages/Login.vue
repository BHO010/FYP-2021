<template>
  <div class="center">
    <v-row xs12 class="center-all logo">
      <h1><a href="/">Logo</a></h1>
    </v-row>

    <v-card flat class="loginCard">
      <v-form>
        <div style="border-bottom: 1px solid #b8bdc2">
          <v-row xs12 class="center-all size23">Login</v-row>
          <v-row xs12 class="center-all size11 margin color2"
            >Access Your Account</v-row
          >
        </div>

        <div class="inputBox">
          <div class="size14 color2 margin-btm">YOUR EMAIL ADDRESS:</div>
          <v-text-field
            type="email"
            v-model="email"
            dense
            outlined
            label="Your email address"
            prepend-inner-icon="mdi-email-outline"
          ></v-text-field>
          <div class="size14 color2 margin-btm">YOUR PASSWORD:</div>
          <v-text-field
            type="password"
            v-model="password"
            dense
            outlined
            label="Your password"
            prepend-inner-icon="mdi-lock-outline"
          ></v-text-field>
          <div class="errorColor" v-if="!!error">{{ error.message }}</div>
          <v-btn type="button" color="#ff733c" @click.prevent="onSignin" block>Login</v-btn>
          <br />
          <v-row class="center-all forgotPW">
            <a>Forgot password?</a>
          </v-row>
        </div>

        <br />
        <hr />

        <div class="footer">
          <v-row xs12 class="center-all">
            <span class="createAct">Do not have an account?</span>
            <a href="/signup" class="createAct">Sign up?</a>
          </v-row>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { http } from "@/axios"
//import { APP_VERSION } from '@/config'
export default {
  data() {
    return {
      email: "",
      password: "",
      snackbarColor: "success",
      snackbarShow: false,
      snackbarText: "",
      snackbarTimeout: 5000,
    }
  },
  created() {
  },
  mounted() {
    this.$store.commit("setLayout", "layout-default")
  },
  computed: {
    ...mapState(["user", "error", "loading"]),
  },
  methods: {
    async onSignin() {
      this.$store.dispatch("clearError")
      this.$store
        .dispatch("signUserIn", {
          email: this.email,
          password: this.password,
        })
        .catch((err) => {})
    }
  },
}
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

.bgColor {
  background-color: #f5f6f7;
}

.center {
  margin: auto;
  margin-top: 8%;
  width: 50%;
  padding: 10px;
}

.center-all {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  margin-bottom: 2%;
}

.color2 {
  color: #b8bdc2;
}

.loginCard {
  margin: auto;
  max-width: 550px;
  border: 1px solid #b8bdc2;
  border-radius: 0.1875rem;
}

.size23 {
  font-size: 23px;
}

.size11 {
  font-size: 11px;
}

.size14 {
  font-size: 14px;
}

.margin {
  margin-top: 5px;
  margin-bottom: 10px;
}

.margin-btm {
  margin-bottom: 10px;
}

.margin-top {
  margin-top: 10px;
}

hr {
  margin-bottom: 10px;
  border-bottom-left-radius: revert !important;
  height: 1px;
  background-color: #b8bdc2;
  border: none;
}

.inputBox {
  margin: 10px;
}

.loginBtn {
  margin-left: 1%;
  margin-right: 1%;
}

.forgotPW {
  text-decoration: underline;
}

.createAct {
  margin-right: 1%;
}

.footer {
  margin-bottom: 1%;
}

.errorColor {
  color: red;
}
</style>