BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.material.inputs");
    var Future = BASE.async.Future;

    components.material.inputs.Validator = function () {
        var self = this;
        var validators = [];

        self.isValidAsync = function () {

            return self.validate().chain(function () {
                return true;
            })["catch"](function () {
                return false;
            }).chain(function (value) {
                return value;
            });

        };

        var setupValidation = function () {
            var value = self.getValue();

            return validators.slice(0).map(function (validator) {
                return validator(value);
            });
        };

        self.validateAsync = function () {
            return Future.all(setupValidation()).ifError(function (message) {
                self.setError(message);
            });
        };

        self.validate = function () {
            return Future.all(setupValidation())["try"]().ifError(function (message) {
                self.setError(message);
            });
        };

        self.getValue = function() {
            throw new Error('You need to overwrite getValue method.');
        };

        self.setError = function () {
            throw new Error('You need to overwrite setError method.');
        };

        self.getValidators = function () {
            return validators;
        };

        self.registerValidator = function (validator) {
            if (typeof validator !== "function") {
                throw new Error("Validator needs to be a function.");
            }

            validators.push(validator);

            return {
                dispose: function () {
                    var index = validators.indexOf(validator);

                    if (index > -1) {
                        validators.splice(index, 1);
                    }
                }
            };
        };
    }
});