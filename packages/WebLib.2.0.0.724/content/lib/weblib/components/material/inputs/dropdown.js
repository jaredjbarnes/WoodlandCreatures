BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline",
    "jQuery.fn.region",
    "components.material.inputs.Validator"
], function () {

    var emptyFn = function () { };
    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var Validator = components.material.inputs.Validator;

    BASE.namespace("components.material.inputs");

    components.material.inputs.Dropdown = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $label = $(tags['label']);
        var $helper = $(tags['helper']);
        var $dropdown = $(tags['dropdown']);
        var $menu = $dropdown.find('[selector="menu"]');
        var $clickableArea = $(tags['clickable-area']);
        var $materialInputContainer = $(tags["material-input-container"]);
        var initialValue = null;
        var helperHtml = $helper.html();
        var selectedElement = null;

        Validator.call(self);

        var draggingState = {
            handler: emptyFn
        }

        var defaultState = {
            handler: function () {
                $materialInputContainer.removeAttr("class");
                $helper.html(helperHtml);
            }
        }

        var clickState = {
            handler: function () {
                defaultState.handler();
                setValueElement($(selectedElement));
                $elem.focus();
                $elem.triggerHandler('change');
            }
        }

        var errorState = {
            handler: function (message) {
                if ($elem.is("[error-class]")) {
                    $materialInputContainer.removeAttr("class").addClass($elem.attr("error-class"));
                } else {
                    $materialInputContainer.removeAttr("class").addClass("text-danger");
                }
                $helper.text(message);
            }
        };

        var currentState = defaultState;

        if ($menu.length === 0) {
            throw new Error("You need to specify an element with an attribute, selector=\"menu\", this allows us to know what the element is the menu and what element is the helper.");
        }

        var menuAnimation = new ElementAnimation({
            target: $menu[0],
            easing: "linear",
            properties: {
                opacity: {
                    from: 0,
                    to: 1
                }
            }
        });

        var dropdownAnimation = new ElementAnimation({
            target: $dropdown[0],
            easing: "easeOutQuad",
            properties: {
                scaleX: {
                    from: 0,
                    to: 1
                },
                scaleY: {
                    from: 0,
                    to: 1
                }
            }
        });

        var selectItem = function ($item) {
            $menu.find('[selected]').removeAttr('selected');
            $item.attr('selected', '');
        }

        var timeline = new PercentageTimeline(400);
        timeline.add({
            animation: menuAnimation,
            startAt: .5,
            endAt: 1
        }, {
            animation: dropdownAnimation,
            startAt: 0,
            endAt: 1
        });

        var show = function () {
            currentState = defaultState;
            $elem.off('focus');
            $dropdown.removeClass("hide");
            $dropdown.focus();
            timeline.setTimeScale(1);
            timeline.play();
        };

        var focusHandler = function () {
            show();
        }

        var hide = function () {
            currentState.handler();
            timeline.setTimeScale(2);
            timeline.reverse();
            var observer = timeline.observe("start", function () {
                $dropdown.addClass("hide");
                $elem.on('focus', focusHandler);
                observer.dispose();
            });
        };

        var setValueElement = function ($item) {
            $label.text($item.text());
            selectItem($item);
        };

        var initialize = function () {
            initialValue = self.getValue();
            self.draw();
        };

        self.draw = function () {
            var currentValue = self.getValue();

            if (currentValue === null) {
                $label.text($elem.attr('label'));
            } else {
                self.setValue(currentValue);
            }
        }

        self.getValue = function () {
            var $selected = $menu.children('[selected]');
            if ($selected.length === 1) {
                return $selected.attr('value') || $selected.text();
            } else {
                return null;
            }

        };

        self.reset = function () {
            self.setValue(initialValue);
            self.draw();
            currentState = defaultState;
        };

        self.setValueElement = function (item) {
            setValueElement($(item));
        }

        self.setValue = function (value) {
            $menu.children().each(function () {
                var $this = $(this);
                var text = $this.text();
                var attrValue = $this.attr('value');
                if (attrValue === value || text === value) {
                    setValueElement($this);
                    return false;
                }
            });
        }

        self.setError = function (message) {
            currentState = errorState;
            currentState.handler(message);
        };

        $menu.on('touchmove', function () {
            currentState = draggingState;
        });

        $menu.on('click', '> div', function (event) {
            currentState = clickState;
            selectedElement = this;
            $dropdown.blur();
        });

        $clickableArea.on('click', function (event) {
            event.preventDefault();
            show();
        });

        /*This should only ever get called if we tab to the dropdown*/
        $elem.on('focus', focusHandler);

        $dropdown.on('blur', hide);

        $dropdown.on('wheel', function () {
            //This is so that Chrome can wake up with scrolling. 
        });

        initialize();
    };

});