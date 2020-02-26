class Circle extends gameObject{

    constructor(x, y, radius, mass){
        super(x, y, 0, 0, 0, 0, mass);
        this.radius = radius;
    }

    testCollision(otherCircle){
        let diffTwoCenterX = this.pos.x - otherCircle.pos.x;
        let diffTwoCenterY = this.pos.y - otherCircle.pos.y;
        let distanceBetweenTwoCircle = (diffTwoCenterX * diffTwoCenterX) + (diffTwoCenterY * diffTwoCenterY);
        return distanceBetweenTwoCircle > (this.radius + otherCircle.radius) * (this.radius + otherCircle.radius);
    }

    getBoundingBox(){
        return new AABB(this.pos.x - this.radius, this.pos.y - this.radius, this.pos.x + this.radius, this.pos.y + this.radius);
    }

    drawCircleCollideBox(context){
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.radius, 0, 360 * (Math.PI / 180), false);
        context.stroke();
    }

}