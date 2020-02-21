class Button{

    constructor(ctx, x, y, width, height, srcButtonImage, content){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.buttonImg = new Image();
        this.buttonImg.src = srcButtonImage;
        this.content = content;
    }

    drawButton(){
        this.ctx.drawImage(this.buttonImg, this.x, this.y, this.width, this.height);
    }

    IsInButton(x, y){
        return x > this.x && x < this.width && y > this.y && y < this.height;
    }
}

Button.prototype.toString = function(){
    return "shape : (" + this.x + ", " + this.y + ", " + this.width + ", " + this.height + ")\n" +
    "src_Image : " + this.buttonImg.src + "\n" + 
    "content : " + this.content;
}