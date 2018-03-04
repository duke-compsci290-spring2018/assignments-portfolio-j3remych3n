/*
 * Author: Jeremy Chen (jc587)
 * JavaScript for Trello clone for CS 290
 *
 * All assets (except image of trello logo, provided courtesy of Trello) owned and created by Jeremy Chen
 */

Vue.use(Vuetify, {
    theme: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
    }
})


var notTrello = new Vue({
    el: "#notTrello",
    data: {
        username: "",
        password: "",
        name: "",

        login: false,
        signup: false,
        loggedIn: false,
        pwInvisible: true,

        lists:[]
    },
    watch: {},
    computed: {},
    methods: {
        loadLogin: function(){
            this.signup=false;
            if(!this.loggedIn){
                this.login=true;
            }
        },
        loadSignup: function(){
            this.login=false;
            if(!this.loggedIn){
                this.signup=true;
            }
        },
        logOut: function() {
            console.log("logging out placeholder");
        },
        closeLogin: function() {
            this.login=false;
        },
        closeSignup: function() {
            this.signup=false;
        },
        enterLogin: function () {
            console.log("Attempted login with username: " + this.username + ", and password: "+ this.password);
            this.login = false;
            this.loggedIn = true;
        },
        enterSignup: function (){
            console.log("Attempted signup with username: " + this.username + ", and password: "+ this.password);
            this.signup = false;
            this.loggedIn = true;
        }
    },
    directives: {}
})