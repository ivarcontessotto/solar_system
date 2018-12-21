"use strict";

// Map indexes
const BLACK_MAP = 0;
const SUN_MAP = 1;
const EARTH_DAY_MAP = 2;
const EARTH_SPECULAR_MAP = 3;
const EARTH_NIGHT_MAP = 4;
const EARTH_CLOUD_MAP = 5;
const EARTH_MOON_MAP = 6;
const MERCURY_MAP = 7;
const VENUS_MAP = 8;
const MARS_MAP = 9;
const JUPITER_MAP = 10;
const JUPITER_MOON_01_MAP = 11;
const JUPITER_MOON_02_MAP = 12;
const JUPITER_MOON_03_MAP = 13;
const JUPITER_MOON_04_MAP = 14;

// Map image Urls
const BLACK_MAP_URL = "images/2k_black.jpg";
const SUN_MAP_URL = "images/2k_sun.jpg";
const EARTH_DAY_MAP_URL = "images/2k_earth_daymap.jpg";
const EARTH_SPECULAR_MAP_URL = "images/2k_earth_specular_map.jpg";
const EARTH_NIGHT_MAP_URL = "images/2k_earth_nightmap.jpg";
const EARTH_CLOUD_MAP_URL = "images/2k_earth_clouds.jpg";
const EARTH_MOON_MAP_URL = "images/2k_moon.jpg";
const MERCURY_MAP_URL = "images/2k_mercury.jpg";
const VENUS_MAP_URL = "images/2k_venus_atmosphere.jpg";
const MARS_MAP_URL = "images/2k_mars.jpg";
const JUPITER_MAP_URL = "images/2k_jupiter.jpg";
const JUPITER_MOON_01_MAP_URL = "images/2k_ceres_fictional.jpg";
const JUPITER_MOON_02_MAP_URL = "images/2k_eris_fictional.jpg";
const JUPITER_MOON_03_MAP_URL = "images/2k_haumea_fictional.jpg";
const JUPITER_MOON_04_MAP_URL = "images/2k_makemake_fictional.jpg";

function AsyncImageLoader() {
    this.imageUrls = [
        BLACK_MAP_URL, SUN_MAP_URL, EARTH_DAY_MAP_URL, EARTH_SPECULAR_MAP_URL, EARTH_NIGHT_MAP_URL,
        EARTH_CLOUD_MAP_URL, EARTH_MOON_MAP_URL, MERCURY_MAP_URL, VENUS_MAP_URL, MARS_MAP_URL,
        JUPITER_MAP_URL, JUPITER_MOON_01_MAP_URL, JUPITER_MOON_02_MAP_URL, JUPITER_MOON_03_MAP_URL,
        JUPITER_MOON_04_MAP_URL
    ];
    this.imagesToLoad = this.imageUrls.length;
    this.images = [];
}

AsyncImageLoader.prototype.loadImages = function(callback) {

    const onImageLoad = () => {
        this.imagesToLoad--;
        if (this.imagesToLoad === 0) {
            callback();
        }
    };

    const loadImage = (url, index) => {
        const image = new Image();
        this.images[index] = image;
        image.onload = onImageLoad;
        image.src = url;
    };

    this.imageUrls.forEach(loadImage);
};