BASE.require([
		"jQuery",
        "Date.prototype.format"
], function () {
    var Future = BASE.async.Future;

    BASE.namespace("components.gem.inputs");

    var defaultValidateAsync = function () {
        return Future.fromResult();
    };
    var defaultMap = function (value) {
        return value;
    };

    components.gem.inputs.OneToManyTargetInput = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $label = $(tags["label"]);
        var $input = $(tags["input"]);
        var $view = $(tags["view"]);
        var $change = $(tags["change"]);
        var $error = $(tags["error-message"]);
        var map = defaultMap;
        var validateAsync = defaultValidateAsync;
        var Type = null;
        var value = null;
        var entity = null;
        var displayService = null;
        var parentTypeDisplay = null;
        var typeDisplay = null;
        var propertyName = null;
        var selectorFuture = null;
        var relationship = null;
        var service = null;
        var currentConfig = null;
        var detailWindowFuture = null;

        var getSelectorModal = function () {
            if (selectorFuture == null) {
                return selectorFuture = services.get("windowService").createModalAsync({
                    componentName: "gem-one-to-many-target-form",
                    height: 600,
                    width: 800
                })
            }

            return selectorFuture;
        };

        var getDetailWindow = function () {
            if (detailWindowFuture == null) {
                return detailWindowFuture = services.get("windowService").createWindowAsync({
                    componentName: "gem-independent-entity-form",
                    height: 600,
                    width: 800
                })
            }

            return detailWindowFuture;
        };

        var setValue = function () {
            $error.text("");

            var parentId = entity[relationship.withForeignKey];
            if (parentId == null) {
                $input.val("");
                $view.prop("disabled", true);
                value = null;
            } else {
                $input.val("Loading...");
                parentTypeDisplay.search("", [], []).where(function (expBuilder) {
                    return expBuilder.property(relationship.hasKey).isEqualTo(parentId);
                }).firstOrDefault().then(function (parentEntity) {
                    if (parentEntity == null) {
                        $input.val("");
                        $view.prop("disabled", true);
                        value = null;
                        return;
                    }
                    $view.prop("disabled", false);
                    $input.val(parentTypeDisplay.displayInstance(parentEntity));
                    value = parentEntity;
                });
            }
        };

        var setLabel = function (label) {
            $label.text(label);
        };

        var showSelectorAsync = function () {
            return getSelectorModal().chain(function (windowManager) {
                var future = windowManager.controller.setConfigAsync(currentConfig);
                windowManager.window.showAsync().try();
                return future;
            }).chain(function (newValue) {
                $error.text("");
                value = newValue;
                $input.val(parentTypeDisplay.displayInstance(value));

                if (value == null) {
                    $view.prop("disabled", true);
                } else {
                    $view.prop("disabled", false);
                }

                $error.text("");
                $elem.trigger("save-needed");
            });
        };

        var showDetailWindowAsync = function () {
            if (value != null) {
                var window;
                return getDetailWindow().chain(function (windowManager) {
                    var future = windowManager.controller.setConfigAsync({
                        displayService: currentConfig.displayService,
                        entity: value
                    });
                    window = windowManager.window;

                    var typeDisplay = currentConfig.displayService.getDisplayByType(relationship.type);
                    window.setName("Edit " + typeDisplay.labelInstance());

                    windowManager.window.showAsync().try();
                    return future;
                }).finally(function () {
                    window.closeAsync().try();
                });
            } else {
                return Future.fromResult();
            }
        };

        self.disable = function () {
            $input.prop("disabled", true);
            $change.prop("disabled", true);
        };

        self.enable = function () {
            $input.prop("disabled", false);
            $change.prop("disabled", false);
        };

        self.focus = function () {
            return $input.focus();
        };

        self.getValue = function () {
            return value;
        };

        self.setConfig = function (config) {
            currentConfig = config;
            entity = config.entity;
            propertyName = config.propertyName;
            relationship = config.relationship;
            service = config.displayService.service;
            parentTypeDisplay = config.displayService.getDisplayByType(relationship.type);
            typeDisplay = config.displayService.getDisplayByType(relationship.ofType);

            if (config.readOnly) {
                self.disable();
            } else {
                self.enable();
            }

            setValue();
            setLabel(config.label());
        };

        self.saveAsync = function () {
            var value = self.getValue();
            if (value[relationship.hasKey] != entity[relationship.withForeignKey]) {
                entity[propertyName] = self.getValue();
            }
        };

        self.validateAsync = function () {
            var value = self.getValue();

            return validateAsync(value).chain(function () {
                if (value == null) {
                    return Future.fromError(new Error(typeDisplay.labelInstance() + " needs to have a " + currentConfig.label() + " selected."));
                }
            }).ifError(function (error) {
                $error.text(error.message);
            });
        };

        $change.on("click", function () {
            showSelectorAsync().try();
        });

        $input.on("mousedown", function () {
            return false;
        });

        $input.on("click", function () {
            showSelectorAsync().try();
            return false;
        });

        $view.on("click", function () {
            showDetailWindowAsync().try();
            return false;
        });

    };
});