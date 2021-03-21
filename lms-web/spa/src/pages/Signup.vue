<template>
  <v-stepper v-model="step">
    <v-snackbar
      v-model="snackbarShow"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      top
      >{{ snackbarText }}</v-snackbar
    >
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1">
        Input Email Address
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="step > 2" step="2" @click="nextStep(2)">
        Select Interested Categories
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="step > 3" step="3" @click="nextStep(3)">
        Create Your Avatar
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="step > 4" step="4" @click="nextStep(4)">
        Complete Sign Up
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-content step="1" style="height: 100%">
      <div style="margin-top: 8%; margin-bottom: 18%">
        <v-row xs12 class="center-all logo">
          <h1>Logo</h1>
        </v-row>

        <v-card flat class="loginCard">
          <div style="border-bottom: 1px solid #f0f1f2">
            <v-row xs12 class="center-all size23">Sign up</v-row>
            <v-row xs12 class="center-all size11 margin color2"
              >Create a new account</v-row
            >
          </div>
          <v-form ref="form0" v-model="valid" lazy-validation>
            <div class="inputBox">
              <div class="size14 color2 margin-btm">YOUR EMAIL ADDRESS:</div>

              <v-text-field
                class="text-input"
                type="email"
                v-model="email"
                :rules="emailRules"
                dense
                outlined
                prepend-inner-icon="mdi-email-outline"
              ></v-text-field>
              <v-btn class="button" color="#009bdc" @click="onEmail()" block
                >Continue</v-btn
              >

              <br />
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
      </div>
    </v-stepper-content>

    <v-stepper-content step="2" style="height: 100%">
      <div style="margin-top: 5%; margin-bottom: 5.5%">
        <v-row xs12 class="center-all logo">
          <h1>Logo</h1>
        </v-row>

        <div class="center-all">
          <h1>Choose your interest</h1>
        </div>
        <v-row class="center-all margin-top">
          <p class="centerText">
            What categories are you interested in learning?<br />
            Select them and we will recommend you popular courses in these
            categories.
          </p>
        </v-row>

        <div class="chipDiv margin-btm">
          <v-row justify="space-around">
            <v-col cols="12" sm="8" md="8" lg="11">
              <v-sheet elevation="5" class="pa-4 chipSheet">
                <v-chip-group
                  v-model="activeTags"
                  column
                  multiple
                  active-class="blue"
                >
                  <v-chip v-for="tag in tags" :key="tag" large filter outlined>
                    {{ tag }}
                  </v-chip>
                </v-chip-group>
              </v-sheet>

              <v-row class="float-right nextBtn">
                <v-btn color="#009bdc" @click="nextStep(3)">Next</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-stepper-content>

    <v-stepper-content step="3" style="height: 100%">
      <div>
        <v-row>
          <v-col cols="6">
            <div>
              <div class="avatarSelect">
                <v-select
                  :items="top"
                  v-model="options.top[0]"
                  outlined
                  dense
                  label="Top"
                ></v-select>

                <v-select
                  :items="hatColor"
                  outlined
                  dense
                  v-model="options.hatColor[0]"
                  label="Hat Color (If hat is selected)"
                ></v-select>

                <v-select
                  :items="hairColor"
                  outlined
                  dense
                  v-model="options.hairColor[0]"
                  label="Hair Color (If hair is selected)"
                ></v-select>

                <v-select
                  :items="accessories"
                  outlined
                  dense
                  v-model="options.accessories[0]"
                  return-object
                  label="Accessories"
                ></v-select>

                <v-select
                  :items="facialHair"
                  outlined
                  dense
                  v-model="options.facialHair[0]"
                  label="Facial Hair"
                ></v-select>

                <v-select
                  :items="facialHairColor"
                  outlined
                  dense
                  v-model="options.facialHairColor[0]"
                  label="Facial Hair Color"
                ></v-select>

                <v-select
                  :items="clothes"
                  outlined
                  dense
                  v-model="options.clothes[0]"
                  label="Clothes"
                ></v-select>

                <v-select
                  :items="clothesColor"
                  outlined
                  dense
                  v-model="options.clothesColor[0]"
                  label="Clothes Color"
                ></v-select>

                <v-select
                  :items="eyes"
                  outlined
                  dense
                  label="Eyes"
                  v-model="options.eyes[0]"
                ></v-select>

                <v-select
                  :items="eyebrow"
                  outlined
                  dense
                  v-model="options.eyebrow[0]"
                  label="Eyebrown"
                ></v-select>

                <v-select
                  :items="mouth"
                  outlined
                  dense
                  v-model="options.mouth[0]"
                  label="Mouth"
                ></v-select>

                <v-select
                  :items="skin"
                  outlined
                  dense
                  v-model="options.skin[0]"
                  label="Skin color"
                ></v-select>
              </div>
            </div>
          </v-col>
          <v-col cols="6">
            <div style="height: 700px">
              <div class="avatarImg" id="avatarImg"></div>
              <v-row style="align-content: space-between">
                <v-btn class="margin-right" color="#69F0AE" @click="generate()"
                  >Generate</v-btn
                >
                <v-btn color="#009bdc" @click="nextStep(4)">Continue</v-btn>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-stepper-content>

    <v-stepper-content step="4" style="height: 100%">
      <div style="margin-top: 5%; margin-bottom: 7.5%">
        <v-row xs12 class="center-all logo">
          <h1><a href="/">Logo</a></h1>
        </v-row>

        <v-card flat class="loginCard">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="onSignup"
          >
            <div style="border-bottom: 1px solid #f0f1f2">
              <v-row xs12 class="center-all size23">Sign up</v-row>
              <v-row xs12 class="center-all size11 margin color2"
                >Create a new account</v-row
              >
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
              <div class="errorColor">{{ comparePasswords }}</div>
              <div class="errorColor" v-if="!!error">
                {{ error.message }}
              </div>
              <v-btn
                type="button"
                color="#69F0AE"
                @click.prevent="onSignup"
                :loading="loading"
                block
                >Sign up</v-btn
              >
              <br />
              <v-row class="center-all">
                <v-checkbox v-model="checkbox" :rules="requiredRules">
                  <template v-slot:label>
                    <div>
                      I agree that
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <a target="_blank" @click.stop="terms" v-on="on"
                            >Terms Of Use</a
                          > </template
                        >Click to view
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
                  <br />1) sample text <br />2) sample text
                </v-card-text>
                <br />
                <v-card-actions>
                  <v-row justify="center">
                    <v-btn
                      color="#69F0AE"
                      class="card-btn"
                      rounded
                      @click="close"
                      >Close</v-btn
                    >
                  </v-row>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-card>
        </v-dialog>
      </div>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import { mapState } from "vuex"
