BASE.require([
    "jQuery",
    "BASE.async.Future",
    "BASE.async.Fulfillment"
], function () {

    var Future = BASE.async.Future;
    var Fulfillment = BASE.async.Fulfillment;

    BASE.namespace("components.material.login");

    components.material.login.LoggedOutState = function (elem, tags) {

        var self = this;
        var $loginButton = $(tags["ok-button"]);
        var fulfillment = Future.fromResult();

        self.activated = function() {
            $loginButton.focus();
        };

        $loginButton.on("keyup", function (event) {
            if (event.keyCode === 13) {
                $loginButton.click();
            }
        });

        self.waitForRetryClickAsync = function () {
            return fulfillment = new Fulfillment();
        };

        $loginButton.on("click", function () {
            fulfillment.setValue();
            return false;
        });

    };

});