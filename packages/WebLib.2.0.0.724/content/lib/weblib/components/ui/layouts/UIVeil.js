BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UIVeil = function (elem, tags) {
        var self = this;
        var $elem = $(elem);

        self.append = function (appendElement) {
            $(tags['veil-content-container']).append(appendElement);
        }
    };
});