BASE.require([
    "app.components.Transform",
    "app.components.Vector",
    "app.components.Collidable"
], function () {
    BASE.namespace("app");

    var Transform = app.components.Transform;
    var Collidable = app.components.Collidable;
    var Vector = app.components.Vector;

    app.CollisionHandler = function (pair) {
        this.entityA = pair[0];
        this.entityB = pair[1];
        this.vectorA = new Vector();
        this.vectorB = new Vector();
        this.joiningVector = new Vector();
    };

    app.CollisionHandler.prototype.getOverlap = function () {
        var transformA = this.entityA.getComponentByType(Transform);
        var transformB = this.entityB.getComponentByType(Transform);

        var collidableA = this.entityA.getComponentByType(Collidable);
        var collidableB = this.entityB.getComponentByType(Collidable);

        var normalsA = collidableA.polygon.getNormals();
        var normalsB = collidableB.polygon.getNormals();

        var verticesA = collidableA.vertices;
        var verticesB = collidableB.vertices;

        var lengthA = verticesA.length;
        var lengthB = verticesB.length;

        var top = Math.max(transformA.center.y, transformB.center.y);
        var bottom = Math.min(transformA.center.y, transformB.center.y);
        var left = Math.max(transformA.center.x, transformB.center.x);
        var right = Math.min(transformA.center.x, transformB.center.x);

        var vertex;
        var indexToCheckA = [];
        var indexToCheckB = [];
        var x;

        for (x = 0 ; x < lengthA; x++) {
            vertex = verticesA[x];

            if (vertex.y + transformA.y >= top &&
                vertex.y + transformA.y <= bottom &&
                vertex.x + transformA.x >= left &&
                vertex.x + transformA.x <= right) {

                indexToCheckA.push(x);

            }
        }

        for (x = 0 ; x < lengthB; x++) {
            vertex = verticesB[x];

            if (vertex.y + transformB.y >= top &&
                vertex.y + transformB.y <= bottom &&
                vertex.x + transformB.x >= left &&
                vertex.x + transformB.x <= right) {

                indexToCheckB.push(x);

            }
        }

        var indexToCheckALength = indexToCheckA.length;
        var indexToCheckBLength = indexToCheckB.length;
        var joiningVector = this.joiningVector;
        var normalA;
        var vectorA = this.vectorA;
        var vectorB = this.vectorB
        var vertexA;
        var vertexB;
        var y;

        joiningVector.x = transformB.center.x - transformA.center.x;
        joiningVector.y = transformB.center.y - transformA.center.y;

        outer: for (x = 0 ; x < indexToCheckALength; x++) {
            normalA = normalsA[x];
            vectorA.x = verticesA[x].x + transformA.center.x;
            vectorA.y = verticesA[x].y + transformA.center.y;

            for (y = 0 ; y < indexToCheckBLength; y++) {
                vertexB = verticesB[y];
            }
        }

    };


});