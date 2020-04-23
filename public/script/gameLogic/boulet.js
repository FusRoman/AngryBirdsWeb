class Boulet extends GameObject {

    constructor(x, y, radius, initSpeed){
        let circle = new Circle(x, y, radius);
        super(circle, 50, 0.8, GMcondition.awake, 2,10000);
        this.speed = initSpeed;
    }

}