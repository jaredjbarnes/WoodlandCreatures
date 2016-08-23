BASE.require([
    "jQuery",
    "jQuery.fn.transition"
], function () {
    BASE.namespace("components.ui.emphasis");

    var Future = BASE.async.Future;

    components.ui.emphasis.UIAlert = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $alertContent = $(tags['alert-content']);

        $(tags['close']).on('click', function (event) {
            $elem.trigger('close');   
        });

        self.setMessage = function (message) {
            $alertContent.html(message);
        }
    };
});
