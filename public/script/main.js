let canvas = document.getElementById("background_canvas");
let context = canvas.getContext("2d");
let menu = document.getElementById("menu");
let loose = document.getElementById("Loose");
let win = document.getElementById("Win");


let game_logic = new GameLogic(canvas, context, menu,loose,win);

window.onload = function(){
    game_logic.initLevelMenu();
}

/*
Fonction appelé à chaque rafraichissement du navigateur
*/
function gameStep(ts) {

    game_logic.updateGame();

    requestAnimationFrame(gameStep);
}

requestAnimationFrame(gameStep);
