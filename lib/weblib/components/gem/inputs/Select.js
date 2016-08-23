BASE.require([
		"jQuery"
], function () {
    var Future = BASE.async.Future;
    var defaultValidateAsync = function () {
        return Future.fromResult();
    };
    var defaultMap = function (value) {
        return value;
    };


    BASE.namespace("components.gem.inputs");

    components.gem.inputs.Select = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $label = $(tags["label"]);
        var $input = $(tags["input"]);
        var $error = $(tags["error-message"]);
        var config = null;
        var map = defaultMap;
        var validateAsync = defaultValidateAsync;
        var value = null;
        var property = null;
        var Type = null;
        var entity = null;
        var displayService = null;
        var propertyName = null;
        var options = null;

        var setValue = function (value) {
            $error.text("");

            if (value != null) {
                $input.val(value.toString());
            } else {
                $input.children().first().select();
            }
        };

        var setLabel = function (label) {
            $label.text(label);
        };

        var createOption = function (option) {
            var optionElement = document.createElement("option");
            optionElement.innerText = option.label;
            optionElement.value = option.value;
            return optionElement;
        };

        var createOptions = function (options) {
            var select = document.createElement("select");
            var $newinput = $(select);
            $newinput.addClass("gem-input");
            $newinput.css("width", "100%");

            $input.replaceWith($newinput);
            $input = $newinput;

            options.forEach(function (option) {
                $input.append(createOption(option));
            });

            if (options.length > 0) {
                $input.val(options[0].value);
            }

            $input.on("change", function () {
                $error.text("");
                $elem.trigger("save-needed");
                return false;
            });
        };

        self.focus = function () {
            return $input.select();
        };

        self.setError = function (message) {
            $error.text(message);
        };

        self.getValue = function () {
            var value = $input.val();
            return map(value);
        };

        self.setValue = function (newValue) {
            setValue(newValue);
        };

        self.setConfig = function (config) {
            entity = config.entity;
            Type = config.Type;
            displayService = config.displayService;
            map = config.map || defaultMap;
            propertyName = config.propertyName;
            value = entity[propertyName];
            options = config.component.options || [];
            createOptions(options);
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

    };
});