import { http } from "@/axios"
import Avatars from "@dicebear/avatars"
import sprites from "@dicebear/avatars-avataaars-sprites"
import {
  getTags,
  getTop,
  getHatColor,
  getHaircolor,
  getAccessories,
  getFacialHair,
  getFacialHairColor,
  getClothes,
  getClothesColor,
  getEyes,
  getEyebrown,
  getMouth,
  getSkin,
} from "../../public/js/settings"

//import { APP_VERSION } from '@/config'
export default {
  //components: { VueRecaptcha }, // recaptcha
  data() {
    return {
      snackbarColor: "success",
      snackbarShow: false,
      snackbarText: "",
      snackbarTimeout: 5000,
      step: 1,
      validToken: "",
      profileImg: "",
      activeTags: [],
      role: "user",
      name: "",
      email: "",
      emailValid: true,
      password: "",
      confirmPassword: "",
      termsNcondition: false,
      checkbox: false,
      valid: true,
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
      tags: getTags(),
      top: getTop(),
      hatColor: getHatColor(),
      hairColor: getHaircolor(),
      accessories: getAccessories(),
      facialHair: getFacialHair(),
      facialHairColor: getFacialHairColor(),
      clothes: getClothes(),
      clothesColor: getClothesColor(),
      eyes: getEyes(),
      eyebrow: getEyebrown(),
      mouth: getMouth(),
      skin: getSkin(),
      options: {
        width: "650px",
        height: "450px",
        style: "circle",
        top: ["longHair"],
        hatColor: ["black"],
        hairColor: ["auburn"],
        accessories: ["none"],
        facialHair: ["none"],
        facialHairColor: ["auburn"],
        clothes: ["blazer"],
        clothesColor: ["black"],
        eyes: ["default"],
        eyebrow: ["default"],
        mouth: ["default"],
        skin: ["tanned"],
        background: "#EFEFEF",
        accessoriesChance: 100,
        facialHairChance: 100,
      },
    }
  },
  created() {},
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
        this.$store.commit("setLoading", true)
        if (this.password !== this.confirmPassword) {
          return false
        } else {
          try {
            let rv = await http.post(
              "/api/auth/signup",
              {
                role: this.role,
                name: this.name,
                password: this.password,
                activeTags: this.activeTags,
                image: this.profileImg,
              },
              {
                headers: {
                  Authorization: "Bearer " + this.validToken,
                },
              }
            )

            if (rv) {
              this.snackbarColor = "success"
              this.snackbarText = "Registered Account Successfully!"
              this.snackbarShow = true
              setTimeout(() => {
                this.$store.commit("setLoading", false)
                this.$router.push("/login")
              }, 3000)
            }
          } catch (e) {}
        }
      }
    },
    async onEmail() {
      console.log("click", this.$refs.form0.validate(), this.email)
      if (this.$refs.form0.validate()) {
        try {
          const { data } = await http.post("/api/signup/email", {
            email: this.email,
          })
          if (data.user) {
            this.snackbarColor = "error"
            this.snackbarText = "Email Address already exists"
            this.snackbarShow = true
          }
        } catch (e) {
          if (e.response.data.user == null) {
            try {
              const { data } = await http.post("/api/auth/signup-email", {
                email: this.email,
                role: this.role,
              })
              this.validToken = data.token.token
              this.emailValid = true
              this.step = 2
              //this.verify = true
            } catch (e) {
              this.snackbarColor = "error"
              this.snackbarText = "Server Error"
              this.snackbarShow = true
            }
          }
        }
      }
    },
    nextStep(i) {
      if (i == 3) {
        this.step = i
      }
      if (i != 1 && this.emailValid == true) {
        this.step = i
      }
    },
    generate() {
      let avatars = new Avatars(sprites, this.options)
      let svg = avatars.create()
      let d = document.getElementById("avatarImg")
      d.innerHTML = ""
      d.innerHTML = svg
      this.profileImg = svg
    },
  },
}
</script>

<style scoped>
.v-chip-group .v-chip--active,
.v-chip-group .v-chip:hover {
  color: #009bdc;
}

.v-stepper-content {
  height: 100%;
}

.bgColor {
  background-color: #f5f6f7;
}

.margin-right {
  margin-right: 4%;
}

.center {
  margin: auto;
  margin-top: 8%;
  width: 50%;
  border: 3px solid #ff733c;
  padding: 10px;
}

.centerText {
  text-align: center;
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

.chipSheet {
  margin-top: 2%;
}

.chipDiv {
  margin: auto;
  width: 40%;
}

.nextBtn {
  margin: 2%;
}

.avatarImg {
  margin: auto;
  margin-top: 15%;
  height: 70%;
  width: 70%;
  background-color: #ff733c;
}

.avatarSelect {
  margin: auto;
  margin-top: 3%;
  margin-left: 20%;
  width: 70%;
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

.marginTop {
  margin-top: 3%;
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

@media screen and (max-width: 1270px) {
  #rc-imageselect,
  .g-recaptcha {
    transform: scale(0.77);
    -webkit-transform: scale(0.77);
    transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
  }

  .chipDiv {
    margin: auto;
    width: 80%;
  }
}
</style>