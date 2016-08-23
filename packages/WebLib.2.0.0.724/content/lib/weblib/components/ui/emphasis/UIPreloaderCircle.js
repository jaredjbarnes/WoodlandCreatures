BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.ui.emphasis");

    var Future = BASE.async.Future;

    components.ui.emphasis.UIPreloaderCircle = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        
        self.setBorderWidth = function (value) {
            $elem.find('.circle').css('border-width', value + 'px');
        }
    };
});
