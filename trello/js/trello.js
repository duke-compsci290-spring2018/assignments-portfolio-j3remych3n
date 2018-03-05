/*
 * Author: Jeremy Chen (jc587)
 * JavaScript for Trello clone for CS 290
 *
 * All assets (except image of trello logo, provided courtesy of Trello) owned and created by Jeremy Chen
 */

class cardList{
    constructor(){
        this.cards=[];
        this.name="unnamed list";
        this.hidden=true;
        this.created = new Date().toDateString() + " " + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds();
        this.naming = false;
        this.id="list"+ parseInt(Math.random()*parseInt(Date.now()))+this.created;
    }

    set name(newName){
        this._name=newName;
    }

    get cards(){
        return this._cards;
    }

    set cards(c){
        this._cards = c;
    }

    get naming(){
        return this._naming;
    }

    set naming(n){
        this._naming = n;
    }

    get name(){
        return this._name;
    }

    set hidden(h){
        this._hidden=h;
    }

    get hidden(){
        return this._hidden;
    }

    toggleVis(){
        this.hidden = !this.hidden;
    }

    set color(c){
        this._color=c;
    }

    get color(){
        return this._color;
    }

    rename(){
        this.naming = !this.naming;
    }

    addCard(cardID){
        this.cards.push(cardID);
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
        this.created = new Date().toDateString() + " " + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds();
        this.id="card"+parseInt(Math.random()*parseInt(Date.now()))+this.created;
        this.description="";
        this.naming = false;
    }

    set name(newName){
        this._name=newName;
    }

    set id(newid){
        this._id = newid;
    }

    get name(){
        return this._name;
    }

    get id(){
        return this._id;
    }

    get created(){
        return this._created;
    }

    rename(){
        this.naming = !(this.naming);
    }

    set naming(n){
        this._naming = n;
    }

    get naming(){
        return this._naming;
    }

    set created(c){
        this._created = c;
    }

    get description(){
        return this._description;
    }

    set description(d){
        this._description = d;
    }
}

class user{
    constructor(name, email, password){
        this.name=name;
        this.email=email;
        this.password=password;
        this.lists = [];
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

        currentUser: {},

        login: false,
        signup: false,
        loggedIn: false,
        pwInvisible: true,

        boards: [],
        lists: [],
        listIDs: [],
        boardIDs: [],
        cardIDs: [],
        cards: []
    },
    watch: {

    },
    computed: {

    },
    methods: {
        temptester: function() {
            console.log("hey");
        },
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
        profDropDown: function() {
          console.log("profile clicked");
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
        },
        shiftListLeft: function(ls){

        },
        shiftListRight: function(ls){

        },
        shiftCardLeft: function(ls){

        },
        shiftCardRight: function(ls){

        },
        deleteList: function(ls){
            index = this.lists.indexOf(ls);
            if(index > -1){
                this.lists.splice(index, 1);
            }
        },
        deleteCard: function(c, ls){
            index = this.cards.indexOf(c);
            if(index > -1){
                this.cards.splice(index, 1);
            }
            lindex = ls.cards.indexOf(c.id);
            if(lindex > -1){
                ls.cards.splice(lindex, 1);
            }
        },
        addNewCard: function(ls){
            var c = new card;
            this.cards.push(c);
            ls.addCard(c.id);
            this.cardIDs.push[c.id];
        },
        addList: function(){
            var cl = new cardList();
            this.lists.push(cl);
            this.listIDs.push[cl.id];
        }
    },
    directives: {}
})