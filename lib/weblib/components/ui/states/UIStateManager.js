BASE.require([
    "jQuery",
    "BASE.util.Observable",
    "BASE.web.Route",
    "components.material.segues.InertSegue"
], function () {
    BASE.namespace("components.ui.states");
    var Future = BASE.async.Future;
    var InertSegue = components.material.segues.InertSegue;
    var emptyFuture = Future.fromResult(undefined);
    var defaultAppearSegue = new InertSegue();
    var defaultDisappearSegue = new InertSegue();

    var emptyFn = function () {
        return undefined;
    };

    components.ui.states.UIStateManager = function (elem, tags) {
        var self = this;
        BASE.util.Observable.call(self);

        var $elem = $(elem);
        var $statesContainer = $(tags['states-container']);

        var initialized = false;
        var activeStates = [];
        var states = {};
        var transitions = Future.fromResult();

        var autoInit;
        if (typeof $(elem).attr("autoinit") === "undefined") {
            autoInit = true;
        } else if ($(elem).attr("autoinit") === "true") {
            autoInit = true;
        } else {
            autoInit = false;
        }

        var recoverFuture = function (future) {
            return future.catchCanceled(emptyFn)["catch"](emptyFn);
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
                } else {
                    $element.addClass("inactive");
                    $element.css("z-index", 1);
                }
            });
        };

        var hasSegue = function (options) {
            return typeof options !== "undefined" && options !== null &&
                typeof options.segue !== "undefined" && options.segue !== null &&
                typeof options.segue.executeAsync === "function";
        };

        var pushAsync = function (element, options) {
            if (typeof element === "undefined") {
                throw new Error("All states need to have a 'name' attribute.");
            }

            return new Future(function (setValue) {
                transitions = recoverFuture(transitions).chain(function (name) {
                    var segue = defaultAppearSegue;

                    if (hasSegue(options)) {
                        segue = options.segue;
                    }

                    var $element = $(element);

                    $element.removeClass("inactive");

                    var prepareFutureArray = [];
                    var name = element.getAttribute("name");

                    var topState = self.getActiveState();
                    if (topState && topState.element === element) {
                        self.updateState(options);
                        setValue(name);
                        return Future.fromResult();
                    }

                    options = options || {};
                    var topStateElement = null;

                    var stateObject = {
                        element: element,
                        name: name,
                        options: options
                    };

                    if (topState) {
                        topStateElement = topState.element;
                        var $topElement = $(topStateElement);
                        var topStateController = $topElement.controller();
                        prepareFutureArray.push(invokeMethodIfExist(topStateController, "prepareToDeactivate"));
                        prepareFutureArray.push(invokeMethodIfExist(topStateController, "prepareToDeactivateAsync"));
                    }

                    var pushToElementController = $element.controller();
                    prepareFutureArray.push(invokeMethodIfExist(pushToElementController, "prepareToActivate", [stateObject.options]));
                    prepareFutureArray.push(invokeMethodIfExist(pushToElementController, "prepareToActivateAsync", [stateObject.options]));

                    prepareFutureArray.push(recoverFuture(segue.executeAsync(topStateElement, $element[0])));
                    return Future.all(prepareFutureArray).chain(function () {
                        if (topStateController) {
                            invokeMethodIfExist(topStateController, "stateBlur")["try"]();
                            invokeMethodIfExist(topStateController, "deactivated")["try"]();
                        }


                        activeStates.push(stateObject);
                        $element.removeClass("inactive");
                        setLayerPrecedence();

                        invokeMethodIfExist(pushToElementController, "stateActive", [stateObject.options])["try"]();
                        invokeMethodIfExist(pushToElementController, "activated", [stateObject.options])["try"]();

                        setValue(stateObject.name);
                    });
                })["try"]();

            });
        };


        var popAsync = function (options) {
            return new Future(function (setValue) {
                transitions = recoverFuture(transitions).chain(function () {
                    if (activeStates.length > 1) {
                        var segue = defaultDisappearSegue;

                        if (hasSegue(options)) {
                            segue = options.segue;
                        }

                        var topState = activeStates.pop();
                        var $topElement = $(topState.element);
                        var topElementController = $topElement.controller();

                        var newTopState = self.getActiveState();
                        var $newTopElement = $(newTopState.element);
                        var newTopElementController = $newTopElement.controller();

                        var prepareFutureArray = [];
                        prepareFutureArray.push(invokeMethodIfExist(topElementController, "prepareToDeactivate"));
                        prepareFutureArray.push(invokeMethodIfExist(topElementController, "prepareToDeactivateAsync"));
                        prepareFutureArray.push(invokeMethodIfExist(newTopElementController, "prepareToActivate"));
                        prepareFutureArray.push(invokeMethodIfExist(newTopElementController, "prepareToActivateAsync"));

                        prepareFutureArray.push(recoverFuture(segue.executeAsync($topElement[0], $newTopElement[0])));

                        return Future.all(prepareFutureArray).chain(function () {
                            var newStateName = $newTopElement.attr("name");


                            /*Blur is not wanted, but we have to keep it for backward comptability*/
                            invokeMethodIfExist(topElementController, "stateBlur")["try"]();
                            invokeMethodIfExist(topElementController, "deactivated")["try"]();

                            if (typeof options === "object" && options !== null) {
                                newTopState.options = options;
                            }

                            setLayerPrecedence();

                            if (newTopState) {
                                /*stateActive and stateFocus are not wanted, but we have to keep it for backward comptability*/
                                invokeMethodIfExist(newTopElementController, "stateActive", [newTopState.options])["try"]();
                                invokeMethodIfExist(newTopElementController, "activated", [newTopState.options])["try"]();
                                invokeMethodIfExist(newTopElementController, "stateFocus")["try"]();
                            }

                            setValue(newTopState.name);
                        });
                    } else {
                        setValue(self.getActiveState().name);
                    }
                })["try"]();
            });
        };

        var replaceAsync = function (element, options) {
            return popAsync().chain(function () {
                return self.pushAsync(element.getAttribute("name"), options);
            });
        };

        var clear = function () {
            $statesContainer.children().each(function () {
                $(this).removeClass("currenty-active-state");
                $(this).addClass("inactive");
            });

            activeStates = [];
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
            if (!initialized) {
                initialized = true;
                // Go through the inactive state container, pulling out
                // each state.
                // The default state should be the first one given, or the last one with the
                // [initial] attribute
                // If the element has a controller, try to call "init" on it.
                var initial;
                $statesContainer.children().each(function () {
                    var elem = this;
                    var name = $(elem).attr("name");
                    if (name) {
                        if (!initial) {
                            initial = elem;
                        }
                        states[name] = elem;
                        $(elem).addClass("inactive");
                        if ($(elem).is("[initial]")) {
                            initial = elem;
                        }
                    }
                });

                Object.keys(states).forEach(function (stateName) {
                    var controller = $(states[stateName]).controller();
                    invokeMethodIfExist(controller, "init", [self]);
                });

                var initialName = $(initial).attr("name");
                self.pushAsync(initialName)["try"]();
                $statesContainer.removeClass("initializing");

                setLayerPrecedence();
            }
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

        self.push = function (name, options) {
            return self.pushAsync(name, options)["try"]();
        };

        self.pushAsync = function (name, options) {
            var element = states[name];
            return pushAsync(element, options);
        };

        self.pop = function (options) {
            return self.popAsync(options)["try"]();
        };

        self.popAsync = function (options) {
            return popAsync(options);
        };

        self.replace = function (name, options) {
            return replaceAsync(states[name], options)["try"]();
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

        self.setStates = function (stateNames) {
            return self.setStatesAsync(stateNames)["try"]();
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

        self.data = {};

        self.initialize = function () {
            initialize();
        };

        if (autoInit) {
            self.initialize();
        }
    };
});