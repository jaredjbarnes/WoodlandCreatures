BASE.require([
    "jQuery",
    "BASE.web.components",
    "BASE.async.Future",
    "BASE.async.delayAsync",
    "BASE.util.invokeMethodIfExists",
    "BASE.util.invokeMethodIfExistsAsync",
    "components.material.animations.createFadeInAnimation",
    "components.material.animations.createFadeOutAnimation"
], function () {

    var Future = BASE.async.Future;
    var invokeMethodIfExists = BASE.util.invokeMethodIfExists;
    var invokeMethodIfExistsAsync = BASE.util.invokeMethodIfExistsAsync;
    var delayAsync = BASE.async.delayAsync;
    var createFadeInAnimation = components.material.animations.createFadeInAnimation;
    var createFadeOutAnimation = components.material.animations.createFadeOutAnimation;

    BASE.namespace('components.material.states');

    components.material.states.LazyLoad = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $appendedElement = $();
        var appendedElementController = {};
        var $preloader = $elem.children(':first-child');
        var delayAmount = 500;
        var $error = $(tags['error']);
        var $errorMessage = $(tags['error-message']);
        var $tryAgain = $(tags['try-again']);

        var errorMessages = {
            0: "Unable to connect to the Internet.",
            404: "The requested page cannot be found.",
            unknown: "There was an error loading the page."
        };

        var createComponentAsync = function () {
            return BASE.web.components.createComponentAsync($elem.attr('lazy-load')).chain(function (element) {
                $appendedElement = $(element);
                $appendedElement.addClass($elem.attr('lazy-load-class') || '');
                appendedElementController = $appendedElement.controller() || {};
                invokeMethodIfExists(appendedElementController, 'init', [self.stateManagerController]);
                return element;
            });
        };

        var createDelayFuture = function () {
            return $preloader.length === 0 ? Future.fromResult() : delayAsync(delayAmount);
        };

        var createComponentFuture = createComponentAsync();

        var delayFuture = createDelayFuture();

        var createStateAsync = function () {
            return Future.all([createComponentFuture, delayFuture]).chain(function (resultArray) {
                return resultArray[0];
            });
        };

        var errorFadeInAnimation = createFadeInAnimation($error[0], 350);

        var hideErrorAsync = function () {
            errorFadeInAnimation.setTimeScale(2);
            return errorFadeInAnimation.reverseToStartAsync().chain(function () {
                $error.addClass('hide');
                $preloader.removeClass('hide');
            });
        };

        var showErrorAsync = function (message) {
            $preloader.addClass('hide');
            errorFadeInAnimation.setTimeScale(1);
            message = message || errorMessages.unknown;
            $errorMessage.text(message);
            $error.css({
                'opacity': 0
            });
            $error.removeClass('hide');
            return errorFadeInAnimation.playToEndAsync();
        };

        self.init = function (stateManagerController) {
            self.stateManagerController = stateManagerController;
        };

        self.prepareToActivateAsync = function () {
            hideErrorAsync()["try"]();
            var args = arguments;
            return createStateAsync().chain(function () {
                $error.remove();

                var preloaderFuture = Future.fromResult();

                if ($preloader.parent().length === 1) {
                    $preloader.css({ position: "absolute", top: 0, left: 0 });
                    $elem.append($appendedElement);

                    var fadePreloaderFuture = createFadeOutAnimation($preloader[0], 100).playToEndAsync().chain(function () {
                        $preloader.remove();
                    });

                    var fadeAppendedElement = createFadeInAnimation($appendedElement[0], 100);
                    var fadeInElementFuture = fadeAppendedElement.playToEndAsync();

                    preloaderFuture = Future.all([fadePreloaderFuture, fadeInElementFuture]);

                } else {
                    $elem.append($appendedElement);
                }

                var prepareToActivateFuture = invokeMethodIfExistsAsync(appendedElementController, 'prepareToActivateAsync', args);

                return Future.all([preloaderFuture, prepareToActivateFuture]);
            }).ifError(function (error) {
                error = error || {};
                var status = error.status;
                var message = errorMessages[status];
                showErrorAsync(message)["try"]();
            });
        };

        self.activated = function () {
            invokeMethodIfExists(appendedElementController, 'activated', arguments);
        };

        self.updateState = function () {
            invokeMethodIfExists(appendedElementController, 'updateState', arguments);
        };

        self.prepareToDeactivateAsync = function () {
            return invokeMethodIfExistsAsync(appendedElementController, 'prepareToDeactivateAsync', arguments);
        };

        self.deactivated = function () {
            invokeMethodIfExists(appendedElementController, 'deactivated', arguments);
            $appendedElement.detach();
        };

        self.getChildElementAsync = function () {
            return createStateAsync();
        };

        self.tryAgain = function () {
            createComponentFuture = createComponentAsync();
            delayFuture = createDelayFuture();
            self.prepareToActivateAsync().chain(function () {
                self.activated();
            })["try"]();
        };

        $tryAgain.on('click', function () {
            self.tryAgain();
        });

    }
});