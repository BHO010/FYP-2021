<template>
  <div id="main">
    <v-snackbar
      v-model="snackbarShow"
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      top
      >{{ snackbarText }}</v-snackbar
    >
    <h1>Update Your profile and settings</h1>
    <v-tabs v-model="tab" background-color="transparent" grow>
      <v-tab v-for="item in tabs" :key="item.id" @click="select(item.id)">
        {{ item.name }}
      </v-tab>
    </v-tabs>

    <div v-if="changeProfile" class="content">
      <div class="body">
        <div class="header">Change Profile</div>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="onUpdateUser"
        >
          <!-- Change Name -->
          <div class="inputRow">
            <h3 class="size-18">Name:</h3>
            <v-text-field
              v-model="userDetails.name"
              type="text"
              outlined
              dense
            ></v-text-field>
          </div>
          <!-- Email, no change allowed-->
          <div class="inputRow">
            <h3 class="size-18">Email:</h3>
            <v-text-field
              v-model="userDetails.email"
              type="email"
              outlined
              dense
              readonly
            ></v-text-field>
          </div>
          <!-- Change Contact Number -->
          <div class="inputRow">
            <h3 class="size-18">Contact Number:</h3>
            <v-text-field
              v-model="userDetails.contactNumber"
              :rules="contactNumberRules"
              type="text"
              outlined
              dense
            ></v-text-field>
          </div>
          <!-- Change Active Tags -->
          <div class="inputRow">
            <h3>Interested Categories:</h3>
            <div class="pa-4 chipSheet">
              <v-chip-group
                v-model="userDetails.activeTags"
                column
                multiple
                active-class="blue"
              >
                <v-chip v-for="tag in tags" :key="tag" large filter outlined>
                  {{ tag }}
                </v-chip>
              </v-chip-group>
            </div>
          </div>

          <!-- Button Row -->
          <v-row class="btnRow" align="end">
            <v-spacer></v-spacer>
            <v-btn
              class="button"
              type="button"
              @click="onUpdateUser('profile')"
              color="#0078ab"
              :loading="loading"
              >Update</v-btn
            >
          </v-row>
        </v-form>
      </div>
    </div>

    <div v-if="changeImage" class="content">
      <div class="body">
        <div class="header">Change Avatar</div>
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
              <v-row align="center">
                <v-btn
                  class="button margin-right"
                  color="#69F0AE"
                  @click="generate()"
                  >Generate</v-btn
                >

                <v-btn
                  class="button"
                  color="#0078ab"
                  @click="onUpdateUser('avatar')"
                  >Update</v-btn
                >
              </v-row>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <div v-if="changePassword" class="content">
      <div class="body">
        <div class="header">Change Password</div>
        <v-form
          ref="form2"
          v-model="valid"
          lazy-validation
          @submit.prevent="onUpdateUser"
        >
          <!-- Old Password -->
          <div class="inputRow">
            <h3 class="size-18">Old Password:</h3>
            <v-text-field
              v-model="oldPassword"
              type="password"
              outlined
              dense
            ></v-text-field>
          </div>
          <!-- New Password -->
          <div class="inputRow">
            <h3 class="size-18">New Password:</h3>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              type="password"
              outlined
              dense
            ></v-text-field>
          </div>
          <!-- Confirm New Password -->
          <div class="inputRow">
            <h3 class="size-18">Confirm Password:</h3>
            <v-text-field
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              type="password"
              outlined
              dense
            ></v-text-field>
          </div>

          <!-- Button Row -->
          <v-row class="btnRow" align="end">
            <v-spacer></v-spacer>
            <v-btn
              class="button"
              :loading="loading"
              type="button"
              @click="onUpdateUser('password')"
              color="#0078ab"
              >Update</v-btn
            >
          </v-row>
        </v-form>
      </div>
    </div>

    <div v-if="applyInstructor" class="content">
      <div v-if="userDetails.role == 'user'" class="body">
        <div class="header">Apply to be an Instructor</div>
        <v-form
          ref="form2"
          v-model="valid"
          lazy-validation
          @submit.prevent="onApplication"
        >
          <!-- Upload document -->
          <div class="inputRow">
            <h3 class="size-18">Documents:</h3>
            <v-file-input
              v-model="files"
              multiple
              small-chips
              label="File input"
              outlined
              dense
              class="fileRow"
            ></v-file-input>
            <!-- Button Row -->
            <v-row class="btnRow" align="end">
              <v-spacer></v-spacer>
              <v-btn
                class="button"
                :loading="loading"
                type="button"
                @click="onApplication()"
                color="#0078ab"
                >Apply</v-btn
              >
            </v-row>
          </div>
        </v-form>
      </div>
      <div v-else class="body">
         <div class="header">Already an Instructor</div>
      </div>
    </div>
  </div>
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

