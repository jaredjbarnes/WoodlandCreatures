BASE.require([
    "jQuery",
    "BASE.async.Future"
], function () {
    BASE.namespace('components.material.segues');

    var Future = BASE.async.Future;
    components.material.segues.InertSegue = function () {
        var self = this;
        var duration = 0;

        self.getDuration = function () {
            return duration;
        }

        self.executeAsync = function (outboundElement, inboundElement) {
            return Future.fromResult();
        };
    };

});