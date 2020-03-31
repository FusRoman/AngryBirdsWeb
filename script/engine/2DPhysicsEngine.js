class PhysicsEngine {

    constructor(gameObject, ctx){
        this.gameObject = gameObject;
        this.timeStep = 0;
        this.deltaT = 0.01;
        this.force = new Array();
        let gravity = new Vector2D(0, 9.81);
        this.force.push(gravity);

        this.drawingContext = ctx;
    }

    KineticMotionAllObject() {
        this.gameObject.forEach(gm => {
            gm.applyKineticLawOfmotion(this.timeStep, this.force);
        });
        this.timeStep += this.deltaT;
    }

    renderEngine() {
        this.gameObject.forEach(gm => {
            gm.draw(this.drawingContext);
        });
    }

}