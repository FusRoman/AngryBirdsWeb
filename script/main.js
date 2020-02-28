let background_canvas = document.getElementById("background_canvas");
let background_context = background_canvas.getContext("2d");
let showFPS = document.getElementById("fpsCounter");
/*
let drawing_canvas = document.getElementById("drawing_canvas");
let drawing_context = drawing_canvas.getContext("2d");*/

let main_menu = new Menu(background_context, 0, 0, background_canvas.clientWidth, background_canvas.height);

/*window.onload = function(){
    main_menu.drawMenu();
}*/

aabb1 = new AABB(10, 10, 100, 100);
aabb2 = new AABB(50, 50, 70, 50);
aabb3 = new AABB(-50, 0, 50, 50);
circle1 = new Circle(100, 30, 50);
circle2 = new Circle(500, 300, 50);

aabb1.drawAABBCollideBox(background_context);
aabb2.drawAABBCollideBox(background_context);
aabb3.drawAABBCollideBox(background_context);
circle1.drawCircleCollideBox(background_context);
circle2.drawCircleCollideBox(background_context);

let toggleCamera = false;
let buttonCameraPressed = new Set();
/*
function camera(){

    if(toggleCamera){
        switch(keyCodeCamera){
            case "90":
                background_context.translate(0, -10);
                break;
        }
    }

}*/

let lastLoop = performance.now();
let counter = 0;
let fps = 0;
background_context.font = "30px Arial";

function fpsCounter() {
    counter += 1;
    delta = (performance.now() - lastLoop) / 1000;
    lastLoop = performance.now();
    fps = Math.round(1 / delta);
    if (counter == 30) {
        showFPS.innerHTML = "fps : " + fps + "</br>time elapsed : " + delta * 1000 + " ms";
        counter = 0;
    }
}

let camera = new Vector2D(0, 0);

function continuousCamera(context) {
    if (buttonCameraPressed.has(90)) {
        context.translate(0, -5);
        camera.y -= 5;
    }
    if (buttonCameraPressed.has(81)) {
        context.translate(-5, 0);
        camera.x -= 5;
    }
    if (buttonCameraPressed.has(83)) {
        context.translate(0, 5);
        camera.y += 5;
    }
    if (buttonCameraPressed.has(68)) {
        context.translate(5, 0);
        camera.x += 5;
    }
}

function gameStep(timeStep) {
    background_context.clearRect(0 - camera.x, 0 - camera.y, background_canvas.width, background_canvas.height);

    continuousCamera(background_context);
    aabb1.drawAABBCollideBox(background_context);
    aabb2.drawAABBCollideBox(background_context);
    aabb3.drawAABBCollideBox(background_context);
    circle1.drawCircleCollideBox(background_context);
    circle2.drawCircleCollideBox(background_context);
    fpsCounter();


    requestAnimationFrame(gameStep);
}

requestAnimationFrame(gameStep);


document.addEventListener("keydown", function (event) {
    if (!toggleCamera) {
        toggleCamera = true;
    }
    buttonCameraPressed.add(event.keyCode);
});

document.addEventListener("keyup", function (event) {
    if (buttonCameraPressed.size == 0) {
        toggleCamera = false;
    }
    buttonCameraPressed.delete(event.keyCode);
});