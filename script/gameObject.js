class gameObject {

    constructor(initPosX, initPosY, initSpeedX, initSpeedY, initAccX, initAccY,
        thetaX, thetaY, omegaX, omegaY, alphaX, alphaY, mass) {
        this.pos = new Vector2D(initPosX, initPosY); // positionnal vector
        this.speed = new Vector2D(initSpeedX, initSpeedY); // velocity vector
        this.acc = new Vector2D(initAccX, initAccY); // acceleration vector
        this.theta = new Vector2D(thetaX, thetaY); // orientation
        this.omega = new Vector2D(omegaX, omegaY); // velocity angular
        this.alpha = new Vector2D(alphaX, alphaY); // angular acceleration
        this.mass = mass;
        if (mass == 0) {
            /* on represente une masse infinie comme une masse valant 0.
               Pour éviter les divisions par 0, on considère que la masse
               inverse vaut 0 */
            this.invMass = 0;
        }
        else {
            this.invMass = 1 / mass;
        }
    }

    /*
        Nous utilisons la methodes d'integration de la vitesse de Verlet
    */
    updatePos(timeStep) {
        let withSpeed = this.speed.mul(timeStep);
        let withAcc = this.acc.mul(0.5).mul(timeStep * timeStep);
        let newPos = withSpeed.add(withAcc);
        this.pos.add(newPos);
    }

    updateSpeed(timeStep) {
        this.speed.add(this.acc.mul(timeStep));
    }

    updateAcc(force) {
        let new_acc = force.div(this.mass);
        this.acc.add(new_acc).div(2);
    }

    updateGameObject(force) {
        this.updatePos();
        this.updateAcc(force);
        this.updateSpeed();
    }

}