<template>
  <v-app>
    <div class="grey lighten-4 px-12 py-4">
      <span class="d-block display-1 font-weight-bold">{{restaurant.name}}</span>
      <span class="d-block display-1 font-weight-regular">Cuisine : {{restaurant.cuisine}}</span>

      <div class="d-flex lign-center">
        <div>
          <v-icon class="primary--text">mdi-map-marker</v-icon>
        </div>
        <span
          class="subtitle-1 d-block pl-1"
        >Batiment : {{restaurant.address.building}}, {{restaurant.address.street}}, {{restaurant.address.zipcode}}</span>
      </div>
    </div>

    <v-container class="px-0 py-4">
      <v-row no-gutters>
        <v-col cols="8">
          <v-carousel>
            <v-carousel-item
              src="@/assets/restaurants/restaurant-1.jpg"
              reverse-transition="fade-transition"
              transition="fade-transition"
            ></v-carousel-item>
            <v-carousel-item
              src="@/assets/restaurants/restaurant-2.jpg"
              reverse-transition="fade-transition"
              transition="fade-transition"
            ></v-carousel-item>
            <v-carousel-item
              src="@/assets/restaurants/restaurant-3.jpg"
              reverse-transition="fade-transition"
              transition="fade-transition"
            ></v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col class="pl-2" height="100%">
          <v-card height="45%" >
            <v-card-text>
              <div>Rating :</div>
              <v-rating v-model="rating" readonly></v-rating>
              <div>Description:</div>
              <div class="text--primary">{{restaurant.description}}</div>
            </v-card-text>
          </v-card>
          <v-card class="mt-3 pa-3" height="45%">
            <GmapMap
              :center="centerMap"
              :zoom="15"
              map-type-id="roadmap"
              style="width: 100%; height: 200px"
            >
              <GmapMarker :position="centerMap" :clickable="true" :draggable="true" />
            </GmapMap>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="(plat,index) in restaurant.plats"
          :key="index"
          cols="3"
          v-show="index > 5 ? !plus : true"
        >
          <v-card outlined tile>
            <v-img src="https://picsum.photos/350/165?random" height="125" class="grey darken-4"></v-img>
            <v-card-title class="headline">{{plat.name}}</v-card-title>
            <v-card-subtitle>{{plat.description}}</v-card-subtitle>
          </v-card>
        </v-col>
        <v-col v-show="plus" cols="3" @click="plus = false">
          <v-card class="pa-2 d-flex align-center justify-center" outlined tile height="100%">
            <div>
              <v-icon class="display-3">mdi-plus</v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "Restaurant",
  data() {
    return {
      url: "http://localhost:8080/api/restaurants/",
      rating: 0,
      plus: true,
      restaurant: {
        address: {}
      },
      centerMap: { lat: 0, lng: 0 }
    };
  },
  watch: {
    "restaurant.grades": function(grades) {
      this.rating = 0;
      if (grades.length > 0) {
        var sum = 0;
        grades.forEach(grade => {
          sum = sum + grade.score;
        });

        this.rating = sum / grades.length;
      }
    }
  },
  mounted() {
    this.getRestaurantFromServer();
  },
  methods: {
    getRestaurantFromServer() {
      fetch(this.url + this.$route.params.id, { method: "get" })
        .then(response => {
          return response.json();
        })
        .then(json => {
          console.log(json);
          this.restaurant = json.restaurant;
          this.centerMap.lat = 43.5905761;
          this.centerMap.lng = 7.1153522;
        });
    }
  }
};
</script>