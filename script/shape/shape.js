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
        this.tolerance = 0.00001;
    }

    getFarthestPoint(direction) {
        let max = Number.MIN_SAFE_INTEGER;
        let res = new Vector2D(0, 0);
        for (let i = 0; i < this.shapePoint.length; i++) {
            let dot = this.shapePoint[i].dot(direction);
            if (dot > max) {
                max = dot;
                res.x = this.shapePoint[i].x;
                res.y = this.shapePoint[i].y;
            }
        }
        return res;
    }

    support(S2, direction) {
        let p1 = this.getFarthestPoint(direction);
        /*
            -direction ici
        */
        let p2 = S2.getFarthestPoint(direction.mul(-1));
        return p1.sub(p2);
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
        while (true) {
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
        }
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

    draw(ctx) {
        ctx.beginPath();
        for (let i = 0; i < this.shapePoint.length - 1; i++) {
            ctx.moveTo(this.shapePoint[i].x, this.shapePoint[i].y);
            ctx.lineTo(this.shapePoint[i + 1].x, this.shapePoint[i + 1].y);
        }
        ctx.lineTo(this.shapePoint[0].x, this.shapePoint[0].y);
        ctx.stroke();
    }
}