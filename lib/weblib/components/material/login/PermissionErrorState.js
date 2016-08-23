BASE.require([
    "jQuery",
    "BASE.async.Future",
    "BASE.async.Fulfillment"
], function () {

    var Future = BASE.async.Future;
    var Fulfillment = BASE.async.Fulfillment;

    BASE.namespace("components.material.login");

    components.material.login.PermissionErrorState = function (elem, tags) {

        var self = this;
        var $retryButton = $(tags["retry-button"]);
        var fulfillment = Future.fromResult();

        self.waitForRetryClickAsync = function () {
            return fulfillment = new Fulfillment();
        };

        $retryButton.on("click", function () {
            fulfillment.setValue();
            return false;
        });

        self.activated = function () {
            $retryButton.focus();
        };

        $retryButton.on("keyup", function (event) {
            if (event.keyCode === 13) {
                $retryButton.click();
            }
        });

    };
});