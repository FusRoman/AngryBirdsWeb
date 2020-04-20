class Target extends GameObject {

    constructor(id, life_point, score, pos_x, pos_y, radius) {
        let shape = new Circle(pos_x, pos_y, radius);
        super(shape, 100, 0.5, GMcondition.awake, id, life_point);
        this.radius = radius;
        this.score = score;
    }

    draw(ctx) {
        ctx.beginPath();
        let red = 255 - (255 * (this.life_point / 100));
        let blue = 255 * (this.life_point / 100);
        context.fillStyle = "rgb(" + red + ", 0, " + blue + ")";
        context.strokeStyle = "#000000";
        ctx.arc(this.shape.shapePoint[0].x, this.shape.shapePoint[0].y, this.radius, 0, 360 * (Math.PI / 180), false);
        ctx.stroke();
        ctx.fill();
    }

}