<template>
  <v-app>
    <v-container>
      <v-card>
        <v-card-title>Les Restaurants</v-card-title>
        <v-data-table
          :headers="headers"
          :items="restaurants"
          :items-per-page="pagesize"
          :loading="loading"
          disable-items-per-page="true"
          class="elevation-1 title ma-0"
          :footer-props="footerProps"
          :server-items-length="count"
          :page.sync="page"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">Nouvelle Restaurants</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.name" label="Nom"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-text-field v-model="editedItem.cuisine" label="Cuisine"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="fermer">Fermer</v-btn>
                    <v-btn color="blue darken-1" text @click="enregistrer">Enregistrer</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-row no-gutters justify="end" v-if="$vuetify.breakpoint.smAndUp">
                <v-col sm="10" md="6">
                  <v-slider
                    thumb-label
                    step="5"
                    min="10"
                    max="100"
                    label="Page size"
                    v-model="pagesize"
                    class="mt-5"
                    @input="getRestaurantsFromServer"
                  ></v-slider>
                </v-col>
              </v-row>
            </v-toolbar>
            <v-divider></v-divider>
            <v-row no-gutters justify="end" v-if="!$vuetify.breakpoint.smAndUp">
              <v-col class="pa-4">
                <v-slider
                  thumb-label
                  step="5"
                  min="10"
                  max="100"
                  label="Page size"
                  v-model="pagesize"
                  class="mt-5"
                  @input="getRestaurantsFromServer"
                ></v-slider>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn class="ma-2" color="teal darken-2" :href="'restaurant/' + item._id">
              <v-icon color="white">mdi-plus-circle</v-icon>
            </v-btn>
            <v-btn class="ma-2" color="lime darken-2" @click="modifier(item)">
              <v-icon color="white">mdi-pencil</v-icon>
            </v-btn>
            <v-btn class="ma-2" color="red darken-2" @click="supprimer(item._id)">
              <v-icon color="white">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "restaurantsTable",
  data() {
    return {
      url: "https://ancient-reaches-45100.herokuapp.com/api/restaurants",
      headers: [
        { text: "Nom", value: "name", class: "title font-weight-black" },
        { text: "Cuisine", value: "cuisine", class: "title font-weight-black" },
        {
          text: "Actions",
          value: "action",
          sortable: false,
          class: "title font-weight-black"
        }
      ],
      dialog: false,
      editedItem: {
        id: -1,
        name: "",
        cuisine: ""
      },
      footerProps: {
        disableItemsPerPage: true,
        itemsperPageOptions: [0, 0],
        itemsPerPageText: ""
      },
      restaurants: [],
      loading: false,
      selection: 1,
      pagesize: 20,
      page: 1,
      count: 0
    };
  },

  mounted() {
    console.log("AVANT RENDU HTML");
    this.getRestaurantsFromServer();
  },

  watch: {
    page() {
      this.getRestaurantsFromServer();
    },
    dialog(val) {
      val || this.fermer();
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nouvelle restaurant"
        : "Modifier restaurant";
    }
  },

  methods: {
    getRestaurantsFromServer() {
      this.loading = true;
      let getUrl =
        this.url + "?page=" + this.page + "&pagesize=" + this.pagesize;

      setTimeout(() => {}, 1000);

      fetch(getUrl, {
        method: "get"
      })
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.restaurants = json.data;
          this.count = json.count;
          this.loading = false;
        })
        .catch(err => {
          console.log("[ERROR] " + err);
        });
    },
    supprimer(id) {
      if (
        confirm("vous etes sur que vous voulez supprimer cette restaurant?")
      ) {
        this.loading = true;
        fetch(this.url + "/" + id, { method: "DELETE" })
          .then(response => {
            return response.json();
          })
          .then(json => {
            console.log(json);
            this.getRestaurantsFromServer();
          })
          .catch(err => {
            console.log("[ERROR] " + err);
          });
      }
    },
    modifier(restaurant) {
      this.editedItem.name = restaurant.name;
      this.editedItem.cuisine = restaurant.cuisine;
      this.editedItem.id = restaurant._id;
      this.dialog = true;
    },
    fermer() {
      this.dialog = false;
      this.editedItem.name = "";
      this.editedItem.cuisine = "";
      this.editedItem.id = -1;
    },
    enregistrer() {
      let restaurant = new FormData();
      restaurant.append("nom", this.editedItem.name);
      restaurant.append("cuisine", this.editedItem.cuisine);
      let method = this.editedItem.id == -1 ? "POST" : "PUT";
      let params = this.editedItem.id == -1 ? "" : ("/" + this.editedItem.id) ;

      this.dialog = false;
      
      let self = this;
      self.loading = true;
      
      fetch(this.url + params, {
        method: method,
        body: restaurant
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
            console.log(json);
            self.getRestaurantsFromServer();
        })
        .catch(function(err) {
          console.log("[ERROR] " + err);
        });
        
    }
  }
};
</script>