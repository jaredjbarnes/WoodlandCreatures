BASE.require([
    "app.Vector"
], function () {

    BASE.namespace("app.components");
    var Vector = app.Vector;

    app.components.Rect = function () {
        var top = 0;
        var left = 0;
        var right = 0;
        var bottom = 0;
        var width = 0;
        var height = 0;
        var center = new Vector(0, 0);

        Object.defineProperties(this, {
            x: {
                get: function () {
                    return left;
                },
                set: function (value) {
                    left = value;
                    right = left + width;
                }
            },
            y: {
                get: function () {
                    return top;
                },
                set: function (value) {
                    top = value;
                    bottom = top + height;
                }
            },
            left: {
                get: function () {
                    return left;
                },
                set: function (value) {
                    left = value;
                    right = left + width;
                }
            },
            top: {
                get: function () {
                    return top;
                },
                set: function (value) {
                    top = value;
                    bottom = top + height;
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
                    width = value;

                    center.x = width / 2;
                    right = left + width;
                }
            },
            height: {
                get: function () {
                    return height;
                },
                set: function (value) {
                    height = value;

                    center.y = height / 2;
                    bottom = top + height;
                }
            }
        });

        app.components.Rect.prototype.getIntersection = function (rect) {
            var top = Math.max(rect.top, this.top);
            var right = Math.min(rect.right, this.right);
            var bottom = Math.max(rect.bottom, this.bottom);
            var left = Math.max(rect.left, this.left);

            if (top < bottom, left < right) {
                var intersection = new app.components.Rect();

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

