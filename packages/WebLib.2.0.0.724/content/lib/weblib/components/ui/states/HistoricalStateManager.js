BASE.require([
    "jQuery",
    "BASE.web.queryString",
    "components.ui.states.UIStateManager",
    "BASE.async.Sequence"
], function () {
    BASE.namespace("components.ui.states");

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Sequence = BASE.async.Sequence;
    var querystring = BASE.web.queryString;

    components.ui.states.HistoricalStateManager = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var autoInit;

        var redirects = {};

        if (typeof $(elem).attr("autoinit") === "undefined") {
            autoInit = true;
        } else if ($(elem).attr("autoinit") === "true") {
            autoInit = true;
        } else {
            autoInit = false;
        }

        // Extend the base StateManager
        components.ui.states.UIStateManager.apply(self, arguments);

        var currentStateStack = [];
        var queryString = BASE.web.queryString;

        var originalPush = self.push;
        var originalPop = self.pop;
        var originalReplace = self.replace;
        var originalUpdateState = self.updateState;
        var originalSetStates = self.setStates;
        var optionsToQueryString = querystring.toString;
        var queryStringToOptions = querystring.parse;

        var setHash = function (hash) {
            // This a brain teaser, but 
            toggleObserver.start();
            routeObserver.stop();

            location.hash = hash;
        };

        var defaultState = {
            push: function (stateName, options) {
                var future;
                stateMachine = transitionState;

                // make sure the new state isn't already in the stack
                if (self.getStateStack().indexOf(stateName) > -1) {
                    future = Future.fromError(new Error("The state was already loaded."));
                } else {
                    var newHash = location.hash + "/" + stateName;
                    if (options) {
                        newHash += optionsToQueryString(options);
                    }
                    setHash(newHash);
                    currentStateStack.push({ name: stateName, options: options });

                    future = originalPush.apply(self, arguments);
                }

                return future.then(function () {
                    stateMachine = defaultState;
                });
            },
            pop: function (options) {
                var future;
                var i;
                stateMachine = transitionState;

                if (self.getStateStack().length < 1) {
                    future = Future.fromError(new Error("There wasn't a state to pop."));
                } else {
                    var parts = location.hash.substr(1).split("/");

                    parts.pop();
                    currentStateStack.pop();

                    var newState = parts.pop();
                    var stateParts = newState.split("?");
                    var stateName = stateParts[0];
                    var stateParameters = stateParts[1];

                    parts.push(stateName);

                    var newHash = parts.join("/");

                    if (typeof options === "object" && options !== null) {
                        newHash = newHash + queryString.toString(options);
                    } else {
                        newHash += '?' + stateParameters;
                        options = queryString.parse(stateParameters);
                    }

                    setHash(newHash);

                    future = originalPop.call(self, options);
                }

                return future.then(function () {
                    stateMachine = defaultState;
                });
            },
            replace: function (stateName, options) {
                var future;
                stateMachine = transitionState;

                // make sure the new state isn't already in the stack
                if (self.getStateStack().indexOf(stateName) > -1) {
                    future = Future.fromError(new Error("The state was already loaded."));
                } else {
                    routeObserver.stop();

                    var parts = location.hash.substr(1).split("/");
                    parts.pop();
                    currentStateStack.pop();

                    var newState = stateName;
                    if (options) {
                        newState += optionsToQueryString(options);
                    }
                    parts.push(newState);
                    setHash(parts.join("/"));

                    currentStateStack.push({ name: stateName, options: options });

                    routeObserver.start();
                    future = originalReplace.apply(self, arguments);
                }

                return future.then(function () {
                    stateMachine = defaultState;
                });
            },
            routeHandler: function (hash) {
                var future;

                var stateStack = hash.split("/").filter(function (str) {
                    if (str === "") {
                        return false;
                    }
                    return true;
                }).map(function (str) {
                    return parseStateName(str);
                });

                var newTopState = stateStack[stateStack.length - 1];

                // replace the redirects
                stateStack.forEach(function (state) {
                    if (redirects[state.name]) {
                        state.name = redirects[state.name];
                    }
                });
                var newStateStackHash = "/" + stateStack.map(function (state) {
                    return stateToString(state);
                }).join("/");

                if (currentStateStack) {

                    // Decide how much of the existing stack matches the new one
                    if (currentStateStack.length < stateStack.length) {
                        // we'll be doing some pushing
                        var matchingDepth = 0;
                        currentStateStack.every(function (state, index) {
                            if (state.name === stateStack[index].name) {
                                matchingDepth++;
                                return true;
                            } else {
                                return false;
                            }
                        });
                        if (matchingDepth === currentStateStack.length) {
                            // just push in the remainder of the states
                            var pushSequence = new BASE.async.Sequence();
                            stateStack.slice(matchingDepth).forEach(function (state) {
                                pushSequence.add(originalPush(state.name, state.options));
                            });
                            pushSequence.start();
                        } else {
                            originalSetStates(stateStack);
                        }
                    } else if (currentStateStack.length > stateStack.length) {
                        // we'll be popping here

                        if (currentStateStack.length - stateStack.length === 1) {
                            // pop the difference
                            var state = stateStack[stateStack.length - 1];
                            var options = state ? state.options : undefined;
                            originalPop(options);
                        } else {
                            originalSetStates(stateStack);
                        }
                    } else if (currentStateStack.length === stateStack.length) {
                        // Should we swap a sibling state?
                        var matchingDepth = 0;
                        stateStack.every(function (state, index) {
                            if (state.name === currentStateStack[index].name) {
                                matchingDepth++;
                                return true;
                            } else {
                                return false;
                            }
                        });
                        if (matchingDepth === currentStateStack.length - 1) {
                            // only the last one is different, it's a swap
                            originalReplace(newTopState.name, newTopState.options);
                        } else if (matchingDepth === currentStateStack.length) {
                            // complete match, reload the existing state
                            originalUpdateState(newTopState.options);
                        } else {
                            originalSetStates(stateStack);
                        }

                    }
                }

                currentStateStack = stateStack.slice(0);
            }
        };

        var transitionState = {
            push: function () {
                return new Future();
            },
            pop: function () {
                return new Future();
            },
            replace: function () {
                return new Future();
            },
            routeHandler: function (hash) {
                location.hash = statesToHash(hash);
            }
        };

        self.updateState = function (options) {
            var state = currentStateStack[currentStateStack.length - 1];
            if (state) {
                state.options = options;
                location.hash = "/" + getCurrentHash();
            }
        };

        var stateMachine = defaultState;

        var getCurrentHash = function () {
            return currentStateStack.map(function (state) {
                return stateToString(state);
            }).join("/");
        };

        var parseStateName = function (stateName) {
            stateName = decodeURIComponent(stateName);
            var parts = stateName.split("?");
            var name = parts[0];
            var options = {};
            if (parts[1]) {
                options = queryStringToOptions(parts[1]);
            }
            return { name: name, options: options }
        };

        var stateToString = function (state) {
            var str = state.name;
            if (typeof state.options === "object" && state.options !== null) {
                var queryString = BASE.web.queryString.toString(state.options);
                if (queryString !== "?") {
                    str += queryString;
                }
            }
            return str;
        };

        var statesToHash = function () {
            return currentStateStack.reduce(function (hash, state) {
                return hash += "/" + stateToString(state);
            }, "");
        };

        self.loadInitial = function (state) {
            // Do nothing. Disable base UIStateManager's initial loading.
        };

        self.push = function (stateName, options) {
            return stateMachine.push(stateName, options);
        };

        self.pop = function (options) {
            return stateMachine.pop(options);
        };

        self.replace = function (stateName, options) {
            return stateMachine.replace(stateName, options);
        };

        self.setStates = function (newStack) {
            // todo: support query params here
            var hashParts = newStack.map(function (state) {
                return stateToString(state);
            });
            location.hash = "/" + hashParts.join("/");
        };

        self.startObserving = function () {
            routeObserver.start();
            var originalHash = location.hash.substr(1); // strip the #
            if (originalHash == "") {
                routeObserver.stop();
                var initialName = $(self.getActiveState()).attr("name");
                location.hash = "#/" + initialName;
                currentStateStack = [parseStateName(initialName)];
                routeObserver.start();
            } else {
                stateMachine.routeHandler(location.hash.substring(2));
            }
        };

        self.stopObserving = function () {
            routeObserver.stop();
        };

        self.redirect = function (oldState, newState) {
            redirects[oldState] = newState;
        }

        self.removeRedirect = function (state) {
            redirects[state] = false;
        }

        var toggleObserver = new BASE.web.Route("/").observe().onEach(function () {
            setTimeout(function () {
                routeObserver.start();
            }, 0);
            toggleObserver.stop();
        });

        toggleObserver.stop();

        var routeObserver = new BASE.web.Route("/").observe().onEach(function (hash) {
            stateMachine.routeHandler(hash);
        });

        routeObserver.stop();

        $elem.on("enteredView", function () {
            if (autoInit) {
                self.startObserving();
            }
        });

    };
});