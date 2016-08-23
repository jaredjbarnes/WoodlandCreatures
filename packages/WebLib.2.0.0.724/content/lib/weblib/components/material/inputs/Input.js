BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "jQuery.fn.region",
    "components.material.inputs.Validator"
], function () {

    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var Validator = components.material.inputs.Validator;

    BASE.namespace("components.material.inputs");

    var primitiveInputMethods = [
        "blur",
        "select",
        "click",
        "focus",
        "setSelectionRange",
        "setRangeText"
    ];

    components.material.inputs.Input = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var input = tags["input"];
        var $input = $(input);
        var $label = $(tags["label"]);
        var $helper = $(tags["helper"]);
        var $materialInputContainer = $(tags["material-input-container"]);
        var helperHtml = $helper.html();

        Validator.call(self);

        var unfocusedState = {
            handler: function () {
                $label.add($helper).add($input).removeAttr("class");
                $input.css({
                    "border-color": ""
                });
                $helper.html(helperHtml);
                if ($input.val() === "") {
                    labelAnimation.reverse();
                }
            }
        };

        var focusedState = {
            handler: function () {
                if ($elem.is("[focused-class]")) {
                    $label.add($helper).removeAttr("class").addClass($elem.attr("focused-class"));
                    $input.css({
                        "border-color": $label.css("color")
                    });
                } else {
                    $label.add($helper).removeAttr("class").addClass("text-info");
                    $input.removeAttr("class").addClass("border-info");
                }
                labelAnimation.play();
            }
        };

        var errorState = {
            handler: function (message) {
                if ($elem.is("[error-class]")) {
                    $label.add($helper).removeAttr("class").addClass($elem.attr("error-class"));
                    $input.css({
                        "border-color": $label.css("color")
                    });
                } else {
                    $label.add($helper).removeAttr("class").addClass("text-danger");
                    $input.removeAttr("class").addClass("border-danger");
                }
                $helper.text(message);
            }
        };

        var currentState;

        var labelAnimation = new ElementAnimation({
            target: $label[0],
            easing: "easeOutQuad",
            properties: {
                fontSize: {
                    from: "14px",
                    to: "12px"
                },
                translateY: {
                    from: "0px",
                    to: "-25px"
                }
            },
            duration: 200
        });

        var focusHandler = function () {
            $input[0].setSelectionRange(0, 0);
            currentState = focusedState;
            currentState.handler();
        };

        var blurHandler = function () {
            setState();
        };

        self.draw = function () {
            if ($elem.is("[label]")) {
                $label.text($elem.attr("label"));
            }

            if ($elem.is("[name]")) {
                $input.attr("name", $elem.attr("name"));
            }

            if ($elem.is("[disabled]")) {
                $input.attr('disabled', '');
            }

            if ($elem.is("[password]")) {
                $input.attr("type", "password");
            }

            if ($input.val() !== "") {
                labelAnimation.seek(1).render();
            }
        };

        self.initialize = function () {
            $input.attr("tabindex", $elem.attr("tabindex"));
            $elem.removeAttr("tabindex");

            $input.val($elem.attr("value"));
            self.draw();
        };

        self.getValue = function () {
            return $input.val();
        };

        var setState = function() {
            currentState = unfocusedState;
            currentState.handler();
        };

        var setValue = function (value) {
            $input.val(value);
            self.draw();
        }

        self.setValue = function (value) {
            setValue(value);
            setState();
        };

        /**
            * Resets the input and resets the state back to unfocused
        */
        self.reset = function () {
            if ($elem.is("[value]")) {
                setValue($elem.attr("value"));
            } else {
                setValue("");
            }
            currentState = unfocusedState;
            currentState.handler();
        };

        self.isFocused = function () {
            return document.activeElement === input;
        };

        self.setError = function (message) {
            currentState = errorState;
            currentState.handler(message);
        };

        $elem.on("click", function () {
            $input.focus();
        });

        $input.on("change", function () {
            self.draw();
        });

        $input.on("click", function (event) {
            event.stopPropagation();
        });

        $input.on("focus", focusHandler);

        $input.on("blur", blurHandler);

        /* Propagate event to parent */
        $input.on('blur focus', function (event) {
            $elem.triggerHandler(event.type);
        });

        self.initialize();

        //Apply defined native methods to this object
        primitiveInputMethods.forEach(function (key) {
            self[key] = function () {
                input[key].apply(input, arguments);
            };
        });
    };

});