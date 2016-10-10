BASE.require([
    "jQuery"
], function () {

    BASE.namespace("app.components");

    var defaultDelegate = {
        positionChange: function () { },
        limitPositionChange: function () { }
    };

    app.components.HorizontalScrollbar = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $body = $(document.body);
        var $limitHandle = $(tags["limit-handle"]);
        var $limitBar = $(tags["limit-bar"]);
        var $handle = $(tags["handle"]);

        var maxValue = 4000;
        var barWidth = 0;
        var limit = 2000;
        var viewportWidth = 0;
        var limitHandleValue = $limitHandle.width();
        var handleWidth = $handle.width();
        var delegate = defaultDelegate;

        var currentValue = 0;
        var startPageX = 0;
        var startPosition = 0;
        var position = 0;
        var availableSpan;
        var maxSpan;

        var limitStartPageX = 0;
        var limitStartPosition = 0;
        var limitPosition = 0;


        var calculateSizes = function () {
            barWidth = $elem.width();
            maxSpan = (barWidth - handleWidth - limitHandleValue);
            ratio = maxValue / maxSpan;

            availableSpan = (limit / ratio);
            limitPosition = availableSpan;
        };

        var handleMousedown = function (event) {
            calculateSizes();
            startPageX = event.pageX;
            startPosition = position;

            drawBars();

            $body.on("mousemove", handleMouseMove);
            $body.on("mouseup", handleMouseUp);
            $body.on("mouseleave", handleMouseUp);
        };

        var handleMouseMove = function (event) {
            position = startPosition + (event.pageX - startPageX);

            if (position < 0) {
                position = 0;
            }

            if (position > availableSpan) {
                position = availableSpan;
            }

            currentValue = position * ratio;
            delegate.positionChange(currentValue);

            drawHandles();
            return false;

        };

        var handleMouseUp = function () {
            $body.off("mousemove", handleMouseMove);
            $body.off("mouseup", handleMouseUp);
            $body.off("mouseleave", handleMouseUp);
        };

        var limitHandleMousedown = function (event) {
            calculateSizes();
            limitStartPageX = event.pageX;
            limitStartPosition = limitPosition;

            drawBars();

            $body.on("mousemove", limitHandleMouseMove);
            $body.on("mouseup", limitHandleMouseUp);
            $body.on("mouseleave", limitHandleMouseUp);
        };

        var limitHandleMouseMove = function (event) {
            limitPosition = limitStartPosition + (event.pageX - limitStartPageX);

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
                width: availableSpan + handleWidth + "px"
            });
        };

        var drawHandles = function () {
            $handle.css({
                left: position + "px"
            });

            $limitHandle.css({
                left: availableSpan + handleWidth + "px"
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

        self.setViewportWidth = function (value) {
            viewportWidth = value;
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