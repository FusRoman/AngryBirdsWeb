class Rectangle extends Shape {

    constructor(x, y, width, heigth){
        let arrayPoint = new Array();
        arrayPoint.push(new Vector2D(x, y));
        arrayPoint.push(new Vector2D(x + width, y));
        arrayPoint.push(new Vector2D(x + width, y + heigth));
        arrayPoint.push(new Vector2D(x, y + heigth));
        super(arrayPoint);
        this.width = width;
        this.heigth = heigth;
    }

}