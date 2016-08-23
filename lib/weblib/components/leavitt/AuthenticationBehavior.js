BASE.require([
    "jQuery",
    "BASE.async.Future",
    "BASE.async.Task",
    "BASE.web.ajax",
    "Date.fromISO",
    "BASE.web.cookies",
    "BASE.web.isCORSEnabled"
], function () {
    var Future = BASE.async.Future;
    BASE.namespace("components.leavitt");
    var signInComponentPath = "leavitt-sign-in";
    var veilComponentPath = "ui-veil";
    var transitionComponentPath = "ui-transition";


    components.leavitt.AuthenticationBehavior = function (elem) {
        var self = this;

        var getApiRoot = function () {
            var root;

            if (!BASE.web.isCORSEnabled()) {
                root = "/webapi";
            } else {
                root = "https://api.leavitt.com";
            }
            return root;
        };

        self.authenticatedPersonId = null;
        self.authenticatedPersonFirstName = null;
        self.authenticatedPersonLastName = null;
        self.authenticationExpirationDate = null;

        self.loginTransition = { name: 'slideInTopCenter', duration: 600, easing: 'easeOutExpo' };
        self.loginCompleteTransition = { name: 'slideOutTopCenter', duration: 600, easing: 'easeOutExpo' };

        self.logout = function () {
            delete localStorage.token;
            BASE.web.cookies.setItem("cdsc", "", 0, "/", ".leavitt.com", true);
        };

        var displaySignIn = function () {

            return new Future(function (setValue, setError) {

                new BASE.async.Task(
                    BASE.web.components.createComponent(veilComponentPath),
                    BASE.web.components.createComponent(signInComponentPath),
                    BASE.web.components.createComponent(transitionComponentPath),
                    BASE.web.components.createComponent(transitionComponentPath)
                ).start().whenAll(function (futures) {

                    var $veil = $(futures[0].value);
                    var $signIn = $(futures[1].value);
                    var $transitionSignIn = $(futures[2].value);
                    var $transitionVeil = $(futures[3].value);

                    var presentSignIn = function () {
                        $transitionSignIn.data('controller').append($signIn);
                        $signIn.controller().reset();
                        $veil.data('controller').append($transitionSignIn);
                        $transitionVeil.css({ position: 'absolute', top: 0, left: 0, 'z-index': 3000 }).data('controller').append($veil);
                        $(elem).append($transitionVeil);
                        $transitionVeil.data('controller').fadeIn(self.loginTransition.duration, self.loginTransition.easing);
                        $transitionSignIn.data('controller')[self.loginTransition.name](self.loginTransition.duration, self.loginTransition.easing).then(function () {
                            $signIn.triggerHandler('enteredView');
                        });
                    };

                    var dismissSignIn = function () {
                        $transitionSignIn.data('controller')[self.loginCompleteTransition.name](self.loginCompleteTransition.duration, self.loginCompleteTransition.easing);
                        $transitionVeil.data('controller').fadeOut(self.loginTransition.duration, self.loginTransition.easing).then(function () {
                            $transitionVeil.remove();
                        });
                    };

                    var signInController = $signIn.data("controller");

                    signInController.setRoot(getApiRoot());

                    $signIn.on("signedIn", function (event) {
                        var token = event.token;
                        self.authenticatedPersonId = event.personId;
                        self.authenticatedPersonFirstName = event.firstName;
                        self.authenticatedPersonLastName = event.lastName;
                        self.authenticationExpirationDate = Date.fromISO(event.expirationDate);
                        dismissSignIn();
                        setValue(token);
                    });

                    presentSignIn();
                });

            });
        };

        self.getToken = function () {
            var token;

            // Try local storage first
            if (localStorage) {
                token = localStorage.token;
            }
            // else cookie
            if (!token) {
                token = BASE.web.cookies.getItem("cdsc");
            }

            return token;
        };

        self.getTokenAsync = function () {

            var getTokenFromSignIn = function () {
                return new BASE.async.Future(function (setValue, setError) {
                    displaySignIn().then(function (token) {
                        localStorage.token = token;
                        setValue(token);
                    }).ifError(setError);
                });
            };

            return new Future(function (setValue, setError) {
                var token = self.getToken();

                if (token) {
                    // verify that the token is valid
                    var apiRoot = getApiRoot();
                    BASE.web.ajax.GET(apiRoot + "/Login", {
                        headers: { "X-LGToken": token }
                    }).then(function (response) {
                        self.authenticatedPersonId = response.data.Data.PersonId;
                        self.authenticatedPersonFirstName = response.data.Data.FirstName;
                        self.authenticatedPersonLastName = response.data.Data.LastName;
                        self.authenticationExpirationDate = Date.fromISO(response.data.Data.ExpirationDate);
                        localStorage.token = token;
                        setValue(token);
                    }).ifError(function (e) {
                        // clean up old tokens
                        if (e.xhr.status === 401) {
                            // the token has expired
                            BASE.web.cookies.removeItem("cdsc");
                            if (localStorage) {
                                delete localStorage.token;
                            }
                            getTokenFromSignIn().then(setValue).ifError(setError);
                        } else {
                            // probably no network, give up.
                            setError("No network");
                        }

                    });
                } else {
                    getTokenFromSignIn().then(setValue).ifError(setError);
                }
            });
        };

    };
});