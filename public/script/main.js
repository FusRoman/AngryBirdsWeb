let background_canvas = document.getElementById("background_canvas");
let background_context = background_canvas.getContext("2d");
let showFPS = document.getElementById("fpsCounter");



let game_object = new Array();
let game_logic = new GameLogic(game_object, background_context, 0, 10, 0);
let engine = new PhysicsEngine(game_object, background_context);


let lastLoop = performance.now();
let counter = 0;
let fps = 0;
background_context.font = "30px Arial";

/*
Pour tester des fonctions
*/
//loadFromServer("loadLevel.js");


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
Fonction appelé à chaque rafraichissement du navigateur
*/
function gameStep(ts) {

    background_context.clearRect(0 - game_logic.camera.coordCamera.x, 0 - game_logic.camera.coordCamera.y, background_canvas.width, background_canvas.height);

    game_logic.updateGame();

    engine.renderEngine();
    engine.applyPhysics();

    fpsCounter();

    requestAnimationFrame(gameStep);
}

requestAnimationFrame(gameStep);


document.addEventListener("wheel", event => {
    event.preventDefault();

    let newAngle = event.deltaY * -0.02;
    game_logic.rotateCannon(newAngle);
});

background_canvas.addEventListener("click", event => {
    if (game_object[1] instanceof Boulet) {
        game_object.splice(1, 1);
    }

    game_logic.nbShoot--;

    let beginVec = game_logic.cannon.shape.shapePoint[0];
    let endvec = game_logic.cannon.shape.shapePoint[1];

    let speedBall = endvec.sub(beginVec).normalize().mul(game_logic.cannon.powerCannon * 1.5);
    game_object.push(new Boulet(endvec.x, endvec.y + 10, speedBall));
});

document.addEventListener("keydown", function (event) {
    if (event.keyCode == 69) {
        if (event.shiftKey) {
            game_logic.cannon.updateTwicePowerCannon();
        }
        else {
            game_logic.cannon.updatePowerCannon();
        }
    }
    game_logic.camera.cameraActionKeydown(event);
});

document.addEventListener("keyup", function (event) {
    game_logic.camera.cameraActionKeyup(event);
});
