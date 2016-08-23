BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UIAccordionGroup = function (elem, tags) {
        var self = this;
        var $elem = $(elem);

        $elem.on('showStart', '[ui-accordion]', function () {
            var currentAccordion = this;
            var $uiAccordions = $elem.find('[ui-accordion]');
            $uiAccordions.each(function () {
                var $this = $(this);
                var controller = $this.controller();
                if (this !== currentAccordion && controller.isVisible()) {
                    controller.hide();
                }
            });
        });
    };
});