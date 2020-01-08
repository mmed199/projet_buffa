<template>
  <v-app>
    <v-container>
      <v-data-table
        :headers="headers"
        :items="restaurants"
        :loading="loading"
        :options.sync="options"
        class="elevation-1 title ma-0"
      >
        <!-- <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Restaurants</v-toolbar-title>
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
        -->
        <template v-slot:item.action="{ item }">
          <v-icon small>delete</v-icon>
        </template>
      </v-data-table>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "restaurantsTable",
  data() {
    return {
      url: "http://localhost:8080/api/restaurants",
      options: {},
      headers: [
        { text: "Nom", value: "name", class: "title font-weight-black" },
        { text: "Cuisine", value: "cuisine", class: "title font-weight-black" }
      ],
      restaurants: [],
      loading: false,
      selection: 1,
      pagesize: 10,
      page: 1,
      count: 0
    };
  },
  watch: {
    options: {
      handler() {
        //this.page = this.options.page
        //this.getRestaurantsFromServer()
      },
      deep: true
    }
  },
  mounted() {
    console.log("AVANT RENDU HTML");
    this.getRestaurantsFromServer(this.page, 10);
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
          //this.count = json.count;
          //this.nbPage = Math.floor(this.count/this.pagesize)
          this.loading = false;
        })
        .catch(err => {
          console.log("[ERROR] " + err);
        });
    }
  }
};
</script>