class Menu{

    constructor(ctx, x, y, width, heigth){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.heigth = heigth;
        this.background = new Image();
        this.background.src = "http://localhost:8000/ressource/main_menu/menu_background.gif";
        this.menu_button = new Array();
        loadFromServer("level/").then((value) => {
            let reg = new RegExp('"level[0-9]+/"','g');
            let i = 0;
            let j = 0;
            let srcImgButton = "http://localhost:8000/ressource/main_menu/Medieval-Buttons-cover.png"
            value.match(reg).map((level) => {
                if(i > 4){
                    i = 0;
                    j += 1;
                }
                this.menu_button.push(new Button(this.ctx, i, j, 50, 50, srcImgButton, level));
                i += 1;
            });
        }).then((value) => {
            console.log(this.menu_button[1].toString());
        });
    }

    drawMenu(){
        this.ctx.drawImage(this.background, this.x, this.y, this.width, this.heigth);
    }

}