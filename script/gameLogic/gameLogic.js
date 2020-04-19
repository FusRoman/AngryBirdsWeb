class GameLogic {

    constructor(gameObject, context, nbTarget, nbShoot,score) {
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
        this.score = score;

    }

    youLoose(){
        return this.score;
    }

    youWon(){
        return this.score;
    }

    drawInfo(ctx, cameraX, cameraY) {
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000";
        ctx.fillText("Nombre de Tir restant : " + this.nbShoot, 40 - cameraX, 50 - cameraY);
        ctx.fillText("Nombre d'ennemis restant : " + this.nbTarget, 40 - cameraX, 100 - cameraY);
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
            this.score=this.score + 500 * this.nbShoot;
            this.youWon();
        }
        if(this.nbShoot == 0 && this.nbTarget != 0 ){
            this.youLoose();
        }
        this.camera.continuousCamera();
        this.drawInfo(this.context,this.camera.coordCamera.x,this.camera.coordCamera.y);
        this.cannon.draw(this.context, this.camera.coordCamera.x, this.camera.coordCamera.y);
                
    }

    rotateCannon(angle) {
        for (let i = 0; i < this.cannon.shape.shapePoint.length; i++) {
            this.cannon.shape.shapePoint[i] = this.cannon.shape.shapePoint[i].rotatePoint(this.cannon.origin, angle);
        }
    }

}