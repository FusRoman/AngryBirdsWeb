class Fleche extends GameObject {

    constructor(x, y, initSpeed){
        let triangle = new Triangle(x, y, 40,40);
        super(triangle, 50, 0.8, GMcondition.awake, 2,10000);
        this.speed = initSpeed;
    }

}