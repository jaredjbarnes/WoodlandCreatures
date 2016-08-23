BASE.require([
		"jQuery",
        "BASE.data.DataContext"
], function () {
    var Future = BASE.async.Future;
    var Fulfillment = BASE.async.Fulfillment;
    var vowelAndSoftSoundRegex = /[aeiouh]/ig;
    var DataContext = BASE.data.DataContext;

    var createWindowName = function (entityDisplay) {
        if (vowelAndSoftSoundRegex.test(entityDisplay.charAt(0))) {
            return "Select an " + entityDisplay;
        } else {
            return "Select a " + entityDisplay;
        }
    };

    var isIndependentType = function (Type, edm) {

        var entity = new Type();
        var mappingTypes = edm.getMappingTypes();

        var isOptionalOneToOne = edm.getOneToOneAsTargetRelationships(entity).every(function (relationship) {
            return relationship.optional;
        });

        var isOptionalOneToMany = edm.getOneToManyAsTargetRelationships(entity).every(function (relationship) {
            return relationship.optional;
        });

        return isOptionalOneToOne && isOptionalOneToMany && !mappingTypes.hasKey(Type);

    };

    BASE.namespace("components.gem.forms");

    components.gem.forms.OneToManyTargetForm = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $table = $(tags["table"]);
        var table = $table.controller();
        var window = null;
        var fulfillment = null;
        var value = null;
        var delegate = null;
        var orderBy = null;
        var entityFormFuture = null;

        var getEntityFormModal = function () {
            if (entityFormFuture == null) {
                return entityFormFuture = services.get("windowService").createModalAsync({
                    componentName: "gem-quick-add-independent-entity-form",
                    height: 500,
                    width: 800
                })
            }

            return entityFormFuture;
        };

        var setupWindow = function (typeDisplay, window) {
            if (typeDisplay.windowSize) {
                window.setSize(typeDisplay.windowSize);
            }

            if (typeDisplay.maxWindowSize) {
                window.setMaxSize(typeDisplay.maxWindowSize);
            }

            if (typeDisplay.minWindowSize) {
                window.setMinSize(typeDisplay.minWindowSize);
            }
        };

        self.setConfigAsync = function (config) {
            var canAdd = false;
            var addAsync = function () { };
            var source = config.entity;
            var displayService = config.displayService;
            var Type = config.relationship.type;
            var typeDisplay = displayService.getDisplayByType(Type);
            var edm = displayService.service.getEdm();
            var keys = edm.getPrimaryKeyProperties(Type).concat(edm.getAllKeyProperties(Type));
            var properties = typeDisplay.listProperties.reduce(function (properties, property) {
                var propertyName = property.propertyName;

                if (keys.indexOf(propertyName) > -1) {
                    return properties;
                }

                properties[propertyName] = property;

                return properties;
            }, {});

            if (isIndependentType(config.relationship.type, edm)) {
                canAdd = true;
                addAsync = function () {
                    var entity = new config.relationship.type();
                    var window = null;
                    var dataContext = new DataContext(displayService.service);
                    dataContext.addEntity(entity);

                    return getEntityFormModal().chain(function (windowManager) {
                        window = windowManager.window;

                        window.setName("Add " + typeDisplay.labelInstance());

                        setupWindow(typeDisplay, window);

                        var controller = windowManager.controller;
                        var saveFuture = controller.setConfigAsync({
                            displayService: displayService,
                            entity: entity
                        });

                        windowManager.window.showAsync().try();
                        return saveFuture
                    }).chain(function () {
                        return dataContext.saveChangesAsync();
                    }).chain(function () {
                        table.searchAsync("").try();
                    }).catch(function (error) {
                        return getDialogModal().chain(function (windowManager) {
                            var dialogWindow = windowManager.window;
                            var controller = windowManager.controller;

                            var fulfillment = controller.getConfirmationForMessageAsync("There was an error while saving: " + error.message);

                            dialogWindow.setName("Error");
                            dialogWindow.setColor("#c70000");

                            return dialogWindow.showAsync().chain(function () {
                                return fulfillment;
                            });
                        });
                    }).finally(function () {
                        dataContext.dispose();
                        return window.closeAsync().try();
                    });
                };
            }

            delegate = {
                canEdit: false,
                canAdd: canAdd,
                canDelete: false,
                selectAsync: function (item) {
                    fulfillment.setValue(item);
                    return window.closeAsync();
                },
                addAsync: addAsync,
                removeAsync: function () { },
                editAsync: function () { },
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
                }
            };

            window.setName(createWindowName(config.label()));
            table.setDelegate(delegate);

            fulfillment = new Fulfillment();
            return fulfillment;
        };

        self.prepareToDeactivateAsync = function () {
            table.searchAsync("").try();
        };

        self.init = function (windowManager) {
            window = windowManager;
        };

        $elem.on("selectionChange", function (event) {
            fulfillment.setValue(event.selectedItems.getValues()[0]);
            window.closeAsync().try();
            return false;
        });
    };
});