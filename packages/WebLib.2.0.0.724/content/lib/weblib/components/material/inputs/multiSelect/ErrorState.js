BASE.require([
    'jQuery'
], function () {
    BASE.namespace('components.material.inputs.multiSelect')
    
    components.material.inputs.multiSelect.ErrorState = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);

        var $errorMessage = $(tags['error-message']);
        var $tryAgain = $(tags['try-again']);

        self.prepareToActivateAsync = function (options) {
            options.errorMessage = options.errorMessage || "An Error Occurred";
            $errorMessage.text(options.errorMessage);
        };

        $tryAgain.on('click', function () {
            $elem.trigger('try-again');
        });
    };
});