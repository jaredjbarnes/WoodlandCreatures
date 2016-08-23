BASE.require([
    "jQuery",
    "components.ui.states.UIStateBehavior",
    "BASE.web.components",
    "BASE.async.Future",
    "components.material.segues.FadeOutFadeIn",
    "BASE.async.delay"
], function () {

    var Future = BASE.async.Future;

    BASE.namespace('components.material.states');

    components.material.states.LazyLoadState = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $appendedElement = $();
        var appendedElementController = {};
        var FadeOutFadeIn = new components.material.segues.FadeOutFadeIn();
        var delay = BASE.async.delay;

        components.ui.states.UIStateBehavior.call(self);

        var createStateAsync = BASE.web.components.createComponent($elem.attr('lazy-load')).chain(function (elem) {
            $appendedElement = $(elem);
            appendedElementController = $appendedElement.controller() || {};
            if (typeof appendedElementController.init === "function") {
                appendedElementController.init(self.stateManager);
            }

            return elem;
        });

        self.prepareToActivateAsync = function (options) {
            return createStateAsync.chain(function () {
                var $preloader = $elem.children(':first-child');

                var preloaderFuture = Future.fromResult();

                if ($preloader.length === 1) {
                    preloaderFuture = delay(1000).chain(function () {
                        FadeOutFadeIn.executeAsync($preloader[0], $appendedElement[0]).then(function () {
                            $preloader.remove();
                        });
                        $elem.append($appendedElement);
                    });
                } else {
                    $elem.html($appendedElement);
                }

                var prepareToActivateFuture = Future.fromResult();

                if (appendedElementController.prepareToActivateAsync) {
                    prepareToActivateFuture = appendedElementController.prepareToActivateAsync.call(appendedElementController, options);
                    if (!(prepareToActivateFuture instanceof Future)) {
                        prepareToActivateFuture = Future.fromResult(prepareToActivateFuture);
                    }
                }

                return Future.all([preloaderFuture, prepareToActivateFuture]);
            });
        };

        self.activated = function () {
            if (appendedElementController.activated) {
                appendedElementController.activated.apply(appendedElementController, arguments);
            }
        };

        self.updateState = function () {
            if (appendedElementController.updateState) {
                appendedElementController.updateState.apply(appendedElementController, arguments);
            }
        };

        self.prepareToDeactivateAsync = function () {
            var prepareToDeactivateFuture = Future.fromResult();
            if (appendedElementController.prepareToDeactivateAsync) {
                prepareToDeactivateFuture = appendedElementController.prepareToDeactivateAsync.apply(appendedElementController, arguments);

                if (!(prepareToDeactivateFuture instanceof Future)) {
                    prepareToDeactivateFuture = Future.fromResult(prepareToDeactivateFuture);
                }

            }
            return prepareToDeactivateFuture
        };

        self.deactivated = function () {
            if (appendedElementController.deactivated) {
                appendedElementController.deactivated.apply(appendedElementController, arguments);
            }
            $appendedElement.detach();
        };

        self.getChildElementAsync = function () {
            return createStateAsync;
        };
		
    }
});