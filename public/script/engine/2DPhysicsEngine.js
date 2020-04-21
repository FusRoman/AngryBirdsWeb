class PhysicsEngine {

    constructor(gameObject, ctx) {
        this.gameObject = gameObject;
        this.timeStep = 0;
        this.deltaT = 0.1;
        //this.restingLimit = 0.02;

        this.drawingContext = ctx;

        this.collisionEngine = new CollisionEngine(this.gameObject);
        this.objectInCollision = new Array();
    }

    restartEngine(gameObject){
        this.timeStep = 0;
        this.gameObject = gameObject;
        this.collisionEngine = new CollisionEngine(this.gameObject);
    }

    renderEngine() {
        this.gameObject.forEach(gm => {
            gm.draw(this.drawingContext);
        });
    }

    applyPhysics() {
        this.KineticMotionAllObject();
        this.objectInCollision = this.collisionEngine.collisionDetection();
        this.collisionEngine.collisionResolution(this.objectInCollision);
    }

    KineticMotionAllObject() {
        this.gameObject.forEach(gm => {
            gm.applyKineticLawOfmotion(this.deltaT);
            /*if (deltaPos != 0 && decimalPart <= this.restingLimit && gm.condition == GMcondition.awake) {
                console.log("2 :", deltaPos);
                gm.condition = GMcondition.sleeping;
            }*/
            gm.collisionForce = new Array();
        });
        this.timeStep += this.deltaT;
    }

}