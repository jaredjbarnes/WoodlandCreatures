BASE.require([
  "jQuery",
  "jQuery.support.transform"
], function () {
    BASE.namespace("components.ui.layouts.collections");

    var _globalObject = this;

    // size : {width: 100, height: 100, paddingTop: 10, paddingBottom: 10}
    components.ui.layouts.collections.GridLayout = function (size) {
        var self = this;
        // Since javascript is single threaded we can resuse the css object.
        var css = {
            "position": "",
            "top": "",
            "left": "",
            "width": "",
            "height": "",
            "-webkit-transform": "",
            "transform": "",
            "display": ""
        };;

        if (self === _globalObject) {
            throw new Error("GridLayout constructor invoked with global context.  Use 'new'.");
        }

        size = size || {};
        size.paddingTop = size.paddingTop || 0;
        size.paddingBottom = size.paddingBottom || 0;

        self.tagName = "div";
        self.offset = 0;
        self.scrollViewport = { width: 0, height: 0 };
        self.component = null;
        self.componentController = null;

        self.getWidth = function (length) {
            return "100%";
        };

        self.getHeight = function (length) {
            return ((Math.ceil(length / getColumnCount()) * size.height) + size.paddingTop + size.paddingBottom) + "px";
        };

        var getColumnCount = function () {
            return Math.floor(self.scrollViewport.width / size.width);
        };

        var getMarginWidth = function () {
            return Math.round((self.scrollViewport.width % size.width) / 2);
        };

        var rowAt = function (y) {
            return Math.floor((y - size.paddingTop) / (size.height));
        };

        var indexAtY = function (y) {
            return rowAt(y) * getColumnCount() - self.offset;
        };

        var getColumn = function (index) {
            return index % getColumnCount();
        };

        var getRow = function (index) {
            return Math.floor(index / getColumnCount());
        };

        // region has {top: 0, left: 0, right: 0, bottom:0}
        // scrollViewport has {width: 0, height: 0}
        self.getIndexes = function (region) {
            var columnCount = getColumnCount();

            var firstIndex = indexAtY(region.top);
            var lastIndex = (indexAtY(region.bottom)) + columnCount;

            var indexes = [];
            for (var i = firstIndex; i < lastIndex; i++) {
                indexes.push(i);
            }

            return indexes;
        };

        self.getCss = function (index) {
            index = index + self.offset;
            var y = (getRow(index) * size.height) + size.paddingTop;
            var x = getColumn(index) * size.width;

            var centeredX = x + getMarginWidth();

            css.display = "block";
            css.position = "absolute";
            css.top = $.support.transform ? "0px" : y + 'px';
            css.left = $.support.transform ? "0px" : centeredX + 'px';
            css.width = size.width + "px";
            css.height = size.height + "px";
            css["-webkit-transform"] = "translate3d(" + centeredX + "px, " + y + "px, 0px)";
            css["transform"] = "translate3d(" + centeredX + "px, " + y + "px, 0px)";

            return css;
        };

        self.prepareElement = function (element, item, index) {
            throw new Error("Not yet implemented");
        };

        return self;
    };

});