window.onload=init;

function init() {
    new Vue({
        el: "#app",
        data: {
            url: 'http://localhost:8080/api/restaurants',
            restaurants: [],
            nom: '',
            cuisine: '',
            count: 0,
            page: 1,
            pagesize :10,
            recherche: '',
            nbPage:0
        },
        mounted () {
            console.log("AVANT RENDU HTML");
            this.getRestaurantsFromServer(this.page,10);
        },
        methods: {
            getRestaurantsFromServer() {
                let getUrl = this.url + '?page=' + this.page + '&pagesize='+this.pagesize+'&name='+this.recherche;
                fetch(getUrl, {
                    method: 'get'
                }).then(response => {
                    return response.json();
                }).then(json => {
                    this.restaurants = json.data;
                    this.count = json.count;
                    this.nbPage = Math.floor(this.count/this.pagesize)
                }).catch(err => {
                    console.log('[ERROR] '+ err);
                });
            },
            supprimerRestaurant(id) {
                event.preventDefault();

                let url = this.url + '/' + id;
                fetch(url, {
                    method: 'delete'
                }).then(function(response){
                    return response.json();
                }).then(function(json){
                    console.log(json.msg);
                }).catch(function(err){
                    console.log('[ERROR] '+ err);
                });

                this.getRestaurantsFromServer();
            },
            ajouterRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();
                let restaurant = new FormData()
                restaurant.append('nom',this.nom);
                restaurant.append('cuisine',this.cuisine);
                this.nom = "";
                this.cuisine = "";

                fetch(this.url, {
                    method: 'post',
                    body : restaurant
                }).then(function(response){
                    return response.json();
                }).then(function(json){
                    console.log(json.msg);
                }).catch(function(err){
                    console.log('[ERROR] '+ err);
                });
            },
            getColor(index) {
                return (index % 2) ? 'lightBlue' : 'pink';
            },
            nextPage(){
                this.page++;
                this.getRestaurantsFromServer();
            },
            prevPage(){
                this.page--; 
                this.getRestaurantsFromServer();
            },
            lastPage(){
                this.page = this.nbPage;
                this.getRestaurantsFromServer();
            }
        }
    })
}
