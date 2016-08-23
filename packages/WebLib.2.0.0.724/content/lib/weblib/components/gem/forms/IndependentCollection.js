BASE.require([
		"jQuery",
        "BASE.data.DataContext"
], function () {
    var Future = BASE.async.Future;
    var DataContext = BASE.data.DataContext;

    BASE.namespace("components.gem.forms");

    components.gem.forms.IndependentCollection = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var collectionForm = $(tags["collection"]).controller();
        var confirmDeleteModalFuture = null;
        var dialogModalFuture = null;
        var entityFormFuture = null;
        var entityViewFuture = null;

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
                    componentName: "gem-independent-entity-form",
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

        var createExpirableDelegate = function (Type, displayService) {
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
                canAdd: typeDisplay.canAdd,
                canEdit: typeDisplay.canEdit,
                canDelete: typeDisplay.canDelete,
                addAsync: function () {
                    var entity = new Type();
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
                        collectionForm.searchAsync("").try();
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
                },
                editAsync: function (entity) {
                    var window = null;
                    var dataContext = new DataContext(displayService.service);
                    entity = dataContext.loadEntity(entity);

                    return getEntityFormModal().chain(function (windowManager) {
                        window = windowManager.window;

                        window.setName("Edit " + typeDisplay.labelInstance());

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
                        collectionForm.searchAsync("").try();
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
                },
                removeAsync: function (items) {
                    var window;

                    return getConfirmDeleteModal().chain(function (windowManager) {
                        var controller = windowManager.controller;
                        var confirmFuture = controller.getConfirmationForMessageAsync("Are you sure you want to delete these items?");
                        window = windowManager.window;

                        windowManager.window.showAsync().try();

                        return confirmFuture;
                    }).chain(function () {
                        var removeItemFutures = items.map(function (item) {
                            return displayService.service.update(Type, item, { endDate: new Date() });
                        });
                        return Future.all(removeItemFutures);
                    }).chain(function () {
                        return collectionForm.searchAsync("").try();
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
                        return window.closeAsync().try();
                    });
                },
                search: function () {
                    return typeDisplay.search.apply(typeDisplay, arguments);
                },
                orderByDesc: function () {

                },
                getPropertyWidth: function (propertyName) {
                    return properties[propertyName].width;
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

            return delegate;
        };

        var createDelegate = function (Type, displayService) {
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
                canAdd: typeDisplay.canAdd,
                canEdit: typeDisplay.canEdit,
                canDelete: typeDisplay.canDelete,
                addAsync: function () {
                    var entity = new Type();
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
                        collectionForm.searchAsync("").try();
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
                },
                editAsync: function (entity) {
                    var window = null;
                    var dataContext = new DataContext(displayService.service);
                    entity = dataContext.loadEntity(entity);

                    return getEntityFormModal().chain(function (windowManager) {
                        window = windowManager.window;

                        window.setName("Edit " + typeDisplay.labelInstance());

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
                        collectionForm.searchAsync("").try();
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
                },
                removeAsync: function (items) {
                    var window;

                    return getConfirmDeleteModal().chain(function (windowManager) {
                        var controller = windowManager.controller;
                        var confirmFuture = controller.getConfirmationForMessageAsync("Are you sure you want to delete these items?");
                        window = windowManager.window;

                        windowManager.window.showAsync().try();

                        return confirmFuture;
                    }).chain(function () {
                        var removeItemFutures = items.map(function (item) {
                            return displayService.service.remove(Type, item);
                        });
                        return Future.all(removeItemFutures);
                    }).chain(function () {
                        return collectionForm.searchAsync("").try();
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
                        return window.closeAsync().try();
                    });
                },
                search: function () {
                    return typeDisplay.search.apply(typeDisplay, arguments);
                },
                orderByDesc: function () {

                },
                getPropertyWidth: function (propertyName) {
                    return properties[propertyName].width;
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

            return delegate;
        };

        self.setDisplay = function (Type, displayService) {
            var typeDisplay = displayService.getDisplayByType(Type);
            var delegate;
            entityViewFuture = null;

            if (typeDisplay.isExpirable) {
                delegate = createExpirableDelegate(Type, displayService);
            } else {
                delegate = createDelegate(Type, displayService);
            }

            if (typeof typeDisplay.searchAsync === "function") {
                delegate.searchAsync = function () {
                    return typeDisplay.searchAsync.apply(typeDisplay, arguments);
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
        };

        self.refreshAsync = function () {
            return collectionForm.searchAsync();
        };
    };
});