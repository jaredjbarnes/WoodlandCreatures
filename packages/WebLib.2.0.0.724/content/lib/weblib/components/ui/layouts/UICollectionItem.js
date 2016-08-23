BASE.require([
    "jQuery",
    "BASE.async.Future",
    "Array.prototype.asQueryable"
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UICollectionItem = function (elem, tags) {
        var self = this;
        var $elem = $(elem);

        var loading = false;
        var itemFuture = new BASE.async.Future();
        var index = -1;
        var $itemContainer = $(tags["item"]);
        var listItem = $itemContainer.children()[0];

        self.getItem = function () {
            if (listItem.parentNode === null) {
                $itemContainer.append(listItem);
            }
            return listItem;
        };
    };
});