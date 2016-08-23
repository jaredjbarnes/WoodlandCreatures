BASE.require([
    "jQuery",
    "components.material.inputs.Input",
    "Date.prototype.format"
], function () {

    var Future = BASE.async.Future;
    var Input = components.material.inputs.Input;

    BASE.namespace("components.material.inputs");

    components.material.inputs.DateInput = function (elem, tags, scope) {
        var self = this;
        Input.call(self, elem, tags, scope);

        var $elem = $(elem);
        var input = tags["input"];
        var $input = $(input);
        var date = null;
        var dateFormat = "ddd mmm dd yyyy HH:MM:ss";

        /**
        * Sets format of date when displayed in the input
        * @param {format} Date Format.  Examples:
        *                                        "ddd mmm dd yyyy HH:MM:ss",
        *                                        "m/d/yy",
        *                                        "mmm d, yyyy",
        *                                        "mmmm d, yyyy",
        *                                        "dddd, mmmm d, yyyy",
        *                                        shortTime: "h:MM TT",
        *                                        "h:MM:ss TT",
        *                                        "h:MM:ss TT Z",
        *                                        "yyyy-mm-dd",
        *                                        "HH:MM:ss",
        *                                        "yyyy-mm-dd'T'HH:MM:ss",
        *                                        "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        */
        self.setDateFormat = function (format) {
            dateFormat = format;
        }

        //Save methods we are overloading....
        var baseGetValue = self.getValue;
        var baseSetValue = self.setValue;

        /**
        * Trys to parse a date from a string.  Returns a failed Future upon error.
        * @param {dateAsString} requiredPermissions
        * @return {Date} Date object from inputed string or null if invalid
        */
        var dateParse = function (string) {
            var valueDate = new Date(string);

            if (isNaN(valueDate.getTime())) {
                return null;
            } else {
                return valueDate;
            }
        };

        /**
        * Gets the current date value in the input.
        * @return {Date} Currently set date value.
        */
        self.getValue = function () {
            return date;
        };

        var validateNullableDateAsync = function (date) {

            if (date != null && isNaN(date.getTime())) {
                return Future.fromError("Invalid Date");
            } else {
                return Future.fromResult();
            }

        };

        var setValue = function (value) {
            validateNullableDateAsync(value).then(function () {
                date = value;

                if (value === null) {
                    self.reset();
                } else {
                    baseSetValue.call(self, value.format(dateFormat));
                }


            });
        };

        /**
       * Sets the current date value for the input and updates the input text.
       * @param {Date} value - The Date object to set.
       */
        self.setValue = function (value) {
            if (value !== null && !(value instanceof Date)) {
                throw new Error("Invalid parameter value. Not a valid date.");
            }

            validateNullableDateAsync(value).ifError(function() {
                throw new Error("Invalid parameter value. Not a valid date.");
            })["try"]();

            setValue(value);
        }

        $input.on("blur", function () {
            setValue(date);
        });

        //On manual user input, validate the text entered and revert if not a valid date.
        $input.on("input", function () {
            var inputtedValue = baseGetValue.call(self);

            if (inputtedValue === "") {
                date = null;
                return;
            }

            date = new Date(inputtedValue);
        });

        var init = function () {
            //Set date format from Markup
            var formatAttr = $elem.attr("format");
            if (typeof formatAttr !== "undefined")
                self.setDateFormat(formatAttr);

            //If value is assigned in markup, parse to make sure it is a valid date and set with supplied format
            var valueAttr = $elem.attr("value");
            if (typeof valueAttr !== "undefined") {
                date = dateParse(valueAttr);
                self.setValue(date);
            }

            //Register Validator
            self.registerValidator(validateNullableDateAsync);
        }

        init();
    };
});