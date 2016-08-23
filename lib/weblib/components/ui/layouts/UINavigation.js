BASE.require([
    "jQuery.fn.region"
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UINavigation = function (elem, tags) {
        var self = this;

        var $elem = $(elem);
        var $wrapper = $(tags["wrapper"]);
        var $outer = $(tags["outer"]);
        var $header = $outer.children().first();
        var defaultHeight = $elem.attr("header-height");

        defaultHeight = defaultHeight ? parseInt(defaultHeight, 10) || 0 : 0;

        var redraw = function () {
            var height = $header.region().height;

            if (height === 0) {
                height = defaultHeight;
            }

            $wrapper.css("top", height + "px");
        };

        $elem.on("enteredView", redraw);

        self.redraw = function () {
            redraw();
        };

        redraw();
    };

});