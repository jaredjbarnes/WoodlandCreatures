/// <reference path="D:\LG Data\grandmaster-nosubmodules\Websites\landscape.leavitt.com\project\lib/weblib/lib/BASE/BASE.js" />
BASE.require([
    "jQuery",
    "components.material.segues.SlideRightToLeftSoft"
], function () {

    var Future = BASE.async.Future;

    BASE.namespace("components.material.login");

    components.material.login.LoginFormState = function (elem, tags) {
        var self = this;
        var stateManagerController = $(tags["state-manager"]).controller();
        var networkErrorStateController = $(tags["network-error"]).controller();
        var inputStateElementFuture = $(tags["login-input-state"]).controller().getChildElementAsync();
        var loggingInController = $(tags["logging-in-state"]).controller();
        var invalidCredElementFuture = $(tags["invalid-credentials"]).controller().getChildElementAsync();
        var multiFactorElementFuture = $(tags["multi-factor-input"]).controller().getChildElementAsync();
        var SlideRightToLeftSoft = new components.material.segues.SlideRightToLeftSoft();
        var defaultUserName = null;

        var doLoginAsync = function (username, password, factors) {

            stateManagerController.pushAsync("logging-in-state", { segue: SlideRightToLeftSoft })["try"]();

            return loggingInController.loginAsync(username, password, factors)
                ["catch"](function (error) {
                    self.setDefaultUsername(username);

                    if (error.type === "Invalid Credentials") {
                        stateManagerController.pushAsync("invalid-credentials", { segue: SlideRightToLeftSoft })["try"]();

                        return invalidCredElementFuture.chain(function (element) {
                            return $(element).controller().waitForRetryClickAsync().chain(function () {
                                return self.loginAsync();
                            });
                        });

                    } else if (error.type === "Network Error") {
                        stateManagerController.pushAsync("network-error", { segue: SlideRightToLeftSoft })["try"]();

                        return networkErrorStateController.waitForRetryClickAsync().chain(function () {
                            return self.loginAsync();
                        });

                    } else if (error.type === "GoogleAuthRequired") {
                        stateManagerController.pushAsync("multi-factor-input", { segue: SlideRightToLeftSoft })["try"]();

                        return multiFactorElementFuture.chain(function (element) {
                            return $(element).controller().getGoolgeAuthTokenAsync().chain(function (googleAuthToken) {
                                return doLoginAsync(username, password, { "GoogleAuthFactor": googleAuthToken });
                            });
                        });
                    }

                    //Default case is ??
                    return self.loginAsync();
                })
                .catchCanceled(function () {
                    self.setDefaultUsername(username);
                    return self.loginAsync();
                }).chain(function(result) {
                    stateManagerController.pushAsync("empty", { segue: SlideRightToLeftSoft })["try"]();
                    return result;
                });
        };

        self.setDefaultUsername = function (username) {
            defaultUserName = username;
        }

        /**
        * Authenticates with web api login controller with supplied credentials. Returns a token string on success. 
        * @return {Future} {loginResult} {username: "", token: ""}
        */
        self.loginAsync = function () {

            return inputStateElementFuture.chain(function (inputStateElement) {
                stateManagerController.pushAsync("login-input-state", { segue: SlideRightToLeftSoft })["try"]();

                var controller = $(inputStateElement).controller();
                controller.setDefaultUsername(defaultUserName);

                return controller.collectCredentialsAsync(defaultUserName).chain(function (credentials) {
                    return doLoginAsync(credentials.username, credentials.password, []);
                });
            });
        };
    };
});