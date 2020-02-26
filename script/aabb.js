class AABB extends gameObject{

    constructor(x, y, w, h, mass) {
        super(x, y, 0, 0, 0, 0, mass);
        this.width = w;
        this.height = h;
    }

    TestCollision(otherAABB) {
        return otherAABB.pos.x >= this.pos.x + this.width
            || otherAABB.pos.x + otherAABB.width <= super.pos.x
            || otherAABB.pos.y >= super.pos.y + this.height
            || otherAABB.pos.y + otherAABB.height <= super.pos.y
    }

    drawAABBCollideBox(context){
        context.beginPath();
        context.rect(this.pos.x, this.pos.y, this.width, this.height);
        context.stroke();
    }

}