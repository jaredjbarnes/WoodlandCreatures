BASE.require([
    "jQuery",
    "jQuery.fn.region",
    "BASE.async.Future"
], function () {

    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;

    var SectionSlideManager = function ($sections) {
        var self = this;
        var $children = $sections.children();
        var scrollTimer;
        var scrollArray = [];

        var setScrollTimeout = function () {
            $sections.stop(true, true);
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(scrollStop, 150);
        }

        var scrollStop = function () {
            var left = $sections.scrollLeft();
            if (scrollArray.length === 0) {
                $sections.scrollLeft(0);
                $children.each(function (index) {
                    var $this = $(this);
                    scrollArray[index] = $this.region().left;
                });
                $sections.scrollLeft(left);
            }
            var closest = null;
            $.each(scrollArray, function () {
                if (closest == null || Math.abs(this - left) < Math.abs(closest - left)) {
                    closest = this;
                }
            }); 
            $sections.off('scroll');
            $sections.scrollLeft(left + 1);
            if (left !== $sections.scrollLeft()) {
                $sections.animate({ scrollLeft: closest }, 300, function () {
                    $sections.on('scroll', setScrollTimeout);
                });
            }
            else {
                $sections.on('scroll', setScrollTimeout);
            }
        }

        $sections.on('scroll', setScrollTimeout);

        $(window).on('resize', function () {
            $sections.trigger('scroll');
        });
    };

   
    components.ui.layouts.UISectionScrollSlideBehavior = function (elem) {
        var self = this;
        var $elem = $(elem);

        $elem.data('sectionScrollSlide', self);

        self.createSectionScrollSlide = function () {
            return new Future(function (setValue, setError) {
                var sectionScrollSlideManager = {};
                SectionSlideManager.call(sectionScrollSlideManager, $elem);
                setValue(sectionScrollSlideManager);
            });
        };
    };

});