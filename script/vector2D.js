class Vector2D{

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    norm(){
        return Math.sqrt( (this.x * this.x) + (this.y * this.y) )
    }

    add(otherVect){
        this.x + otherVect.x;
        this.y + otherVect.y;
    }

    mul(scalar){
        this.x * scalar;
        this.y * scalar;
    }

    div(scalar){
        this.x / scalar;
        this.y / scalar;
    }

    dot(otherVect){
        return this.x * otherVect.x + this.y * otherVect.y;
    }
}