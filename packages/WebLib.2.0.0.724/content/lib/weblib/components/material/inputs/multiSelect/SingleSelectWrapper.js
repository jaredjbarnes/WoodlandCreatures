BASE.require([
    "jQuery",
    "components.material.animations.createFadeInAnimation",
    "BASE.async.Fulfillment"
], function () {
    BASE.namespace('components.material.inputs.multiSelect');

    var createFadeInAnimation = components.material.animations.createFadeInAnimation;
    var Fulfillment = BASE.async.Fulfillment;

    components.material.inputs.multiSelect.SingleSelectWrapper = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var currentFulfillment = new Fulfillment();
        var $close = $(tags['close']);
        var modalManager = null;

        var fadeInAnimation = createFadeInAnimation(elem);

        var showModalAsync = function () {
            fadeInAnimation.setTimeScale(1);
            return fadeInAnimation.playToEndAsync();
        }

        var hideModalAsync = function () {
            fadeInAnimation.setTimeScale(2);
            return fadeInAnimation.reverseToStartAsync();
        }

        self.setModalManager = function (value) {
            modalManager = value;
        };

        self.prepareToActivateAsync = function () {
            $elem.css({
                opacity: 0
            });
        };

        self.activated = function () {
            return showModalAsync()["try"]().chain(function () {
                return currentFulfillment = new Fulfillment();
            });
        };

        $elem.on('change', function (event) {
            event.stopPropagation();
            hideModalAsync().then(function () {
                currentFulfillment.setValue(event.item);
                modalManager.hideAsync()["try"]();
            });

        })

        $close.on('click', function () {
            hideModalAsync().then(function () {
                currentFulfillment.cancel();
                modalManager.hideAsync()["try"]();
            });
        });
    };
});