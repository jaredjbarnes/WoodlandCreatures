BASE.require([], function () {
    BASE.namespace("components.tester");

    components.tester.ControllerInspector = function (elem, tags) {
        var self = this;

        var controller = null;

        var getMethodDescription = function () {

        };

        var getMethodArguments = function () {

        };

        var getMethodProperties = function (controller) {
            var methodProperties = {};

            // Find methods and get there properties.
            for (var x in controller) (function (x) {
                if (typeof controller[x] === "function") {
                    var method = controller[x];

                    var description = getMethodDescription(method);
                    var args = getMethodArguments(method);

                    methodProperties[x] = {
                        description: description,
                        args: args
                    };
                }
            }(x));

            return methodProperties;
        };

        self.setController = function (newController) {
            if (controller) {
                controller = newController;
                var methodProperties = getMethodProperties(controller);
            }
        };




    };
});