<template>
  <v-app>
    <div>
      <v-app-bar color="primary" dense dark fixed>
        <v-toolbar-title>Restaurant</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" persistent scrollable max-width="400">
          <template v-slot:activator="{ on }">
            <v-btn tile class="ma-2" color="primary" depressed v-on="on">Panier({{panier.length}})</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">Ton Panier:</v-card-title>
            <v-card-text>
              <span v-if="panier.length == 0">Aucun plat ajouté</span>
              <v-list>
                <v-list-item v-for="(item, index) in panier" :key="index">
                  <v-list-item-icon>
                    <v-icon color="red" @click="panier.splice(index,1)">mdi-close-circle</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-avatar>{{item.price}} EUR</v-list-item-avatar>
                </v-list-item>

                <v-divider v-if="panier.length != 0" inset></v-divider>
                <v-list-item v-if="panier.length != 0">
                  <v-list-item-content>Total :</v-list-item-content>
                  <v-list-item-avatar>{{totalPanier}} EUR</v-list-item-avatar>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" v-if="panier.length != 0" text @click="panier = []; dialog = false">Tout Supprimer</v-btn>
              <v-btn color="green darken-1" text @click="dialog = false" >Fermer</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-app-bar>
    </div>

    <div class="grey lighten-4 px-12 py-4 mt-12">
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
          <v-card height="45%">
            <v-card-text>
              <div>Rating :</div>
              <v-rating v-model="rating" readonly></v-rating>
              <div>Description:</div>
              <div class="text--primary">{{restaurant.description}}</div>
            </v-card-text>
          </v-card>
          <v-card class="mt-3 pa-3" height="45%">
            <RestaurantMap :centerMap="centerMap" width="100%" height="200px"></RestaurantMap>
          </v-card>
        </v-col>
      </v-row>
      <div class="mt-10 display-1 font-weight-bold">Nos Menus:</div>
      <v-row>
          <v-col
          v-for="(menu,index) in restaurant.menus"
          :key="index"
          cols="4"
          v-show="index > 5 ? !plus : true"
        >
          <v-card outlined tile>
            <v-card-title class="headline pa-4">{{menu.name}}</v-card-title>
            <v-card-subtitle>{{menu.price}} EUR</v-card-subtitle>
            <v-card-text>
              Les plats inclus :
            </v-card-text>
            <v-chip-group class="mt-2 mb-4">
              <v-chip class="text-white" v-for="(plat,index) in menu.plats" :key="index">
                {{plat}}
              </v-chip>
            </v-chip-group>
            <v-row align="end" justify="end" class="mx-4 mb-4" @click="panier.push(menu)">
              <v-btn color="primary" depressed small>Ajouter</v-btn>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <div class="mt-10 display-1 font-weight-bold">Nos Plats:</div>
      <v-row>
        <v-col
          v-for="(plat,index) in restaurant.plats"
          :key="index"
          cols="3"
          v-show="index > 5 ? !plus : true"
        >
          <v-card outlined tile>
            <v-img src="@/assets/plats/plat-1.jpg" height="125" class="grey darken-4"></v-img>
            <v-card-title class="headline pb-2">{{plat.name}}</v-card-title>
            <v-card-text class="text--primary">
              <v-chip-group>
                <v-chip class="text-white">{{plat.price}} EUR</v-chip>
                <v-chip color="primary" class="white--text">{{plat.type}}</v-chip>
              </v-chip-group>
              {{plat.description}}
            </v-card-text>
            <v-row align="end" justify="end" class="mx-4 mb-4" @click="panier.push(plat)">
              <v-btn color="primary" depressed small>Ajouter</v-btn>
            </v-row>
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
import RestaurantMap from "../components/RestaurantMap.vue";

export default {
  name: "Restaurant",
  components: {
    RestaurantMap
  },
  data() {
    return {
      url: "https://ancient-reaches-45100.herokuapp.com/api/restaurants/",
      dialog: false,
      rating: 0,
      plus: true,
      panier: [],
      restaurant: {
        address: {}
      },
      centerMap: { lat: 0, lng: 0 }
    };
  },
  computed: {
    totalPanier() {
      if (this.panier.length > 0) {
        var sum = 0;
        this.panier.forEach(plat => (sum = sum + plat.price));
        return sum;
      }
      return 0;
    }
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