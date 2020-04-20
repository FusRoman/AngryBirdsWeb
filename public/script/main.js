let canvas = document.getElementById("background_canvas");
let context = canvas.getContext("2d");
let showFPS = document.getElementById("fpsCounter");
let menu = document.getElementById("menu");


let game_logic = new GameLogic(canvas, context);

window.onload = function(){
    game_logic.createLevelMenu();
}

/*
Fonction appelé à chaque rafraichissement du navigateur
*/
function gameStep(ts) {

    game_logic.updateGame();

    requestAnimationFrame(gameStep);
}

requestAnimationFrame(gameStep);
