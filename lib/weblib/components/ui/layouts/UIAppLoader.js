BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UIAppLoader = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        
        self.load = function (URL) {
            $elem.animate({ left: 0 }, 600);
        }

        self.unload = function () {
            
        }
    };
});