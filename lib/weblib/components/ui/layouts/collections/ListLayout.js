BASE.require([
    "jQuery",
    "jQuery.support.transform"
], function () {
    BASE.namespace("components.ui.layouts.collections");

    var _globalObject = this;

    // options is {height: 100, paddingTop: 10, paddingBottom: 10}
    components.ui.layouts.collections.ListLayout = function (options) {
        var self = this;
        var itemHeight;
        var paddingTop;
        var paddingBottom;
        var width = "100%";

        // To reduce garbage collections we reuse this object.
        var css = {
            "position": "",
            "top": "",
            "left": "",
            "width": "",
            "height": "",
            "-webkit-transform": "",
            "transform": ""
        };

        if (typeof options === "number" || typeof options === "undefined") {
            itemHeight = options || 100;
            console.log("Please use a object with {height: 100}, passing in a number is deprecated.");
        } else {
            itemHeight = options.height;
        }

        paddingTop = options.paddingTop || 0;
        paddingBottom = options.paddingBottom || 0;


        if (this === _globalObject) {
            throw new Error("Constructor run with global context.  Use new.");
        }

        self.component = null;

        self.componentController = null;

        self.scrollViewport = { width: 0, height: 0 };

        self.getWidth = function (length) {
            return width;
        };

        self.getHeight = function (length) {
            return ((length * itemHeight) + paddingTop + paddingBottom) + "px";
        };

        self.setWidth = function (value) {
            width = value;
        };

        self.setItemHeight = function (value) {
            var oldValue = itemHeight;
            if (oldValue !== value) {
                itemHeight = value;
            }
        };

        self.setPaddingTop = function (value) {
            paddingTop = value;
        }

        self.setPaddingBottom = function (value) {
            paddingBottom = value;
        }

        // region has {top: 0, left: 0, right: 0, bottom:0}
        // scrollViewport has {width: 0, height: 0}
        self.getIndexes = function (region) {
            var startIndex = Math.floor((region.top - paddingTop) / itemHeight);
            var endIndex = Math.ceil((region.bottom - paddingTop) / itemHeight);

            var indexes = [];
            for (var x = startIndex ; x <= endIndex; x++) {
                indexes.push(x);
            }

            return indexes;
        };

        self.getCss = function (index) {
            var y = (index * itemHeight) + paddingTop;

            css["position"] = "absolute";
            css["top"] = $.support.transform ? "0px" : (y) + 'px';
            css["left"] = "0px";
            css["width"] = "100%";
            css["height"] = (itemHeight) + "px";
            css["-webkit-transform"] = "translate3d(0px, " + y + "px, 0px)";
            css["transform"] = "translate3d(0px, " + y + "px, 0px)";
            return css;
        };

        self.prepareElement = function (element, item, index) {
            element.innerHTML = index;
        };

    };
});