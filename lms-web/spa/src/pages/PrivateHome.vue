<template>
  <v-container fluid class="mainBody">
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <!-- Banner -->
    <v-container class="bannerContainer">
      <v-carousel
        cycle
        height="400"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item
          v-for="(item, i) in slides"
          :key="i"
          :src="item.src"
        ></v-carousel-item>
      </v-carousel>
    </v-container>

    <div class="tempBox"></div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      slides: [
          {
            src: '/img/carousell-1.png',
          },
          {
            src: '/img/carousell-2.png',
          },
          {
            src: '/img/carousell-3.png',
          },
          {
            src: '/img/carousell-4.png',
          },
        ],
    }
  },
  created() {},
  mounted() {
    this.$store.commit("setLayout", "layout-private")
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    loading() {
      return this.$store.getters.loading
    },
  },
  methods: {},
}
</script>

<style scoped>
.mainBody {
  width: 90%;
  margin: auto;
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

.tempBox {
  border: 1px solid black;
  height: 700px;
}
</style>
