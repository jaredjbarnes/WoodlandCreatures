BASE.require([
		"jQuery"
], function () {
    BASE.namespace("components.gem.forms");

    var Future = BASE.async.Future;

    components.gem.forms.Form = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $container = $(tags["container"]);
        var currentComponents = null;
        var componentsByPropertyName = null;
        var displayService = null;
        var entity = null;
        var Type = null;

        var generateFormAsync = function (properties) {
            componentsByPropertyName = {};

            $container.empty();

            var columnFutures = Object.keys(properties).filter(function (name) {
                var property = properties[name];
                return typeof property.inputComponent === "object" && property.inputComponent != null;
            }).map(function (name) {
                var property = properties[name];
                var inputComponent = property.inputComponent.name;

                return BASE.web.components.createComponentAsync(inputComponent).chain(function (element) {
                    return {
                        name: name,
                        element: element,
                        property: property
                    };
                });
            });

            return Future.all(columnFutures).chain(function (columns) {
                var $fragment = $(document.createDocumentFragment());

                currentComponents = columns.map(function (column) {
                    var $input = $(column.element).css({
                        padding: "8px",
                        boxSizing: "border-box"
                    });

                    if (column.property.formSpan) {
                        $input.attr("span", column.property.formSpan);
                    } else {
                        $input.attr("span", "12");
                    }

                    var inputController = $(column.element).controller();

                    inputController.setConfig({
                        entity: entity,
                        displayService: displayService,
                        propertyName: column.name,
                        Type: Type
                    });

                    $input.appendTo($fragment);
                    componentsByPropertyName[column.name] = inputController;

                    return {
                        column: column,
                        inputController: inputController
                    };
                });

                $container.append($fragment);
            });
        };

        self.setConfigAsync = function (config) {
            entity = config.entity;
            Type = config.Type;
            displayService = config.displayService;

            return generateFormAsync(config.properties).chain(function () {
                if (currentComponents.length > 0) {
                    setTimeout(function () {
                        currentComponents[0].inputController.focus();
                    }, 0);
                }
            }).try();
        };

        self.validateAsync = function () {
            var validationFutures = currentComponents.map(function (columnData) {
                return columnData.inputController.validateAsync();
            });

            return Future.all(validationFutures);
        };

        self.saveAsync = function () {
            var saveFutures = currentComponents.map(function (columnData) {
                return columnData.inputController.saveAsync();
            });

            return Future.all(saveFutures);
        };

    };
});