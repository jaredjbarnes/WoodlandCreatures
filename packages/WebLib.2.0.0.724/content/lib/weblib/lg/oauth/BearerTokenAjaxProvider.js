BASE.require([
    "BASE.web.HttpRequest",
    "BASE.odata4.OData4DataConverter",
    "BASE.data.responses.ErrorResponse"
], function () {
    var HttpRequest = BASE.web.HttpRequest;
    var _dataConverter = new BASE.odata4.OData4DataConverter();
    var ErrorResponse = BASE.data.responses.ErrorResponse;
    var Future = BASE.async.Future;

    BASE.namespace("lg.oauth");

    lg.oauth.BearerTokenAjaxProvider = function (config) {
        var self = this;
        var tokenProvider = config.tokenProvider;
        var handleUnauthenticatedAsync = config.handleUnauthenticatedAsync;
        var globalAjaxOptions = config.globalAjaxOptions || {};
        var dataConverter = config.dataConverter || _dataConverter;

        if (tokenProvider == null || typeof tokenProvider.getAccessTokenAsync !== "function") {
            throw new Error("Illegal Argument Exception: Expected to have a token provider that implements a method 'getTokenAsync'.");
        }

        if (typeof handleUnauthenticatedAsync !== "function") {
            throw new Error("Illegal Argument Exception: Expected to have a function handling unauthenicated users.");
        }


        self.request = function (url, options) {
            options = options || {};

            Object.keys(globalAjaxOptions).forEach(function (key) {
                if (typeof options[key] === "undefined") {
                    options[key] = globalAjaxOptions[key];
                }
            });

            options.url = url;

            return tokenProvider.getAccessTokenAsync()["catch"](function (error) {
                if (error.type === "unauthenticated") {
                    return handleUnauthenticatedAsync(error.xhr)["catch"](function () {
                        return Future.fromError(new ErrorResponse("Authentication failed."));
                    });
                }

                return Future.fromError(error.xhr);
            }).chain(function (token) {
                options.headers["Authorization"] = "Bearer " + token;
                return dataConverter.handleRequestAsync(options);
            }).chain(function () {
                var request = new HttpRequest(url, options);
                return request.sendAsync();
            }).chain(function (xhr) {
                return dataConverter.handleResponseAsync(xhr);
            })["catch"](function (xhr) {
                return dataConverter.handleErrorResponseAsync(xhr);
            });
        };
    };
});