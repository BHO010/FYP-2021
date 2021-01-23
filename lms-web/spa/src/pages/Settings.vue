<template>
  <div id="main">
    <h1>Update Your profile and settings</h1>
    <v-tabs v-model="tab" background-color="transparent" grow>
      <v-tab v-for="item in tabs" :key="item.name" @click="select(item.id)">
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
            @submit.prevent="onUpdate"
            class="editForm"
          >
          <!-- Change Name -->
            <div class="inputRow">
              <h3 class="size-18">Name:</h3>
              <v-text-field v-model="name" type="text" outlined dense></v-text-field>
            </div>
          <!-- Change Email -->
            <div class="inputRow">
              <h3 class="size-18">Email:</h3>
              <v-text-field v-model="name" type="email" outlined dense></v-text-field>
            </div>  
          <!-- Change Contact Number -->
            <div class="inputRow">
              <h3 class="size-18">Contact Number:</h3>
              <v-text-field
                v-model="contactNumber"
                :rules="contactNumberRules"
                type="text"
                outlined
                dense
              ></v-text-field>
            </div>  
          <!-- Change Active Tags -->
            <div class="inputRow">
              <h3>Interested Categories:</h3>
              <div class="chipSheet">
                <v-chip-group column multiple active-class="#FED8B1">
                  <v-chip
                    v-for="tag in tags"
                    :key="tag"
                    large
                    filter
                    outlined
                    @click="addTags(tag)"
                  >
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
                  @click="onUpdateUser"
                  color="#69F0AE"
                >Update</v-btn>
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
                <v-select :items="top" v-model="options.top[0]" outlined dense label="Top"></v-select>

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

                <v-select :items="eyes" outlined dense label="Eyes" v-model="options.eyes[0]"></v-select>

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
                 <v-btn class="button margin-right" color="#69F0AE" @click="generate()">Generate</v-btn>
                 
                 <v-btn class="button" color="#69F0AE" @click="onUpdateUser()">Update</v-btn>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <div v-if="changePassword" class="content">
      <div class="body">
        <div class="header">Change Password</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { http } from "@/axios"
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-avataaars-sprites';

export default {
  data() {
    return {
      changeProfile: true,
      changePassword: false,
      changeImage: false,
      valid: true,
      activeTags: [],
      profileImg: "",
      name: "",
      contactNumber: "",
      tab: "Profile",
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
      contactNumberRules: [
        v => !v || /^(0|[1-9][0-9]*)$/.test(v) || "Numbers Only",
        v =>
          !v || (v && v.length == 8) || "Contact Number must be 8 digits (SG)"
      ],
      tabs: [
        { id: 1, name: "Profile" },
        { id: 2, name: "Avatar" },
        { id: 3, name: "Password" },
      ],
      tags: [
        "Business",
        "Leadership and Management",
        "Marketing",
        "Accounting",
        "Business Strategy",
        "Arts",
        "Shopping",
        "Art",
        "Finance",
        "Information Technology",
        "Economics",
        "Mechanical Engineering",
        "Chemistry",
        "Physics",
        "Electrical Engineering",
        "Biology",
        "Programming",
        "Computer Science",
        "Math",
      ],
      top: [
        "longHair",
        "shortHair",
        "hat",
        "hijab",
        "turban"
      ],
      hatColor: [
        "black",
        "blue",
        "gray",
        "heather",
        "pastel",
        "pink",
        "red",
        "white"
      ],
      hairColor: [
        "auburn",
        "black",
        "blonde",
        "brown",
        "pastel",
        "platinum",
        "red",
        "gray"
      ],
      accessories: [
        "none",
        "kurt",
        "prescription01",
        "prescription02",
        "round",
        "sunglasses",
        "wayfarers"
      ],
      facialHair: [
        "none",
        "medium",
        "light",
        "majestic",
        "fancy",
        "magnum"
      ],
      facialHairColor: [
        "auburn",
        "black",
        "blonde",
        "brown",
        "platinum",
        "red"
      ],
      clothes: [
        "blazer",
        "sweater",
        "shirt",
        "hoodie",
        "overall"
      ],
      clothesColor: [
        "black",
        "blue",
        "gray",
        "heather",
        "pastel",
        "pink",
        "red",
        "white"
      ],
      eyes: [
        "close", 
        "cry", 
        "default", 
        "dizzy", 
        "roll", 
        "happy", 
        "hearts", 
        "side", 
        "squint", 
        "surprised", 
        "wink", 
        "winkWacky"
      ],
      eyebrow: [
        "angry", "default", "flat", "raised", "sad", "unibrow", "up"
      ],
      mouth: [
        "concerned", "default", "disbelief", "eating", "grimace", "sad", "scream", "serious", "smile", "tongue", "twinkle", "vomit"
      ],
      skin: [
        "tanned", "yellow", "pale", "light", "brown", "darkBrown", "black"
      ],
      options: {
        width: '650px',
        height: '450px',
        style: 'circle',
        top: ['longHair'],
        hatColor: ['black'],
        hairColor: ['auburn'],
        accessories: ['none'],
        facialHair: ['none'],
        facialHairColor: ['auburn'],
        clothes: ['blazer'],
        clothesColor: ['black'],
        eyes: ['default'],
        eyebrow:['default'],
        mouth: ['default'],
        skin: ['tanned'],
        background: '#EFEFEF',
        accessoriesChance: 100,
        facialHairChance: 100
      }
    }
  },
  mounted() {},
  methods: {
    generate() {
      let avatars = new Avatars(sprites, this.options);
      let svg = avatars.create();
      let d= document.getElementById('avatarImg')
      d.innerHTML = ''
      d.innerHTML = svg
      this.profileImg = svg
    },
    select(id) {
      if (id == 1) {
        this.changeProfile = true,
        this.changeImage = false,
        this.changePassword = false
      } else if (id == 2) {
        this.changeProfile = false,
        this.changeImage = true,
        this.changePassword = false
        setTimeout(function() {
            this.generate()
        },500)
        
      } else {
        this.changeProfile = false,
        this.changeImage = false,
        this.changePassword = true
      }
    },
    onUpdateUser() {

    }
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
  margin: auto;
}

#main h1 {
  font-family: "DarkerGrotesque-Medium";
  font-size: 42px;
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
  font-size: 42px;
  color: #0d47a1;
  margin-bottom: 2%;
}

.inputRow h3 {
    font-family: "DarkerGrotesque-Medium";
    font-size: 28px;
}

.chipSheet {
    width: 50%;
}

.btnRow {
  margin: 1%;
}

.button {
  font-family: "DarkerGrotesque-Medium";
  text-transform: none;
  line-height: 1;
  font-size: 26px;
  text-align: center;
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
</style>