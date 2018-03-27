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

// firebase refs
var db = firebase.initializeApp(config).database();
var storageRef = firebase.storage().ref();
var usersRef = db.ref('users');
var cardsRef = db.ref('cards');
var commentsRef = db.ref('comments');
var listsRef = db.ref('lists');
var boardsRef = db.ref('boards');
var imagesRef = db.ref('images');
var activityRef = db.ref('activity');
var todosRef = db.ref('todos');
var categoryRef = db.ref('categories');
var attachRef = db.ref('attachments');

Vue.use(VueFire);

// class representing attached images on cards
class attachment{
    constructor(card, url){
        this.parent = card;
        this.image = url;
    }
}

// class representing a list of cards, uses date/name based id
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

// class representing trello card, uses date/name based id
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

// class representing category TODO
class category{
    constructor(n, c){
        this.name=n;
        this.color=c;
    }
}

// class represneting comment on a card
class comment{
    constructor(user, card, t){
        this.parent = card;
        this.text = t;
        this.userID = user;
    }
}

// class representing a todo on a card
class todo{
    constructor(card, text){
        this.task = text;
        this.parent = card;
        this.longcreated = new Date().toDateString(); + " at " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
        this.id="card"+parseInt(Math.random()*parseInt(Date.now()))+this.longcreated;
        this.done = false;
    }
}

// class representing a "user"
class user{
    constructor(name, email, password, imgUrl){
        this.longcreated = new Date().toDateString(); + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
        this.id="user"+parseInt(Math.random()*parseInt(Date.now()))+this.longcreated;
        this.myName=name;
        this.avatar = imgUrl;
        this.email=email;
        this.password=password;
    }
}

// class representing a project board
class board{
    constructor(n){
        this.name = n;
        this.longcreated = new Date().toDateString() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
        this.id="board"+parseInt(Math.random()*parseInt(Date.now()))+this.longcreated;
        this.starred = false;
        this.closed = false;
        this.background = "";
    }
}

