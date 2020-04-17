class Edge {

    constructor() {
        this.distance = Number.MAX_SAFE_INTEGER;
        this.normal = new Vector2D(0, 0);
        this.index = 0;
    }

}


class Shape {

    constructor(p) {
        this.shapePoint = p;
        let tmp = new Vector2D(0, 0);
        this.shapePoint.forEach(point => {
            tmp = tmp.add(point);
        });

        //this.centerOfMass = tmp.div(this.shapePoint.length);

        this.tolerance = 0.00001;
        //this.inertiaTensor = -1;
    }

    getFarthestPoint(direction) {
        let max = Number.MIN_SAFE_INTEGER;
        let res = new Array();
        let point = new Vector2D(0, 0);
        let index = 0;
        for (let i = 0; i < this.shapePoint.length; i++) {
            let dot = this.shapePoint[i].dot(direction);
            if (dot > max) {
                max = dot;
                point.x = this.shapePoint[i].x;
                point.y = this.shapePoint[i].y;
                index = i;
            }
        }
        res.push(point);
        res.push(index);
        return res;
    }

    support(S2, direction) {
        let p1 = this.getFarthestPoint(direction);
        /*
            -direction ici
        */
        let p2 = S2.getFarthestPoint(direction.mul(-1));
        return p1[0].sub(p2[0]);
    }

    containsOrigin(simplex, direction) {
        let a = simplex[simplex.length - 1];
        let ao = a.mul(-1);
        if (simplex.length == 3) {
            let b = simplex[1];
            let c = simplex[0];
            let ab = b.sub(a);
            let ac = c.sub(a);
            let abPerp = ac.tripleProductExpansion(ab, ab);
            let acPerp = ab.tripleProductExpansion(ac, ac);
            if (abPerp.dot(ao) > 0) {
                simplex.splice(1, 1);
                direction.x = abPerp.x;
                direction.y = abPerp.y;
            }
            else {
                if (acPerp.dot(ao) > 0) {
                    simplex.splice(0, 1);
                    direction.x = acPerp.x;
                    direction.y = acPerp.y;
                }
                else {
                    return true;
                }
            }
        }
        else {
            let b = simplex[0];
            let ab = b.sub(a);
            let abPerp = ab.tripleProductExpansion(ao, ab);
            direction.x = abPerp.x;
            direction.y = abPerp.y;
        }
        return false;
    }

    GJK(S2) {
        let direction = new Vector2D(0, -1);
        let simplex = new Array();
        simplex.push(this.support(S2, direction));
        direction = direction.mul(-1);
        let limit = 50;
        let it = 0;
        while (it < limit) {
            simplex.push(this.support(S2, direction));
            if (simplex[simplex.length - 1].dot(direction) <= 0) {
                let res = new Array();
                res.push(false);
                res.push(simplex);
                return res;
            }
            else {
                if (this.containsOrigin(simplex, direction)) {
                    let res = new Array();
                    res.push(true);
                    res.push(simplex);
                    return res;
                }
            }
            ++it;
        }
        let res = new Array();
        res.push(false);
        return res;
    }

    findClosestEdge(simplex) {
        let closest = new Edge();

        for (let i = 0; i < simplex.length; i++) {
            let j = (i + 1 == simplex.length) ? 0 : i + 1;
            let a = simplex[i];
            let b = simplex[j];

            let e = b.sub(a);
            let normal = e.tripleProductExpansion(a, e);
            let normalize_vect = normal.normalize();
            let d = normalize_vect.dot(a);
            if (d < closest.distance) {

                closest.distance = d;
                closest.normal = normalize_vect;
                closest.index = j;

            }
        }
        return closest;
    }

    EPA(shape2, simplex) {
        while (true) {
            let edge = this.findClosestEdge(simplex);
            let p = this.support(shape2, edge.normal);
            let d = p.dot(edge.normal);

            if (d - edge.distance < this.tolerance) {
                let res = new Array();
                res.push(edge.normal);
                res.push(d);
                return res;

            }
            else {
                simplex.splice(edge.index, 0, p);
            }

        }
    }

