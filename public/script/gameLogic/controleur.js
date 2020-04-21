class GameControleur {

    constructor(gameLogic) {
        this.gameLogic = gameLogic;
        this.canvas = this.gameLogic.canvas;
        this.context = this.gameLogic.context;
        this.gameObject = this.gameLogic.gameObject;


        this.canvas.addEventListener("click", event => {
            if (this.gameObject[1] instanceof Boulet) {
                this.gameObject.splice(1, 1);
            }
        
            --this.gameLogic.nbBall;
        
            let beginVec = game_logic.cannon.shape.shapePoint[0];
            let endvec = game_logic.cannon.shape.shapePoint[1];
        
            let speedBall = endvec.sub(beginVec).normalize().mul(game_logic.cannon.powerCannon * 1.5);
            this.gameObject.splice(1, 0, new Boulet(endvec.x, endvec.y + 10, speedBall));
        });
        
        this.canvas.addEventListener("wheel", event => {
            event.preventDefault();
            
            let newAngle = event.deltaY * -0.02;
            this.gameLogic.rotateCannon(newAngle);
        });
        
        let mySelf = this;

        document.addEventListener("keydown", function (event) {
            if (event.keyCode == 69) {
                if (event.shiftKey) {
                    mySelf.gameLogic.cannon.updateTwicePowerCannon();
                }
                else {
                    mySelf.gameLogic.cannon.updatePowerCannon();
                }
            }
            else if(event.keyCode == 70 && event.ctrlKey && event.altKey){
                mySelf.gameLogic.showFPS = !mySelf.gameLogic.showFPS;
            }
            mySelf.gameLogic.camera.cameraActionKeydown(event);
        });
        
        document.addEventListener("keyup", function (event) {
            mySelf.gameLogic.camera.cameraActionKeyup(event);
        });

    }

}