<template>
  <v-main class="center-all bgColor">
    <v-row xs12 class="center-all logo">
      <h1>Logo</h1>
    </v-row>

    <v-card flat class="loginCard">
      <v-form ref="form" v-model="valid" @submit.prevent="onSignup">
        <div style="border-bottom: 1px solid #f0f1f2;">
          <v-row xs12 class="center-all size23">Sign up</v-row>
          <v-row xs12 class="center-all size11 margin color2">Create a new account</v-row>
        </div>

        <div class="inputBox">
          <div class="size14 color2 margin-btm">YOUR NAME:</div>
          <v-text-field
            class="text-input"
            type="email"
            v-model="name"
            dense
            outlined
            :rules="requiredRules"
            label="Your name"
            prepend-inner-icon="mdi-account-outline"
          ></v-text-field>
          <div class="size14 color2 margin-btm">YOUR EMAIL ADDRESS:</div>
          <v-text-field
            class="text-input"
            type="email"
            v-model="email"
            :rules="emailRules"
            dense
            outlined
            label="Your email address"
            prepend-inner-icon="mdi-email-outline"
          ></v-text-field>
          <div class="size14 color2 margin-btm">YOUR PASSWORD:</div>
          <v-text-field
            class="text-input"
            type="password"
            v-model="password"
            :rules="passwordRules"
            dense
            outlined
            label="Your password"
            prepend-inner-icon="mdi-lock-outline"
          ></v-text-field>
          <div class="size14 color2 margin-btm">CONFIRM PASSWORD:</div>
          <v-text-field
            class="text-input"
            type="password"
            v-model="confirmPassword"
            :rules="requiredRules"
            dense
            outlined
            label="Confirm password"
            prepend-inner-icon="mdi-lock-outline"
          ></v-text-field>
          <div class="errorColor">{{comparePasswords}}</div>
          <div class="errorColor" v-if="!!error">{{ error.message }}</div>
          <v-btn type="button" @click.prevent="onSignup" block>Sign up</v-btn>
          <br />
          <v-row class="center-all">
            <v-checkbox v-model="checkbox" :rules="requiredRules">
              <template v-slot:label>
                <div>
                  I agree that
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <a target="_blank" @click.stop="terms" v-on="on">Terms Of Use</a>
                    </template>Click to view
                  </v-tooltip>
                </div>
              </template>
            </v-checkbox>
          </v-row>
          <hr />
        </div>

        <div class="footer">
          <v-row xs12 class="center-all">
            <span class="login">Already have an account?</span>
            <a href="/login" class="login">Log in?</a>
          </v-row>
        </div>
      </v-form>
    </v-card>
    <!-- Terms and conditions pop up -->
    <v-dialog v-model="termsNcondition" max-width="600">
      <v-card>
        <v-card class="card-dialog">
          <v-container>
            <v-card-title>Terms Of Use</v-card-title>
            <v-card-text>
              By creating and account you agree to the following
              <br />1) sample text
              <br />2) sample text
            </v-card-text>
            <br />
            <v-card-actions>
              <v-row justify="center">
                <v-btn class="card-btn" rounded @click="close">Close</v-btn>
              </v-row>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script>
import { mapState } from "vuex"
import { http } from "@/axios"
//import { APP_VERSION } from '@/config'
export default {
  //components: { VueRecaptcha }, // recaptcha
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsNcondition: false,
      checkbox: false,
      valid: true,
      snackbarColor: "success",
      snackbarShow: false,
      snackbarText: "",
      snackbarTimeout: 5000,
      requiredRules: [(v) => !!v || "This is required"],
      emailRules: [
        (v) => !!v || "Email Address is required",
        (v) =>
          /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email Address must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          /^(?=.*[0-9])(?=.*[!@#$%^&*()_+])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*()_+]{8,}$/.test(
            v
          ) ||
          "Password must contain at least 8 character with 1 special character, number, lower and uppercase letter",
      ],
    }
  },
  created() {
    // console.log('comment out line below to test Google Recaptcha on localhost')
    // if (
    //   window.location.hostname === "127.0.0.1" ||
    //   window.location.hostname === "localhost" ||
    //   this.sitekey === ""
    // )
    //   this.recaptchaUnverified = false;
  },
  mounted() {
    this.$store.commit("setLayout", "layout-default")
  },
  computed: {
    comparePasswords() {
      if (this.password !== this.confirmPassword) {
        return "Passwords do not match"
      } else {
        return ""
      }
    },
    ...mapState(["user", "error", "loading"]),
  },
  methods: {
    terms() {
      this.termsNcondition = true
    },
    close() {
      this.termsNcondition = false
    },
    async onSignup() {
      if (this.$refs.form.validate()) {
        if (this.password !== this.confirmPassword) {
          console.log("error")
          return false
        } else {
          try {
            let rv = await http.post("/api/auth/signup", {
              name: this.name,
              email: this.email,
              password: this.password,
              role: "user",
            })

            if (rv) {
              this.snackbarColor = "success"
              this.snackbarText = "Registered Account Successfully!"
              this.snackbarShow = true
              setTimeout(() => {
                this.$router.push("/login")
              }, 3000)
            }
          } catch (e) {}
        }
      }
    },
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
  border: 1px solid #f0f1f2;
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
  background-color: #f0f1f2;
  border: none;
}

.inputBox {
  margin: 10px;
}

.footer {
  margin-bottom: 1%;
}

.login {
  margin-right: 1%;
}

.errorColor {
  color: red;
}
</style>