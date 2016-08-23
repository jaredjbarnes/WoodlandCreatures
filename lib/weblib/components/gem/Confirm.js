BASE.require([
		"jQuery",
        "BASE.async.Fulfillment"
], function () {
    var Fulfillment = BASE.async.Fulfillment;
    var Future = BASE.async.Future;

    BASE.namespace("components.gem");

    components.gem.Confirm = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $yes = $(tags["yes"]);
        var $no = $(tags["no"]);
        var $message = $(tags["message"]);
        var fulfillment = Future.fromResult();
        var windowManager = null;

        self.getConfirmationForMessageAsync = function (message) {
            fulfillment = new Fulfillment();
            $message.text(message);

            return fulfillment;
        };

        self.init = function (window) {
            windowManager = window;
            window.setName("Confirm");
        };

        $no.on("click", function () {
            fulfillment.cancel();
            windowManager.closeAsync().try();
        });

        $yes.on("click", function () {
            fulfillment.setValue(true);
            windowManager.closeAsync().try();
        });

    };
});