BASE.require([
    'jQuery'
], function () {
    BASE.namespace('components.material.inputs.multiSelect')
    
    components.material.inputs.multiSelect.LandingState = function (elem, tags, scope) {
        var self = this;

        var $landingMessage = $(tags['landing-message']);

        self.prepareToActivateAsync = function (options) {
            options.landingMessage = options.landingMessage || "Select add to begin";
            $landingMessage.text(options.landingMessage);
        };
    };
});