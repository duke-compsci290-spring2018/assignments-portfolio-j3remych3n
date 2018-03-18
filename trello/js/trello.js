/*
 * Author: Jeremy Chen (jc587)
 * JavaScript for Trello clone for CS 290
 *
 * All assets owned and created by Jeremy Chen
 */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDDCvHJPmWamvJs28T6X8WC0SdwasoT78o",
    authDomain: "vue-trello-e759d.firebaseapp.com",
    databaseURL: "https://vue-trello-e759d.firebaseio.com",
    projectId: "vue-trello-e759d",
    storageBucket: "vue-trello-e759d.appspot.com",
    messagingSenderId: "78034298118"
};

var db = firebase.initializeApp(config).database();
var storageRef = firebase.storage().ref();
var usersRef = db.ref('users');
var cardsRef = db.ref('cards');
var listsRef = db.ref('lists');
var boardsRef = db.ref('boards');
var imagesRef = db.ref('images');
var activityRef = db.ref('activity');

Vue.use(VueFire);

class cardList{
    constructor(board){
        this.parent=board;
        this.myName="unnamed list";
        this.isHidden=false;
        this.created = new Date().toDateString() + " " + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds();
        this.beingNamed = false;
        this.id="list"+ parseInt(Math.random()*parseInt(Date.now()))+this.created;
    }
}

class card{
    constructor(list){
        this.parent = list;
        this.category = "";
        this.myName="unnamed card";
        this.created = new Date().toDateString();
        this.longcreated = this.created + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
        this.id="card"+parseInt(Math.random()*parseInt(Date.now()))+this.longcreated;
        this.description="Add a description";
        this.deadline = "Add a deadline";
        this.beingNamed = false;
        this.describing = false;
        this.todoing = false;
        this.commenting = false;
    }
}

class todo{
    constructor(card){
        this.task = "";
        this.longcreated = new Date().toDateString(); + " at " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
        this.id="card"+parseInt(Math.random()*parseInt(Date.now()))+this.longcreated;
        this.done = false;
    }
}

class user{
    constructor(name, email, password, imgUrl){
        this.longcreated = new Date().toDateString(); + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
        this.id="card"+parseInt(Math.random()*parseInt(Date.now()))+this.longcreated;
        this.myName=name;
        this.avatar = imgUrl;
        this.email=email;
        this.password=password;
    }
}

class board{
    constructor(){
        this.name = '';
        this.longcreated = new Date().toDateString() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
        this.id="card"+parseInt(Math.random()*parseInt(Date.now()))+this.longcreated;
        this.starred = false;
        this.backGround = "";
    }
}


