BASE.require([
		"jQuery"
], function () {
    var Future = BASE.async.Future;
    var Fulfillment = BASE.async.Fulfillment;

    BASE.namespace("components.gem.forms");

    components.gem.forms.OneToOneTargetForm = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $cancel = $(tags["cancel"]);
        var $table = $(tags["table"]);
        var table = $table.controller();
        var window = null;
        var fulfillment = null;


        self.setConfigAsync = function (config) {
            fulfillment = new Fulfillment();

            var displayService = config.displayService;
            var Type = config.relationship.type;
            var typeDisplay = displayService.getDisplayByType(Type);
            var edm = displayService.service.getEdm();
            var keys = edm.getPrimaryKeyProperties(Type).concat(edm.getAllKeyProperties(Type));
            var properties = typeDisplay.listProperties.orderBy(function (property) {
                return typeof property.sortOrder === "number" ? property.sortOrder : Infinity;
            }).reduce(function (properties, property) {
                var propertyName = property.propertyName;

                if (keys.indexOf(propertyName) > -1) {
                    return properties;
                }

                properties[propertyName] = property;

                return properties;
            }, {});

            var delegate = {
                search: function (text, orderBy) {
                    return typeDisplay.search(text, orderBy);
                },
                getPropertyLabel: function (propertyName) {
                    return properties[propertyName].label();
                },
                getPropertyDisplay: function (entity, propertyName) {
                    return properties[propertyName].display(entity[propertyName]);
                },
                getPropertyNames: function () {
                    return Object.keys(properties);
                },
                getPrimaryKeyPropertyName: function () {
                    return displayService.edm.getPrimaryKeyProperties(Type)[0];
                }
            };
            table.setDelegate(delegate);
            return fulfillment;
        };

        self.init = function (windowManager) {
            window = windowManager;
        };

        $table.on("selectionChange", function () {
            var entity = table.getSelectedItems().getValues()[0];
            fulfillment.setValue(entity);
            return false;
        });

    };
});