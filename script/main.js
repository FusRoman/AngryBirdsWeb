let background_canvas = document.getElementById("background_canvas");
let background_context = background_canvas.getContext("2d");
/*
let drawing_canvas = document.getElementById("drawing_canvas");
let drawing_context = drawing_canvas.getContext("2d");*/

let main_menu = new Menu(background_context, 0, 0, background_canvas.clientWidth, background_canvas.height);

/*window.onload = function(){
    main_menu.drawMenu();
}*/

aabb1 = new AABB(10,10,100,100);
aabb2 = new AABB(50,50,70,50);
circle1 = new Circle(100,30,50);
circle2 = new Circle(500,300,50);

aabb1.drawAABBCollideBox(background_context);
aabb2.drawAABBCollideBox(background_context);
circle1.drawCircleCollideBox(background_context);
circle2.drawCircleCollideBox(background_context);