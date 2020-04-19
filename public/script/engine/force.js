class Force {

    constructor(mass) {
        this.mass = mass;
    }


    computeForce() { }
}

class Gravity extends Force {
    constructor(mass) {
        super(mass);
        this.gravityEarth = 9.81;
    }

    computeForce() {
        return new Vector2D(0, this.mass * this.gravityEarth);
    }
}

class NormalForce extends Force {
    constructor(mass, acc, sumForce, collisionNormal) {
        super(mass);
        this.acceleration = acc;
        this.forceResultant = sumForce;
        this.normal = collisionNormal;
    }

    computeForce() {
        let tmp = this.forceResultant.add(this.acceleration.mul(this.mass)).mul(-1);
        return tmp;
    }
}

class Friction extends Force {
    constructor(mass, normalForce, speed) {
        super(mass);
        this.mu = 0.01;
        this.normalForce = normalForce;
        this.speed = speed;
    }

    computeForce() {
        let tmp = this.normalForce * this.mu;
        let friction = this.speed.mul(-1).normalize();
        let res = friction.mul(tmp);
        return res;
    }
}