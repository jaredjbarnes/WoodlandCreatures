BASE.require([
		"jQuery",
        "BASE.async.Fulfillment",
        "BASE.data.DataContext",
        "BASE.query.Queryable"
], function () {
    BASE.namespace("components.gem");

    var Fulfillment = BASE.async.Fulfillment;
    var DataContext = BASE.data.DataContext;
    var Queryable = BASE.query.Queryable;

    components.gem.forms.HistoricalCollection = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $ok = $(tags["ok"]);
        var collectionForm = $(tags["collection"]).controller();
        var confirmDeleteModalFuture = null;
        var dialogModalFuture = null;
        var entityFormFuture = null;
        var entityViewFuture = null;
        var fulfillment = null;
        var parentEntity = null;
        var relationship = null;
        var displayService = null;
        var window = null;
        var array = null;

        var getEntityViewFuture = function (viewComponent) {
            if (entityViewFuture == null) {
                return entityViewFuture = services.get("windowService").createModalAsync({
                    componentName: viewComponent.name,
                    height: viewComponent.size && viewComponent.size.height || 500,
                    width: viewComponent.size && viewComponent.size.width || 800
                })
            }

            return entityViewFuture;
        };

        var getConfirmDeleteModal = function () {
            if (confirmDeleteModalFuture == null) {
                return confirmDeleteModalFuture = services.get("windowService").createModalAsync({
                    componentName: "gem-confirm",
                    height: 150,
                    width: 350
                })
            }

            return confirmDeleteModalFuture;
        };

        var getDialogModal = function () {
            if (dialogModalFuture == null) {
                return dialogModalFuture = services.get("windowService").createModalAsync({
                    componentName: "gem-dialog",
                    height: 150,
                    width: 350
                })
            }

            return dialogModalFuture;
        };

        var getEntityFormModal = function () {
            if (entityFormFuture == null) {
                return entityFormFuture = services.get("windowService").createModalAsync({
                    componentName: "gem-one-to-many-collection-entity-form",
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

        self.prepareToDeactivateAsync = function () {
            fulfillment.setValue(parentEntity[relationship.hasMany]);
        };

        self.validateAsync = function () { };
        self.saveAsync = function () { };

        self.setConfigAsync = function (config) {
            fulfillment = new Fulfillment();
            displayService = config.displayService;
            parentEntity = config.entity;
            relationship = config.relationship;

            var edm = displayService.service.getEdm();
            var keys = edm.getPrimaryKeyProperties(relationship.ofType).concat(edm.getAllKeyProperties(relationship.ofType));
            var Type = relationship.ofType;
            var typeDisplay = displayService.getDisplayByType(Type);
            var queryable;

            var properties = typeDisplay.listProperties.orderBy(function (property) {
                return typeof property.sortOrder === "number" ? property.sortOrder : Infinity;
            }).reduce(function (properties, property) {
                var propertyName = property.propertyName;

                if (keys.indexOf(propertyName) > -1 || propertyName === relationship.withOne) {
                    return properties;
                }

                properties[propertyName] = property;

                return properties;
            }, {});

            var delegate = {
                canAdd: typeDisplay.canAdd,
                canEdit: typeDisplay.canEdit,
                canDelete: typeDisplay.canDelete,
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

            if (parentEntity[relationship.hasKey] == null) {
                array = [];
                queryable = array.asQueryable().where(function (expBuilder) {
                    return expBuilder.property("isExpired").isEqualTo(false);
                });

                delegate.addAsync = function () {
                    var entity = new Type();

                    var window = null;
                    return getEntityFormModal().chain(function (windowManager) {
                        window = windowManager.window;

                        window.setName("Add " + typeDisplay.labelInstance());

                        setupWindow(typeDisplay, window);

                        var controller = windowManager.controller;
                        var saveFuture = controller.setConfigAsync({
                            displayService: displayService,
                            parentEntity: parentEntity,
                            entity: entity,
                            relationship: relationship
                        });

                        windowManager.window.showAsync().try();
                        return saveFuture
                    }).chain(function () {
                        array.push(entity);
                        parentEntity[relationship.hasMany].push(entity);
                        return window.closeAsync().chain(function() {
                            return queryable;
                        });
                    });
                };

                delegate.editAsync = function (entity) {
                    var window = null;
                    return getEntityFormModal().chain(function (windowManager) {
                        window = windowManager.window;

                        window.setName("Edit " + typeDisplay.labelInstance());

                        setupWindow(typeDisplay, window);

                        var controller = windowManager.controller;
                        var saveFuture = controller.setConfigAsync({
                            displayService: displayService,
                            parentEntity: parentEntity,
                            entity: entity,
                            relationship: relationship
                        });

                        windowManager.window.showAsync().try();
                        return saveFuture
                    }).chain(function () {
                        return window.closeAsync();
                    });
                };

                delegate.removeAsync = function (items) {
                    var window;

                    return getConfirmDeleteModal().chain(function (windowManager) {
                        var controller = windowManager.controller;
                        var confirmFuture = controller.getConfirmationForMessageAsync("Are you sure you want to delete these items?");
                        window = windowManager.window;

                        windowManager.window.showAsync().try();

                        return confirmFuture;
                    }).chain(function () {
                        items.forEach(function (item) {
                            //THESE HAVE NOT BEEN SAVED TO THE SERVER YET, JUST POP from local array rather than set an enddate
                            array.pop(item);
                            parentEntity[relationship.hasMany].pop(item);
                        });
                    });
                };

                delegate.search = function (text, orderByAsc, orderByDesc) {

                    return typeDisplay.listProperties.reduce(function (queryable, listProperty) {
                        var isOrderByAsc = orderByAsc.indexOf(listProperty.propertyName) > -1;
                        var isOrderByDesc = orderByDesc.indexOf(listProperty.propertyName) > -1;

                        var newQueryable = listProperty.search(queryable, text, isOrderByAsc, isOrderByDesc);
                        if (!(newQueryable instanceof Queryable)) {
                            throw new Error("Expected a Queryable to be returned from list property: " + listProperty.name);
                        }
                        return newQueryable;
                    }, queryable);
                };

            } else {

                delegate.addAsync = function () {
                    var entity = new Type();
                    var window = null;
                    var dataContext = new DataContext(displayService.service);
                    entity = dataContext.loadEntity(entity);

                    return getEntityFormModal().chain(function (windowManager) {
                        window = windowManager.window;

                        window.setName("Add " + typeDisplay.labelInstance());

                        setupWindow(typeDisplay, window);

                        var controller = windowManager.controller;
                        var saveFuture = controller.setConfigAsync({
                            displayService: displayService,
                            parentEntity: parentEntity,
                            entity: entity,
                            relationship: relationship
                        });

                        windowManager.window.showAsync().try();
                        return saveFuture
                    }).chain(function (entity) {
                        entity[relationship.withForeignKey] = parentEntity[relationship.hasKey];
                        return dataContext.saveChangesAsync().chain(function () {
                            collectionForm.searchAsync("").try();
                        });
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

                delegate.editAsync = function (entity) {
                    var window = null;

                    var firstEntity = entity;

                    var dataContext = new DataContext(displayService.service);
                    entity = dataContext.loadEntity(entity);

                    return getEntityFormModal().chain(function (windowManager) {
                        window = windowManager.window;

                        window.setName("Edit " + typeDisplay.labelInstance());

                        setupWindow(typeDisplay, window);

                        var controller = windowManager.controller;
                        var saveFuture = controller.setConfigAsync({
                            displayService: displayService,
                            parentEntity: parentEntity,
                            entity: entity,
                            relationship: relationship
                        });

                        windowManager.window.showAsync().try();
                        return saveFuture
                    }).chain(function (entity) {
                        return dataContext.saveChangesAsync().chain(function () {
                            collectionForm.searchAsync("").try();
                        });
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

                delegate.removeAsync = function (items) {
                    var window = null;
                    var dataContext = new DataContext(displayService.service);
                    return getConfirmDeleteModal().chain(function (windowManager) {
                        var controller = windowManager.controller;
                        var confirmFuture = controller.getConfirmationForMessageAsync("Are you sure you want to delete these items?");
                        window = windowManager.window;
                        windowManager.window.showAsync().try();

                        return confirmFuture;
                    }).chain(function () {
                        items.forEach(function (item) {
                            var loadedItem = dataContext.loadEntity(item);
                            loadedItem.endDate = new Date();
                        });

                        return dataContext.saveChangesAsync().chain(function () {
                            collectionForm.searchAsync("").try();
                        });
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


                if (typeof typeDisplay.searchAsync === "function") {
                    delegate.searchAsync = function () {
                        return typeDisplay.searchAsync.apply(typeDisplay, arguments);
                    };
                }

                delegate.search = function () {
                    var searchQueryable = typeDisplay.search.apply(typeDisplay, arguments);
                    return searchQueryable.where(function (expBuilder) {
                        return expBuilder.and(
                            expBuilder.property(relationship.withForeignKey).isEqualTo(parentEntity[relationship.hasKey]),
                            expBuilder.property("isExpired").isEqualTo(false)
                        );
                    });
                };
            }

            if (typeDisplay.viewComponent && typeDisplay.viewComponent.name) {
                delegate.selectAsync = function (entity) {
                    return getEntityViewFuture(typeDisplay.viewComponent).chain(function (windowManager) {
                        windowManager.controller.setConfig({
                            entity: entity,
                            displaySevice: displayService,
                            delegate: delegate
                        });

                        return windowManager.window.showAsync();
                    });
                };
            }

            collectionForm.setDelegate(delegate);
            return fulfillment;
        };

    };
});