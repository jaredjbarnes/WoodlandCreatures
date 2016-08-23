BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline",
    "jQuery.fn.region",
    "Array.prototype.asQueryable",
    "BASE.async.delay",
    "components.material.inputs.Validator",
    "components.material.segues.FadeOutFadeIn",
    "components.material.segues.AppearInstantSegue"
], function () {

    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var emptyQueryableFuture = Future.fromResult([].asQueryable());
    var delay = BASE.async.delay;
    var Validator = components.material.inputs.Validator;
    var FadeOutFadeIn = components.material.segues.FadeOutFadeIn;
    var AppearInstantSegue = components.material.segues.AppearInstantSegue;

    BASE.namespace("components.material.inputs");

    components.material.inputs.SingleSelect = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $label = $(tags['label']);
        var $helper = $(tags['helper']);
        var $dropdown = $(tags['dropdown']);
        var $clickableArea = $(tags['clickable-area']);
        var $search = $(tags["search"]);
        var $list = $(tags["list"]);
        var searchController = $search.controller();
        var listController = $list.controller();
        var finalValue = null;
        var $materialInputContainer = $(tags['material-input-container']);
        var helperHtml = $helper.html();
        var $stateManager = $(tags['state-manager']);
        var stateManagerController = $stateManager.controller();
        var $dropdownContentContainer = $(tags['dropdown-content-container']);
        var preloaderLineController = $(tags['preloader-line']).controller();
        var $errorMessage = $(tags['error-message']);
        var fadeOutFadeIn = new FadeOutFadeIn();
        var appearInstantSegue = new AppearInstantSegue();

        Validator.call(self);

        var defaultState = {
            handler: function () {
                $materialInputContainer.removeAttr("class");
                $helper.html(helperHtml);
            }
        }

        var errorState = {
            handler: function (message) {
                if ($elem.is("[error-class]")) {
                    $materialInputContainer.removeAttr("class").addClass($elem.attr("error-class"));
                } else {
                    $materialInputContainer.removeAttr("class").addClass("text-danger");
                }
                $helper.text(message);
            }
        };

        var currentState = defaultState;

        var setValueElement = function (item) {
            if (item === null) {
                self.reset();
            } else {
                $label.text(self.getStringForItem(item));
            }
            finalValue = item;
        };

        var dropdownContentContainerAnimation = new ElementAnimation({
            target: $dropdownContentContainer[0],
            easing: "linear",
            properties: {
                opacity: {
                    from: 0,
                    to: 1
                }
            }
        });

        var dropdownAnimation = new ElementAnimation({
            target: $dropdown[0],
            easing: "easeOutQuad",
            properties: {
                scaleX: {
                    from: 0,
                    to: 1
                },
                scaleY: {
                    from: 0,
                    to: 1
                }
            }
        });

        var lastSearchFuture = Future.fromResult();

        var search = function () {
            lastSearchFuture.cancel();
            preloaderLineController.play();

            lastSearchFuture = doSearchAsync(searchController.getValue());
            lastSearchFuture["try"]();

        };

        var doSearchAsync = function (search) {
            var now = Date.now();
            return delay(300).chain(function () {
                return Future.all([
                    self.filterAsync(search),
                    stateManagerController.pushAsync('loading', { segue: fadeOutFadeIn })
                ]);
            }).chain(function (results) {

                var queryable = results[0];
                return listController.setQueryableAsync(queryable).chain(function (count) {
                    if (count) {
                        return stateManagerController.pushAsync('results', { segue: fadeOutFadeIn });
                    } else {
                        return stateManagerController.pushAsync('no-results', { segue: fadeOutFadeIn });
                    }
                }).ifError(function (error) {

                    if (error instanceof BASE.data.responses.ConnectionErrorResponse) {
                        $errorMessage.text("Could not perform search due to a connection problem, please verify connectivity and try again");
                    } else {
                        $errorMessage.text(error.message);
                    }


                    stateManagerController.pushAsync('error', { segue: fadeOutFadeIn })["try"]();
                }).finally(function () {
                    preloaderLineController.pause();
                });
            });
        }

        var timeline = new PercentageTimeline(400);
        timeline.add({
            animation: dropdownContentContainerAnimation,
            startAt: .5,
            endAt: 1
        }, {
            animation: dropdownAnimation,
            startAt: 0,
            endAt: 1
        });

        self.reset = function () {
            finalValue = null;
            self.draw();
        }

        self.show = function () {
            currentState = defaultState;
            $dropdown.removeClass("hide");
            timeline.seek(0).render();
            timeline.setTimeScale(1);
            timeline.play();
        };

        self.hide = function () {
            timeline.setTimeScale(2);
            timeline.reverse();
            var observer = timeline.observe("start", function () {
                $dropdown.addClass("hide");
                searchController.setValue('');
                observer.dispose();
            })
        };

        self.draw = function () {
            var currentValue = self.getValue();

            if (currentValue === null) {
                $label.text($elem.attr('label'));
            } else {
                self.setValue(currentValue);
            }
        }

        self.getValue = function () {
            return finalValue;
        };

        self.setValue = function (value) {
            if (typeof value === "undefined") {
                return;
            }
            setValueElement(value);
        };

        self.getStringForItem = function (item) {
            return item.toString();
        };

        self.filterAsync = function () {
            return emptyQueryableFuture;
        };

        self.setError = function (message) {
            currentState = errorState;
            currentState.handler(message);
        };
        

        $search.on("input", search);
        
        $clickableArea.on('click', function (event) {
            var showSearchResults = $elem.attr("show-search-results") ;

            self.show();
            stateManagerController.pushAsync('pre-search', { segue: appearInstantSegue })["try"]();
            if (showSearchResults) {
                search();
            }
            searchController.select();
        });

        $search.on("blur", function (e) {
            setTimeout(function () {
                if ($(document.activeElement).closest($elem).length === 0) {
                    self.hide();
                } else {
                    $stateManager.focus();
                }
            }, 0);
        });

        $stateManager.on("blur", function (e) {
            setTimeout(function () {
                if ($(document.activeElement).closest($elem).length === 0) {
                    self.hide();
                }
            }, 0);
        });

        $elem.children().on('change', function (event) {
            event.stopPropagation();
        });

        $elem.on("selectedItem", function (event) {
            event.stopPropagation();
            currentState.handler();
            finalValue = event.item;
            self.setValue(finalValue);
            self.hide();
            $elem.trigger({
                type: "change",
                item: finalValue
            });
            return false;
        });

        listController.getLayout().prepareElement = function (item, entity, index) {
            var $item = $(item);
            var itemController = $(item).controller();

            var value = self.getStringForItem(entity);
            itemController.setValue(entity, value);

        };

        self.draw();
    };

});