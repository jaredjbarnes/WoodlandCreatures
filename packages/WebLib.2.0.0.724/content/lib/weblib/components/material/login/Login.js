BASE.require([
    "jQuery",
    "BASE.async.delay",
    "components.material.segues.SlideRightToLeftSoft",
    "components.material.login.AuthenticationResult"
], function () {

    var AuthenticationResult = components.material.login.AuthenticationResult;
    var SlideRightToLeftSoft = new components.material.segues.SlideRightToLeftSoft();

    BASE.namespace("components.material.login");

    components.material.login.Login = function (elem, tags) {
        var self = this;
        var requiredPermissionsForAccess = [];
        var stateManagerController = $(tags["state-manager"]).controller();
        var $elem = $(elem);

        var verifyTokenStateElementFuture = $(tags["verify-token"]).controller().getChildElementAsync();
        var permissionErrorStateElementFuture = $(tags["permission-error"]).controller().getChildElementAsync();
        var networkErrorStateController = $(tags["network-error"]).controller();
        var $userName = $(tags["user-full-name"]);
        var sessionExpirredStateController = $(tags["session-expired-state"]).controller();
        var loggedOutStateController = $(tags["logged-out-state"]).controller();
        var leavittProfileElement = tags["leavitt-profile-image"];
        var $leavittProfileImage = $(leavittProfileElement);
        var leavittProfileImageController = $leavittProfileImage.controller();
        var lastAuthenticationResult = new AuthenticationResult();
        var delay = BASE.async.delay;

        /**
       * Sets up pre-login defaults for picture, fullname and username for the login form.
       * @param {AuthenticationResult}
       * @return
       */
        self.setLastLoggedIn = function (authResult) {
            if (!(authResult instanceof AuthenticationResult))
                throw new Error("authResult is not an instace of AuthenticationResult.");

            lastAuthenticationResult = authResult;
            $userName.text(authResult.fullname);
            leavittProfileImageController.loadImageAsync(authResult.personId)["try"]();

        };

        var hasAllRoles = function (userRoles) {
            var success = requiredPermissionsForAccess.every(function (role) {
                return userRoles.indexOf(role) > -1;
            });
            return success;
        };

        var loginAsync = function () {
            stateManagerController.pushAsync("login-form", { segue: SlideRightToLeftSoft })["try"]();

            return $(tags["login-form"]).controller().getChildElementAsync().chain(function (element) {

                var loginFormController = $(element).controller();
                loginFormController.setDefaultUsername(lastAuthenticationResult.username);

                //Call the login on the login form state
                return loginFormController.loginAsync().chain(function (loginResult) {

                    //If login succeeds, verify the token in order to get the roles.
                    return verifyTokenAndPermissionsAsync(loginResult.token, loginResult.username);
                });
            });
        };


        /**
        * @param {String} token 
        * @return {Future} AuthenticationResult
        */
        var verifyTokenAndPermissionsAsync = function (token, username) {
            stateManagerController.pushAsync("verify-token", { segue: SlideRightToLeftSoft })["try"]();

            return verifyTokenStateElementFuture.chain(function (element) {

                //Handle error on token validation
                return $(element).controller().verifyTokenAsync(token)
                    .catchCanceled(function () {
                        return loginAsync();
                    })
                    ["catch"](function (error) {
                        if (error.type === "Network Error") {
                            stateManagerController.pushAsync("network-error", { segue: SlideRightToLeftSoft })["try"]();
                            return networkErrorStateController.waitForRetryClickAsync().chain(function () {
                                return loginAsync();
                            });
                        } else if (error.type === "Invalid Token") {
                            //If the token is invalid, go directly to the login-input state and start the process over
                            return loginAsync();
                        }

                        return loginAsync();
                    }).chain(function (verifyTokenResult) {

                        //set picture
                        verifyTokenResult.username = username;
                        self.setLastLoggedIn(new AuthenticationResult(verifyTokenResult));

                        //If token is valid, check permissions...
                        if (!hasAllRoles(verifyTokenResult.roles)) {
                            stateManagerController.pushAsync("permission-error", { segue: SlideRightToLeftSoft })["try"]();

                            return permissionErrorStateElementFuture.chain(function (element) {
                                return $(element).controller().waitForRetryClickAsync().chain(function () {
                                    return loginAsync();
                                });
                            });
                        }

                        //Last step is to show the logged in state and return user info...
                        return stateManagerController.pushAsync("logged-in-state", { segue: SlideRightToLeftSoft }).chain(function () {
                            return delay(1000).chain(function () {
                                return new AuthenticationResult(verifyTokenResult);
                            });
                        })["try"]();


                    });
            });
        };

        /**
        * Gets the users token or validates if already exists. If you provide required permissions, the user must posses all permissions to successfully authenticate.  
        * Returns token and array of string premissions the user has. 
        * @param {String} token 
        * @param {String} requiredPermissions
        * @return {Future} AuthenticationResult
        */
        self.authenticateAsync = function (token, requiredPermissions) {

            if (Array.isArray(requiredPermissions)) {
                requiredPermissionsForAccess = requiredPermissions;
            }

            if (typeof token !== "string") {
                return loginAsync();
            } else {
                return verifyTokenAndPermissionsAsync(token, lastAuthenticationResult.username);
            }
        };


        /**
        * Shows user session state expired screen and allows them to re-auth.
        * @param {String} requiredPermissions
        * @return {Future} AuthenticationResult
        */
        self.showSessionExpiredStateWaitForRetryAsync = function () {

            stateManagerController.pushAsync("session-expired-state", { segue: SlideRightToLeftSoft })["try"]();
            return sessionExpirredStateController.waitForRetryClickAsync();
        };

        /**
       * Shows logged in state screen and returning when the user clicks 
       * @param {String} requiredPermissions
       * @return {Future} AuthenticationResult
       */
        self.showLoggedOutStateWaitForRetryAsync = function () {
            stateManagerController.pushAsync("logged-out-state", { segue: SlideRightToLeftSoft })["try"]();
            return loggedOutStateController.waitForRetryClickAsync();
        };

    }
});