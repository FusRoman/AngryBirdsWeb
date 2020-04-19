class GameLogic {

    constructor(gameObject, context, nbTarget) {
        this.hGround = 500;
        let groundShape = new Rectangle(-1000, this.hGround, 6000, 100);
        this.ground = new GameObject(groundShape, 0, 0.1, GMcondition.static, 0);

        this.gameObject = gameObject;
        this.gameObject.push(this.ground);
        this.context = context;

        this.camera = new Camera(this.context);

        this.cannon = new Cannon(this.hGround);

        this.victoryPoint = 0;
        this.nbTarget = nbTarget;

    }

    updateGame() {
        this.camera.continuousCamera();
        this.cannon.draw(this.context, this.camera.coordCamera.x, this.camera.coordCamera.y);
    }

    rotateCannon(angle) {
        for (let i = 0; i < this.cannon.shape.shapePoint.length; i++) {
            this.cannon.shape.shapePoint[i] = this.cannon.shape.shapePoint[i].rotatePoint(this.cannon.origin, angle);
        }
    }

}