export default {
  data() {
    return {
      snackbarColor: "success",
      snackbarShow: false,
      snackbarText: "",
      snackbarTimeout: 5000,
      userDetails: null,
      activeTags: null,
      changeProfile: true,
      changePassword: false,
      changeImage: false,
      applyInstructor: false,
      fileName: [],
      valid: true,
      profileImg: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
      tab: "Profile",
      files: [],
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
      confirmPasswordRules: [
        (v) => !!v || "Confirm Password is required",
        (v) => !v || v == this.password || "Passwords do not match",
      ],
      contactNumberRules: [
        (v) => !v || /^(0|[1-9][0-9]*)$/.test(v) || "Numbers Only",
        (v) =>
          !v || (v && v.length == 8) || "Contact Number must be 8 digits (SG)",
      ],
      tabs: [
        { id: 1, name: "Profile" },
        { id: 2, name: "Avatar" },
        { id: 3, name: "Password" },
        { id: 4, name: "Instructor Application" },
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
  computed: {
    comparePasswords() {
      return this.newPassword !== this.confirmPassword
        ? "Passwords do not match"
        : ""
    },
    ...mapState(["error", "loading"]),
  },
  async mounted() {
    try {
      const rv = await http.get("/api/me")
      this.userDetails = rv.data
    } catch (e) {}
  },
  methods: {
    generate() {
      let avatars = new Avatars(sprites, this.options)
      let svg = avatars.create()
      let d = document.getElementById("avatarImg")
      d.innerHTML = ""
      d.innerHTML = svg
      this.profileImg = svg
    },
    select(id) {
      if (id == 1) {
        this.changeProfile = true
        this.changeImage = false
        this.changePassword = false
        this.applyInstructor = false
      } else if (id == 2) {
        this.changeProfile = false
        this.changeImage = true
        this.changePassword = false
        this.applyInstructor = false
        setTimeout(function () {
          this.generate()
        }, 500)
      } else if (id == 3) {
        this.changeProfile = false
        this.changeImage = false
        this.changePassword = true
        this.applyInstructor = false
      } else {
        this.changeProfile = false
        this.changeImage = false
        this.changePassword = false
        this.applyInstructor = true
      }
    },
    async onUpdateUser(type) {
      try {
        let rv = null
        if (type == "profile") {
          try {
            this.$store.commit("setLoading", true)
            rv = await http.post("/api/me/settings/update", {
              type: type,
              name: this.userDetails.name,
              email: this.userDetails.email,
              contactNumber: this.userDetails.contactNumber,
              activeTags: this.userDetails.activeTags,
            })
          } catch (e) {
            this.snackbarColor = "error"
            this.snackbarText = e.response.data.e
            this.snackbarShow = true
            this.$store.commit("setLoading", false)
          }
        } else if (type == "avatar") {
          try {
            this.$store.commit("setLoading", true)
            rv = await http.post("/api/me/settings/update", {
              profileImg: this.profileImg,
              type: type,
            })
          } catch (e) {
            this.snackbarColor = "error"
            this.snackbarText = e.response.data.e
            this.snackbarShow = true
            this.$store.commit("setLoading", false)
          }
        } else {
          if (this.$refs.form2.validate()) {
            try {
              this.$store.commit("setLoading", true)
              rv = await http.post("/api/me/settings/update", {
                oldPassword: this.oldPassword,
                password: this.password,
              })
            } catch (e) {
              if (e.response.data.e) {
                this.snackbarColor = "error"
                this.snackbarText = e.response.data.e
                this.snackbarShow = true
                this.$store.commit("setLoading", false)
              }
            }
          }
        }

        if (rv) {
          setTimeout(() => {
            this.$store.commit("setLoading", false)
            this.$router.push("/profile").catch((err) => {})
          }, 1000)
        }
      } catch (e) {}
    },
    async onApplication() {
      this.$store.commit("setLoading", true) 
      for (var i = 0; i < this.files.length; i++) {
        await this.uploadFile(this.files[i])
      }

      let rv = await http.post("/api/me/application", {
        email: this.userDetails.email,
        fileName: this.fileName,
      })

      if (rv) {
        this.$store.commit("setLoading", false)
        this.snackbarColor = "success"
        this.snackbarText = rv.data.msg
        this.snackbarShow = true
        setTimeout(() => {
          this.$router.go()
        },500)
        
      }
    },
    async uploadFile(JSfile) {
        let name = JSfile.name
        let date = new Date().getTime()
        name = name.split('.')
        name[0] = name[0].concat(date)
        name = name.join('.')
        this.fileName.push(name)
      try {
        const { data } = await http.post(`/api/gcp-sign`, {
          filename: name,
          action: "write",
        })

        const rv = await http.put(data.url, JSfile, {
          withCredentials: false,
          headers: { "Content-Type": "application/octet-stream" },
        })

        if (rv) {
          return
        }
      } catch (e) {}
    },
  },
}
</script>

<style>
.avatarImg svg {
  width: 450px;
  height: 450px;
}
</style>

<style scoped>
#main {
  width: 80%;
  min-height: 100%;
  margin: auto;
}

#main h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(32px + (42 - 32) * ((100vw - 300px) / (1920 - 300)));
  color: #0d47a1;
  margin-top: 2%;
  margin-bottom: 2%;
}

.margin-right {
  margin-right: 4%;
}

.content {
  margin-top: 2%;
  border: 8px solid lightgrey;
  border-radius: 50px;
  margin-bottom: 4%;
}

.content .body {
  width: 90%;
  margin: auto;
}

.body .header {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(32px + (42 - 32) * ((100vw - 300px) / (1920 - 300)));
  color: #0d47a1;
  margin-bottom: 2%;
}

.inputRow h3 {
  font-family: "DarkerGrotesque-Medium";
  font-size: calc(24px + (28 - 24) * ((100vw - 300px) / (1920 - 300)));
}

.chipSheet {
  width: 60%;
}

.btnRow {
  margin: 1%;
  margin-bottom: 4%;
}

.button {
  font-family: "DarkerGrotesque-Medium";
  text-transform: none;
  line-height: 1;
  font-size: calc(16px + (24 - 16) * ((100vw - 300px) / (1920 - 300)));
  text-align: center;
  color: white;
}

.avatarImg {
  margin: auto;
  margin-top: 15%;
  height: 70%;
  width: 70%;
  margin-bottom: 2%;
}

.avatarSelect {
  margin: auto;
  margin-top: 3%;
  margin-left: 2%;
  width: 80%;
}

.v-chip-group .v-chip--active,
.v-chip-group .v-chip:hover {
  color: #009bdc;
}

@media screen and (max-width: 1480px) {
  .chipSheet {
    width: 90% !important;
  }
}

@media screen and (max-width: 1280px) {
  #main {
    width: 95% !important;
    margin: auto;
    margin-top: 8%;
  }
}

@media screen and (max-width: 1000px) {
  #main {
    margin-top: 10%;
  }
}

@media screen and (max-width: 600px) {
  #content {
    border: none;
    border-radius: 50px;
    padding: 2%;
  }
  #main {
    margin-top: 15%;
  }
}
</style>