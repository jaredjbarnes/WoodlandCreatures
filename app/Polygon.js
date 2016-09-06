BASE.require([
], function () {

    var Polygon = function () {
        this.vertices = [];
        this.edges = [];
        this.normals = [];
    };

    Polygon.prototype.getNormals = function () {
        if (this.normals.length > 0) {
            return this.normals;
        } else {
            return this.normals = this.getEdges.map(function (edge) {
                return edge.getNormal();
            });
        }
    };

    Polygon.prototype.getEdges = function () {
        if (this.edges.length > 0) {
            return this.edges;
        } else {
            var length = this.vertices.length;
            var vertices = this.vertices;

            return this.edges = vertices.map(function (vertexA, index) {
                var vertexB;

                if (index < length - 1) {
                    vertexB = vertices[index + 1];
                } else {
                    vertexB = vertices[0];
                }

                return vertexB.clone().subtract(vertexA);
            });
        }


    };

});