"use strict";

window.onload = main;

function main() {
    const canvas = document.getElementById("myCanvas");
    resizeCanvasToDisplaySize(canvas);

    const model = new Model(canvas);
    const view = new View(canvas, model, callback);
    // Now await callback for when images are loaded.
    
    function callback() {
        const controller = new Controller(model, view);
        controller.run();
    }
}