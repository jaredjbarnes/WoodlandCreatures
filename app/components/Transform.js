BASE.require([
    "app.Vector"
], function () {

    BASE.namespace("app.components");
    var Vector = app.Vector;

    app.components.Transform = function () {
        var top = 0;
        var left = 0;
        var right = 0;
        var bottom = 0;
        var width = 0;
        var height = 0;
        var center = new Vector(0, 0);

        var lastTop = 0;
        var lastLeft = 0;
        var lastRight = 0;
        var lastBottom = 0;
        var lastWidth = 0;
        var lastHeight = 0;
        var lastCenter = new Vector(0, 0);

        Object.defineProperties(this, {
            x: {
                get: function () {
                    return left;
                },
                set: function (value) {
                    lastLeft = left;
                    lastRight = right;
                    lastCenter.x = center.x;

                    left = value;
                    right = left + width;
                    center.x = width / 2;
                }
            },
            y: {
                get: function () {
                    return top;
                },
                set: function (value) {
                    lastTop = top;
                    lastBottom = bottom;
                    lastCenter.y = center.y;

                    top = value;
                    bottom = top + height;
                    center.y = height / 2;
                }
            },
            left: {
                get: function () {
                    return left;
                },
                set: function (value) {
                    lastLeft = left;
                    lastRight = right;
                    lastCenter.x = center.x;

                    left = value;
                    right = left + width;
                    center.x = width / 2;
                }
            },
            top: {
                get: function () {
                    return top;
                },
                set: function (value) {
                    lastTop = top;
                    lastBottom = bottom;
                    lastCenter.y = center.y;

                    top = value;
                    bottom = top + height;
                    center.y = height / 2;
                }
            },
            center: {
                get: function () {
                    return center;
                }
            },
            bottom: {
                get: function () {
                    return bottom;
                }
            },
            right: {
                get: function () {
                    return right;
                }
            },
            width: {
                get: function () {
                    return width;
                },
                set: function (value) {
                    lastWidth = width;
                    lastCenter.x = center.x;

                    width = value;
                    right = left + width;
                    center.x = width / 2;
                }
            },
            height: {
                get: function () {
                    return height;
                },
                set: function (value) {
                    lastHeight = height;
                    lastCenter.y = lastCenter.y;

                    height = value;
                    bottom = top + height;
                    center.y = height / 2;
                }
            }
        });

        app.components.Transform.prototype.getIntersection = function (rect) {
            var top = Math.max(rect.top, this.top);
            var right = Math.min(rect.right, this.right);
            var bottom = Math.max(rect.bottom, this.bottom);
            var left = Math.max(rect.left, this.left);

            if (top < bottom, left < right) {
                var intersection = new app.components.Transform();

                intersection.top = top;
                intersection.left = left;
                intersection.bottom = bottom;
                intersection.right = right;

                return intersection;
            }

            return null;
        };
    };
});

