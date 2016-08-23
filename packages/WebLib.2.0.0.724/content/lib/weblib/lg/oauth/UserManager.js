BASE.require([
    "BASE.async.Future",
    "CryptoJS",
    "lg.oauth.User",
    "BASE.web.Url",
    "BASE.web.queryString",
    "BASE.web.HttpRequest"
], function () {

    var Future = BASE.async.Future;
    var User = lg.oauth.User;
    var Url = BASE.web.Url;
    var queryString = BASE.web.queryString;
    var HttpRequest = BASE.web.HttpRequest;

    BASE.namespace("lg.oauth");

    /**
    * Object that stores authenication data on a logged in user. 
    * @param {object} data OPTIONAL Uses data from object literal data to create AuthenticationResult pre-popualted.
    * @return {AuthenticationResult}
    */

    lg.oauth.UserManager = function (data) {
        var self = this;
        data = data || {};

        var currentPageUrl = new Url(document.location.toString());
        currentPageUrl.setHash("");

        //DEFAULTS
        var localStorageKey = typeof data.localStorageKey === "string" ? data.localStorageKey : "LgUser";
        var loginUrl = data.loginUrl instanceof Url ? data.loginUrl : new Url("https://login.leavitt.com/oauth/");
        var publicApiKey = typeof data.publicApiKey === "string" ? data.publicApiKey : "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzlDs/IW1tIkSJ9G+clkkm0DSb4MmwfVm9WB0CAZ9A1Iatzcm5lxayZmpYsU9XUbcOS2KzE3Dr1VWgmyEnC/KZpDXyRUmoTocQHXGqKahKdLvutC/umXooMW9KReYQ+6ModXYPkBRbMAhqlAOSeDF1IYFmiGxPYe5lziWJ+ANGk8X787eRD99D+hpVb3v4lLYtb+rULHrIoxMjgk5mLqmnbzu2jHEXzx7BRq5kW9VYut6DoBqwWl3PpLNdDoOTgGiBIjanYj9B7apyCy3mK3dc9ND/StdOfhUM+CATRDCuUrvQ937MxRVn7VdhloHpWTqLcyhkLWyNBXlZUVbn7NrFwIDAQAB-----END PUBLIC KEY-----";
        var continueUrl = typeof data.continueUrl === "string" ? data.continueUrl : currentPageUrl.toString();

        Object.defineProperties(self, {
            "localStorageKey": {
                enumerable: true,
                get: function () {
                    return localStorageKey;
                }
            }
        });

        //private fields
        var user = null;
        var accessToken = null;
        var refreshToken = null;

        var getAccessTokenFromApiAsync = function (refreshToken) {
            var body = {
                grant_type: "refresh_token",
                refresh_token: refreshToken
            };
            var request = new HttpRequest("https://oauth2.leavitt.com/token", {
                method: "POST",
                data: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                proxyUrl: "/oauth2api/token"
            });

            return request.sendAsync()["catch"](function (xhr) {
                var body = "";
                try {
                    body = JSON.parse(xhr.responseText);
                } catch (e) {
                    return Future.fromError({
                        message: "The server sent back invalid JSON.",
                        xhr: xhr
                    });
                }
                if (xhr.status === 400 && body != null && body.error === "unauthorized_client") {
                    return Future.fromError({
                        message: "Invalid Refresh Token",
                        type: "Not authenticated",
                        xhr: xhr
                    });
                } else {
                    return Future.fromError({
                        xhr: xhr
                    });
                }
            }).chain(function (xhr) {
                try {
                    var result = JSON.parse(xhr.responseText);
                    return Future.fromResult(result.access_token);
                } catch (e) {
                    return Future.fromError({
                        message: "The server sent back invalid JSON.",
                        xhr: xhr
                    });
                }
            });
        };

        var createUserFromToken = function (refreshToken, accessToken) {
            var payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(accessToken.split(".")[1]));
            var expDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
            expDate.setUTCSeconds(payloadObj.exp);

            return new User({
                personId: parseInt(payloadObj.nameid) || 0,
                firstName: payloadObj.given_name,
                lastName: payloadObj.family_name,
                fullName: payloadObj.unique_name,
                roles: payloadObj.role,
                expirationDate: expDate,
                refreshToken: refreshToken,
                accessToken: accessToken
            });
        };

        var redirectToLogin = function (continueUrl) {
            var params = { "continue": continueUrl };
            loginUrl.setQuery(params);
            document.location = loginUrl.toString();
        };

        var isTokenValid = function (accessToken) {
            var pubkey = KEYUTIL.getKey(publicApiKey);
            try {
                return KJUR.jws.JWS.verifyJWT(accessToken, pubkey, {
                    alg: ["RS256", "RS512", "PS256", "PS512"],
                    iss: ["https://oauth2.leavitt.com/"],
                    verifyAt: KJUR.jws.IntDate.getNow() + 30 //hack...0 doesnt work
                });
            } catch (e) {
                return false;
            }

        };

        var clearHashFromUrl = function () {
            document.location.hash = "";
        };

        var parseTokensFromUrl = function () {
            var currentUrl = new Url(document.location);
            var hash = currentUrl.getHash();
            var parts = queryString.parse(hash);
            if (typeof (parts["refreshToken"]) != "undefined") {
                return parts;
            }
            return null;
        };

        var getLocalTokens = function () {

            //First type and get tokens from URL
            var tokens = parseTokensFromUrl();
            if (tokens != null) {
                accessToken = tokens["accessToken"] || "";
                refreshToken = tokens["refreshToken"];
                clearHashFromUrl();
            } else {
                //Fallback get tokens from localstorage if user has been here before
                var localStorageUser = User.fromLocalStorage(localStorageKey);
                if (localStorageUser.refreshToken != null && localStorageUser.accessToken != null) {
                    accessToken = localStorageUser.accessToken;
                    refreshToken = localStorageUser.refreshToken;
                }
            }
        };
        var fetchAccessTokenAsync = function () {

            getLocalTokens();

            //valid local tokens
            if (accessToken != null && isTokenValid(accessToken)) {
                user = createUserFromToken(refreshToken, accessToken);
                user.saveToLocalStorage(localStorageKey);
                return Future.fromResult(accessToken);
            }

            //Try to use refresh token
            if (refreshToken != null) {
                return getAccessTokenFromApiAsync(refreshToken).chain(function (token) {
                    accessToken = token;

                    if (isTokenValid(accessToken)) {
                        user = createUserFromToken(refreshToken, accessToken);
                        user.saveToLocalStorage(localStorageKey);
                        return Future.fromResult(accessToken);
                    }

                    return Future.fromError({
                        type: "Not authenticated",
                        message: "Not authenticated"
                    });
                });
            }

            return Future.fromError({
                type: "Not authenticated",
                message: "Not authenticated"
            });
        };

        self.logoutAsync = function () {
            accessToken = null;
            refreshToken = null;
            localStorage.removeItem(localStorageKey);

            //TODO:  POST TO API TO EXPIRE REFRESH TOKEN

            return Future.fromResult();
        };

        self.authenticateAsync = function () {
            return fetchAccessTokenAsync().ifError(function (error) {
                if (error.type === "Not authenticated") {
                    redirectToLogin(continueUrl);
                }
            });
        };

        self.getAccessTokenAsync = function () {
            return fetchAccessTokenAsync().ifError(function (error) {
                if (error.type === "Not authenticated") {
                    redirectToLogin(continueUrl);
                }
            }).chain(function () {
                return Future.fromResult(accessToken);
            });
        };

        self.getRolesAsync = function () {
            return fetchAccessTokenAsync().ifError(function (error) {
                if (error.type === "Not authenticated") {
                    redirectToLogin(continueUrl);
                }
            }).chain(function () {
                return Future.fromResult(user.roles);
            });
        };

        self.getUserAsync = function () {
            return fetchAccessTokenAsync().ifError(function (error) {
                if (error.type === "Not authenticated") {
                    redirectToLogin(continueUrl);
                }
            }).chain(function () {
                return Future.fromResult(user);
            });
        };
    };
});