import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify)

var app = new Vue({
    el: '#app',
    render: h => h(App),

})