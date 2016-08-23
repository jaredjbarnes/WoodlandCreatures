BASE.require([
    'jQuery',
    'jQuery.fn.region',
    'jQuery.support.transform'
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UIDraggable = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var isModernBrowser = (document.addEventListener);
        var startX = 0;
        var startY = 0;
        var offsetX = 0;
        var offsetY = 0;
        var $container = $();
        var $boundary = $();
        var elemBox = {};
        var containerBox = {};
        var boundaryBox = {};

        var matrix3dRegEx = /matrix3d\((.*?)\)/;
        var matrixRegEx = /matrix\((.*?)\)/;
        var getTransform = function ($elem) {
            var value = $elem.css("transform");
            var isMatrix3d = value.indexOf("matrix3d") > -1;
            var results;

            var returnValue = { x: 0, y: 0 };

            if (value !== "none") {
                if (isMatrix3d) {
                    results = matrix3dRegEx.exec(value)[1].split(",");
                    returnValue.x = parseInt(results[12], 10);
                    returnValue.y = parseInt(results[13], 10);
                } else {
                    results = matrixRegEx.exec(value)[1].split(",");
                    returnValue.x = parseInt(results[4], 10);
                    returnValue.y = parseInt(results[5], 10);
                }
            }
            return returnValue;
        };

        var getEvent = function (event) {
            event = event.originalEvent || event;
            if (event.targetTouches && event.targetTouches.length > 0) {
                event = event.targetTouches[0];
            } else if (event.changedTouches && event.changedTouches.length > 0) {
                event = event.changedTouches[0];
            }
            return event;
        };

        var mouseupHandler = function (event) {
            if (isModernBrowser) {
                document.removeEventListener('mousemove', mousemoveHandler, true);
                document.removeEventListener('mouseup', mouseupHandler, true);
                document.removeEventListener('touchmove', mousemoveHandler, true);
                document.removeEventListener('touchend', mouseupHandler, true);
            }
            else {
                $(document).off('mousemove', mousemoveHandler);
            }
            $elem.trigger({
                type: 'dragEnd',
                boundingBox: elem.getBoundingClientRect()
            });
        }

        var mousemoveHandler = function (event) {
            event.preventDefault();
            event = getEvent(event);

            var diffX = event.pageX - startX;
            var diffY = event.pageY - startY;

            var topPos = diffY + offsetY;
            var leftPos = diffX + offsetX;

            if ($boundary.length > 0) {
                if (boundaryBox.top < (diffY + elemBox.top)) {
                    topPos -= (diffY + elemBox.top) - boundaryBox.top;
                };
                if (boundaryBox.bottom > (diffY + elemBox.bottom)) {
                    topPos += boundaryBox.bottom - (diffY + elemBox.bottom);
                };
                if (boundaryBox.left < (diffX + elemBox.left)) {
                    leftPos -= (diffX + elemBox.left) - boundaryBox.left;
                }
                if (boundaryBox.right > (diffX + elemBox.right)) {
                    leftPos += boundaryBox.right - (diffX + elemBox.right);
                };
            }

            if ($container.length > 0) {
                if (containerBox.top > (diffY + elemBox.top)) {
                    topPos += containerBox.top - (diffY + elemBox.top);
                };
                if (containerBox.bottom < (diffY + elemBox.bottom)) {
                    topPos -= (diffY + elemBox.bottom) - containerBox.bottom;
                };
                if (containerBox.left > (diffX + elemBox.left)) {
                    leftPos += containerBox.left - (diffX + elemBox.left);
                }
                if (containerBox.right < (diffX + elemBox.right)) {
                    leftPos -= (diffX + elemBox.right) - containerBox.right;
                };
            }
            self.setPosition(leftPos < 0 ? Math.floor(leftPos) : Math.ceil(leftPos), topPos < 0 ? Math.floor(topPos) : Math.ceil(topPos));

            $elem.trigger({
                type: 'dragging',
                boundingBox: elem.getBoundingClientRect()
            });
        }

        self.enableDrag = function () {
            $elem.addClass('draggable').on('mousedown touchstart', function (event) {
                event.preventDefault();

                event = getEvent(event);

                startX = event.pageX;
                startY = event.pageY;

                var startPos = getTransform($elem);
                offsetX = startPos.x;
                offsetY = startPos.y;

                if ($container.length > 0) {
                    containerBox = $container[0].getBoundingClientRect();
                    elemBox = elem.getBoundingClientRect();
                }

                if ($boundary.length > 0) {
                    boundaryBox = $boundary[0].getBoundingClientRect();
                    elemBox = elem.getBoundingClientRect();
                }

                if (isModernBrowser) {
                    document.addEventListener('mousemove', mousemoveHandler, true);
                    document.addEventListener('mouseup', mouseupHandler, true);
                    document.addEventListener('touchmove', mousemoveHandler, true);
                    document.addEventListener('touchend', mouseupHandler, true);
                }
                else {
                    $(document).on('mousemove', mousemoveHandler);
                    $(document).one('mouseup', mouseupHandler);
                }

                $elem.triggerHandler("dragStart");
            });
        }

        self.disableDrag = function () {
            $elem.removeClass('draggable');
            $elem.off('mousedown touchstart');
            mouseupHandler();
        }

        self.setContainer = function (value) {
            $container = $(value);
        }

        self.setBoundary = function (value) {
            $boundary = $(value);
        }

        self.checkBoundary = function () {
            boundaryBox = $boundary[0].getBoundingClientRect();
            elemBox = elem.getBoundingClientRect();
            var startPos = getTransform($elem);
            var topPos = startPos.y;
            var leftPos = startPos.x;
            if ($boundary.length > 0) {
                if (boundaryBox.top < elemBox.top) {
                    topPos -= elemBox.top - boundaryBox.top;
                };
                if (boundaryBox.bottom > elemBox.bottom) {
                    topPos += boundaryBox.bottom - elemBox.bottom;
                };
                if (boundaryBox.left < elemBox.left) {
                    leftPos -= elemBox.left - boundaryBox.left;
                }
                if (boundaryBox.right > elemBox.right) {
                    leftPos += boundaryBox.right - elemBox.right;
                };
            }
            self.setPosition(leftPos < 0 ? Math.floor(leftPos) : Math.ceil(leftPos), topPos < 0 ? Math.floor(topPos) : Math.ceil(topPos));
        }

        self.reset = function () {
            $elem.css({
                top: '',
                left: '',
                transform: ''
            });
        }

        self.getPosition = function () {
            return getTransform($elem);
        }

        self.setPosition = function (x, y) {
            if ($.support.transform) {
                $elem.css({
                    transform: 'translate3d(' + x + 'px,' + y + 'px, 0)'
                });
            }
            else {
                $elem.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }
        }

        self.enableDrag();
    };
});