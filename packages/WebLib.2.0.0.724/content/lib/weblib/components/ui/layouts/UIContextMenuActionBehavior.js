BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UIContextMenuActionBehavior = function (element) {
        var self = this;

        self.isApplicableForItems = function (items) {
            return true;
        };

        self.hide = function () {
            $(element).hide();
        };

        self.show = function () {
            $(element).show();
        };

    };
});