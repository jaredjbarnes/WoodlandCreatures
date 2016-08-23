BASE.require([
    'jQuery'
], function () {
    BASE.namespace('components.material.inputs.multiSelect')
    
    components.material.inputs.multiSelect.LandingState = function (elem, tags, scope) {
        var self = this;
        var preloaderCircleController = $(tags['preloader-circle']).controller();

        self.prepareToActivateAsync = function () {
            preloaderCircleController.play();
        };

        self.deactivated = function () {
            preloaderCircleController.pause();
        }
    };
});