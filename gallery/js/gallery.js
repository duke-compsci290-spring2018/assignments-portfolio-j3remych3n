function showMeTheMoney(){

}

function loadJsonFile(uri){
    $.getJson(uri, {}, function(jsonFile){
        showMeTheMoney(jsonFile);
    })
}

class ImageCollection{
    constructor(){
        this.imgs = [];
    }

    add(){

    }

    buildSubcollection(tags){
        var subcollection = [];
        for(let img of this.imgs){
            if(img.belongs(tags)){
                subcollection.push(img);
            }
        }
        return subcollection;
    }

    generateThumbnail(){
        return this.imgs[parseInt(Math.random()*imgs.length)];
    }
}

class ImageSlides{
    constructor(){
        this.imgs = [];
        this.index = 1;
    }

    addImage(img){
        this.slides.push(img);
    }

    injectImage(img){
        var injected = $('<img>').addClass("mySlides").attr({src: img.name});

    }


}

class SelectionMenu{
    constructor(){
        this.selections = [];
        this.selected = [];
    }

    show(){
        for(let choice of selections){

        }
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

    inject() {
        return $('<img>').addClass("col-5").attr({src: IMAGES_URI + this.name});
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
// var myJson;
var myCollection = new ImageCollection();
var mySlides = new ImageSlides();
var myMenu = new SelectionMenu();