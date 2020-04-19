class Camera {

    constructor(ctx) {
        this.coordCamera = new Vector2D(0, 0);
        this.buttonCameraPressed = new Set();
        this.drawingContext = ctx;
    }


    /*
    cette fonction est utilisé pour déplacer la camera du canvas
    */
    continuousCamera() {
        if (this.buttonCameraPressed.has(90)) {
            this.drawingContext.translate(0, 5);
            this.coordCamera.y += 5;
        }
        if (this.buttonCameraPressed.has(81)) {
            this.drawingContext.translate(5, 0);
            this.coordCamera.x += 5;
        }
        if (this.buttonCameraPressed.has(83)) {
            this.drawingContext.translate(0, -5);
            this.coordCamera.y -= 5;
        }
        if (this.buttonCameraPressed.has(68)) {
            this.drawingContext.translate(-5, 0);
            this.coordCamera.x -= 5;
        }
    }

    cameraActionKeydown(event) {
        this.buttonCameraPressed.add(event.keyCode);
    }

    cameraActionKeyup(event) {
        this.buttonCameraPressed.delete(event.keyCode);
    }

}