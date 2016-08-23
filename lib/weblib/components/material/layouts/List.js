BASE.require([
    "jQuery",
    "components.ui.layouts.collections.ListLayout",
    "components.ui.layouts.UICollection"
], function () {

    var ListLayout = components.ui.layouts.collections.ListLayout;
    var UICollection = components.ui.layouts.UICollection;

    BASE.namespace("components.material.layouts");

    components.material.layouts.List = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var layout = null;
        UICollection.call(self, elem, tags, scope);

        var setup = function () {
            var config = {};
            var itemHeight = parseInt($elem.attr("item-height"), 10);
            var itemComponent = $elem.attr("item-component");
            var paddingTop = parseInt($elem.attr("padding-top"), 10);
            var paddingBottom = parseInt($elem.attr("padding-bottom"), 10);

            if (isNaN(itemHeight) || typeof itemComponent === "undefined") {
                throw new Error("List needs to have a item-height and item-component attribute.");
            }

            if (!isNaN(paddingTop)) {
                config.paddingTop = paddingTop;
            }

            if (!isNaN(paddingBottom)) {
                config.paddingBottom = paddingBottom;
            }

            config.height = itemHeight;

            layout = new ListLayout(config);
            layout.component = itemComponent;
            self.setLayout(layout);

        };

        self.getLayout = function () {
            return layout;
        };

        setup();
    };

});

