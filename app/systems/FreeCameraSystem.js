BASE.require([
    "Array.prototype.orderBy",
    "app.systems.CameraSystem"
], function () {

    BASE.namespace("app.systems");

    var emptyFn = function () { };
    var CameraSystem = app.systems.CameraSystem;

    app.systems.FreeCameraSystem = function (canvas, camera, scale) {
        var self = this;

        CameraSystem.call(self, canvas);
        this.setCamera(camera);
        this.positionConstraint = camera.getProperty("position-constraint");

        scale = scale || {
            x: 1,
            y: 1
        };

        this.isMouseDown = false;
        this.mouseStartPosition = {
            x: 0,
            y: 0
        };
        this.canvasStartPosition = {
            x: 0,
            y: 0
        };

        var mousemove = function (event) {
            if (self.enabled) {
                self.position.x = self.canvasStartPosition.x + ((self.mouseStartPosition.x - event.pageX) / scale.x);
                self.position.y = self.canvasStartPosition.y + ((self.mouseStartPosition.y - event.pageY) / scale.y);
            }
        };

        var mouseup = function (event) {
            canvas.removeEventListener("mousemove", mousemove);
        };

        canvas.addEventListener("mousedown", function (event) {
            self.mouseStartPosition.x = event.pageX;
            self.mouseStartPosition.y = event.pageY;
            self.canvasStartPosition.x = self.position.x;
            self.canvasStartPosition.y = self.position.y;

            canvas.addEventListener("mousemove", mousemove);
        });

        canvas.addEventListener("mouseup", mouseup);
        canvas.addEventListener("mouseout", mouseup);
    };

    BASE.extend(app.systems.FreeCameraSystem, CameraSystem);

    app.systems.FreeCameraSystem.prototype.positionCamera = function () {
        var cameraSize = this.cameraSize;
        var cameraMovement = this.cameraMovement;
        var positionConstraint = this.positionConstraint;

        cameraMovement.position.x = this.position.x;
        cameraMovement.position.y = this.position.y;

        if (cameraMovement.position.x + cameraSize.width > positionConstraint.position.x + positionConstraint.size.width) {
            cameraMovement.position.x = positionConstraint.position.x + positionConstraint.size.width - cameraSize.width;
        }

        if (cameraMovement.position.y + cameraSize.height > positionConstraint.position.y + positionConstraint.size.height) {
            cameraMovement.position.y = positionConstraint.position.y + positionConstraint.size.height - cameraSize.height;
        }

        if (cameraMovement.position.x < positionConstraint.position.x) {
            cameraMovement.position.x = positionConstraint.position.x;
        }

        if (cameraMovement.position.y < positionConstraint.position.y) {
            cameraMovement.position.y = positionConstraint.position.y
        }
    };


});