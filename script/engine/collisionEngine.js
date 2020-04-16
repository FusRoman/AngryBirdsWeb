class CollisionEngine {

    constructor(listObject) {
        this.gameObject = listObject;
    }

    test_couple(array_couple, value_to_test) {
        let res = false;
        array_couple.forEach(element => {
            if (element[0] == value_to_test[1] && element[1] == value_to_test[0]) {
                res = true;
            }
        });
        return res;
    }

    collisionDetection() {
        let res = new Array();
        let couple = new Array();
        this.gameObject.forEach(gm1 => {
            if (gm1.condition == GMcondition.awake) {
                this.gameObject.forEach(gm2 => {
                    if (!gm1.equal(gm2) && !this.test_couple(couple, [gm1.id, gm2.id])) {
                        couple.push([gm1.id, gm2.id]);
                        let test_collision = gm1.shape.GJK(gm2.shape);
                        if (test_collision[0]) {
                            if (gm2.condition == GMcondition.sleeping) {
                                gm2.condition = GMcondition.awake;
                            }
                            res.push([gm1, gm2, test_collision[1]]);
                        }
                    }
                });
            }
        });
        return res;
    }

    computeImpulsion(objectA, objectB, normalCollision) {
        let relativeVel = objectB.speed.sub(objectA.speed);
        let velocityAlongNormal = relativeVel.dot(normalCollision);
        if (velocityAlongNormal <= 0) {
            let sumInvMass = objectA.invMass + objectB.invMass;
            let j_a = (-(1 + objectA.restitution) * velocityAlongNormal) / sumInvMass;
            let j_b = (-(1 + objectB.restitution) * velocityAlongNormal) / sumInvMass;
            let impulseA = normalCollision.mul(j_a).mul(objectA.invMass);
            let impulseB = normalCollision.mul(j_b).mul(objectB.invMass);
            objectA.speed = objectA.speed.sub(impulseA);
            objectB.speed = objectB.speed.add(impulseB);
        }
    }

    positionalCorrection(objectA, objectB, penetrationDepth, normalCollision) {
        let sumInvMass = objectA.invMass + objectB.invMass;
        let percent = 0.8;
        let slop = 0.01;
        let tmp = Math.max(penetrationDepth - slop, 0);
        tmp /= sumInvMass;
        tmp *= percent;
        let correction = normalCollision.mul(tmp);
        objectA.modifySub(correction.mul(objectA.invMass));
        objectB.modifyAdd(correction.mul(objectB.invMass));
    }

    collisionResolution(collideObject) {
        let collisionManifold = new Array();
        collideObject.forEach(element => {
            let objectA = element[0];
            let objectB = element[1];
            let simplex = element[2];
            let tmp = objectA.shape.EPA(objectB.shape, simplex);
            collisionManifold.push([objectA, objectB, tmp]);
        });

        collisionManifold.forEach(collide => {
            let objectA = collide[0];
            let objectB = collide[1];
            let normalCollision = collide[2][0];
            let penetrationDepth = collide[2][1];


            /*
                Array return by findContactPoint may be empty, check that for computeImpulsion.
            */
            let contactPoints;
            try {
                contactPoints = objectA.shape.findContactPoint(objectB.shape, normalCollision);
            } catch (e) {
                contactPoints = objectB.shape.findContactPoint(objectA.shape, normalCollision);
            }

            this.computeImpulsion(objectA, objectB, normalCollision);
            this.positionalCorrection(objectA, objectB, penetrationDepth, normalCollision);

            let sumForceA = objectA.computeSecondLawNewton();
            let sumForceB = objectB.computeSecondLawNewton();
            let normalFA = new NormalForce(objectA.mass, objectA.acc, sumForceA);
            let normalFB = new NormalForce(objectB.mass, objectB.acc, sumForceB);


            /*
                Le calcul de la force normal à une collision n'est pas sur, elle n'est donc pas
                implémenté.

            objectA.collisionForce.push(normalFA);
            objectB.collisionForce.push(normalFB);*/

            let frictionFA = new Friction(objectA.mass, normalFA.computeForce().norm(), objectA.speed);
            let frictionFB = new Friction(objectB.mass, normalFB.computeForce().norm(), objectB.speed);
            objectA.collisionForce.push(frictionFA);
            objectB.collisionForce.push(frictionFB);
        });
    }
}