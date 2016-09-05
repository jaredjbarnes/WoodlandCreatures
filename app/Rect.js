BASE.require([
    "app.Vector"
], function () {

    BASE.namespace("app");
    var Vector = app.Vector;

    app.Rect = function () {
        var self = this;
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

        this._x = 0;
        this._y = 0;
        this._top = 0;
        this._left = 0;
        this._right = 0;
        this._bottom = 0;
        this._width = 0;
        this._height = 0;
        this._center = center;

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

                    self._left = left;
                    self._x = left;
                    self._right = right;
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

                    self._top = top;
                    self._y = top;
                    self._bottom = bottom;
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

                    self._left = left;
                    self._x = left;
                    self._right = right;
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

                    self._top = top;
                    self._y = top;
                    self._bottom = bottom;
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

                    self._width = width;
                    self._right = right;
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

                    self._bottom = bottom;
                    self._height = height;
                }
            }
        });

        app.Rect.fromPoint = function (vectorA, vectorB) {
            var top = Math.min(vectorA.y, vectorB.y);
            var bottom = Math.max(vectorA.y, vectorB.y);
            var left = Math.min(vectorA.x, vectorB.x);
            var right = Math.max(vectorA.x, vectorB.x);
            var width = right - left;
            var height = bottom - top;

            var rect = new Rect();
            rect.x = left;
            rect.y = top;
            rect.width = width;
            rect.height = height;

            return rect;
        };

        app.Rect.prototype.includesPoint = function (vector) {
            var top = Math.max(this.x, vector.x);
            var bottom = Math.min(this.y, vector.y);
            var left = Math.max(this.x, vector.x);
            var right = Math.min(this.y, vector.x);

            return top <= bottom && left <= right;
        };

        app.Rect.prototype.getIntersection = function (rect, intersection) {
            var top = Math.max(rect._top, this._top);
            var right = Math.min(rect._right, this._right);
            var bottom = Math.min(rect._bottom, this._bottom);
            var left = Math.max(rect._left, this._left);

            if (top < bottom && left < right) {
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

