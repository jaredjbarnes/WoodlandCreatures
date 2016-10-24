BASE.require([
    "app.CanvasScaler"
], function () {

    BASE.namespace("app.systems");

    var hasTouchInput = function (entity) {
        return entity.hasProperties(["touch-input", "position", "size"]);
    };

    app.systems.TouchInputSystem = function (document, canvas, camera) {
        var self = this;
        this.document = document;
        this.canvasScaler = new app.CanvasScaler(canvas);
        this.scale = this.canvasScaler.scale;
        this.isTouching = false;
        this.touch = {
            pageX: 0,
            pageY: 0
        };
        this.isReady = true;
        this.cameraName = camera.name;
        this.cameraPosition = camera.getProperty("position");
        this.entities = [];

        this.touchstartListener = function (event) {
            if (event.targetTouches.length > 0) {
                self.isTouching = true;
                self.touch.pageX = event.targetTouches[0].pageX;
                self.touch.pageY = event.targetTouches[0].pageY;
            }

            return event.preventDefault();
        };

        this.touchendListener = function (event) {
            if (event.targetTouches.length === 0) {
                self.isTouching = false;
            }
        };
    };

    app.systems.TouchInputSystem.prototype.update = function () {
        var entity;
        var position;
        var size;
        var centerX;
        var centerY;
        var cameraPosition = this.cameraPosition;
        var touchInput;

        if (this.isTouching) {

            for (var x = 0 ; x < this.entities.length; x++) {
                entity = this.entities[x];
                touchInput = entity.getProperty("touch-input");

                position = entity.getProperty("position");
                size = entity.getProperty("size");

                centerX = position.x + (size.width / 2);
                centerY = position.y + (size.height / 2);

                touchInput.x = this.touch.pageX - ((centerX - this.cameraPosition.x) * this.scale.x);
                touchInput.y = this.touch.pageY - ((centerY - this.cameraPosition.y) * this.scale.y);
                touchInput.isTouching = true;
            }
        } else {
            for (var x = 0 ; x < this.entities.length; x++) {
                entity = this.entities[x];
                touchInput = entity.getProperty("touch-input");
                touchInput.isTouching = false;
            }
        }
    };


    app.systems.TouchInputSystem.prototype.activated = function (game) {
        var self = this;
        var document = this.document;
        var touches = this.touches;

        game.stage.filter().forEach(function (entity) {
            self.entityAdded(entity);
        });

        document.body.addEventListener("touchstart", this.touchstartListener, false);
        document.body.addEventListener("touchmove", this.touchstartListener, false);
        document.body.addEventListener("touchend", this.touchendListener, false);
        document.body.addEventListener("touchcancel", this.touchendListener, false);
    }

    app.systems.TouchInputSystem.prototype.deactivated = function () {
        var document = this.document;
        document.body.removeEventListener("touchstart", this.touchstartListener, false);
        document.body.removeEventListener("touchmove", this.touchstartListener, false);
        document.body.removeEventListener("touchend", this.touchendListener, false);
        document.body.removeEventListener("touchcancel", this.touchendListener, false);
    };

    app.systems.TouchInputSystem.prototype.entityAdded = function (entity) {
        if (hasTouchInput(entity)) {
            this.entities.push(entity);
        }
    };

    app.systems.TouchInputSystem.prototype.entityRemoved = function (entity) {
        if (hasTouchInput(entity)) {
            var index = this.entities.indexOf(entity);
            if (index > -1) {
                this.entities.splice(index, 1);
            }
        }
    };


});