    findBestEdge(normal) {
        let resFarthestPoint = this.getFarthestPoint(normal);
        let pointFarthestPoint = resFarthestPoint[0];
        let indexFarthestPoint = resFarthestPoint[1];
        let nextIndice = (indexFarthestPoint + 1 < this.shapePoint.length) ? indexFarthestPoint + 1 : 0;
        let prevIndice = (indexFarthestPoint - 1 > 0) ? indexFarthestPoint - 1 : this.shapePoint.length - 1;
        let prevPoint = this.shapePoint[prevIndice];
        let nextPoint = this.shapePoint[nextIndice];
        let left = pointFarthestPoint.sub(nextIndice).normalize();
        let right = pointFarthestPoint.sub(prevPoint).normalize();
        let res = new Array();
        if (right.dot(normal) <= left.dot(normal)) {
            res.push(pointFarthestPoint);
            res.push(prevIndice);
            res.push(pointFarthestPoint);
            return res;
        }
        else {
            res.push(pointFarthestPoint);
            res.push(pointFarthestPoint);
            res.push(nextPoint);
            return res;
        }
    }

    findRefIncEdge(S2, normal) {

        let e1 = this.findBestEdge(normal);
        let e2 = S2.findBestEdge(normal.mul(-1));
        let subE1 = e1[2].sub(e1[1]);
        let subE2 = e2[2].sub(e2[1]);
        let res = new Array();
        if (Math.abs(subE1.dot(normal)) <= Math.abs(subE2.dot(normal))) {
            res.push(false);
            res.push(e1);
            res.push(e2);
            return res;
        }
        else {
            res.push(true);
            res.push(e2);
            res.push(e1);
            return res;
        }

    }

    clip(v1, v2, refv, o) {
        let clippedPoint = new Array();
        let d1 = refv.dot(v1) - o;
        let d2 = refv.dot(v2) - o;
        if (d1 >= 0) {
            clippedPoint.push(v1);
        }
        if (d2 >= 0) {
            clippedPoint.push(v2);
        }

        if (d1 * d2 < 0) {
            let e = v2.sub(v1);
            let u = d1 / (d1 - d2);
            e = e.mul(u).add(v1);
            clippedPoint.push(e);
        }
        return clippedPoint;
    }

    findContactPoint(S2, normal) {
        let tmp = this.findRefIncEdge(S2, normal);
        let flip = tmp[0];

        let ref = tmp[1];
        let refMax = ref[0];
        let ref_v1 = ref[1];
        let ref_v2 = ref[2];

        let inc = tmp[2];
        let inc_v1 = inc[1];
        let inc_v2 = inc[2];

        let refSub = ref_v2.sub(ref_v1).normalize();
        let o1 = refSub.dot(ref_v1);

        let cp = this.clip(inc_v1, inc_v2, refSub, o1);
        if (cp.length < 2) { return new Array(); }

        let o2 = refSub.dot(ref_v2);
        cp = this.clip(cp[0], cp[1], refSub.mul(-1), -o2);
        if (cp.length < 2) { return new Array(); }


        let refCross = refSub.rightHandRules();
        let max = refCross.dot(refMax);
        if (flip) { refCross = refCross.mul(-1); }

        let finalContactPoint = new Array();
        for (let i = 0; i < cp.length; ++i) {
            let depth = refCross.dot(cp[i]) - max;
            if (depth > 0) {
                finalContactPoint.push(cp[i]);
            }
        }
        return finalContactPoint;
    }

    draw(ctx) {
        //ctx.fillRect(this.centerOfMass.x, this.centerOfMass.y, 1, 1);
        ctx.beginPath();
        for (let i = 0; i < this.shapePoint.length - 1; i++) {
            ctx.moveTo(this.shapePoint[i].x, this.shapePoint[i].y);
            ctx.lineTo(this.shapePoint[i + 1].x, this.shapePoint[i + 1].y);
        }
        ctx.lineTo(this.shapePoint[0].x, this.shapePoint[0].y);
        ctx.stroke();
    }
}