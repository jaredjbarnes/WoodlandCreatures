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

    components.gem.inputs.Date = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $label = $(tags["label"]);
        var $input = $(tags["input"]);
        var $change = $(tags["change"]);
        var $error = $(tags["error-message"]);
        var map = defaultMap;
        var validateAsync = defaultValidateAsync;
        var value = null;
        var property = null;
        var Type = null;
        var entity = null;
        var displayService = null;
        var propertyName = null;
        var calendarFuture = null;

        var getCalendarModal = function () {
            if (calendarFuture == null) {
                return calendarFuture = services.get("windowService").createModalAsync({
                    componentName: "gem-calendar",
                    height: 403,
                    width: 232
                })
            }

            return calendarFuture;
        };

        var setValue = function (value) {
            $error.text("");

            if (value == null) {
                $input.val("");
                return;
            }

            $input.val(value.format("mm/dd/yyyy"));
        };

        var setLabel = function (label) {
            $label.text(label);
        };

        var showCalendar = function () {
            getCalendarModal().chain(function (windowManager) {
                windowManager.controller.setValue(value);

                return windowManager.window.showAsync().chain(function () {
                    return windowManager.controller.getFulfillment();
                });
            }).chain(function (newValue) {
                value = newValue;
                setValue(value);

                $error.text("");
                $elem.trigger("save-needed");
            }).try();
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
            return map(value);
        };

        self.setError = function (message) {
            $error.text(message);
        };

        self.setValue = function (newValue) {
            setValue(newValue);
        };

        self.setConfig = function (config) {
            entity = config.entity;
            Type = config.Type;
            displayService = config.displayService;
            propertyName = config.propertyName;
            value = entity[propertyName];
            validateAsync = config.validateAsync || defaultValidateAsync;


            if (config.readOnly) {
                self.disable();
            } else {
                self.enable();
            }

            setValue(value);
            setLabel(config.label());
        };

        self.saveAsync = function () {
            entity[propertyName] = self.getValue();
        };

        self.validateAsync = function () {
            return validateAsync(self.getValue()).ifError(function (error) {
                self.setError(error.message);
            });
        };

        $change.on("click", function () {
            showCalendar();
        });

        $input.on("mousedown", function () {
            return false;
        });

        $input.on("click", function () {
            showCalendar();
            return false;
        });

    };
});