
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

class SmartImage{
    constructor(){

    }
}


const RELATIVE_URI = "/../img/";
var jsonFile;
var set = new ImageSet();
var slides = new ImageSlides();
var menu = new SelectionMenu();