BASE.require([
    "jQuery",
    "jQuery.fn.transition"
], function () {

    var Future = BASE.async.Future;
    var emtpyFuture = Future.fromResult();

    var Fade = function (duration) {
        var self = this;
        duration = duration || 700;

        self.prepareElementsToEnter = function (fromElement, toElement) {
            var $fromElement = $(fromElement);
            var $toElement = $(toElement);

            $toElement.css({
                opacity: 0
            });
        };

        self.prepareElementsToExit = function (fromElement, toElement) {
            var $fromElement = $(fromElement);
            var $toElement = $(toElement);

            $fromElement.css({
                opacity: 0
            });
        };

        self.forward = function (fromElement, toElement) {
            return new Future(function (setValue, setError) {
                var $fromElement = $(fromElement);
                var $toElement = $(toElement);

                if (fromElement) {
                    $(fromElement).transition({
                        opacity: {
                            to: 0,
                            easing: "easeOutExpo",
                            duration: duration
                        }
                    });
                }

                $(toElement).transition({
                    opacity: {
                        from: 0,
                        to: 1,
                        easing: "easeOutExpo",
                        duration: duration
                    }
                }).then(setValue);
            });
        };

        self.back = function (fromElement, toElement) {
            return new Future(function (setValue, setError) {
                var $fromElement = $(fromElement);
                var $toElement = $(toElement);

                if (fromElement) {
                    $fromElement.transition({
                        opacity: {
                            from: 0,
                            to: 1,
                            easing: "easeOutExpo",
                            duration: duration
                        }
                    }).then(setValue);
                }
                $toElement.transition({
                    opacity: {
                        to: 0,
                        easing: "easeOutExpo",
                        duration: duration
                    }
                }).then(setValue);
            });
        };
    };

    BASE.namespace("components.tester");

    components.tester.StateManager = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var statesByName = {};
        var stateDetailsStack = [];
        var defaultSegue = new Fade(700);
        var $stateContainer = $(tags["state-manager-container"]);
        var currentPushFuture = emtpyFuture;
        var state = null;

        var transitionState = {
            push: function () { return emtpyFuture; },
            pop: function () { return emtpyFuture; }
        };

        var callStateControllerMethod = function (controller, methodName, args) {
            args = args || [];
            if (controller && typeof controller[methodName] === "function") {
                controller[methodName].apply(controller, args);
            }
        };

        var defaultState = {
            push: function (name, options) {
                state = transitionState;

                assertStateName(name);
                options = options || {};
                var segue = options.segue || defaultSegue;
                var lastDetails = stateDetailsStack[stateDetailsStack.length - 1];
                var fromState = lastDetails ? lastDetails.to : null;
                var toState = statesByName[name];
                var $fromState = $(fromState);
                var $toState = $(toState);
                var fromController = $fromState.controller();
                var toController = $toState.controller();

                stateDetailsStack.push({
                    segue: segue,
                    from: fromState,
                    to: toState,
                    name: name
                });

                segue.prepareElementsToEnter(fromState, toState);

                $toState.removeClass("inactive-state");

                callStateControllerMethod(fromController, "prepareToDeactivate");
                callStateControllerMethod(toController, "prepareToActivate");

                return currentPushFuture = segue.forward(fromState, toState).then(function () {
                    $fromState.addClass("inactive-state");
                    callStateControllerMethod(fromController, "deactivate");
                    callStateControllerMethod(toController, "activate");

                    currentPushFuture = emtpyFuture;
                    state = defaultState
                });
            },
            pop: function () {
                state = transitionState;

                var details = stateDetailsStack.pop();
                var fromState = details.from;
                var toState = details.to;
                var $fromState = $(fromState);
                var $toState = $(toState);
                var fromController = $fromState.controller();
                var toController = $toState.controller();

                details.segue.prepareElementsToExit(fromState, toState);

                $fromState.removeClass("inactive-state");
                callStateControllerMethod(fromController, "prepareToActivate");
                callStateControllerMethod(toController, "prepareToDeactivate");

                return transitionFuture = details.segue.back(fromState, toState).then(function () {

                    $toState.addClass("inactive-state");
                    callStateControllerMethod(fromController, "activate");
                    callStateControllerMethod(toController, "deactivate");

                    state = defaultState;
                });
            }
        };

        var assertStateName = function (name) {
            if (!statesByName[name]) {
                throw new Error("Cannot find state with name, \"" + name + "\".");
            }
        };

        var getStates = function () {
            $stateContainer.children().each(function () {
                var $this = $(this);
                var name = $this.attr("name");
                var conroller;

                if (name) {
                    statesByName[name] = this;
                    controller = $this.controller();
                    $this.detach()
                        .addClass("all-states")
                        .addClass("inactive-state")
                        .appendTo($elem);

                    if (controller && typeof controller.setStateManager === "function") {
                        controller.setStateManager(self);
                    }
                }
            });
        };

        var setUp = function () {
            state = defaultState;
            getStates();
        };

        self.getStateByName = function (name) {
            return statesByName[name] || null;
        };

        self.push = function (name) {
            //location.hash = name;
            return state.push.apply(self, arguments);
        };

        self.pop = function () {
            return state.pop.apply(self, arguments);
        };

        //$(window).on("popstate", function () {
        //    var details = stateDetailsStack[stateDetailsStack.length - 2];
        //    if (details && location.hash === "#" + details.name) {
        //        self.pop();
        //    }
        //})

        setUp();
    };

});