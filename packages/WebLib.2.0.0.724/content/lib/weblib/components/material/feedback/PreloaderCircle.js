BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.material.feedback");

    var Future = BASE.async.Future;

    components.material.feedback.PreloaderCircle = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        
        self.setCircumference = function (value) {
            $elem.css({
                width: value + 'px',
                height: value + 'px'
            });
        };

        self.setBorderWidth = function (value) {
            $elem.find('[preloader-circle-circle]').css('border-width', value + 'px');
        }

        self.pause = function () {
            $elem.attr('paused', '');
        };

        self.play = function () {
            $elem.removeAttr('paused');
        };
    };
});
