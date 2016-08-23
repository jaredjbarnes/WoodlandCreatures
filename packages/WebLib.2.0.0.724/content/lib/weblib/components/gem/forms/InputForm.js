BASE.require(["jQuery"], function () {
    var Future = BASE.async.Future;

    BASE.namespace("components.gem.forms");

    components.gem.forms.InputForm = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var inputs = null;
        var $container = $(tags["container"]);
        var inputHash = {};
        var currentConfig = null;

        var getComponentControllersByName = function () {
            return $container.children("[component]").toArray().reduce(function (hash, element) {
                var $element = $(element);
                var name = $element.attr("input-name");

                hash[name] = $(element).controller();
                return hash;
            }, {});
        };

        var cacheInputs = function () {
            inputHash = {};

            return $container.children("[component]").toArray().reduce(function (hash, element) {
                var $element = $(element);
                var name = $element.attr("input-name");

                hash[name] = $(element);
                return hash;
            }, inputHash);
        };

        var hideInputs = function (hiddenInputs) {
            var hiddenHash = hiddenInputs.reduce(function (hash, inputName) {
                hash[inputName] = true;
                return hash;
            }, {});

            Object.keys(inputHash).forEach(function (key) {
                if (hiddenHash[key]) {
                    inputHash[key].addClass("hide");
                } else {
                    inputHash[key].removeClass("hide");
                }
            });
        };

        self.getInputs = function () {
            return Object.keys(inputHash).map(function (key) {
                return inputHash[key].controller();
            });
        };

        self.getInputControllers = function () {
            return Object.keys(inputHash).reduce(function (hash, key) {
                hash[key] = inputHash[key].controller();
                return hash;
            }, {});
        };

        self.setConfigAsync = function (config) {
            currentConfig = config;

            hideInputs(config.hiddenInputs);

            config.typeDisplay.mainInputs.forEach(function (input) {
                var name = input.propertyName;
                var $element = inputHash[name];

                if ($element) {
                    var controller = $element.controller();
                    input.displayService = config.displayService;
                    input.Type = config.Type;
                    input.entity = config.entity;

                    controller.setConfig(input);
                }
            });

            return Future.fromResult();
        };

        self.saveAsync = function () {
            var elements = inputHash;

            var futures = Object.keys(elements).filter(function (key) {
                var $element = elements[key];
                return currentConfig.hiddenInputs.indexOf(key) === -1;
            }).map(function (key) {
                var controller = elements[key].controller();
                return controller.saveAsync();
            });

            return Future.all(futures);
        };

        self.validateAsync = function () {
            var elements = inputHash;

            var futures = Object.keys(elements).filter(function (key) {
                var $element = elements[key];
                return currentConfig.hiddenInputs.indexOf(key) === -1;
            }).map(function (key) {
                var controller = elements[key].controller();
                return controller.validateAsync();
            });

            return Future.all(futures);
        };

        cacheInputs();
    };
});