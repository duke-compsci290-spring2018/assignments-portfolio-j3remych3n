
function loadImageSet(uri){
    $.getJson(uri, )
}

class ImageSet{
    constructor(){

    }
}

class ImageSlides{
    constructor(){
        this.slides = [];
    }

    addImage(img){
        this.slides.push(img);
    }

    injectImage(img){
        var injected = $('<img>').addClass("slides").attr({src: img.name});

    }
}

class SelectionMenu{
    constructor(){

    }
}

class SmartImage {
    constructor(imageName, imageCaption, imageTags){
        this.name = imageName;
        this.caption = imageCaption;
        this.tags = imageTags;
    }

    inject() {

    }

    belongs(otherTag){
        return this.tags.includes(otherTag);
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


const IMAGES_URI = "/../img/";
const JSON_URI = "/../json/";
var myJson;
var mySet = new ImageSet();
var mySlides = new ImageSlides();
var myMenu = new SelectionMenu();