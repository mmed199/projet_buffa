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
                    <span class="headline">Add</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container></v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="fermer">Cancel</v-btn>
                    <v-btn color="blue darken-1" text >Save</v-btn>
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
            <v-btn class="ma-2" color="lime darken-2">
              <v-icon color="white" >mdi-pencil</v-icon>
            </v-btn>
            <v-btn class="ma-2" color="red darken-2">
              <v-icon color="white" @click="supprimer(item._id)">mdi-delete</v-icon>
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
      url: "http://localhost:8080/api/restaurants",
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
  watch: {
    page: function() {
      this.getRestaurantsFromServer();
    }
  },
  mounted() {
    console.log("AVANT RENDU HTML");
    this.getRestaurantsFromServer();
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
    supprimer(id){
      fetch(this.url + "/" + id, { method: "DELETE" })
      .then(response => {
          return response.json();
        })
        .then(json => {
          console.log(json)
        })
        .catch(err => {
          console.log("[ERROR] " + err);
        });
    },
    fermer () {
        this.dialog = false
        setTimeout(() => {
          //this.editedItem = Object.assign({}, this.defaultItem)
          //this.editedIndex = -1
        }, 300)
      },
  }
};
</script>