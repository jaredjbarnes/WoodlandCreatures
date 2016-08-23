BASE.require.loader.setObject("jQuery.fn.plot", "/js/lib/jQuery/fn/plot.js");
BASE.require([
    "jQuery",
    "jQuery.fn.plot",
    "ui.layouts.UIPopoverBehavior"
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UIPlot = function (elem, tags) {
        var self = this;

        var $elem = $(elem);
        var plot = $.plot($elem, [], {});

        self.setData = function (data, options) {
            plot = $.plot($elem, data, options);
        };

        self.createPopover = function () {
            ui.layouts.UIPopoverBehavior.call({}, elem);
            return $(elem).data('popover').createPopover();
        }

    };
    
});