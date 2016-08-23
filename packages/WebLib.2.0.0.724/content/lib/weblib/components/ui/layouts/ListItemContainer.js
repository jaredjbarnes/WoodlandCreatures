BASE.require([
    "jQuery",
    "jQuery.fn.region"
], function () {

    BASE.namespace("components.ui.layouts");

    var emptyFn = function () { };

    var nullableController = {
        setItem: emptyFn
    };

    components.ui.layouts.ListItemContainer = function (elem, tags) {
        var self = this;

        var $elem = $(elem);
        var $name = $(tags["name"]);
        var defaultTitle = "";
        var item = null;

        var setTitle = function (title) {
            $name.text(title);
        };

        var setHeight = function (height) {
            $elem.css("height", height + "px");
        };

        self.focus = function () {
            $elem.css({
                border: "3px solid #0094ff",
                lineHeight: "29px"
            });
        };

        self.blur = function () {
            $elem.css({
                border: "",
                lineHeight: ""
            });
        };

        self.titleForItem = function (item) {
            throw new Error("This was meant to be overridden.");
        };

        self.getItem = function () {
            return item;
        };

        self.setItem = function (value) {
            if (value) {
                item = value;
                setTitle(self.titleForItem(item));
            } else {
                setTitle(defaultTitle);
            }
        };

        self.setDefaultTitle = function (value) {
            defaultTitle = value;
        };
    }

});