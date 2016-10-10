BASE.require([
    "jQuery"
], function () {

    BASE.namespace("app.components");

    var defaultDelegate = {
        positionChange: function () { },
        limitPositionChange: function () { }
    };

    app.components.VerticalScrollbar = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $body = $(document.body);
        var $limitHandle = $(tags["limit-handle"]);
        var $limitBar = $(tags["limit-bar"]);
        var $handle = $(tags["handle"]);

        var maxValue = 4000;
        var barHeight = 0;
        var limit = 2000;
        var viewportHeight = 0;
        var limitHandleHeight = $limitHandle.height();
        var handleHeight = $handle.height();
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
            barHeight = $elem.height();
            maxSpan = (barHeight - handleHeight - limitHandleHeight);
            ratio = maxValue / maxSpan;

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
            drawHandles();

            delegate.positionChange(currentValue);

            return false;
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
                currentValue = position * ratio;
            }

            drawHandles();
            drawBars();

            delegate.limitPositionChange(limit);

            return false;

        };

        var limitHandleMouseUp = function () {
            $body.off("mousemove", limitHandleMouseMove);
            $body.off("mouseup", limitHandleMouseUp);
            $body.off("mouseleave", limitHandleMouseUp);
        };

        var drawBars = function () {
            $limitBar.css({
                height: availableSpan + handleHeight + "px"
            });
        };

        var drawHandles = function () {
            $handle.css({
                top: position + "px"
            });

            $limitHandle.css({
                top: availableSpan + handleHeight + "px"
            });
        };

        self.setLimitValue = function (value) {
            limit = value;

            calculateSizes();
            drawBars();
            drawHandles();
        };

        self.setMaxValue = function (value) {
            size = value;
        };

        self.setViewportHeight = function (value) {
            viewportHeight = value;
            calculateSizes();
        };

        self.getValue = function () {
            return currentValue;
        };

        self.setDelegate = function (value) {
            delegate = value;
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