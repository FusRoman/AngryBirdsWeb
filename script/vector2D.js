class Vector2D{

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    equals(otherVect){
        return this.x === otherVect.x && this.y === otherVect.y;
    }

    norm(){
        return Math.sqrt( (this.x * this.x) + (this.y * this.y) );
    }

    add(otherVect){
        let new_vect = new Vector2D(this.x,this.y);
        new_vect.x += otherVect.x;
        new_vect.y += otherVect.y;
        return new_vect;
    } 

    sub(otherVect){
        let new_vect = new Vector2D(this.x, this.y);
        new_vect.x -= otherVect.x;
        new_vect.y -= otherVect.y;
        return new_vect;
    }

    mul(scalar){
        let new_vect = new Vector2D(this.x, this.y);
        new_vect.x *= scalar;
        new_vect.y *= scalar;
        return new_vect;
    }

    div(scalar){
        let new_vect = new Vector2D(this.x, this.y);
        new_vect.x /= scalar;
        new_vect.y /= scalar;
        return new_vect;
    }

    dot(otherVect){
        return this.x * otherVect.x + this.y * otherVect.y;
    }

    vectorProduct(v2){
        let res = new Vector2D(this.x, this.y);
        res.x = this.y * v2.x - this.x * v2.y;
        res.y = this.x * v2.y - this.y * v2.x;
        return res;
    }

    tripleProductExpansion(v2, v3){
        let res = new Vector2D(0,0);
        let tmp = this.x * v2.y - this.y * v2.x;
        res.x = -tmp * v3.y;
        res.y = tmp * v3.x;
        return res;
    }

    normalize(){
        return this.div(this.norm());
    }
}