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

    components.gem.inputs.Number = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $label = $(tags["label"]);
        var $input = $(tags["input"]);
        var $error = $(tags["error-message"]);
        var map = defaultMap;
        var validateAsync = defaultValidateAsync;
        var value = null;
        var property = null;
        var Type = null;
        var entity = null;
        var displayService = null;
        var propertyName = null;

        var setValue = function (value) {
            $error.text("");

            if (value == null) {
                $input.val("");
            } else {
                $input.val(value);
            }
        };

        var setLabel = function (label) {
            $label.text(label);
        };

        self.focus = function () {
            return $input.select();
        };

        self.getValue = function () {
            var value = parseFloat($input.val());

            if (isNaN(value)) {
                $input.val("");
                value = null;
            }

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
                $input.prop("disabled", true);
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

        $input.on("keydown", function (e) {
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                // Allow: Ctrl+A
           (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: Ctrl+C
           (e.keyCode == 67 && e.ctrlKey === true) ||
                // Allow: Ctrl+X
           (e.keyCode == 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
           (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
                return;
            }

            $error.text("");
            $elem.trigger("save-needed");

        });
    };
});