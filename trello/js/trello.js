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

class cardList{
    constructor(){
        this.users=[];
        this.cards=[];
        this.color="#1976D2";
        this.name="unnamed list";
    }

    set name(newName){
        this._name=newName;
    }

    get name(){
        return this._name;
    }

    set color(c){
        this._color=c;
    }

    get color(){
        return this._color;
    }

    addCard(cardName){
        this.cards.push(cardName);
    }

    removeCard(cardName){
        index = this.cards.indexOf(cardName);
        if(index > -1){
            this.cards.splice(index, 1);
        }
    }

    addUser(username){
        this.cards.push(username);
    }

    removeUser(username){
        index = this.users.indexOf(username);
        if(index > -1){
            this.users.splice(index, 1);
        }
    }
}

class card{
    constructor(){
        this.name="unnamed card";
        this.created = this.dateCreated();
    }

    set name(newName){
        this._name=newName;
    }

    get name(){
        return this._name;
    }

    get created(){
        return this._created;
    }

    dateCreated(){
        d = new Date();
        return d.getDate() + " " + d.getMonth() + " " + d.getUTCFullYear() + " " + d.getHours() + ":" + d.getMinutes();
    }
}

class user{
    constructor(name, email, password){
        this.name=name;
        this.email=email;
        this.password=password;

        this.boards = [];
    }

    addBoard(board){
        boards.push(board);
    }

    removeBoard(board){
        index = this.boards.indexOf(board);
        if(index > -1){
            this.boards.splice(index, 1);
        }
    }
}


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

        boards:[],
        lists:[],
        cards:[]
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
            this.loggedIn=false;
            this.username='';
            this.password='';
            this.name='';
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