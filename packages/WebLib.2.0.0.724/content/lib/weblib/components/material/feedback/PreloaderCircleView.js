BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.material.feedback");

    var Future = BASE.async.Future;

    components.material.feedback.PreloaderCircleView = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $preloaderCircle = $(tags['preloader-circle']);
        var preloaderCircleController = $preloaderCircle.controller();

        self.setCircumference = function (value) {
            preloaderCircleController.setCircumference(value);
        }

        self.setBorderWidth = function (value) {
            preloaderCircleController.setBorderWidth(value);
        }

        self.pause = function () {
            preloaderCircleController.pause();
        }

        self.play = function () {
            preloaderCircleController.play();
        }
    };
});