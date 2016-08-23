BASE.require([
		"jQuery",
        "BASE.async.Fulfillment"
], function () {
    var Fulfillment = BASE.async.Fulfillment;
    var Future = BASE.async.Future;

    BASE.namespace("components.gem");

    components.gem.Dialog = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $ok = $(tags["ok"]);
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
            window.hideCloseButton();
        };

        self.setName = function (name) {
            window.setName(name || "");
        };

        self.prepareToActivateAsync = function () { };

        $ok.on("click", function () {
            fulfillment.setValue(true);
            windowManager.closeAsync().try();
        });

    };
});