class GameLogic {

    constructor(gameObject, context, nbTarget, nbShoot) {
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
        this.nbShoot = nbShoot;

    }

    youLoose(){
        return 0;
    }

    youWon(){
        return 1;
    }

    updateGame() {
        for(let i=0; i < this.gameObject.length; i++){
            if(this.gameObject[i].life_point==0){
                if(this.gameObject[i] instanceof Target){
                    this.nbTarget--;
                }
                gameObject.splice(i,1);                
            }
        }
        if(this.nbTarget == 0){
            youWon();
        }
        if(this.nbShoot == 0 && this.nbTarget != 0 ){
            this.youLoose();
        }
        this.camera.continuousCamera();
        this.cannon.draw(this.context, this.camera.coordCamera.x, this.camera.coordCamera.y);
                
    }

    rotateCannon(angle) {
        for (let i = 0; i < this.cannon.shape.shapePoint.length; i++) {
            this.cannon.shape.shapePoint[i] = this.cannon.shape.shapePoint[i].rotatePoint(this.cannon.origin, angle);
        }
    }

}