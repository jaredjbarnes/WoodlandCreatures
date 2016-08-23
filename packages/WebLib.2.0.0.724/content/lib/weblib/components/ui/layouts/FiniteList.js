BASE.require([
    "BASE.web.animation.Animation",
    "jQuery"
], function () {

    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;
    var baseComponents = BASE.web.components;
    var Animation = BASE.web.animation.Animation;
    var returnCompleteFuture = function () {
        return Future.fromResult();
    };
    var emptyFn = function () { };

    components.ui.layouts.FiniteList = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var itemComponentName;
        var elementPoolFutures = [];

        var scrollToTopAsync = function () {
            if (elem.scrollTop === 0) {
                return Future.fromResult();
            }

            var animation = new Animation({
                target: elem,
                properties: {
                    scrollTop: {
                        from: elem.scrollTop,
                        to: 0
                    }
                },
                easing: "easeOutQuad",
                duration: 300
            });

            return animation.playToEndAsync();
        };

        var createElementForIndex = function (item, index) {
            var itemFuture = baseComponents.createComponent(itemComponentName).chain(function (addedItem) {
                var $itemElement = $(addedItem);
                var itemElementController = $itemElement.data("controller");

                return {
                    $element: $itemElement,
                    controller: itemElementController,
                    item: item,
                    index: index
                };
            });

            return elementPoolFutures[index] = itemFuture;
        };

        var appendItemsToContent = function (items) {

            var futures = items.map(function (item, index) {
                if (elementPoolFutures[index]) {
                    return elementPoolFutures[index].chain(function (itemData) {
                        itemData.item = item;
                        itemData.index = index;
                        return itemData;
                    });
                } else {
                    return createElementForIndex(item, index);
                }
            });

            return Future.all(futures);

        };

        var setup = function () {
            itemComponentName = $elem.attr("item-component-name");
        };

        var setItems = function (items) {
            var fragment = document.createDocumentFragment();
            items.forEach(function (item) {
                fragment.appendChild(item.$element[0]);
                item.controller.setItem(item.item, item.index);
            });

            $elem.append(fragment);
        };

        self.setComponentName = function (value) {
            itemComponentName = value;
        }

        self.getItemsControllers = function () {
            return $elem.children().toArray().map(function (element) {
                return $(element).controller();
            });
        };

        self.setArrayAsync = function (array, options) {
            options = options || {};

            if (itemComponentName && typeof itemComponentName !== "string") {
                throw new Error("Invalid component: FiniteList needs an item-component-name to specify its list items.");
            }

            if (typeof options.animateOutAsync !== "function") {
                options.animateOutAsync = returnCompleteFuture;
            }

            if (typeof options.animateInAsync !== "function") {
                options.animateInAsync = returnCompleteFuture;
            }

            if (typeof options.prepareElementsToAnimateIn !== "function") {
                options.prepareElementsToAnimateIn = emptyFn;
            }

            if (!Array.isArray(array)) {
                throw new Error("Invalid arguments: setArrayAsync must be given an array.");
            }

            return scrollToTopAsync().chain(function () {
                return appendItemsToContent(array);
            }).chain(function (items) {
                var elements = items.map(function (item) {
                    return item.$element[0];
                });

                return options.animateOutAsync($elem.children().get()).chain(function () {
                    $elem.children().each(function () {
                        $(this).detach();
                    });

                    options.prepareElementsToAnimateIn(elements);
                    setItems(items);
                    return options.animateInAsync(elements);
                });
            }).chain(function () {
                return undefined;
            });

        };

        setup();

    };

});