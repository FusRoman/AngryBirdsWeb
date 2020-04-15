let background_canvas = document.getElementById("background_canvas");
let background_context = background_canvas.getContext("2d");
let showFPS = document.getElementById("fpsCounter");

let game_object = new Array();
let camera = new Camera(background_context);
let engine = new PhysicsEngine(game_object, background_context);


//objet de jeu
let circle1 = new Circle(500, 100, 100);
let triangle1 = new Triangle(200, 100, 50, 100);
let rectangle1 = new Rectangle(100, 100, 10, 300);
let rectangle6 = new Rectangle(300, 100, 20, 100);

//let gm2 = new GameObject(circle1, 0.05, 10, 2);
let gm1 = new GameObject(rectangle1, 1, 0.2, GMcondition.awake, 1);
let gm3 = new GameObject(triangle1, 1, 0.2, GMcondition.awake, 3);
let gm8 = new GameObject(rectangle6, 1, 0.2, GMcondition.awake, 8);


game_object.push(gm1);
//game_object.push(gm2);
game_object.push(gm3);
game_object.push(gm8);


//aire de jeu

let epaisseurMur = 50
let tailleEnceinte = 1000

let rectangle2 = new Rectangle(0 - epaisseurMur, 0, epaisseurMur, tailleEnceinte);
let rectangle3 = new Rectangle(3, 0, tailleEnceinte, epaisseurMur);
let rectangle4 = new Rectangle(tailleEnceinte + 4, 0, epaisseurMur, tailleEnceinte);
let rectangle5 = new Rectangle(0, tailleEnceinte + 2, tailleEnceinte + 4, epaisseurMur);


let gm4 = new GameObject(rectangle2, 0, 0.2, GMcondition.static, 4);
let gm5 = new GameObject(rectangle3, 0, 0.2, GMcondition.static, 5);
let gm6 = new GameObject(rectangle4, 0, 0.2, GMcondition.static, 6);
let gm7 = new GameObject(rectangle5, 0, 0.2, GMcondition.static, 7);


game_object.push(gm4);
game_object.push(gm5);
game_object.push(gm6);
game_object.push(gm7);




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

    engine.renderEngine();
    engine.applyPhysics();

    fpsCounter();

    requestAnimationFrame(gameStep);
}

requestAnimationFrame(gameStep);

background_canvas.addEventListener("click", function (event) {
    let newShape = new Rectangle(100, 100, 20, 50);
    let newGM = new GameObject(newShape, 10, Math.random(), GMcondition.awake, i);
    newGM.speed = new Vector2D(10, -50);
    game_object.push(newGM);
    ++i;
});

document.addEventListener("keydown", function (event) {
    camera.cameraActionKeydown(event);
});

document.addEventListener("keyup", function (event) {
    camera.cameraActionKeyup(event);
});