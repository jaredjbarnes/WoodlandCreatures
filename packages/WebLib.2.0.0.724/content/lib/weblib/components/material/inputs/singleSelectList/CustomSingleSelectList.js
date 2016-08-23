BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline",
    "jQuery.fn.region",
    "Array.prototype.asQueryable",
    "BASE.async.delayAsync",
    "components.material.segues.FadeOutFadeIn",
    "components.material.segues.AppearInstantSegue",
    "BASE.data.responses.ConnectionErrorResponse"
], function () {

    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var emptyQueryableFuture = Future.fromResult([].asQueryable());
    var delayAsync = BASE.async.delayAsync;
    var Validator = components.material.inputs.Validator;
    var FadeOutFadeIn = components.material.segues.FadeOutFadeIn;
    var AppearInstantSegue = components.material.segues.AppearInstantSegue;
    var ITEM_HEIGHT = 48;

    BASE.namespace("components.material.inputs.singleSelectList");

    components.material.inputs.singleSelectList.CustomSingleSelectList = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $search = $(tags["search"]).children().eq(0);
        var searchController = $search.controller();
        var list = tags["list"];
        var $list = $(list);
        var listController = $list.controller();
        var finalValue = null;
        var stateManagerController = $(tags['state-manager']).controller();
        var preloaderLineController = $(tags['preloader-line']).controller();
        var $errorMessage = $(tags['error-message']);
        var fadeOutFadeIn = new FadeOutFadeIn();
        var appearInstantSegue = new AppearInstantSegue();
        var singleSelectActiveIndex = 0;
        var $currentlyActiveItem = null;

        var lastSearchFuture = Future.fromResult();

        if (!searchController || !searchController.setValue || !searchController.getValue) {
            throw new Error('The embeded component must have setValue and getValue methods');
        }

        var search = function () {
            lastSearchFuture.cancel();
            lastSearchFuture = doSearchAsync(searchController.getValue());
            lastSearchFuture["try"]();
        };

        var init = function () {
            stateManagerController.replaceAsync('pre-search', { segue: appearInstantSegue })["try"]();
        };

        var doSearchAsync = function (search) {
            return delayAsync(300).chain(function () {
                preloaderLineController.play();
                return Future.all([
                    self.filterAsync(search),
                    stateManagerController.replaceAsync('loading', { segue: fadeOutFadeIn })
                ]);
            }).chain(function (results) {
                var queryable = results[0];
                singleSelectActiveIndex = 0;
                $currentlyActiveItem = null;
                list.scrollTop = 0;
                return listController.setQueryableAsync(queryable).chain(function (count) {
                    if (count) {
                        return stateManagerController.replaceAsync('results', { segue: fadeOutFadeIn });
                    } else {
                        return stateManagerController.replaceAsync('no-results', { segue: fadeOutFadeIn });
                    }
                }).ifError(function (error) {
                    error = error || {};
                    if (error instanceof BASE.data.responses.ConnectionErrorResponse) {
                        $errorMessage.text("Could not perform search due to a connection problem, please verify connectivity and try again");
                    } else {
                        if (error.message) {
                            $errorMessage.text(error.message);
                        } else {
                            $errorMessage.text("An Error Occurred");
                        }
                    }


                    stateManagerController.replaceAsync('error', { segue: fadeOutFadeIn })["try"]();
                }).finally(function () {
                    preloaderLineController.restart();
                    preloaderLineController.stop();
                });
            });
        };

        self.filterAsync = function (search) {
            return emptyQueryableFuture;
        };

        self.focus = function () {
            $search.trigger('click');
        };

        self.getStringForItem = function (item) {
            return item.toString();
        };

        self.setValue = function (value) {
            searchController.setValue(value);
            search();
        };

        self.getValue = searchController.getValue;

        self.reset = function () {
            searchController.setValue(null);
            singleSelectActiveIndex = 0;
            $currentlyActiveItem = null;
            stateManagerController.replaceAsync('pre-search', { segue: appearInstantSegue })["try"]();
        };

        listController.getLayout().prepareElement = function (item, entity, index) {
            var $item = $(item);
            $item.removeClass('single-select-item-active');

            if (index === singleSelectActiveIndex) {
                $item.addClass('single-select-item-active');
                $currentlyActiveItem = $item;
            }

            var itemController = $(item).controller();

            var value = self.getStringForItem(entity);
            itemController.setValue(entity, value);
        };

        $search.on("input", search);

        $search.on("change", function (event) {
            event.stopPropagation();
        });

        $elem.on("selectedItem", function (event) {
            event.stopPropagation();
            finalValue = event.item;
            $elem.trigger({
                type: "change",
                item: finalValue
            });
        });

        $search.on('keydown', function (event) {
            event.stopPropagation();

            if (event.keyCode === 13) {
                if ($currentlyActiveItem) {
                    $currentlyActiveItem.trigger('click');
                }
            }

            if (event.keyCode === 40) {
                event.preventDefault();
                if (singleSelectActiveIndex < (listController.getLength() - 1)) {
                    singleSelectActiveIndex++;
                    listController.reloadItemAtIndex(singleSelectActiveIndex - 1);
                    listController.reloadItemAtIndex(singleSelectActiveIndex);
                    list.scrollTop = singleSelectActiveIndex * ITEM_HEIGHT;
                }
            }

            if (event.keyCode === 38) {
                event.preventDefault();
                if (singleSelectActiveIndex > 0) {
                    singleSelectActiveIndex--;
                    listController.reloadItemAtIndex(singleSelectActiveIndex + 1);
                    listController.reloadItemAtIndex(singleSelectActiveIndex);
                    list.scrollTop = singleSelectActiveIndex * ITEM_HEIGHT;
                }

            }
        });

        init();
    };

});