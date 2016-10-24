BASE.require([
    "jQuery"
], function () {

    BASE.namespace("app.components");

    app.components.MobileController = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $a = $(tags["a"]);
        var $b = $(tags["b"]);
        var $joystick = $(tags["joystick"]);
        var touchInput = null;
        var startJoystickData = {
            id: 0,
            x: 0,
            y: 0
        };

        var joyStickTouchStart = function (event) {
            var originalEvent = event.originalEvent;
            var changedTouches = originalEvent.changedTouches;
            var touch = changedTouches[0];

            startJoystickData.id = touch.id;
            startJoystickData.x = touch.pageX;
            startJoystickData.y = touch.pageY;

            if (touchInput != null) {
                touchInput.x = 0;
                touchInput.y = 0;
                touchInput.isTouching = true;
            }
        };

        var joyStickTouchMove = function (event) {
            var originalEvent = event.originalEvent;
            var changedTouches = originalEvent.changedTouches;
            var touch = changedTouches[0];

            self.direction.x = touch.pageX - startJoystickData.x;
            self.direction.y = touch.pageY - startJoystickData.y;

            if (touchInput != null) {
                touchInput.x = self.direction.x;
                touchInput.y = self.direction.y;
            }
        };

        var joyStickTouchEnd = function (event) {
            self.direction.x = 0;
            self.direction.y = 0;

            if (touchInput != null) {
                touchInput.x = self.direction.x;
                touchInput.y = self.direction.y;
                touchInput.isTouching = false;
            }
        };

        self.direction = {
            x: 0,
            y: 0
        };

        self.setTouchInput = function (value) {
            touchInput = value;
        };

        $a.on("touchstart", function (event) {

        });

        $b.on("touchstart", function (event) {

        });

        $joystick.on("touchstart", joyStickTouchStart);
        $joystick.on("touchmove", joyStickTouchMove);
        $joystick.on("touchend", joyStickTouchEnd);
    };

});