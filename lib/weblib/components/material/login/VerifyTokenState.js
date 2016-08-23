BASE.require([
    "jQuery",
    "components.ui.states.UIStateBehavior",
    "String.prototype.trim",
    "BASE.async.Future",
    "BASE.web.ajax",
    "BASE.async.delay",
    "BASE.web.animation.ElementAnimation"
], function () {

    var Future = BASE.async.Future;
    var delay = BASE.async.delay;

    BASE.namespace("components.material.login");

    components.material.login.VerifyTokenState = function (elem, tags) {
        var self = this;
        var host = "https://api.leavitt.com/";
        var endpoint = "login";
        var $preloader = $(tags["preloader"]);
        var preloaderController = $preloader.controller();
        var $cancelButton = $(tags["cancel-button"]);
        components.ui.states.UIStateBehavior.apply(self);
        var verifyFuture = Future.fromResult();

        $cancelButton.on("click", function () {
            verifyFuture.cancel();
        });

        $cancelButton.on("keyup", function (event) {
            if (event.keyCode === 13) {
                $cancelButton.click();
            }
        });

        self.activated = function () {
            $cancelButton.focus();
        };


        self.deactivated = function () {
            preloaderController.pause();
        };

        self.prepareToActivateAsync = function () {
            preloaderController.play();
        };

        /**
        * 
        * @param {String} token 
        * @return {Future} userData {"personId": 1,"firstName": "","lastName": "","expirationDate": "2015-05-14T11:40:57-06:00","roles": ["",""], "token": ""} 
        */
        self.verifyTokenAsync = function (token) {
            if (typeof token !== "string") {
                throw new Error("Null Parameter error: Token parameters needs to be a string.");
            };

            var settings = {
                headers: { "X-LGToken": token }
            };

            $cancelButton.removeClass("hide");

            return verifyFuture = BASE.web.ajax.GET(host + endpoint, settings)
                ["catch"](function (error) {
                    $cancelButton.addClass("hide");
                    return delay(1500).chain(function () {
                        if (error.xhr.status === 401) {
                            return Future.fromError({
                                type: "Invalid Token",
                                token: token,
                                message: "Invalid Token"
                            });
                        } else {
                            return Future.fromError({
                                type: "Network Error",
                                token: token,
                                message: "Network error: " + error.xhr.message
                            });
                        }
                    });
                }).chain(function (result) {
                    $cancelButton.addClass("hide");
                    return delay(1500).chain(function () {
                        if (result.data.Error) {
                            return Future.fromError({
                                type: "Invalid Token",
                                token: token,
                                message: "Invalid Token"
                            });
                        } else {

                            var resultObject = {
                                expirationDate: result.data.Data.ExpirationDate,
                                personId: result.data.Data.PersonId,
                                firstName: result.data.Data.FirstName,
                                lastName: result.data.Data.LastName,
                                roles: result.data.Data.Roles,
                                token: token
                            }


                            return Future.fromResult(resultObject);
                        }
                    });
                });
        }
    }
});