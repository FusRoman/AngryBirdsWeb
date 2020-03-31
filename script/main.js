let background_canvas = document.getElementById("background_canvas");
let background_context = background_canvas.getContext("2d");
let showFPS = document.getElementById("fpsCounter");

let game_object = new Array();
let camera = new Camera(background_context);
let engine = new PhysicsEngine(game_object, background_context);

let rectangle1 = new Rectangle(500, 50, 100, 100, 0);
let circle1 = new Circle(500, 100, 100, 1);
let triangle1 = new Triangle(450, 120, 50, 100, 2);

let gm1 = new GameObject(rectangle1, 200);
let gm2 = new GameObject(circle1, 2000);
let gm3 = new GameObject(triangle1, 100);

game_object.push(gm1);
game_object.push(gm2);
game_object.push(gm3);


let lastLoop = performance.now();
let counter = 0;
let fps = 0;
background_context.font = "30px Arial";

/*
Fonction permettant de calculer le framerate du canvas
*/
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



/*


/*
Fonction appelé à chaque rafraichissement du navigateur
*/
function gameStep(ts) {
    background_context.clearRect(0 - camera.coordCamera.x, 0 - camera.coordCamera.y, background_canvas.width, background_canvas.height);

    camera.continuousCamera();

    engine.renderEngine();
    engine.KineticMotionAllObject();

    fpsCounter();

    requestAnimationFrame(gameStep);
}

requestAnimationFrame(gameStep);

document.addEventListener("keydown", function (event) {
    camera.cameraActionKeydown(event);
});

document.addEventListener("keyup", function (event) {
    camera.cameraActionKeyup(event);
});