BASE.require([
    "jQuery",
    "BASE.web.Route",
    "components.material.segues.InertSegue",
    "jQuery.fn.region",
    "BASE.web.animation.ElementAnimation"
], function () {
    BASE.namespace("components.material.states");
    var Future = BASE.async.Future;
    var InertSegue = components.material.segues.InertSegue;
    var emptyFuture = Future.fromResult(undefined);
    var defaultAppearSegue = new InertSegue();
    var defaultDisappearSegue = new InertSegue();
    var ElementAnimation = BASE.web.animation.ElementAnimation;

    var emptyFn = function () {
        return undefined;
    };

    components.material.states.StateManager = function (elem, tags) {
        var self = this;

        var $elem = $(elem);

        var initialized = false;
        var activeStates = [];
        var states = {};
        var transitions = Future.fromResult();

        var resizeStateManagerAsync = function ($inboundElement, $outboundElement, duration) {
            if ($outboundElement) {
                var outboundHeight = $outboundElement.region().height;
                $outboundElement.removeClass('state-manager-top-state');
                $elem.css('height', outboundHeight + 'px');
            }

            duration = duration || 1;

            var regionElem = $elem.region();
            var regionInboundElement = $inboundElement.region();

            var elementAnimation = new ElementAnimation({
                target: elem,
                easing: 'easeOutExpo',
                properties: {
                    height: {
                        from: regionElem.height + 'px',
                        to: (regionInboundElement && regionInboundElement.height + 'px') || '0px'
                    }
                },
                duration: duration
            });

            return elementAnimation.playToEndAsync().chain(function () {
                $inboundElement.addClass('state-manager-top-state');
                $elem.css('height', 'auto');
            });
        };

        var recoverFuture = function (future) {
            return future.catchCanceled(emptyFn)["catch"](emptyFn);
        };

        var getStateName = function (state) {
            if (!state) {
                return null;
            }

            return state.name;
        };

        var invokeMethodIfExist = function (controller, methodName, args) {
            var returnValue = emptyFuture;

            if (!Array.isArray(args)) {
                args = [];
            }

            if (controller) {
                var method = controller[methodName];
                if (typeof method === "function") {
                    returnValue = method.apply(controller, args);

                    if (!(returnValue instanceof Future)) {
                        returnValue = Future.fromResult(returnValue);
                    }

                }
            }

            return recoverFuture(returnValue);
        };

        var setLayerPrecedence = function () {
            var activeStateHash = activeStates.reduce(function (activeStateHash, state, index) {
                activeStateHash[state.name] = index + 2;
                return activeStateHash;
            }, {});

            Object.keys(states).forEach(function (name) {
                var $element = $(states[name]);

                if (typeof activeStateHash[name] === "number") {
                    $element.css("z-index", activeStateHash[name]);
                    $element.addClass('state-manager-on-stack');
                    $element.removeClass('state-manager-off-stack');
                } else {
                    $element.removeClass("state-manager-on-stack");
                    $element.addClass('state-manager-off-stack');
                    $element.css("z-index", 1);
                }
            });
        };

        var hasSegue = function (options) {
            return typeof options !== "undefined" && options !== null &&
                typeof options.segue !== "undefined" && options.segue !== null &&
                typeof options.segue.executeAsync === "function";
        };

        var createStateObject = function (element, options) {
            var name = element.getAttribute("name");

            var stateObject = {
                element: element,
                name: name,
                options: options
            };

            return stateObject;
        };

        var goToStateAsync = function (stateObject) {
            var element = stateObject.element;
            var options = stateObject.options || {};
            var name = stateObject.name;

            setLayerPrecedence();

            if (typeof element === "undefined") {
                throw new Error("The push to State does not exist.");
            }

            return new Future(function (setValue) {
                transitions = recoverFuture(transitions).chain(function () {
                    var segue = defaultAppearSegue;
                    var $element = $(element);
                    var prepareFutureArray = [];
                    var topState = activeStates[activeStates.length - 2];
                    var topStateElement = null;
                    var pushToElementController = $element.controller();

                    if (hasSegue(options)) {
                        segue = options.segue;
                    }

                    $elem.triggerHandler({
                        type: "stateChange",
                        newStateName: name,
                        newStateOptions: options,
                        oldStateName: getStateName(topState),
                        oldStateOptions: topState && topState.options ? topState.options : {},
                        stateStack: self.getStateStack()
                    });

                    if (topState && topState.element === element) {
                        self.updateState(options);
                        setValue(name);
                        return Future.fromResult();
                    }

                    if (topState) {
                        topStateElement = topState.element;
                        var $topElement = $(topStateElement);
                        var topStateController = $topElement.controller();
                        prepareFutureArray.push(invokeMethodIfExist(topStateController, "prepareToDeactivateAsync"));
                    }

                    prepareFutureArray.push(invokeMethodIfExist(pushToElementController, "prepareToActivateAsync", [stateObject.options]).chain(function () {
                        var duration = 1;

                        if (typeof segue.getDuration !== undefined) {
                            duration = segue.getDuration();
                        }

                        return resizeStateManagerAsync($element, $topElement, duration);
                    }));

                    prepareFutureArray.push(recoverFuture(segue.executeAsync(topStateElement, $element[0])));

                    return Future.all(prepareFutureArray).chain(function () {

                        if (topStateController) {
                            invokeMethodIfExist(topStateController, "deactivated")["try"]();
                        }

                        invokeMethodIfExist(pushToElementController, "activated", [stateObject.options])["try"]();

                        setValue(stateObject.name);
                    });
                })["try"]();

            });
        };

        var pushAsync = function (element, options) {
            var stateObject = createStateObject(element, options);
            var activeState = self.getActiveState();

            if (activeState && activeState.element === element) {
                return replaceAsync.apply(null, arguments);
            } else {
                activeStates.push(stateObject);
                return goToStateAsync(stateObject);
            }
        };

        var popAsync = function (options) {
            return new Future(function (setValue) {
                transitions = recoverFuture(transitions).chain(function () {
                    if (activeStates.length > 0) {

                        var segue = defaultDisappearSegue;

                        if (hasSegue(options)) {
                            segue = options.segue;
                            delete options.segue;
                        }

                        var topState = activeStates.pop();
                        var $topElement = $(topState.element);
                        var topElementController = $topElement.controller();

                        var newTopState = self.getActiveState() || {};
                        newTopState.options = options && Object.keys(options).length > 0 ? options : newTopState.options;
                        var $newTopElement = $(newTopState.element);
                        var newTopElementController = $newTopElement.controller();

                        $elem.triggerHandler({
                            type: "stateChange",
                            newStateName: getStateName(newTopState),
                            newStateOptions: newTopState.options || {},
                            oldStateName: getStateName(topState),
                            oldStateOptions: topState.options || {},
                            stateStack: self.getStateStack()
                        });

                        var prepareFutureArray = [];
                        prepareFutureArray.push(invokeMethodIfExist(topElementController, "prepareToDeactivateAsync"));
                        prepareFutureArray.push(invokeMethodIfExist(newTopElementController, "prepareToActivateAsync", [newTopState.options]).chain(function () {
                            var duration = 1;

                            if (typeof segue.getDuration !== undefined) {
                                duration = segue.getDuration();
                            }

                            return resizeStateManagerAsync($newTopElement, $topElement, duration);
                        }));

                        prepareFutureArray.push(recoverFuture(segue.executeAsync($topElement[0], $newTopElement[0])));

                        return Future.all(prepareFutureArray).chain(function () {
                            var newStateName = $newTopElement.attr("name");

                            invokeMethodIfExist(topElementController, "deactivated")["try"]();

                            setLayerPrecedence();

                            invokeMethodIfExist(newTopElementController, "activated", [newTopState.options])["try"]();
                            setValue(newTopState.name);
                        });
                    } else {
                        setValue(self.getActiveState().name);
                    }
                })["try"]();
            });
        };

        var replaceAsync = function (element, options) {
            var stateObject = createStateObject(element, options);
            var topState = self.getActiveState();

            activeStates.push(stateObject);

            return goToStateAsync(stateObject).chain(function () {
                var index = activeStates.indexOf(topState);
                if (index > -1) {
                    activeStates.splice(index, 1);
                }
                setLayerPrecedence();
            });
        };

        var clear = function () {
            activeStates = [];
            setLayerPrecedence();
        };

        var setStatesAsync = function (newStates) {
            clear();

            return newStates.reduce(function (future, state) {
                return future.chain(function () {
                    return pushAsync(state.state, state.options);
                });
            }, Future.fromResult());
        };

        var updateState = function (options) {
            var stateToBeUpdated = activeStates[activeStates.length - 1];
            stateToBeUpdated.options = options;
            var controller = $(stateToBeUpdated.element).controller();
            invokeMethodIfExist(controller, "updateState", [options]);
        };

        var initialize = function () {
            // Go through the state manager, pulling out
            // each state.
            // If the element has a controller, try to call "init" on it.
            $elem.children().each(function () {
                var $this = $(this);
                var name = $this.attr("name");
                if (name) {
                    states[name] = this;
                } else {
                    throw new Error("All states need to have a 'name' attribute.");
                }
            });

            Object.keys(states).forEach(function (stateName) {
                var controller = $(states[stateName]).controller();
                invokeMethodIfExist(controller, "init", [self]);
            });

            setLayerPrecedence();
        };

        self.getActiveState = function () {
            var state = activeStates[activeStates.length - 1];
            return state;
        };

        self.getStateStack = function () {
            return activeStates.map(function (state) {
                return state.name;
            });
        };

        self.pushAsync = function (name, options) {
            var element = states[name];

            return pushAsync(element, options);
        };

        self.popAsync = function (options) {
            return popAsync(options);
        };

        self.replaceAsync = function (name, options) {
            return replaceAsync(states[name], options);
        };

        self.clear = function () {
            return clear();
        };

        self.getState = function (stateName) {
            return states[stateName];
        };

        self.getStates = function () {
            return states;
        };

        self.setStatesAsync = function (stateNames) {
            var newStates = stateNames.map(function (state) {
                return { state: states[state.name], options: state.options };
            });
            return setStatesAsync(newStates);
        };

        self.updateState = function (options) {
            return updateState(options);
        };

        initialize();
    };
});