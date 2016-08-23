BASE.require([
    "jQuery",
    "components.ui.layouts.collections.ListLayout",
    "Array.prototype.asQueryable",
    "components.ui.layouts.UICollection"
], function () {
    BASE.namespace("components.internetExplorer.ui.layouts");

    var UICollection = components.ui.layouts.UICollection;

    components.internetExplorer.ui.layouts.UICollection = function (elem, tags) {
        var self = this;
        var $elem = $(elem);

        UICollection.apply(self, arguments);

        var oldRedraw = self.redraw;
        var throttle = null;

        self.redraw = function () {
            clearTimeout(throttle);
            throttle = setTimeout(oldRedraw, 33);
        };

    };
});