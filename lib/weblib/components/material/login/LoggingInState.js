BASE.require([
    "jQuery",
    "BASE.async.Future",
    "BASE.async.delay"
], function () {

    var Future = BASE.async.Future;
    var delay = BASE.async.delay;

    BASE.namespace("components.material.login");

    components.material.login.LoggingInState = function (elem, tags, scope) {

        var self = this;
        var host = "https://api.leavitt.com/";
        var endpoint = "login";
        var $preloader = $(tags["preloader"]);
        var preloaderController = $preloader.controller();
        var $cancelButton = $(tags["cancel-button"]);
        var loginFuture = Future.fromResult();

        self.activated = function () {
            $cancelButton.focus();
        };

        self.deactivated = function () {
            preloaderController.pause();
        };

        self.prepareToActivateAsync = function () {
            preloaderController.play();
        };

        $cancelButton.on("keyup", function (event) {
            if (event.keyCode === 13) {
                $cancelButton.click();
            }
        });

        /**
       * Posts to WebApi login controller with supplied credentials. Returns a token string on success. 
       * @param {string} username - Users authentication 
       * @param {string} password - Users plaintext password 
       * @param {object} factors - Additional factors needed for ex. {"Google Authenticator Factor"}
       * @return {Future} {loginResult} {username: "", token: ""}
       */
        self.loginAsync = function (username, password, factors) {

            $cancelButton.removeClass("hide");

            var data = {
                Username: username,
                Factors: {
                    "PasswordFactor": password
                }
            }

            Object.keys(factors).forEach(function (key) {
                data.Factors[key] = factors[key];
            });

            return loginFuture = BASE.web.ajax.POST(host + endpoint, { data: data })
                ["catch"](function (error) {
                    $cancelButton.addClass("hide");
                    return delay(1000).chain(function () {
                        if (error.xhr.status === 400) {
                            if (error.data.Message === "Missing required factors!") {
                                return Future.fromError({
                                    type: "GoogleAuthRequired",
                                    message: "Google Auth Required"
                                });
                            } else {
                                return Future.fromError({
                                    type: "Invalid Credentials",
                                    message: "Invalid Credentials"
                                });
                            }
                        } else {
                            return Future.fromError({
                                type: "Network Error",
                                message: "Network error: " + error.xhr.message
                            });
                        }
                    });
                }).chain(function (result) {
                    $cancelButton.addClass("hide");
                    return delay(1000).chain(function () {

                        var loginResult = {
                            username: username,
                            token: result.data.Data.Token
                        }
                        return Future.fromResult(loginResult);
                    });
                });
        }

        $cancelButton.on("click", function () {
            loginFuture.cancel();
        });
    };

});