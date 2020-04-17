let background_canvas = document.getElementById("background_canvas");
let background_context = background_canvas.getContext("2d");
let showFPS = document.getElementById("fpsCounter");



let game_object = new Array();
let game_logic = new GameLogic(game_object, background_context, 0);



let camera = new Camera(background_context);
let engine = new PhysicsEngine(game_object, background_context);


let lastLoop = performance.now();
let counter = 0;
let fps = 0;
background_context.font = "30px Arial";

/*
Fonction permettant de calculer le framerate du canvas
*/

let i = 20;

function fpsCounter() {
    counter += 1;
    delta = (performance.now() - lastLoop) / 1000;
    lastLoop = performance.now();
    fps = Math.round(1 / delta);
    if (counter == 30) {
        showFPS.innerHTML = "fps : " + fps + "</br>time elapsed : " + delta * 1000 + " ms" + "</br>nombre d'objet : " + ((i - 20) + 3);
        counter = 0;
    }
}

/*
Fonction appelé à chaque rafraichissement du navigateur
*/
function gameStep(ts) {
    background_context.clearRect(0 - camera.coordCamera.x, 0 - camera.coordCamera.y, background_canvas.width, background_canvas.height);

    camera.continuousCamera();
    game_logic.drawCannon();

    engine.renderEngine();
    engine.applyPhysics();

    fpsCounter();

    requestAnimationFrame(gameStep);
}

requestAnimationFrame(gameStep);

background_canvas.addEventListener("click", function (event) {
    let widthRand = randomIntervalle(10, 80);
    let heightRand = randomIntervalle(10, 100);
    let newShape = new Rectangle(event.offsetX - camera.coordCamera.x, event.offsetY - camera.coordCamera.y, widthRand, heightRand);
    let newGM = new GameObject(newShape, 1, Math.random(), GMcondition.awake, i);
    newGM.speed = new Vector2D(10, 0);
    game_object.push(newGM);
    ++i;
});

document.addEventListener("wheel", event => {
    event.preventDefault();

    let newAngle = event.deltaY * -0.02;
    game_logic.rotateCannon(newAngle);

});

document.addEventListener("keydown", function (event) {
    camera.cameraActionKeydown(event);
});

document.addEventListener("keyup", function (event) {
    camera.cameraActionKeyup(event);
});