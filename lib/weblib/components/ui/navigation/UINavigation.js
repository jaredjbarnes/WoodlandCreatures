BASE.require([
    "jQuery",
    "BASE.web.Route",
    "BASE.async.Future",
    "jQuery.fn.region",
    "jQuery.fn.transition",
], function () {

    BASE.namespace("components.ui.navigation");

    var Future = BASE.async.Future;

    var transitionIntoDefault = {
        transform: {
            to: "translate(0px,0px)",
            duration: 700,
            easing: "easeOutExpo"
        }
    };

    var setTransitionOut = {
        slideRight: function (region) {
            return {
                transform: {
                    to: "translate3d(" + region.width + "px, 0,0)",
                    duration: 700,
                    easing: "easeOutExpo"
                }
            };
        },
        slideLeft: function (region) {
            return {
                transform: {
                    to: "translate3d(-" + region.width + "px, 0,0)",
                    duration: 700,
                    easing: "easeOutExpo"
                }
            };
        },
        slideUp: function (region) {
            return {
                transform: {
                    to: "translate3d(0, -" + region.height + "px,0)",
                    duration: 700,
                    easing: "easeOutExpo"
                }
            };
        },
        slideDown: function (region) {
            return {
                transform: {
                    to: "translate3d(0, " + region.height + "px,0)",
                    duration: 700,
                    easing: "easeOutExpo"
                }
            };
        }
    };

    var setCss = {
        slideRight: function (region) {
            return {
                display: "block",
                transform: "translate3d(-" + (region.width) + "px, 0,0)"
            }
        },
        slideDown: function (region) {
            return {
                display: "block",
                transform: "translate3d(0, -" + (region.height) + "px,0)"
            }
        },
        slideLeft: function (region) {
            return {
                display: "block",
                transform: "translate3d(" + (region.width) + "px, 0,0)"
            }
        },
        slideUp: function (region) {
            return {
                display: "block",
                transform: "translate3d(0, " + (region.height) + "px,0)"
            }
        }
    };


    components.ui.navigation.UINavigation = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $inactiveElements = $(tags["inactive"]).children();
        var elements = null;
        var stateStack = [];

        if (localStorage.stateStack) {
            try {
                stateStack = JSON.parse(localStorage.stateStack);
            } catch (e) {
                //Do nothing for now.
            }
        }


        var getElements = function () {
            var elements = {};

            $inactiveElements.each(function () {
                var $this = $(this);
                var controller = $this.controller();
                var name = $this.attr("name");

                if (typeof name === "string") {
                    elements[name] = this;

                    var route = new BASE.web.Route(name);

                    route.observe().onEach(function (hash) {
                        var element = elements[name];
                        if (stateStack[stateStack.length - 2] === name) {
                            self.hide();
                        } else {
                            self.show(name);
                        }

                    });

                    if (controller && typeof controller.initialize === "function") {
                        controller.initialize(self);
                    }
                }

                $this.css({
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    display: "none"
                }).detach().appendTo($elem);

            });

            return elements;
        };



        elements = getElements();

        self.show = function (name, parameters) {
            var element = elements[name];

            if (stateStack[stateStack.length - 1] !== name) {
                if (!element) {
                    throw new Error("Couldn't find element named: \"" + name + "\".")
                }

                stateStack.push(name);

                localStorage.stateStack = JSON.stringify(stateStack);

                $(element).detach().appendTo($elem);

                return new Future(function (setValue) {

                    var region = $elem.region();
                    var transitionIn = $(element).attr("transition-in");
                    var getCss = setCss[transitionIn] || setCss.slideRight;
                    var css = getCss(region);

                    $(element).css(css).transition(transitionIntoDefault).then(setValue);

                }).then();
            } else {
                return Future.fromResult();
            }
        };

        self.hide = function () {
            var name = stateStack.pop();
            localStorage.stateStack = JSON.stringify(stateStack);

            var element = elements[name];

            if (!element) {
                throw new Error("Couldn't find element named: \"" + name + "\".")
            }

            return new Future(function (setValue) {
                var region = $elem.region();
                var transitionOut = $(element).attr("transition-out");
                var getTransition = setTransitionOut[transitionOut] || setTransitionOut.slideLeft;
                var $element = $(element);
                var transition = getTransition(region);

                $element.transition(transition).then(function () {

                    $element.css({
                        display: "none"
                    });

                });
                setValue();
            }).then();
        };


        stateStack.forEach(function (name) {
            var element = elements[name];
            if (element) {
                $(element).detach().appendTo($elem).css("display", "block");
            }
        });

    };

});