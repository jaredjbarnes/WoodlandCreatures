BASE.require([
    "jQuery",
    "BASE.web.ajax",
    "BASE.async.Fulfillment"
], function () {

    var Future = BASE.async.Future;

    BASE.namespace("components.material.login");

    components.material.login.LoginInputState = function (elem, tags, scope) {
        var self = this;
        var $submitButton = $(tags["submit-button"]);
        var $usernameInput = $(tags["username-input"]);
        var $passwordInput = $(tags["password-input"]);


        var usernameInputController = $usernameInput.controller();
        var passwordInputController = $passwordInput.controller();
        var userInputControllers = [usernameInputController, passwordInputController];
        var isValidFutures = Future.fromResult();
        var fulfillment = Future.fromResult();

        self.init = function (stateManager) {
            self.stateManager = stateManager;

            $usernameInput.controller().registerValidator(function (value) {
                if (!(value !== null && value.split("@")[0].trim() !== "")) {
                    return Future.fromError("Invalid username.");
                }
                return Future.fromResult();
            });


        };

        self.activated = function () {
            if ($usernameInput.controller().getValue().length !== 0) {
                $passwordInput.controller().focus();
            } else {
                if (!$passwordInput.controller().isFocused()) {
                    $usernameInput.controller().focus();
                    $usernameInput.controller().select();
                }
            }
        }

        self.setDefaultUsername = function (username) {
            if (typeof username !== "undefined" && username !== null) {
                $usernameInput.controller().setValue(username);
            }
        };

        self.collectCredentialsAsync = function () {
            return fulfillment = new BASE.async.Fulfillment();
        };

        $submitButton.on("click", function () {

            //Focus on the submit button so the clearing of the password doesn't create a blur and validate to error state
            $submitButton.focus();

            isValidFutures.cancel();
            isValidFutures = Future.all(userInputControllers.map(function (controller) {
                return controller.isValidAsync();
            })).then(function (results) {
                if (!results.every(function (isValid) {
                    return isValid;
                })) {
                    $submitButton.controller().shake();
                    return;
                }

                fulfillment.setValue({
                    username: $usernameInput.controller().getValue().split("@")[0].trim(),
                    password: $passwordInput.controller().getValue().trim()
                });
                $passwordInput.controller().reset();
            });
        });
    };
});