class Circle extends Shape {

    constructor(x, y, radius, id){
        let p = new Array();
        p.push(new Vector2D(x, y));
        super(p, id);
        this.radius = radius;
    }

    getFarthestPoint(direction) {
        let res = new Vector2D(0, 0);
        res.x = this.shapePoint[0].x + this.radius * (direction.x / direction.norm());
        res.y = this.shapePoint[0].y + this.radius * (direction.y / direction.norm());
        return res;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.shapePoint[0].x, this.shapePoint[0].y, this.radius, 0, 360 * (Math.PI / 180), false);
        ctx.stroke();
    }

}