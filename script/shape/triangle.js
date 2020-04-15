class Triangle extends Shape {

    constructor(x, y, longueurBase, hauteur){
        let arrayPoint = new Array();
        arrayPoint.push(new Vector2D(x, y));
        arrayPoint.push(new Vector2D(x + longueurBase, y));
        arrayPoint.push(new Vector2D(x, y + hauteur));
        super(arrayPoint);
    }
}