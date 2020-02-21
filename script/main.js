let background_canvas = document.getElementById("background_canvas");
let background_context = background_canvas.getContext("2d");

let drawing_canvas = document.getElementById("drawing_canvas");
let drawing_context = drawing_canvas.getContext("2d");

let main_menu = new Menu(background_context, 0, 0, background_canvas.clientWidth, background_canvas.height);

window.onload = function(){
    main_menu.drawMenu();
}