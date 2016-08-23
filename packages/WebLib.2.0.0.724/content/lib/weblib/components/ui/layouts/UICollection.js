BASE.require([
    "jQuery",
    "components.ui.layouts.collections.ListLayout",
    "Array.prototype.asQueryable",
    "jQuery.fn.transition",
    "Array.prototype.except",
    "Array.prototype.intersect",
    "requestAnimationFrame",
    "BASE.collections.Hashmap",
    "components.ui.layouts.ItemCache",
    "BASE.async.delayAsync"
], function () {

    BASE.namespace("components.ui.layouts");

    var ListLayout = components.ui.layouts.collections.ListLayout;
    var ItemCache = components.ui.layouts.ItemCache;
    var Future = BASE.async.Future;
    var Hashmap = BASE.collections.Hashmap;
    var delayAsync = BASE.async.delayAsync;

    components.ui.layouts.UICollection = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var content = tags["content"];
        var $content = $(content);

        var reusableEvent = jQuery.Event("scroll");
        var cachedTop = 0;
        var cachedLeft = 0;
        var cachedWidth = 0;
        var cachedHeight = 0;
        var cachedContentHeight = 0;
        var cachedContentWidth = 0;

        var totalCollectionLength = null;
        var currentIndexes = [];
        var scrollDirection = 1;

        var itemCache = new ItemCache([].asQueryable, 50);
        var indexToElementFutures = new Hashmap();
        var availableindexToElementFutures = [];
        var layout = null;
        var pixelBuffer = 500;
        var scrollHandlers = [];
        var resizeTimer = null;
        var queryErrorEvent = new $.Event("queryError");
        var querySuccessEvent = new $.Event("querySuccess");
        var queryable = [].asQueryable();

        var currentIndexChanges = {
            removed: [],
            added: [],
            indexes: []
        };

        var contentRegion = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };

        reusableEvent.top = 0;
        reusableEvent.left = 0;
        reusableEvent.zoom = 1;
        reusableEvent.preventDefault = function () { throw new Error("Cannot call this."); };
        reusableEvent.stopPropagation = function () { throw new Error("Cannot call this."); };

        var createItem = function () {
            var itemFuture;
            var itemController = "";
            if (layout.componentController) {
                itemController = 'controller="' + layout.componentController + '"';
            }

            var item = "<div tag=\"collectionItemContent\" " + itemController + "></div>";
            if (layout.component) {
                item = "<div tag=\"collectionItemContent\" component=\"" + layout.component + "\" " + itemController + "></div>";
            }

            itemFuture = BASE.web.components.createComponent("ui-collection-item", item).then(function (lastElement) {
                var $collectionItem = $(lastElement);
                var collectionItemController = $collectionItem.data("controller");
                var $item = $(collectionItemController.getItem());

                $item.css({
                    width: "100%",
                    height: "100%"
                });

                if ($collectionItem.parent().length === 0) {
                    $content.append($collectionItem);
                }

            });

            return itemFuture;
        };

        var getElementForIndex = function (index) {
            var elementFuture = indexToElementFutures.get(index);

            if (elementFuture instanceof Future) {
                return elementFuture;
            }

            if (availableindexToElementFutures.length > 0) {
                elementFuture = availableindexToElementFutures.pop();
                indexToElementFutures.add(index, elementFuture);
                return elementFuture;
            }

            elementFuture = createItem();
            indexToElementFutures.add(index, elementFuture);

            return elementFuture;
        };

        var placeElementByIndex = function (element, index) {
            var $elment = $(element);
            var css = layout.getCss(index);

            $elment.attr("index", index);
            css["z-index"] = index + 1;

            var cssText = Object.keys(css).map(function (key) {
                return key + ":" + css[key] + ";";
            }).join("");

            element.style.cssText = cssText;
        };

        var loadItem = function (entity, index) {
            if (indexToElementFutures.hasKey(index)) {
                var elementFuture = indexToElementFutures.get(index);

                elementFuture.then(function (element) {
                    var itemController = $(element).controller();
                    var listItem = itemController.getItem();

                    var customController = $(listItem).controller();

                    if (customController && typeof customController.setItem === "function") {
                        customController.setItem(entity, index);
                    } else {
                        layout.prepareElement(listItem, entity, index);
                    }

                    placeElementByIndex(element, index);
                });
            }
        };

        var setItemToLoading = function (index) {
            var elementFuture = getElementForIndex(index);

            elementFuture.then(function (element) {
                var itemController = $(element).controller();
                var listItem = itemController.getItem();

                var customController = $(listItem).controller();

                if (customController && typeof customController.setLoading === "function") {
                    customController.setLoading();
                } else if (layout && typeof layout.cleanElement === "function") {
                    layout.cleanElement(listItem);
                }

                placeElementByIndex(element, index);
            });
        };

        var getIndexesOnScreen = function () {
            var top = self.top;
            var left = self.left;
            var width = self.width;
            var height = self.height;
            var indexes;

            var top = top - pixelBuffer;
            var bottom = self.top + height + pixelBuffer;

            if (top < 0) {
                bottom = bottom + Math.abs(top);
                top = 0;
            }

            contentRegion.top = top;
            contentRegion.right = left + width;
            contentRegion.bottom = bottom;
            contentRegion.left = left < 0 ? 0 : left;

            indexes = layout.getIndexes(contentRegion);

            return indexes;
        };

        var fixArrayToBounds = function (array) {
            while (array[0] < 0) {
                array.shift();
            }

            // This strips out indexes that are greater than the total collection length.
            while (array[array.length - 1] >= totalCollectionLength) {
                array.pop();
            }
        };

        var getIndexChanges = function () {
            var newCurrentIndexes = getIndexesOnScreen();
            var x, value;

            fixArrayToBounds(newCurrentIndexes);

            currentIndexChanges.added = newCurrentIndexes.except(currentIndexes);
            currentIndexChanges.removed = currentIndexes.except(newCurrentIndexes);
            currentIndexChanges.indexes = newCurrentIndexes;

            if (currentIndexes.length > 0 && newCurrentIndexes.length > 0) {
                scrollDirection = currentIndexes[0] < newCurrentIndexes[0] ? 1 : -1;
            }

            currentIndexes = newCurrentIndexes;

            return currentIndexChanges;
        };

        var hideLoader = function () {
            console.log("Deprecated");
        };

        var showLoader = function () {
            console.log("Deprecated");
        };

        var setContentSize = function (collectionLength) {
            layout.scrollViewport.height = self.height;
            layout.scrollViewport.width = self.width;

            var width = layout.getWidth(collectionLength);
            var height = layout.getHeight(collectionLength);

            $content.css({
                width: width,
                height: height
            });

            cachedContentHeight = content.clientHeight;
            cachedContentWidth = content.clientWidth;
        };

        var drawItemsWithCount = function (count) {
            totalCollectionLength = count;
            setContentSize(count);
            placeRecycledElements();
            currentIndexes.forEach(addItemWithIndex);
        };

        var drawItems = function () {
            return queryable.count().then(drawItemsWithCount);
        };

        var prepareLayout = function () {
            cachedLeft = elem.scrollLeft;
            cachedTop = elem.scrollTop;
            cachedWidth = elem.clientWidth;
            cachedHeight = elem.clientHeight;
        };

        var addItemWithIndex = function (index) {
            getElementForIndex(index);

            var entityFuture = itemCache.getItemByIndexAsync(index);
            if (entityFuture.isDone === false) {
                setItemToLoading(index);
            }

            entityFuture.then(function (entity) {
                loadItem(entity, index);
            });
        };

        var removeItemWithIndex = function (index) {
            var elementFuture = indexToElementFutures.remove(index);

            if (elementFuture) {
                availableindexToElementFutures.push(elementFuture);

                if (elementFuture.isDone) {
                    elementFuture.value.style.display = "none";
                }
            }

        };

        var placeRecycledElements = function () {
            var indexChanges = getIndexChanges();
            var indexesToRemove = indexChanges.removed;
            var indexesToAdd = indexChanges.added;

            indexesToRemove.forEach(removeItemWithIndex);
            indexesToAdd.forEach(addItemWithIndex);
        };

        var onScroll = function () {
            var event = createScrollEvent();
            placeRecycledElements();
            scrollHandlers.forEach(function (callback) {
                callback(event);
            });
        };

        var createScrollEvent = function () {
            cachedTop = reusableEvent.top = elem.scrollTop;
            cachedLeft = reusableEvent.left = elem.scrollLeft;
            reusableEvent.zoom = 1;
            return reusableEvent;
        };

        var getItemLengthOnViewport = function () {
            return getIndexesOnScreen().length;
        };

        self.setPixelBuffer = function (count) {
            if (typeof count === "number") {
                pixelBuffer = count;
            }
        };

        self.setQueryableAsync = function (newQueryable) {
            queryable = newQueryable || [].asQueryable();
            itemCache = new ItemCache(queryable, getItemLengthOnViewport() * 2)

            elem.scrollTop = 0;
            prepareLayout();

            elem.top = 0;
            return drawItems();
        };

        self.setQueryable = function (queryable) {
            return self.setQueryableAsync(queryable)["try"]();
        };

        self.reloadItemAtIndex = function (index) {
            return queryable.skip(index).take(1).toArray().then(function (entity) {
                loadItem(entity, index);
            });
        };

        self.updateItemAtIndex = function (index, entity) {
            loadItem(entity, index);
        };

        self.reloadData = function () {
            itemCache.clear();
            return drawItems();
        };

        self.redrawItems = function () {
            prepareLayout();
            drawItems();
        };

        self.update = function () {
            itemCache.clear();
            prepareLayout();

            return drawItems();
        };

        self.appendContent = function (element) {
            $content.append(element);
        };

        self.setLayout = function (value) {
            layout = value;
            itemCache.clear();
            prepareLayout();
            drawItems();
        };

        self.getLayout = function () {
            return layout;
        };

        self.onScroll = function (callback) {
            if (typeof callback === "function") {
                scrollHandlers.push(callback);
            }
        };

        self.getLength = function () {
            return totalCollectionLength;
        }

        self.showLoader = showLoader;
        self.hideLoader = hideLoader;

        Object.defineProperties(self, {
            top: {
                get: function () {
                    return cachedTop;
                },
                set: function (value) {
                    elem.scrollTop = value;
                }
            },
            left: {
                get: function () {
                    return cachedLeft;
                },
                set: function (value) {
                    elem.scrollLeft = value;
                }
            },
            height: {
                get: function () {
                    return elem.clientHeight;
                }
            },
            width: {
                get: function () {
                    return elem.clientWidth;
                }
            },
            contentHeight: {
                get: function () {
                    return cachedContentHeight;
                }
            },
            contentWidth: {
                get: function () {
                    return cachedContentWidth;
                }
            }
        });

        self.resize = function () {
            //Throttle this event because it is called a ton.
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

            resizeTimer = setTimeout(function () {
                // If the scroll isn't hidden.
                if (!$elem.is(":hidden")) {
                    //No need to clear the iteam cache here, we can reuse what we already have
                    self.redrawItems();
                };
            }, 350);

        };

        layout = new ListLayout({ height: 100 });

        $elem.on("scroll", onScroll);
        $elem.on("windowResize", self.resize);
    };
});