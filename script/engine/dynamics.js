class Dynamics {

    constructor(initPos, initSpeed, initAcc, mass, restitution, condition) {
        this.pos = initPos;
        this.speed = initSpeed;
        this.acc = initAcc;


        this.mass = mass;
        this.restitution = restitution;
        this.condition = condition;


        if (mass == 0) {
            /* on represente une masse infinie comme une masse valant 0.
               Pour éviter les divisions par 0, on considère que la masse
               inverse vaut 0 */
            this.invMass = 0;
        }
        else {
            this.invMass = 1 / mass;
        }


        this.environmentalForce = new Array();
        this.environmentalForce.push(new Gravity(this.mass));

        this.collisionForce = new Array();

    }

    goToSleep() {
        if (this.condition == GMcondition.awake) {
            this.condition = GMcondition.sleeping;
        }
    }

    /*
        Calcul de la seconde loi de Newton : sum(forces) = m * a => a = sum(forces) * (1/m)
    */
    computeSecondLawNewton() {
        let sumForce = new Vector2D(0, 0);
        this.environmentalForce.forEach(force => {
            sumForce = sumForce.add(force.computeForce());
        });
        this.collisionForce.forEach(force => {
            sumForce = sumForce.add(force.computeForce());
        });
        return sumForce.mul(this.invMass);
    }

    /*
        Nous utilisons la methodes d'integration de la vitesse de Verlet
    */
    updatePos(deltaT) {
        let withSpeed = this.speed.mul(deltaT);
        let withAcc = this.acc.mul(0.5).mul(deltaT * deltaT);
        let newPos = withSpeed.add(withAcc);
        for (let i = 0; i < this.pos.shapePoint.length; i++) {
            this.pos.shapePoint[i] = this.pos.shapePoint[i].add(newPos);
        }
    }

    modifyAdd(addToPos) {
        for (let i = 0; i < this.pos.shapePoint.length; i++) {
            this.pos.shapePoint[i] = this.pos.shapePoint[i].add(addToPos);
        }
    }

    modifySub(subToPos) {
        for (let i = 0; i < this.pos.shapePoint.length; i++) {
            this.pos.shapePoint[i] = this.pos.shapePoint[i].sub(subToPos);
        }
    }

    updateSpeed(deltaT) {
        this.speed = this.speed.add(this.acc.mul(deltaT));
    }

    updateAcc() {
        let new_acc = this.computeSecondLawNewton();
        this.acc = this.acc.add(new_acc).div(2);
    }

    applyKineticLawOfmotion(deltaT) {
        if (this.condition == GMcondition.awake) {
            this.updatePos(deltaT);
            this.updateAcc();
            this.updateSpeed(deltaT);
        }
    }
}