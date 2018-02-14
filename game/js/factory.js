/*
 * Image and Sound manager
 */

// handle image and sounds loading, really only needed for LOTS or BIG images and sounds
class ResourceManager {
    constructor () {
        this.numImagesLeftToLoad = 0;
        this.numSoundsLeftToLoad = 0;
    }

    // these need to be called BEFORE the game starts so they are loaded and available DURING the game
    loadImage (url) {
        // create actual HTML element and note when it finishes loading
        var img = new Image();
        var self = this;
        img.onload = function () {
            self.numImagesLeftToLoad -= 1;
            console.log(url + ' loaded');
            // reset so it is only counted once (just in case)
            this.onload = null;
        }
        img.onerror = function () {
            console.log('ERROR: could not load ' + url);
        }
        img.src = url;
        this.numImagesLeftToLoad += 1;
        return img;
    }
    
    loadImageSeq (uri, filenames){
        var imgs = [];
        for(let i of filenames){
            imgs.push(resources.loadImage(uri + i));
        }
        return imgs;
    }

    loadSound (url) {
        // create actual HTML element and note when it finishes loading
        var snd = new Audio();
        var self = this;
        snd.oncanplay = function () {
            self.numSoundsLeftToLoad -= 1;
            console.log(url + ' loaded');
            // reset so it is only counted once (just in case)
            this.oncanplay = null;
        }
        snd.onerror = function () {
            console.log('ERROR: could not load ' + url);
        }
        snd.src = url;
        this.numSoundsLeftToLoad += 1;
        return snd;
    }

    isLoadingComplete () {
        return this.numImagesLoaded === this.numImagesExpected &&
               this.numSoundsLoaded === this.numSoundsExpected;
    }
};

export { ResourceManager };