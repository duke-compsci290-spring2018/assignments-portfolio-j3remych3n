/*
 * Author: Jeremy Chen (jc587)
 * JavaScript for Trello clone for CS 290
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
    el: "#board",
    data: {
        username: "",
        password: "",
        name: "",
        login: true,
        signup: false,
        pwInvisible: false
    },
    watch: {},
    computed: {},
    methods: {
        enterLogin: function () {
            console.log("Attempted login with username: " + this.username + ", and password: "+ this.password);
        }
    },
    directives: {}
})