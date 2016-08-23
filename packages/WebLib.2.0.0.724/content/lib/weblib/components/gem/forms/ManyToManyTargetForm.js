BASE.require([
		"jQuery",
        "Array.prototype.empty"
], function () {
    var Future = BASE.async.Future;
    var Fulfillment = BASE.async.Fulfillment;

    BASE.namespace("components.gem.forms");

    components.gem.forms.ManyToManyTargetForm = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $cancel = $(tags["cancel"]);
        var $table = $(tags["table"]);
        var $search = $(tags["search"]);
        var table = $table.controller();
        var window = null;
        var fulfillment = null;
        var selectedItems = null;
        var delegate = null;
        var lastOrderBy = null;

        var search = function (orderByAsc, orderByDesc) {
            var search = $search.val();
            return table.setQueryableAsync(delegate.search(search, orderByAsc, orderByDesc)).try();
        };

        self.setConfigAsync = function (config) {
            var displayService = config.displayService;
            var service = displayService.service;
            var Type = config.relationship.type;
            var typeDisplay = displayService.getDisplayByType(Type);
            var relationship = config.relationship;
            var edm = displayService.service.getEdm();
            var keys = edm.getPrimaryKeyProperties(Type).concat(edm.getAllKeyProperties(Type));
            var entity = config.entity;
            entityArray = entity[relationship.withMany];

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

            delegate = {
                search: function () {
                    return typeDisplay.search.apply(typeDisplay, arguments);
                },
                getPropertyLabel: function (propertyName) {
                    return properties[propertyName].label();
                },
                getPropertyWidth: function (propertyName) {
                    return properties[propertyName].width;
                },
                getPropertyDisplay: function (entity, propertyName) {
                    return properties[propertyName].display(entity[propertyName]);
                },
                getPropertyNames: function () {
                    return Object.keys(properties);
                },
                getPrimaryKeyPropertyName: function () {
                    return displayService.edm.getPrimaryKeyProperties(Type)[0];
                },
                orderBy: function (orderByAsc, orderByDesc) {
                    search(orderByAsc, orderByDesc);
                }
            };

            table.setDelegate(delegate);
            self.searchAsync().try();

            return entityArray.asQueryable().toArray().chain(function (array) {
                selectedItems.clear();

                array.forEach(function (item) {
                    selectedItems.add(item[delegate.getPrimaryKeyPropertyName()], item);
                });

                return table.redrawItems();
            });
        };

        self.validateAsync = function () {
            return Future.fromResult();
        };

        self.saveAsync = function () {
            var values = selectedItems.getValues();

            if (typeof entityArray.sync === "function") {
                entityArray.sync(values);
            } else {
                entityArray.empty();
                values.forEach(function (value) {
                    entityArray.push(value);
                });
            }

            return Future.fromResult();
        };


        self.searchAsync = function (text) {
            if (!text) {
                text = $search.val();
            } else {
                $search.val(text);
            }

            return table.setQueryableAsync(delegate.search(text, table.getOrderAscendingColumns(), table.getOrderDescendingColumns()));
        };

        $search.on("keyup", function () {
            search(table.getOrderAscendingColumns(), table.getOrderDescendingColumns());
        });

        $search.on("keydown", function (event) {
            if (event.which === 13) {
                return false;
            }
        });

        selectedItems = table.getSelectedItems();
    };
});

