BASE.require([
    "jQuery", "jQuery.fn.redraw", "jQuery.support.transition"
], function () {
    BASE.namespace("components.ui.navigation");

    components.ui.navigation.UINavbarInner = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $btnCollapse = $(tags['btn-collapse']);
        var $navCollapse = $elem.find('.nav-collapse');

        self.show = function () { 
            $navCollapse.show().css('paddingBottom', '');
            var height = $navCollapse.outerHeight();
            $navCollapse.css({
                maxHeight: 0,
                overflow: 'hidden'
            }).redraw().css({
                transition: 'all 500ms cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                maxHeight: height + 'px'
            });
            if ($.support.transition) {
                $navCollapse.on('transitionend webkitTransitionEnd', function () {
                    $navCollapse.css({
                        overflow: 'visible'
                    }).off('transitionend webkitTransitionEnd');
                });
            }
            else {
                $navCollapse.css({
                    overflow: 'visible'
                });
            }
        }

        self.hide = function () {
            var height = $navCollapse.outerHeight();
            $navCollapse.css({
                maxHeight: height + 'px',
                overflow: 'hidden'
            }).redraw().css({
                transition: 'all 500ms cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                paddingBottom: 0,
                maxHeight: 0
            });
            if ($.support.transition) {
                $navCollapse.on('transitionend webkitTransitionEnd', function () {
                    $navCollapse.css({
                        display: '',
                        maxHeight: '' 
                    }).off('transitionend webkitTransitionEnd');
                });
            }
            else {
                $navCollapse.css({
                    display: '',
                    maxHeight: ''
                });
            }
        }

        $btnCollapse.on('click', function () {
            if($navCollapse.is(':visible')){
                self.hide();
                $btnCollapse.blur();
            }
            else{
                self.show();
            }
        });
    };
});