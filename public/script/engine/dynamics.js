class Dynamics {

    constructor(initPos, initSpeed, initAcc, /*initOmega, initAlpha,*/ mass, restitution, /*iM,*/ condition) {
        this.pos = initPos;
        this.speed = initSpeed;
        this.acc = initAcc;

        /*this.theta = 0;
        this.omega = initOmega;
        this.alpha = initAlpha;*/

        this.mass = mass;
        //this.inertialMoment = iM;
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

        if (this.inertialMoment == 0) {
            this.invInertia = 0;
        }
        else {
            this.invInertia = 1 / this.inertialMoment;
        }

        //this.lastEnergy = this.computeKineticEnergy();


        this.environmentalForce = new Array();
        this.environmentalForce.push(new Gravity(this.mass));

        this.collisionForce = new Array();

    }

    goToSleep() {
        if (this.condition == GMcondition.awake) {
            this.condition = GMcondition.sleeping;
        }
    }

    modifyAdd(addToPos) {
        for (let i = 0; i < this.pos.shapePoint.length; i++) {
            this.pos.shapePoint[i] = this.pos.shapePoint[i].add(addToPos);
        }
        //this.pos.centerOfMass = this.pos.centerOfMass.add(addToPos);
    }

    modifySub(subToPos) {
        for (let i = 0; i < this.pos.shapePoint.length; i++) {
            this.pos.shapePoint[i] = this.pos.shapePoint[i].sub(subToPos);
        }
        //this.pos.centerOfMass = this.pos.centerOfMass.sub(subToPos);
    }

    /*
        Nous utilisons la methodes d'integration de la vitesse de Verlet
    */
    updatePos(deltaT) {

        // update translation movement
        //console.log("avant : ", this.speed);
        let withSpeed = this.speed.mul(deltaT);
        //console.log("apres : ", withSpeed);
        //console.log("acc avant : ");
        let withAcc = this.acc.mul(0.5).mul(deltaT * deltaT);
        //console.log("acc : ", withAcc);
        let newPos = withSpeed.add(withAcc);
        //console.log("pos : ", newPos);

        //update rotation movement
        /*let withAngularSpeed = this.omega * deltaT;
        let withAngularAcceleration = 0.5 * this.alpha * (deltaT * deltaT);
        this.theta = withAngularSpeed + withAngularAcceleration;*/


        for (let i = 0; i < this.pos.shapePoint.length; i++) {
            this.pos.shapePoint[i] = this.pos.shapePoint[i].add(newPos);
        }

        /*this.pos.centerOfMass = this.pos.centerOfMass.add(newPos);

        for (let i = 0; i < this.pos.shapePoint.length; i++) {
            this.pos.shapePoint[i] = this.pos.shapePoint[i].rotatePoint(this.pos.centerOfMass, this.theta);
        }*/
    }

    updateSpeed(deltaT) {
        //update translation speed
        this.speed = this.speed.add(this.acc.mul(deltaT));
        if (this.speed.norm() < 0.8) {
            this.speed = new Vector2D(0, 0);
        }
        //console.log("dynamics speed : " , this.speed);
        //update rotation speed
        //this.omega = this.omega + this.alpha * deltaT;
    }

    updateAcc() {
        let new_acc = this.computeSecondLawNewton();
        this.acc = this.acc.add(new_acc).div(2);

        /*let new_alpha = this.computePrincipeInertie();
        this.alpha = (this.alpha + new_alpha) / 2;*/
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

    /*computePrincipeInertie() {
        let torque = 0;
        this.pos.shapePoint.forEach(point => {
            let r = this.pos.centerOfMass.sub(point);
            this.environmentalForce.forEach(force => {
                torque += force.computeForce().crossProduct2D(r);
            });
        });
        return torque;
    }*/

    computeKineticEnergy(normal) {
        if (this.speed.dot(normal) > 1) {
            return this.speed.norm() * 0.5 * this.mass;
        }
        else{
            return 0;
        }
    }

    applyKineticLawOfmotion(deltaT) {
        if (this.condition == GMcondition.awake) {
            //let lastKE = this.computeKineticEnergy();
            this.updatePos(deltaT);
            this.updateAcc();
            this.updateSpeed(deltaT);
            //let sub = this.computeKineticEnergy().sub(lastKE);
            /*if(this.speed.norm() === 0){
                this.condition = GMcondition.sleeping;
            }*/
            //this.lastEnergy = sub;
        }
    }
}