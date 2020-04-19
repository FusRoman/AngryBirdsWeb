class Vector2D {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(otherVect) {
        return this.x === otherVect.x && this.y === otherVect.y;
    }

    norm() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    add(otherVect) {
        let new_vect = new Vector2D(this.x, this.y);
        new_vect.x += otherVect.x;
        new_vect.y += otherVect.y;
        return new_vect;
    }

    sub(otherVect) {
        let new_vect = new Vector2D(this.x, this.y);
        new_vect.x -= otherVect.x;
        new_vect.y -= otherVect.y;
        return new_vect;
    }

    mul(scalar) {
        let new_vect = new Vector2D(this.x, this.y);
        new_vect.x *= scalar;
        new_vect.y *= scalar;
        return new_vect;
    }

    div(scalar) {
        let new_vect = new Vector2D(this.x, this.y);
        new_vect.x /= scalar;
        new_vect.y /= scalar;
        return new_vect;
    }

    abs() {
        return new Vector2D(Math.abs(this.x), Math.abs(this.y));
    }

    dot(otherVect) {
        return this.x * otherVect.x + this.y * otherVect.y;
    }

    crossProduct2D(otherVect) {
        return otherVect.x * this.y - otherVect.y * this.x;
    }

    distance(otherPoint) {
        let squaredx = (this.x - otherPoint.x) * (this.x - otherPoint.x);
        let squaredy = (this.y - otherPoint.y) * (this.y - otherPoint.y);
        return Math.sqrt(squaredx + squaredy);
    }

    rightHandRules() {
        return new Vector2D(-this.y, this.x);
    }

    angle(otherVect) {

        let dot = this.dot(otherVect);
        let norm = this.norm() * otherVect.norm();
        return Math.acos(dot / norm);

    }

    tripleProductExpansion(v2, v3) {
        let res = new Vector2D(0, 0);
        let tmp = this.x * v2.y - this.y * v2.x;
        res.x = -tmp * v3.y;
        res.y = tmp * v3.x;
        return res;
    }

    normalize() {
        return this.div(this.norm());
    }

    rotatePoint(center, angle) {
        /*
            Suppose that angle is in radian
        */
        let res = new Vector2D(0, 0);
        let cosAngle = Math.cos(angle);
        let sinAngle = Math.sin(angle);
        let dx = this.x - center.x;
        let dy = this.y - center.y;
        res.x = center.x + (dx * cosAngle - dy * sinAngle);
        res.y = center.y + (dx * sinAngle + dy * cosAngle);
        return res;
    }
}