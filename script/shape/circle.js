class Circle extends Shape {

    constructor(x, y, radius){
        let p = new Array();
        p.push(new Vector2D(x, y));
        super(p);
        this.radius = radius;
    }

    getFarthestPoint(direction) {
        let tmp = direction.div(direction.norm());
        tmp = tmp.mul(this.radius);
        return this.shapePoint[0].add(tmp);
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.shapePoint[0].x, this.shapePoint[0].y, this.radius, 0, 360 * (Math.PI / 180), false);
        ctx.stroke();
    }

}