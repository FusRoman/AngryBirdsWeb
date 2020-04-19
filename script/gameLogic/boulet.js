class Boulet extends GameObject {

    constructor(x, y, initSpeed){
        let circle = new Circle(x, y, 20);
        super(circle, 50, 0.5, GMcondition.awake, 1,10000);
        this.speed = initSpeed;
    }

}