var notTrello = new Vue({
    el: "#notTrello",
    data: {
        inusername: "",
        inpassword: "",
        inname: "",
        inavatar: "a",

        currentUser: "",
        currentBoard: "temp",
        currListName: "",
        currCardName: "",
        currCardDescription: "",
        currCardDeadline: "",

        namedialog:false,
        userdialog:false,
        picdialog:false,
        backdialog:false,

        invalidInput: false,
        login: false,
        signup: false,
        loggedIn: false,
        pwInvisible: true,

        colors: ["red lighten-1", "deep-purple darken-2", "indigo darken-2", "teal darken-1", "blue-grey darken-2"],
        colorDict: {"red lighten-1": "#EF5350",
            "deep-purple darken-2": "#512DA8",
            "indigo darken-2": "#303F9F",
            "teal darken-1": "#00897B",
            "blue-grey darken-2": "#455A64"}
    },
    firebase: {
        users: usersRef,
        lists: listsRef,
        cards: cardsRef,
        boards: boardsRef,
        images: imagesRef
    },
    watch: {
    },
    computed: {

    },
    methods: {
        activity_add: function(text){
            var time = new Date().toDateString() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
            var name = "";
            var parent = this;
            usersRef.once('value').then(function(snapshot) {
                name = snapshot.child(parent.currentUser).child("myName").val();
            }).then(function(){
                var str = text + " by " + name + " on " + time;
                console.log("ACTIVITY " + str);
                activityRef.push(str);
            });
        },

        addNewImage (u, url) {
            imagesRef.push({
                title: u,
                url: url
            });
            u.avatar=url;
        },

        changeImage(u, url) {
            var updates = {};
            return imagesRef.once('value').then(function(snapshot) {
                try{
                    snapshot.forEach(function(img){
                        console.log(img);
                        console.log(img.key);
                        if(img.child('title').val()==u){
                            updates['/' + img.key + '/url'] = url;
                            throw updates;
                        }
                    })} catch(e){
                    imagesRef.update(updates);
                }
            });
        },
        board_lists: function(){
            return this.lists.filter(list => list.parent === this.currentBoard);
        },

        board_changeImage(currentBoard){
            // make image and color changes persistent?
            this.backdialog=false;
        },

        card_getCards: function (ls, category){
            // TODO change category code
            return this.cards.filter(card => card.parent === ls.id && card.category == category);
        },

        card_addNew: function(ls){
            cardsRef.push(new card(ls.id)).then((data, err) => { if (err) {console.log(err)}});
            this.activity_add("New card created");
        },

        card_delete: function(card){
            cardsRef.child(card['.key']).remove();
            this.activity_add("Card named " + card.myName + " deleted");
            index = this.cards.indexOf(card);
            if(index > -1){
                this.cards.splice(index, 1);
            }
        },

        card_moveRight(card, list, lists){
            var i = lists.indexOf(list);
            if(i<lists.length - 1){
                var j = i + 1;
                this.card_move(card, lists[j]);
            }
        },

        card_moveLeft(card, list, lists){
            var i = lists.indexOf(list);
            if(i > 0){
                var j = i - 1;
                this.card_move(card, lists[j]);
            }
        },

        card_move(card, list){
            this.activity_add("Card named " + card.myName + " moved to list named " + list.myName);
            updates = {};
            updates['/' + card['.key'] + "/parent"] = list.id;
            cardsRef.update(updates);
            notTrello.$forceUpdate();
        },

        card_rename(card){
            console.log(card.beingNamed);
            card.beingNamed = !card.beingNamed;
            console.log(card.beingNamed);

            if(!card.beingNamed){
                this.activity_add("Card named " + card.myName + " renamed to " + this.currCardName);
                card.myName = this.currCardName;
                var update = {};
                update['/' + card['.key'] + "/myName"] = this.currCardName;
                cardsRef.update(update);
                this.currCardName = "";
                // notTrello.$forceUpdate();
            }
        },

        card_describe(card) {
            console.log(card.describing);
            card.describing = !card.describing;
            console.log(card.describing);

            if(!card.describing){
                card.description = this.currCardDescription;
                var update = {};
                update['/' + card['.key'] + "/description"] = this.currCardDescription;
                this.activity_add("Description of card " + card.myName + " changed/added");
                cardsRef.update(update);
            }
        },

        card_deadline(card) {
            if(this.currCardDeadline != ""){
                card.deadline= this.currCardDeadline;
                var update = {};
                update['/' + card['.key'] + "/deadline"] = this.currCardDeadline;
                cardsRef.update(update);
                this.activity_add("Deadline " + this.currCardDeadline + " added to card named " + card.myName);
                this.currCardDeadline="";
            }
        },

        list_swapLeft: function(list, lists){
            var i = lists.indexOf(list);
            if (i > 0) {
                var j = i - 1;
                this.list_swap(list, lists[j]);
            }
        },

        list_swapRight: function (list, lists) {
            var i = lists.indexOf(list);
            if (i < lists.length - 1) {
                var j = i + 1;
                this.list_swap(list, lists[j]);
            }
        },

        list_swap: function (list1, list2){
            var key1 = list1['.key'];
            var key2 = list2['.key'];

            listsRef.child(key1).update({
                created : list2.created,
                id : list2.id,
                myName : list2.myName
            });
            listsRef.child(key2).update({
                created : list1.created,
                id : list1.id,
                myName : list1.myName
            });
            notTrello.$forceUpdate();
        },

        list_addNew: function(board){
            listsRef.push(new cardList(board)).then((data, err) => { if (err) {console.log(err)}});
            this.activity_add("New list created");
        },

        list_rename: function(list) {
            console.log(list.beingNamed);
            list.beingNamed = !list.beingNamed;
            console.log(list.beingNamed);

            if(!list.beingNamed){
                this.activity_add("List named " + list.myName + " renamed to " + this.currListName);
                list.myName = this.currListName;
                var update = {};

                update['/' + list['.key'] + "/myName"] = this.currListName;
                listsRef.update(update);
                this.currListName = "";
                notTrello.$forceUpdate();
            }
        },

        list_toggleVis: function(ls){
            ls.isHidden = !ls.isHidden;
        },
        // TODO remove children
        list_delete: function(ls){
            listsRef.child(ls['.key']).remove();

            index = this.lists.indexOf(ls);
            if(index > -1){
                this.lists.splice(index, 1);
            }
            this.activity_add("List named " + ls.myName + "removed");
        },

        user_changeName: function(user, newName) {
            this.namedialog=false;
            var updates = {};
            updates['/' + user + '/' + "myName"] = newName;
            usersRef.update(updates);
        },

        user_changeEmail: function(user, newEmail) {
            this.userdialog=false;
            var updates = {};
            updates['/' + user + '/' + "email"] = newEmail;
            usersRef.update(updates);
        },

        user_exists: function(){
            var parent = this;
            return usersRef.once('value').then(function(snapshot) {
                var ret = false;
                snapshot.forEach(function(u){
                    if(u.child('email').val()==parent.inusername){
                        ret = true;
                    }
                })
                return ret;
            });
        },

        user_getImage: function() {
            var url = "resources/low res andy.jpg";
            console.log(this.currentUser);
            var a = this.currentUser;
            db.ref('users/' + this.currentUser).once('value', function (snapshot) {
                   url = snapshot.val().avatar;
            });
            return url;
        },

        user_changeImage(userID){
            console.log("THIS IS BEING CALLED");
            this.picdialog = false;
            var input = document.getElementById('files1');
            var parent = this;
            var updates = {}
            if(input.files.length>0){
                var file = input.files[0];
                storageRef.child('images/' + file.name)
                    .put(file)
                    .then(function(snapshot){
                        parent.changeImage(parent.currentUser, snapshot.downloadURL);
                        updates['/' + parent.currentUser + "/avatar"] = snapshot.downloadURL;
                        usersRef.update(updates);
                        console.log(snapshot.downloadURL);
                        parent.user_successLogIn();
                        notTrello.$forceUpdate();
                    })
            }
        },

        newImgClick: function(){
            this.$refs.newImgButton.click();
        },

        changeImgClick: function(){
            this.$refs.changeImgButton.click();
        },

        changeBkClick: function(){
            this.$refs.changeBkButton.click();
        },

        user_makeNew: function(){
            var parent = this;
            var input = document.getElementById('files');
            var imgUrl = "";
            var u = new user(this.inname, this.inusername, this.inpassword, 'temp');
            var updates = {};
            usersRef.push(u);
            usersRef.once('value').then(function(snapshot) {
                snapshot.forEach(function(u){
                    if(u.child('email').val()==parent.inusername && u.child('password').val()==parent.inpassword) {
                        parent.currentUser = u.key;
                        if(input.files.length>0){
                            var file = input.files[0];
                            storageRef.child('images/' + file.name)
                                .put(file)
                                .then(function(snapshot){
                                    parent.addNewImage(u.key, snapshot.downloadURL);
                                    updates['/' + u.key + "/avatar"] = snapshot.downloadURL;
                                    usersRef.update(updates);
                                    parent.logOut();
                                    parent.user_successLogIn();
                                })
                        }
                    }
                })

            });
            console.log("added new user: " + this.currentUser);
        },

        user_existsValidate: function(curuser, login, loggedin, invalid) {
            var logIn = function(){this.user_successLogIn()};
            var us = this.inusername;
            var pw = this.inpassword;
            var parent = this;
            return usersRef.once('value').then(function(snapshot) {
                var b = false;
                snapshot.forEach(function(u){
                    if(u.child('email').val()==us && u.child('password').val()==pw) {
                        b = true;
                        console.log(u.key);
                        parent.currentUser = u.key;
                    }
                })
                return b;
            });
        },

        user_successLogIn: function(){
            this.login = false;
            this.loggedIn = true;
            this.invalidInput = false;
        },

        changeColor: function(color){
            console.log("previous " + document.getElementById("gradBackground").style.background);
            console.log("tried changing to " + color);
            document.getElementById("gradBackground").style.background = this.colorDict[color];
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
            this.inusername='';
            this.inpassword='';
            this.inname='';
        },
        closeLogin: function() {
            this.user_getImage();
            this.logOut();
            this.invalidInput = false;
            this.login=false;
        },
        closeSignup: function() {
            this.logOut();
            this.invalidInput = false;
            this.signup=false;
        },
        enterLogin: function () {
            var parent = this;
            console.log("Attempted login with username: " + this.inusername + ", and password: "+ this.inpassword);
            this.user_existsValidate().then(function(ret) {
                console.log("final : " + ret)
                if(ret){
                    parent.user_successLogIn();
                }
                else{
                    parent.invalidInput=true;
                }
            });
        },
        enterSignup: function (){
            console.log("Attempted signup with username: " + this.username + ", and password: "+ this.password);
            var parent = this;

            this.user_exists().then(function(ret) {
                console.log(ret);
                if (ret || (parent.inusername.length * parent.inname.length * parent.inpassword.length * parent.inavatar.length <= 0)) {
                    parent.invalidInput = true;
                }
                else{
                    parent.user_makeNew();
                }
            });

        },
    },
    directives: {}
})