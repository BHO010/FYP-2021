<template>
  <div class="container">
    <v-snackbar
      v-model="snackbarShow"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      top
      >{{ snackbarText }}</v-snackbar
    >
    <div id="content">
      <v-card flat class="loginCard">
        <v-form>
          <div id="top">
            <v-row xs12 class="center-all size24">Reset</v-row>
            <v-row xs12 class="center-all size11">Reset Your Password</v-row>
          </div>

          <div class="inputBox">
            <div v-if="this.step == 1" class="inputContainer">
              <div class="size14 color2 margin-btm">YOUR EMAIL ADDRESS:</div>
              <v-text-field
                type="email"
                v-model="email"
                dense
                outlined
                label="Your email address"
                prepend-inner-icon="mdi-email-outline"
              ></v-text-field>
            </div>

            <div v-else-if="this.step == 2" class="inputContainer">
              <div class="size18">CONFIRMATION CODE:</div>
              <v-text-field
                type="text"
                v-model="confirmationCode"
                dense
                outlined
                label="Confirmation Code"
              ></v-text-field>
            </div>

            <div v-else-if="this.step == 3" class="inputContainer">
              <v-form ref="form" v-model="valid" lazy-validation>
                <div class="size18">YOUR PASSWORD:</div>
                <v-text-field
                  type="password"
                  v-model="password"
                  dense
                  outlined
                  :rules="passwordRules"
                  label="Your password"
                  prepend-inner-icon="mdi-lock-outline"
                ></v-text-field>

                <div class="size18">CONFIRM YOUR PASSWORD:</div>
                <v-text-field
                  type="password"
                  v-model="confirmPassword"
                  dense
                  outlined
                  label="Confirm Your Password"
                  prepend-inner-icon="mdi-lock-outline"
                ></v-text-field>
                <div class="errorColor">{{ comparePasswords }}</div>
                <div class="errorColor" v-if="!!error">{{ error.message }}</div>
              </v-form>
            </div>

            <v-btn
              type="button"
              color="#0078ab"
              class="btn"
              block
              @click.prevent="onSubmit"
              >Submit</v-btn
            >
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
  </div>
</template>

<script>
import { http } from "@/axios"
import { mapState } from "vuex"

export default {
  data() {
    return {
      snackbarColor: "success",
      snackbarShow: false,
      snackbarText: "",
      snackbarTimeout: 5000,
      step: 1,
      email: "",
      confirmationCode: "",
      valid: true,
      password: "",
      confirmPassword: "",
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
  computed: {
    ...mapState(["user", "error", "loading"]),
    comparePasswords() {
      if (this.password !== this.confirmPassword) {
        return "Passwords do not match"
      } else {
        return ""
      }
    },
  },
  mounted() {},
  methods: {
    async onSubmit() {
      try {
        if (this.step == 1) {
          let rv = await http.get("/api/me/user", {
            params: {
              email: this.email,
              type: "forgotPW"
            },
          })

          if (rv.data.found) {
            let rv0 = await http.post("/api/me/generate-code", {
              email: this.email,
            })

            if (rv0) {
              this.snackbarText = rv0.data.msg
              this.snackbarColor = "success"
              this.snackbarShow = true
              this.step = 2
            }
          } else {
            this.snackbarText = "Email not found"
            this.snackbarColor = "error"
            this.snackbarShow = true
          }
        } else if (this.step == 2) {
          let rv1 = await http.post("/api/me/verifyCode", {
            email: this.email,
            code: this.confirmationCode,
          })
          if (rv1) {
            this.snackbarText = rv1.data.msg
            this.snackbarColor = "success"
            this.snackbarShow = true
            this.step = 3
          }
        } else {
          if (this.$refs.form.validate()) {
            if (this.password !== this.confirmPassword) {
              return false
            } else {
              try {
                let rv = await http.post("/api/me/updatePW", {
                  password: this.password,
                  email: this.email,
                })

                if (rv) {
                  this.snackbarText = rv.data.msg
                  this.snackbarColor = "success"
                  this.snackbarShow = true
                  setTimeout(() => {
                    this.$router.push('/login').catch(()=> {})
                  }, 500);
                }
              } catch (e) {}
            }
          }
        }
      } catch (e) {
        if (this.step == 2) {
          this.snackbarText = "Incorrect Code"
          this.snackbarColor = "error"
          this.snackbarShow = true
        }
      }
    },
  },
}
</script>

<style scoped>
.container {
  width: 40%;
  padding: 4%;
  padding-top: 10%;
}

.center {
  margin: auto;
  width: 80%;
  padding: 10px;
}

.center-all {
  display: flex;
  align-items: center;
  justify-content: center;
}

.inputContainer {
  margin-top: 2%;
}

#top {
  border-bottom: 1px solid #b8bdc2;
}

.btn {
  text-transform: none;
  color: white;
  font-size: calc(14px + (18 - 14) * ((100vw - 300px) / (1920 - 300)));
}

.size24 {
  font-size: calc(16px + (24 - 16) * ((100vw - 300px) / (1920 - 300)));
}

.size18 {
  font-size: calc(14px + (18 - 14) * ((100vw - 300px) / (1920 - 300)));
}

.errorColor {
  color: red;
}
</style>