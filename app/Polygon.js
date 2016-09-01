(function () {

    var Polygon = function () {
        this.vertices = [];
    };

    Polygon.prototype.getNormals = function () {
        return this.getEdges.map(function (edge) {
            return edge.getNormal();
        });
    };

    Polygon.prototype.getEdges = function () {
        var length = this.vertices.length;
        var vertices = this.vertices;

        return vertices.map(function (vertexA, index) {
            var vertexB;

            if (index < length - 1) {
                vertexB = vertices[index + 1];
            } else {
                vertexB = vertices[0];
            }

            return vertexB.clone().subtract(vertexA);
        });
    };

}());