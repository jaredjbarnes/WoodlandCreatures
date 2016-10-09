BASE.require([
    "jQuery"
], function () {

    BASE.namespace("app.components");

    var defaultDelegate = {
        onScroll: function () { },
        onLimitScroll: function () { }
    };

    app.components.VerticalScrollbar = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $body = $(document.body);
        var $limitHandle = $(tags["limit-handle"]);
        var $limitBar = $(tags["limit-bar"]);
        var $handle = $(tags["handle"]);

        var maxSize = 4000;
        var barSize = 0;
        var limit = 2000;
        var viewportSize = 0;
        var limitHandleSize = $limitHandle.height();
        var handleSize = $handle.height();
        var delegate = defaultDelegate;

        var currentValue = 0;
        var startPageY = 0;
        var startPosition = 0;
        var position = 0;
        var availableSpan;
        var maxSpan;

        var limitStartPageY = 0;
        var limitStartPosition = 0;
        var limitPosition = 0;


        var calculateSizes = function () {
            barSize = $elem.height();
            maxSpan = (barSize - handleSize - limitHandleSize);
            ratio = maxSize / maxSpan;

            availableSpan = (limit / ratio);
            limitPosition = availableSpan;
        };

        var handleMousedown = function (event) {
            calculateSizes();
            startPageY = event.pageY;
            startPosition = position;

            drawBars();

            $body.on("mousemove", handleMouseMove);
            $body.on("mouseup", handleMouseUp);
            $body.on("mouseleave", handleMouseUp);
        };

        var handleMouseMove = function (event) {
            position = startPosition + (event.pageY - startPageY);

            if (position < 0) {
                position = 0;
            }

            if (position > availableSpan) {
                position = availableSpan;
            }

            currentValue = position * ratio;
            delegate.onScroll(currentValue);

            drawHandles();

            console.log(currentValue);
        };

        var handleMouseUp = function () {
            $body.off("mousemove", handleMouseMove);
            $body.off("mouseup", handleMouseUp);
            $body.off("mouseleave", handleMouseUp);
        };

        var limitHandleMousedown = function (event) {
            calculateSizes();
            limitStartPageY = event.pageY;
            limitStartPosition = limitPosition;

            drawBars();

            $body.on("mousemove", limitHandleMouseMove);
            $body.on("mouseup", limitHandleMouseUp);
            $body.on("mouseleave", limitHandleMouseUp);
        };

        var limitHandleMouseMove = function (event) {
            limitPosition = limitStartPosition + (event.pageY - limitStartPageY);

            if (limitPosition < 0) {
                limitPosition = 0;
            }

            if (limitPosition > maxSpan) {
                limitPosition = maxSpan;
            }

            limit = limitPosition * ratio;
            availableSpan = (limit / ratio);

            if (position > availableSpan) {
                position = availableSpan;
            }

            drawHandles();
            drawBars();
        };

        var limitHandleMouseUp = function () {
            $body.off("mousemove", limitHandleMouseMove);
            $body.off("mouseup", limitHandleMouseUp);
            $body.off("mouseleave", limitHandleMouseUp);
        };

        var drawBars = function () {
            $limitBar.css({
                height: availableSpan + handleSize + "px"
            });
        };

        var drawHandles = function () {
            $handle.css({
                top: position + "px"
            });

            $limitHandle.css({
                top: availableSpan + handleSize + "px"
            });
        };

        self.setLimitSize = function (value) {
            limit = value;

            calculateSizes();
            drawBars();
            drawHandles();
        };

        self.setMaxSize = function (value) {
            size = value;
        };

        self.setViewportSize = function (value) {
            viewportSize = value;
            calculateSizes();
        };

        self.getValue = function () {
            return currentValue;
        };

        $handle.on("mousedown", handleMousedown);
        $limitHandle.on("mousedown", limitHandleMousedown);

        $elem.on("windowResize", function () {
            calculateSizes();
            drawBars();
            drawHandles();
        });

        calculateSizes();
        drawBars();
        drawHandles();

    };

});