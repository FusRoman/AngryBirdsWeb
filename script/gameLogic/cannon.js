class SemiCircle {

    constructor(origin, radius) {
        this.origin = origin;
        this.radius = radius;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.origin.x, this.origin.y, this.radius, 0, Math.PI, true);
        ctx.stroke();
    }
}

class Cannon {

    constructor(ground) {
        this.ground = ground;

        this.xCannon = 0;

        this.powerCannon = 1;
        this.flip = 1;

        this.shape = new Rectangle(this.xCannon, ground - 30, 100, 20);
        this.origin = new Vector2D(this.shape.shapePoint[0].x, this.shape.shapePoint[0].y + this.shape.heigth);
        this.supportCannon = new SemiCircle(new Vector2D(this.xCannon, this.ground), 50);
    }

    updatePowerCannon() {
        if (this.powerCannon == 0 || this.powerCannon == 100) {
            this.flip *= -1;
        }
        this.powerCannon += 1 * this.flip;
    }

    updateTwicePowerCannon() {
        if (this.powerCannon <= 0) {
            this.flip *= -1;
            this.powerCannon = 0;
        }
        if(this.powerCannon >= 100){
            this.flip *= -1;
            this.powerCannon = 100;
        }
        this.powerCannon += 5 * this.flip;
    }

    draw(ctx, cameraX, cameraY) {
        ctx.strokeStyle = "#000000";
        this.supportCannon.draw(ctx);
        this.shape.draw(ctx);

        ctx.fillText("puissance du canon : " + this.powerCannon, 10 - cameraX, 150 - cameraY);

        var grd = ctx.createLinearGradient(10 - cameraX, 10 - cameraY, 10 - cameraX, (10 - cameraY) + 1 + ((this.powerCannon)*2));
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "green");
        ctx.fillStyle = grd;
        ctx.fillRect(10 - cameraX, 10 - cameraY, 20, 100);
    }

}