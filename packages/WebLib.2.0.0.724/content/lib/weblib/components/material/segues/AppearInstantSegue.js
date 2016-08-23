BASE.require([
    "jQuery",
    "BASE.async.Future"
], function () {
    BASE.namespace('components.material.segues');

    var Future = BASE.async.Future;
    components.material.segues.AppearInstantSegue = function () {
        var self = this;
        var duration = 0;

        self.getDuration = function () {
            return duration;
        }

        self.executeAsync = function (outboundElement, inboundElement) {
            var $outboundElement = $(outboundElement);
            var $inboundElement = $(inboundElement);

            $outboundElement.css({
                "opacity": 0,
                "transform": ""
            });

            $inboundElement.css({
                "opacity": 1,
                "transform": ""
            });

            return Future.fromResult();
        };
    };

});