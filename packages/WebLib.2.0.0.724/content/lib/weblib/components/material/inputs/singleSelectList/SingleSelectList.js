BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline",
    "jQuery.fn.region",
    "Array.prototype.asQueryable",
    "BASE.async.delay",
    "components.material.segues.FadeOutFadeIn",
    "components.material.segues.AppearInstantSegue",
    "BASE.data.responses.ConnectionErrorResponse"
], function () {

    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var emptyQueryableFuture = Future.fromResult([].asQueryable());
    var delay = BASE.async.delay;
    var Validator = components.material.inputs.Validator;
    var FadeOutFadeIn = components.material.segues.FadeOutFadeIn;
    var AppearInstantSegue = components.material.segues.AppearInstantSegue;

    BASE.namespace("components.material.inputs.singleSelectList");

    components.material.inputs.singleSelectList.SingleSelectList = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $search = $(tags["search"]);
        var searchController = $search.controller();
        var $list = $(tags["list"]);
        var listController = $list.controller();
        var finalValue = null;
        var stateManagerController = $(tags['state-manager']).controller();
        var preloaderLineController = $(tags['preloader-line']).controller();
        var $errorMessage = $(tags['error-message']);
        var fadeOutFadeIn = new FadeOutFadeIn();
        var appearInstantSegue = new AppearInstantSegue();

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


                    stateManagerController.pushAsync('error', { segue: fadeOutFadeIn })["try"]();
                }).finally(function () {
                    preloaderLineController.pause();
                });
            });
        }

        self.filterAsync = function () {
            return emptyQueryableFuture;
        };

        self.focus = function () {
            searchController.focus();
        }

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

        self.getStringForItem = function (item) {
            return item.toString();
        };

        self.reset = function () {
            searchController.setValue('');
            stateManagerController.pushAsync('pre-search', { segue: appearInstantSegue })["try"]();
        }

        listController.getLayout().prepareElement = function (item, entity, index) {
            var $item = $(item);
            var itemController = $(item).controller();

            var value = self.getStringForItem(entity);
            itemController.setValue(entity, value);
        };
    };

});