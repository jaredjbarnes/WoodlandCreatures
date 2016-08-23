BASE.require([
    "jQuery",
    "Array.prototype.asQueryable",
    "requestAnimationFrame",
    "BASE.collections.Hashmap",
    "BASE.web.animation.ElementAnimation",
    "BASE.async.delayAsync"
], function () {

    BASE.namespace("components.material.layouts");

    var Future = BASE.async.Future;
    var Hashmap = BASE.collections.Hashmap;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var emptyFuture = Future.fromResult();
    var emptyFn = function () { };
    var delayAsync = BASE.async.delayAsync;

    var requestFrameAsync = function () {
        return new Future(function (setValue) {
            requestAnimationFrame(setValue);
        });
    };

    var fadeIn = function (element, duration) {
        var animation = new ElementAnimation({
            target: element,
            properties: {
                opacity: {
                    from: 0,
                    to: 1
                }
            },
            easing: "easeOutExpo",
            duration: duration
        });

        return animation;
    };

    var fadeOut = function () {
        var animation = new ElementAnimation({
            target: element,
            properties: {
                opacity: {
                    from: 1,
                    to: 0
                }
            },
            easing: "easeOutExpo",
            duration: duration
        });

        return animation;
    };


    var recoverFuture = function (future) {
        return future.catchCanceled(emptyFn).catch(emptyFn);
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

    components.material.layouts.Collection = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var content = tags["content"];
        var feedback = tags["feedback-state-manager"];
        var componentName = $elem.attr("item-component");
        var $content = $(content);
        var $feedback = $(feedback);

        var batchSize = 50;
        var originalQueryable;
        var itemPositions = [];
        var entities = [];
        var itemsPool = [];
        var itemsOnDom = new Hashmap();
        var viewportHeight = 0;
        var lastIndex = 0;
        var isComplete = false;
        var currentSkip = 0;
        var buffer = viewportHeight * 2;

        var feedbackController = $feedback.controller();

        var initializeValues = function () {
            lastIndex = 0;
            currentSkip = 0;
            itemPositions = [];
            entities = [];
            viewportHeight = elem.offsetHeight;

            itemsOnDom.getValues().forEach(removeItem);
        };

        var withInRange = function (start, end, value) {
            return value >= start - buffer && value <= end + buffer;
        };

        var removeItem = function (key, $item) {
            invokeMethodIfExist($item.controller, "prepareToDeactivate");
            itemsOnDom.remove(key, $item);
            $item.detach();
            itemsPool.push($item);
            invokeMethodIfExist($item.controller, "deactivated");
        };

        var removeItemsOffViewport = function () {
            var top = elem.scrollTop;
            var bottom = top + viewportHeight;

            itemsOnDom.getKeys().forEach(function (key) {
                var $item = itemsOnDom.get(key);
                var index = key;
                var itemTop = itemPositions[index - 1] || 0;
                var itemBottom = itemPositions[index];

                if (!(withInRange(top, bottom, itemTop) ||
                    withInRange(top, bottom, itemBottom) ||
                    (itemTop < top - buffer && itemBottom > bottom + buffer)
                    )) {
                    removeItem(key, $item);
                }
            });
        };

        var createItemAsync = function () {
            return BASE.web.components.createComponent(componentName).chain(function (elem) {
                return $(elem);
            });
        };

        var getItemAsync = function () {
            if (itemsPool.length === 0) {
                return createItemAsync();
            }

            var $item = itemsPool.pop();
            return Future.fromResult($item);
        };

        var getNextBatchAsync = function () {
            if (!isComplete) {
                var arrayFuture = originalQueryable.skip(currentSkip).take(batchSize).toArrayWithCount().chain(function (data) {
                    var results = data.array;
                    var count = data.count;

                    entities = entities.concat(results);

                    if (entities.length >= count) {
                        isComplete = true;
                    }

                    return entities;
                });
                currentSkip += batchSize;
                return arrayFuture;
            } else {
                return Future.fromResult(entities);
            }
        };

        var computeHeightFromIndexAsync = function (fromIndex) {
            return getItemAsync().chain(function ($item) {
                var controller = $item.controller();

                if (!controller || typeof controller.getItemHeight !== "function") {
                    throw new Error("Items need to implement a getItemHeight method.");
                }

                var length = entities.length;
                var nextHeight = 0;
                fromIndex = fromIndex >= 0 ? fromIndex : 0;

                for (var x = fromIndex; x < length; x++) {
                    nextHeight = controller.getItemHeight(entities[x]);
                    itemPositions[x] = nextHeight + (itemPositions[x - 1] || 0);
                }

                var total = itemPositions[itemPositions.length - 1];

                $content.css("height", total + "px");
            });
        };

        var computeHeightsAsync = function () {
            return computeHeightFromIndexAsync(itemPositions.length - 1);
        };

        var getItemPosition = function (index) {
            return itemPositions[index - 1] || 0
        };

        var layoutItemsAsync = function () {
            removeItemsOffViewport();

            return requestFrameAsync().chain(function () {
                var placementFutures = [];

                var top = elem.scrollTop;
                var bottom = top + viewportHeight;
                var currentY = itemPositions[lastIndex - 1] || 0;

                var alreadyOnDom = itemsOnDom.getKeys().reduce(function (hash, key) {
                    hash[key] = itemsOnDom.get(key);
                    return hash;
                }, {});

                // Find where to start from our last index.
                if (currentY > top) {
                    while (currentY > top) {
                        currentY = getItemPosition(lastIndex);
                        lastIndex--;
                    }
                } else {
                    while (currentY < top) {
                        currentY = getItemPosition(lastIndex);
                        lastIndex++;
                    }
                }

                lastIndex = lastIndex >= 0 ? lastIndex : 0;

                // Go until we hit the bottom of the viewport.
                while (currentY <= bottom && lastIndex < entities.length) {
                    currentY = getItemPosition(lastIndex);

                    if (alreadyOnDom[lastIndex]) {
                        lastIndex++;
                        continue;
                    }

                    (function (currentY, index) {
                        placementFutures.push(getItemAsync().chain(function ($item) {
                            var controller = $item.controller();
                            invokeMethodIfExist(controller, "prepareToActivate", [entities[index]]);

                            $item.css({
                                transform: "translateY(" + currentY + "px)",
                                width: "100%",
                                height: controller.getItemHeight(entities[index]),
                                position: "absolute",
                                top: 0,
                                left: 0
                            });

                            $item.appendTo(content);
                            itemsOnDom.add(index, $item);
                            invokeMethodIfExist(controller, "activated", [entities[index]]);
                        }));
                    })(currentY, lastIndex);

                    lastIndex++;
                }

                return Future.all(placementFutures);
            });

        };

        var fetchAsync = function () {
            var arrayFuture = getNextBatchAsync();

            return Future.all([arrayFuture, feedbackController.pushAsync("loading")]).catch(function (error) {
                feedbackController.pushAsync("error");
            }).chain(function () {
                return computeHeightsAsync();
            }).chain(function () {
                return layoutItemsAsync();
            });
        };

        self.setQueryableAsync = function (queryable) {
            initializeValues();
            originalQueryable = queryable;

            return fetchAsync();
        };

        $elem.on("scroll", function () {
            layoutItemsAsync().try();

            if (elem.scrollTop === (elem.scrollHeight - viewportHeight - buffer)) {
                fetchAsync().try();
            }
        });

    };
});