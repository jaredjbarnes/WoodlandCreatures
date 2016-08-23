BASE.require([
    "jQuery",
    "BASE.async.Fulfillment"
], function () {

    var Future = BASE.async.Future;
    var Fulfillment = BASE.async.Fulfillment;

    BASE.namespace("components.material.login");

    components.material.login.MultiFactorInputState = function (elem, tags, scope) {

        var self = this;
        var $submitButton = $(tags["submit-button"]);
        var $tokenInput = $(tags["token-input"]);
        var tokenInputController = $tokenInput.controller();
        var fulfillment = Future.fromResult();

        self.activated = function () {
            $tokenInput.controller().focus();
        }

        $submitButton.on("click", function () {
            tokenInputController.isValidAsync().then(function (isValid) {
                if (!isValid) {
                    $submitButton.controller().shake();
                } else {
                    fulfillment.setValue($tokenInput.controller().getValue().trim());
                    $tokenInput.controller().setValue("");
                }
            });
        });

        self.getGoolgeAuthTokenAsync = function () {
            return fulfillment = new Fulfillment();
        };
       
    };

});