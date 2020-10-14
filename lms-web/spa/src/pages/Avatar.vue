<template>
    <v-container>
        <div class="container">
            <v-icon id="here">
                
            </v-icon>
        </div>
         <v-btn @click="generate()">Avatar</v-btn>
    </v-container>
   
</template>

<script>
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-avataaars-sprites';

export default {
  data() {
    return {
        image: '',
    }
  },
  created() {},
  computed: {
    loading() {
      return this.$store.getters.loading
    },
  },
  async mounted() {
  },
  methods: {
      generate() {
            let options = {
                width: '200px',
                height: '200px',
                style: 'circle',
                top: [ 'hat'],
                hatColor: ['pink'],
                hairColor: ['auburn'],
                accessories: [],
                facialHair: [],
                facialHairColor: [],
                clothes: [],
                clothesColor: [],
                eyes: [],
                eyebrow:[],
                mouth: [],
                skin: ['tanned'],
                background: '#EFEFEF'


            };
            let avatars = new Avatars(sprites, options);
            let svg = avatars.create();
            let d= document.getElementById('here')
            d.innerHTML = ''
            d.innerHTML = svg
            
      }
  },
}
</script>

<style scooped>
.container {
    width: 60%;
    margin: auto;
    border: 1px solid black;
    height: 400px;
}

</style>