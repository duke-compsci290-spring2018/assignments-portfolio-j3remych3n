function showMeTheMoney(){
    mySlides.inject();
    myMenu.inject();
}

function defaultLoad(filename){
    loadJsonFile(JSON_URI + filename);
}

function setupCollection(jsonFile){
    reset();
    $.each(jsonFile, function(key, val){
        var caption = jsonFile[key]['caption'];
        var tags = jsonFile[key]['tags'];
        var img = new SmartImage(key, caption, tags);
        myCollection.add(img);
        mySlides.add(img);
        myMenu.add(tags);
        console.log(myMenu);
    });
}

function loadJsonFile(uri){
    $.getJSON(uri, {}, function(jsonFile){
        setupCollection(jsonFile);
        showMeTheMoney();
    });
}

function reset(){
    jsonFile = undefined;
    myCollection = new ImageCollection();
    mySlides = new ImageSlides();
    myMenu = new SelectionMenu();
}

class ImageCollection{
    constructor(){
        this.imgs = [];
        this.subcollections = [];
    }

    add(img){
        this.imgs.push(img);
    }

    buildSubcollection(tags){
        var subcollection = new ImageCollection();
        for(let img of this.imgs){
            if(img.belongs(tags)){
                subcollection.add(img);
            }
        }
        return subcollection;
    }

    genThumbnail(){
        return this.imgs[parseInt(Math.random()*imgs.length)];
    }
}

class ImageSlides{
    constructor(){
        this.imgs = [];
        this.index = 1;
        this.injectedImgs = [];
    }

    add(img){
        this.imgs.push(img);
    }

    get index() {
        return this._index;
    }

    set index(i){
        this._index = i;
    }

    injectImage(img){
        var injected = img.injectionSnippet().addClass("col-12 mySlides");
        this.injectedImgs.push(injected);
        return injected;
    }

    injectIndicator(num){
        return $("<span>").addClass("w3-badge demo w3-border").click(function(n){
            mySlides.showDivs(n);
        });
        // return $("<span>").addClass("w3-badge demo w3-border").click(currentDiv(num));
    }

    inject(){
        for(let img of this.imgs){
            $("#slideshow").append(this.injectImage(img));
        }


        $("#slideshow").append($('<div>')).addClass("w3-center w3-container w3-section w3-large w3-text-white w3-display-bottommiddle").attr("id", "indicator");
        $("#indicator").append($('<div>').html("&#10094;").addClass("w3-left w3-hover-text-khaki").on("click", function(){
            plusDivs(-1);
        }))
        $("#indicator").append($('<div>').html("&#10095;").addClass("w3-right w3-hover-text-khaki").on("click", function(){
            plusDivs(1);
        }))
        for(var i = 1; i<=this.imgs.length; i++){
            $("#indicator").append(this.injectIndicator(i));
        }
        this.showDivs(this.index);
    }

    showDivs(n){
        var i;
        var x = document.getElementsByClassName("mySlides");
        var dots = document.getElementsByClassName("demo");
        if (n > x.length) {this.index = 1}
        if (n < 1) {this.index = x.length}
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" w3-white", "");
        }
        x[this.index-1].style.display = "block";
        dots[this.index-1].className += " w3-white";
    }
}

function currentDiv(n) {
    mySlides.showDivs(n);
}

function plusDivs(n){
    mySlides.showDivs(mySlides.index += n);
}

class SelectionMenu{
    constructor(){
        this.selections = [];
        this.selected = [];
    }

    inject(){
        for(let choice of this.selections){
            $("#menu").append(this.injectionSnippet(choice));
            $("#menu").append(this.labelSnippet(choice));
        }
    }

    injectionSnippet(choice){
        return $('<input>').addClass("check").attr({type: "checkbox", id: choice});
    }

    labelSnippet(choice){
        return $('<label>').html(choice).attr({for: choice});
    }

    get selected(){
        return this._selected;
    }

    set selected(selectedTags){
        this._selected = selectedTags;
    }

    add(selection){
        this.selections.push.apply(this.selections, selection);
        this.selections = $.uniqueSort(this.selections);
    }

    select(choice){
        this.selected.push(choice);
        this.selected = $.uniqueSort(this.selected);
    }

    deselect(choice) {
        this.selected.splice(this.selected.indexOf(choice), 1);
    }
}

class SmartImage {
    constructor(imageName, imageCaption, imageTags){
        this.name = imageName;
        this.caption = imageCaption;
        this.tags = imageTags;
    }

    injectionSnippet() {
        return $('<img>').attr({src: IMAGES_URI + this.name});
    }

    belongs(ts){
        for(let t of ts) {
            if (this.tags.includes(t)) {
                return true;
            }
        }
        return false;
    }

    get name(){
        return this._name;
    }

    set name(newName){
        this._name = newName;
    }

    get caption(){
        return this._caption;
    }

    set caption(newCaption){
        this._caption = newCaption;
    }

    get tags(){
        return this._tags;
    }

    set tags(newTags){
        this._tags = newTags;
    }
}

const IMAGES_URI = "img/";
const JSON_URI = "json/";
var jsonFile;
var myCollection = new ImageCollection();
var mySlides = new ImageSlides();
var myMenu = new SelectionMenu();
$("#load").click(defaultLoad('2.json'));