// MAIN VUE APP
var notTrello = new Vue({
    el: "#notTrello",
    data: {
        // temp user login input vars; kept in memory for current user
        inusername: "",
        inpassword: "",
        inname: "",
        inavatar: "a",

        // more temp variables (I'M SORRY) for keeping track of fields while being edited
        currentUser: "",
        currentBoard: "temp",
        currListName: "",
        currCardName: "",
        currCardDescription: "",
        currCardComment:"",
        currCardDeadline: "",
        currCardTodo:"",
        currAttUrl:"",
        currCardId: "",
        currboardname: "",

        // toggle booleans for displaying certain elements during editing parts of the project
        namedialog:false,
        userdialog:false,
        picdialog:false,
        backdialog:false,
        activitydialog:false,
        attdialog: false,
        asdfdialog: false,
        boarddialog: false,

        // temp var for new board creation
        newBoardName: "",

        // board display logic/validation logic
        invalidInput: false,
        login: false,
        signup: false,
        loggedIn: false,
        pwInvisible: true,
        currimg: "",


        drawer: false,

        // baked in colors for user selection
        colors: ["red lighten-1", "deep-purple darken-2", "indigo darken-2", "teal darken-1", "blue-grey darken-2"],
        colorDict: {"red lighten-1": "#EF5350",
            "deep-purple darken-2": "#512DA8",
            "indigo darken-2": "#303F9F",
            "teal darken-1": "#00897B",
            "blue-grey darken-2": "#455A64"}
    },
    firebase: {
        // firebase refs
        users: usersRef,
        lists: listsRef,
        cards: cardsRef,
        boards: boardsRef,
        images: imagesRef,
        activity: activityRef,
        comments: commentsRef,
        todos: todosRef,
        categories: categoryRef,
        attachments: attachRef
    },
    watch: {
    },
    computed: {

    },
    methods: {

        setBoardColor: function(){
            var input = document.getElementById('pickcolor');
            console.log("YOLO SWAG " + input);
        },

        // adds a new board lol
        board_addNew: function(){
            this.boarddialog=false;
            var b = new board(this.newBoardName);
            boardsRef.push(b);
            this.currboardname = this.newBoardName;
            this.currentBoard = b.id;
            this.newBoardName = "";

        },

        // filters for starred boards
        board_starred: function(){
            return this.boards.filter(board => board.starred);
        },

        // filters for not starred & not archived boards
        board_normie: function(){
            console.log(this.boards);
            return this.boards.filter(board => !board.starred&&!board.closed);
        },

        // filters for archived project boards
        board_closed: function(){
            return this.boards.filter(board => board.closed);
        },

        // adds new activity/history entry
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

        // adds new attachment, contains image uploading logic as well
        attachment_addNew: function(card){
            var input = document.getElementById('card_attachments');
            var parent = this;
            // this.currCardID = card.id;
            console.log(input.files);
            if(input.files.length>0){
                console.log("PLS WORKD");
                var file = input.files[0];
                storageRef.child('images/' + file.name)
                    .put(file)
                    .then(function(snapshot){
                        parent.genAddNewImage(file.name+parent.currCardId + "_att", snapshot.downloadURL);
                        var a = new attachment(parent.currCardId, snapshot.downloadURL);
                        attachRef.push(a);
                    });
            }
            this.attdialog=false;
            // notTrello.$forceUpdate();
        },

        // adds a todo to a card (& to db)
        todo_addNew(card){
            todosRef.push(new todo(card.id, this.currCardTodo));
            card.todoing=false;
            this.currCardTodo="";
            this.activity_add("Todo addded to card named " + card.myName);
        },

        // a toggle that will display an attachment in a modal
        asdftoggle(img){
            this.currimg = img.image;
            this.asdfdialog = !this.asdfdialog;
        },

        // Checks off a todo as done when user clicked, stores to db as well
        todo_check(todo){
            var updates = {};
            updates['/' + todo['.key'] + '/done'] = !todo.done;
            todo.done = !todo.done;
            todosRef.update(updates);
            this.activity_add("Todo checked/unchecked on todo with task " + todo.task);
        },

        // deletes a todo from a card
        todo_delete(todo){
            todosRef.child(todo['.key']).remove();
            this.activity_add("Todo with text " + todo.task + " removed");
            var index = this.todos.indexOf(todo);
            if(index > -1){
                this.todos.splice(index, 1);
            }
        },

        // deletes a comment from a card
        comment_delete(comment){
            commentsRef.child(comment['.key']).remove();
            this.activity_add("Comment with text " + comment.text + " removed");
            var index = this.comments.indexOf(comment);
            if(index > -1){
                this.comments.splice(index, 1);
            }
        },

        // checks if a card is categorized or not
        card_hasCategory(card){
            return card.category!=="";
        },

        // gett for card category
        card_getCategory(card){
            return card.category;
        },

        // get all the comments that belong to a card, given a card id
        card_comments(card){
            return this.comments.filter(comment => comment.parent === card.id);
        },

        // gets all the todos from a card, given an id
        card_todos(card){
            return this.todos.filter(todo => todo.parent === card.id);
        },

        // retrieves attachments bound to a card, based off of a given card id
        card_atts(card){
            // return this.attachments;
            return this.attachments.filter(att => att.parent == card.id);
        },

        // dumb method to toggle my "commenting" boolean on a card
        card_startStopCommenting(card){
            card.commenting=!card.commenting;
        },

        // dumb method to toggle my "todoing" boolean on a card
        card_startStopTodoing(card){
            card.todoing=!card.todoing;
        },

        // adds a new comment to a card based off of a given id
        card_addComment(card){
            commentsRef.push(new comment(this.currentUser, card.id, this.currCardComment));
            card.commenting=false;
            this.currCardComment="";
            this.activity_add("Comment added to card named " + card.myName);
        },

        // will return all activity (in reverse chronological order)
        activity_allActivity: function(){
            return this.activity.slice().reverse();
        },

        // adds a reference to a new image on firebase
        addNewImage: function(u, url) {
            this.genAddNewImage(u,url);
            u.avatar=url;
        },

        // a generic version of addNewImage
        genAddNewImage: function(u, url) {
            imagesRef.push({
                title: u,
                url: url
            });
            // u.avatar=url;
        },

        // changes user profile image
        changeImage: function(u, url) {
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
                    });} catch(e){
                    imagesRef.update(updates);
                }
            });
        },

        // returns all lists tied t a board
        board_lists: function(){
            return this.lists.filter(list => list.parent === this.currentBoard);
        },

        // switched to board based off of user selection
        board_changeboard: function(board){
            this.currboardname = board.name;
            this.currentBoard = board.id;
        },

        // archives a given board
        board_close: function(board){
            var updates = {};
            updates['/' + board['.key'] + '/closed'] = true;
            updates['/' + board['.key'] + '/starred'] = false;
            boardsRef.update(updates);
            this.activity_add("Board named " + board.name + " closed");
        },

        // stars a given board
        board_star: function(board){
            var updates = {};
            updates['/' + board['.key'] + '/starred'] = true;
            boardsRef.update(updates);
            this.activity_add("Board named " + board.name + " starred");
        },

        // removes a given board
        board_delete: function(board){
            boardsRef.child(board['.key']).remove();
            this.activity_add("Board named " + board.name + " deleted");
            var index = this.boards.indexOf(board);
            if(index > -1){
                this.boards.splice(index, 1);
            }
        },

        // opens a closed project board
        board_unarchive: function(board){
            var updates = {};
            updates['/' + board['.key'] + '/closed'] = false;
            this.activity_add("Board named " + board.name + " unarchived");
            boardsRef.update(updates);
        },

        // unstars a project board
        board_unstar: function(board){
            var updates = {};
            updates['/' + board['.key'] + '/starred'] = false;
            this.activity_add("Board named " + board.name + " unstarred");
            boardsRef.update(updates);
        },

        // changes the board background image
        board_changeImage(currentBoard){
            // make image and color changes persistent?
            this.backdialog=false;
        },

        card_getCards: function (ls, category){
            // TODO change category code
            return this.cards.filter(card => card.parent === ls.id && card.category == category);
        },

        card_addNew: function(ls){
            cardsRef.push(new card(ls.id)).then((data, err) => { if (err) {console.log(err);}});
            this.activity_add("New card created");
        },

        card_delete: function(card){
            cardsRef.child(card['.key']).remove();
            this.activity_add("Card named " + card.myName + " deleted");
            var index = this.cards.indexOf(card);
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
            var updates = {};
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
                this.currCardDescription = "";
            }
        },

        card_deadline(card) {
            if(this.currCardDeadline !== ""){
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

        list_addNew: function(){
            listsRef.push(new cardList(this.currentBoard)).then((data, err) => { if (err) {console.log(err);}});
            this.activity_add("New list created");
            console.log("fuck me up yo");
            var bigDiv = document.getElementById("gradBackground");
            console.log(bigDiv.scrollWidth);
            bigDiv.scrollLeft = bigDiv.scrollWidth;
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

            var index = this.lists.indexOf(ls);
            if(index > -1){
                this.lists.splice(index, 1);
            }
            this.activity_add("List named " + ls.myName + " removed");
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
                });
                return ret;
            });
        },

        user_getImage: function() {
            var url = "resources/low res andy.jpg";
            console.log(this.currentUser);
            // var a = this.currentUser;
            db.ref('users/' + this.currentUser).once('value', function (snapshot) {
                   url = snapshot.val().avatar;
            });
            return url;
        },

        getImage: function(user) {
            var url = "resources/low res andy.jpg";
            console.log(this.currentUser);
            // var a = user;
            db.ref('users/' + user).once('value', function (snapshot) {
                url = snapshot.val().avatar;
            });
            return url;
        },

        user_changeImage(userID){
            console.log("THIS IS BEING CALLED");
            this.picdialog = false;
            var input = document.getElementById('files1');
            var parent = this;
            var updates = {};
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
                    });
            }
        },

        setCurrCard(card){
            this.currCardId = card.id;
        },

        newAttachmentClick: function(){
            console.log("WHY THOUGH " + this.$refs.attachButton);
            // for (let asdf of this.$refs.attachButton){
            //     console.log(asdf);
            // }
            this.$refs.attachButton.click();
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

        changeBkColorClick: function(){
            this.$refs.changeBkCol.click();
        },

        user_makeNew: function(){
            var parent = this;
            var input = document.getElementById('files');
            // var imgUrl = "";
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
                                });
                        }
                    }
                });
            });
            console.log("added new user: " + this.currentUser);
        },

        user_existsValidate: function(curuser, login, loggedin, invalid) {
            // var logIn = function(){this.user_successLogIn();};
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
                });
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
            document.getElementById("gradBar").style.background = this.colorDict[color];
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
                console.log("final : " + ret);
                if(ret){
                    parent.user_successLogIn();
                }
                else{
                    parent.invalidInput=true;
                }
            });
            this.currentBoard = this.boards[0].id;
            this.currboardname = this.boards[0].name;
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
            this.currentBoard = this.boards[0].id;
            this.currboardname = this.boards[0].name;

        },
    },
    directives: {}
});