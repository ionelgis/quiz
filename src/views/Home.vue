<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>

    <div class="row">
        

      <div class="col-md-8 mx-auto">

        <button class="btn btn-primary" @click="getCountries" type="button">Get countries</button>
      </div>
      <div class="mt-5">
        <p v-for="(region, index) in regions" :key="index">
            <button class="btn btn-primary"  @click="getCountriesInRegion(region)" type="button">Get countries in {{region}}</button>
        </p>
        
      </div>
    </div>
  </div>



</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
// import axios from "axios";
import { db } from "../helpers/firebase.service.js";
export default {
  name: "home",
  data() {
    return {
      regions: undefined
    };
  },
  components: {
    HelloWorld
  },
  methods: {
    getCountries: function() {
      //GET RANDOM COUNTRY IN WORLD
      // db.ref("countries/allIds").on("value", item => {
      //   const allIds = item.val();
      //   const randomItem = getRandomItemFromArray(allIds.split(","));
      //   db.ref(`countries/${randomItem}`).on("value", snap =>
      //     console.log(snap.val())
      //   );
      // });
      this.getRegions();
    },
    getRegions: function() {
      db.ref("countries/regionsList").on("value", snap => {
        this.regions = snap.val();
      });
    },

    getCountriesInRegion: function(region) {
      db.ref("countries")
        .orderByChild("region")
        .equalTo(region)
        .on("value", snap => console.log(snap.val()));
    }
  }
};
</script>
