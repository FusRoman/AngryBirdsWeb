class Menu{

    constructor(ctx, x, y, width, heigth){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.heigth = heigth;
        this.background = new Image();
        this.background.src = "http://localhost:8000/ressource/main_menu/menu_background.gif";
        loadFromServer("level/").then((value) => {
            let reg = new RegExp('"level[0-9]+/"','g');
            let i = 0;
            let j = 0;
            let srcImgButton = "http://localhost:8000/ressource/main_menu/Medieval-Buttons-cover.png"
            let srcButtonSize = [20, 50, 100, 50];
            let buttonArray = new Array();
            value.match(reg).map((level) => {
                if(i > 4){
                    i = 0;
                    j += 1;
                }
                buttonArray.push(new Button(this.ctx, i, j, 50, 50, srcImgButton, srcButtonSize, level));
                i += 1;
            });

            buttonArray.forEach((element) => {
                element.drawButton();
            })
        });
    }

    drawMenu(){
        this.ctx.drawImage(this.background, this.x, this.y, this.width, this.heigth);
    }

}