BASE.require([
    "jQuery",
    "components.material.segues.AppearInstantSegue",
    "components.material.segues.FadeOutFadeIn",
    "components.material.animations.createShrinkHeightAnimation",
    "components.material.animations.createSpinInBottomAnimation",
    "BASE.web.animation.ElementAnimation",
    "BASE.async.Future",
    "BASE.async.delayAsync"
], function () {

    var fadeOutFadeIn = new components.material.segues.FadeOutFadeIn();
    var appearInstantSegue = new components.material.segues.AppearInstantSegue();
    var ListLayout = components.ui.layouts.collections.ListLayout;
    var createShrinkHeightAnimation = components.material.animations.createShrinkHeightAnimation;
    var createSpinInBottomAnimation = components.material.animations.createSpinInBottomAnimation;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var Future = BASE.async.Future;
    var delayAsync = BASE.async.delayAsync;

    BASE.namespace("components.material.inputs.multiSelect");

    components.material.inputs.multiSelect.MultiSelect = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var collectionController = $(tags['collection']).controller();
        var stateManagerController = $(tags['state-manager']).controller();
        var multiSelectAdd = tags['multi-select-add'];
        var $multiSelectAdd = $(multiSelectAdd);
        var singleSelectListController = $(tags['single-select-list']).controller();
        var main = tags['main'];
        var $main = $(main);
        var bottomPosition = 23;
        var rightPosition = 23;
        var scrollWidth = 0;


        var spinAnimationMultiSelectAdd = createSpinInBottomAnimation(multiSelectAdd, bottomPosition);

        var landingMessage = $elem.attr('helper-text');
        var itemComponentName = $elem.attr("item-component-name");

        if (!itemComponentName) {
            throw new Error("A component must be supplied through the item-component-name attribute");
        }

        collectionController.setComponentName(itemComponentName);

        var finalValue = [];

        var removeItem = function (item, element) {
            var index = finalValue.indexOf(item);
            if (index >= 0) {
                finalValue.splice(index, 1);
                var shrinkAnimation = createShrinkHeightAnimation(element);
                shrinkAnimation.playToEndAsync().then(function () {
                    setArrayAsync()["try"]();
                });
            }

            if (finalValue.length === 0) {
                stateManagerController.pushAsync('landing', { segue: fadeOutFadeIn, landingMessage: landingMessage })["try"]();
            }
        };

        var setArrayAsync = function () {
            return collectionController.setArrayAsync(finalValue).chain(function () {
                return calculateAddButtonPosition();
            });
        };

        var calculateAddButtonPosition = function () {

            var tempScrollWidth = $main.outerWidth() - main.scrollWidth;

            if (tempScrollWidth !== scrollWidth) {
                scrollWidth = tempScrollWidth;

                var rightAnimation = new ElementAnimation({
                    target: multiSelectAdd,
                    easing: "easeOutQuad",
                    properties: {
                        right: {
                            from: $multiSelectAdd.css('right'),
                            to: rightPosition + scrollWidth + 'px'
                        }
                    },
                    duration: 200
                });

                return rightAnimation.playToEndAsync();
            }
            return Future.fromResult();
        }

        var showAddButtonAsync = function () {
            spinAnimationMultiSelectAdd.setTimeScale(1);
            return spinAnimationMultiSelectAdd.playToEndAsync();
        }

        var hideAddButtonAsync = function () {
            spinAnimationMultiSelectAdd.setTimeScale(2);
            return spinAnimationMultiSelectAdd.reverseToStartAsync();
        }

        self.setValue = function (value) {
            if (!typeof value === "array") {
                throw (new Error("setValue expects an array passed in for the value."));
            }

            stateManagerController.pushAsync('loading', { segue: appearInstantSegue })["try"]();
            finalValue = value;

            hideAddButtonAsync().chain(function () {
                return setArrayAsync();
            }).chain(function () {
                if (finalValue.length > 0) {
                    return stateManagerController.pushAsync('main', { segue: fadeOutFadeIn });
                } else {
                    return stateManagerController.pushAsync('landing', { segue: fadeOutFadeIn, landingMessage: landingMessage });
                }
            }).then(function () {
                showAddButtonAsync()["try"]();
            }).ifError(function (error) {
                error = error || {};
                error.message = error.message || "An Error Occurred";
                stateManagerController.pushAsync('error', { segue: fadeOutFadeIn, errorMessage: error.message })["try"]();
            });
        };

        self.getValue = function () {
            return finalValue;
        };

        Object.defineProperty(self, "setSearchQueryable", {
            get: function () {
                singleSelectListController.filterAsync;
            },
            set: function (func) {
                singleSelectListController.filterAsync = func;
            }
        });

        self.setSearchQueryable = function (queryable) {
            return [].asQueryable();
        }

        Object.defineProperty(self, "setStringForSearchItem", {
            get: function () {
                return singleSelectListController.getStringForItem;
            },
            set: function (func) {
                singleSelectListController.getStringForItem = func;
            }
        });

        self.setStringForSearchItem = function (item) {
            return item.toString();
        };

        $elem.on('remove-item', function (event) {
            event.stopPropagation();
            var item = event.item;
            var element = event.element;
            if (typeof item === "undefined" || typeof element === "undefined") {
                throw new Error("remove-item needs to be passed the item and the element through the event");
            }
            removeItem(item, element);
        });

        $elem.on('try-again', function (event) {
            event.stopPropagation();
            self.setValue(finalValue);
        });

        $multiSelectAdd.on('click', function (event) {
            event.stopPropagation();
            $multiSelectAdd.getModalAsync('single-select').then(function (modalManager) {
                modalManager.showAsync().then(function (item) {
                    finalValue.unshift(item);
                    singleSelectListController.reset();
                    stateManagerController.pushAsync('loading', { segue: fadeOutFadeIn }).chain(function () {
                        return setArrayAsync();
                    }).chain(function () {
                        return stateManagerController.pushAsync('main', { segue: fadeOutFadeIn });
                    })["try"]();
                }).ifCanceled(function () {
                    singleSelectListController.reset();
                });
                singleSelectListController.focus();
            });
        });
    };

});