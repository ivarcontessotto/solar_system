"use strict";

window.onload = main;

function main() {
    const canvas = document.getElementById("myCanvas");
    resizeCanvasToDisplaySize(canvas);
    const imageLoader = new AsyncImageLoader();
    imageLoader.loadImages(callback);
    
    function callback() {
        const model = new Model(canvas.width, canvas.height);
        const view = new View(canvas, model, imageLoader.images);
        const controller = new Controller(model, view);
        controller.run();
    }
}