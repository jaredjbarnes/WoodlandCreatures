BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "BASE.async.Fulfillment"
], function () {
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var Fulfillment = BASE.async.Fulfillment;
    var Future = BASE.async.Future;
    var emptyFuture = Future.fromResult();
    var emptyFn = function () { };

    var recoverFuture = function (future) {
        return future["catch"](emptyFn).catchCanceled(emptyFn);
    };

    jQuery.fn.getModalAsync = function (name) {
        var $this = $(this[0]);
        var event = $.Event("modal");
        event.name = name;
        event.modalManagerAsync = new Fulfillment();
        $this.trigger(event);
        return event.modalManagerAsync;
    };

    BASE.namespace("components.material.layouts");

    components.material.layouts.ModalManager = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var transitions = {};
        var modals = {};

        var initialize = function () {
            $elem.children("[name]").each(function () {
                var $this = $(this);
                var modalName = $this.attr("name");

                var controller = $this.controller();
                invokeMethodIfExists(controller, "setModalManager", [{
                    hideAsync: function (options) {
                        return self.hideModalAsync(modalName, options);
                    },
                    showAsync: function (options) {
                        return self.showModalAsync(modelName, options);
                    }
                }]);
            });

        };

        var getModalControllerByName = function (name) {
            return getModalElementByName(name).controller() || null;
        };

        var getModalElementByName = function (name) {
            element = modals[name];

            if (typeof element === "undefined") {
                element = modals[name] = $elem.children("[name='" + name + "']");
            }

            return element;
        };

        var getModalTransitionAsync = function (modalName) {
            if (transitions[modalName]) {
                return transitions[modalName];
            }

            return emptyFuture;
        };

        var invokeMethodIfExistsAsync = function (controller, methodName, args) {
            var method;
            var future;

            if (!controller) {
                return emptyFuture;
            }

            method = controller[methodName];

            if (typeof method === "function") {
                future = method.apply(controller, args);
                if (future instanceof Future) {
                    return future;
                }

                return emptyFuture;
            }

            return emptyFuture;
        };

        var invokeMethodIfExists = function (controller, methodName, args) {
            var method;

            if (controller === null) {
                return;
            }

            method = controller[methodName];

            if (typeof method === "function") {
                return method.apply(controller, args);
            }
        };

        self.showModalAsync = function (modalName, options) {
            var controller = getModalControllerByName(modalName);

            return transitions[modalName] = recoverFuture(getModalTransitionAsync(modalName)).chain(function () {
                var $element = getModalElementByName(modalName);
                if ($element.hasClass("currently-active")) {
                    return Future.fromError();
                }
            }).chain(function () {
                var prepareToActivateFuture = invokeMethodIfExistsAsync(controller, "prepareToActivateAsync", options).chain(function () {
                    getModalElementByName(modalName).addClass("currently-active");
                });

                return Future.all([prepareToActivateFuture]);
            }).chain(function () {
                return invokeMethodIfExists(controller, "activated", options);
            });

        };

        self.hideModalAsync = function (modalName, options) {
            var controller = getModalControllerByName(modalName);

            return transitions[modalName] = recoverFuture(getModalTransitionAsync(modalName)).chain(function () {
                var $element = getModalElementByName(modalName);
                if (!$element.hasClass("currently-active")) {
                    return Future.fromError();
                }
            }).chain(function () {
                return Future.all([invokeMethodIfExistsAsync(controller, "prepareToDeactivateAsync", options)]);
            }).chain(function () {
                getModalElementByName(modalName).removeClass("currently-active");
                return invokeMethodIfExists(controller, "deactivated", options);
            });
        };

        $elem.children("[name]").on("hideModal", function (event) {
            var $target = $(event.target);
            var modalName = $target.attr("name");

            self.hideModalAsync(modalName)["try"]();
        });

        $elem.on("modal", function (event) {
            var modalName = event.name;

            if (typeof event.name !== "string") {
                throw new Error("The modal event needs to have a name set to the modal's name attribute.");
            }

            if (!(event.modalManagerAsync instanceof Fulfillment)) {
                throw new Error("The modal event needs to have a fulfillment set to the modal property of the event.");
            }

            event.modalManagerAsync.setValue({
                showAsync: function (options) {
                    return self.showModalAsync(modalName, options);
                },
                element: getModalElementByName(modalName),
                controller: getModalControllerByName(modalName)
            });

            return false;
        });

        initialize();

    };
});