BASE.require([
    "jQuery",
    "BASE.async.Future",
    "BASE.web.components",
    "jQuery.fn.region"
], function () {

    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;

    var PopoverManager = function ($popover, $container, $elem) {
        var self = this;
        var popoverController = $popover.controller();

        self.show = function () {
            $container.append($popover);
            popoverController.popover.show();
            return self[popoverController.placement]().then(function () {
                popoverController.show();
            }).then();
        };

        self.hide = function () {
            return popoverController.hide().then(function () {
                $popover.detach();
            }).then();
        };

        self.top = function () {
            return new Future(function (setValue, setError) {
                $popover.css({
                    position: 'absolute',
                    zIndex: 2000
                });
                var elemRegion = $elem.region();
                var popoverRegion = $popover.region();
                $popover.offset({
                    top: elemRegion.top - popoverRegion.height - 9,
                    left: elemRegion.left + (elemRegion.width / 2) - (popoverRegion.width / 2)
                });
                setValue();
            }).then();
        }

        self.bottom = function () {
            return new Future(function (setValue, setError) {
                $popover.css({
                    position: 'absolute',
                    zIndex: 2000
                });
                var elemRegion = $elem.region();
                var popoverRegion = $popover.region();
                $popover.offset({
                    top: elemRegion.top + elemRegion.height - 1,
                    left: elemRegion.left + (elemRegion.width / 2) - (popoverRegion.width / 2)
                });
                setValue();
            }).then();
        }

        self.left = function () {
            return new Future(function (setValue, setError) {
                $popover.css({
                    position: 'absolute',
                    zIndex: 2000
                });
                var elemRegion = $elem.region();
                var popoverRegion = $popover.region();
                $popover.offset({
                    top: elemRegion.top + (elemRegion.height / 2) - (popoverRegion.height / 2),
                    left: elemRegion.left - popoverRegion.width - 9
                });
                setValue();
            }).then();
        }

        self.right = function () {
            return new Future(function (setValue, setError) {
                $popover.css({
                    position: 'absolute',
                    zIndex: 2000
                });
                var elemRegion = $elem.region();
                var popoverRegion = $popover.region();
                $popover.offset({
                    top: elemRegion.top + (elemRegion.height / 2) - (popoverRegion.height / 2),
                    left: elemRegion.left + elemRegion.width - 1
                });
                setValue();
            }).then();
        }

        self.setOptionsAsync = function (options) {
            return popoverController.setOptionsAsync(options);
        }

        self.setMaxWidth = function (value) {
            popoverController.setMaxWidth(value);
        }

        self.setPosition = function (top, left) {
            return new Future(function (setValue, setError) {
                $popover.css({
                    position: 'absolute',
                    zIndex: 2000
                });
                $popover.offset({
                    top: top,
                    left: left
                });
                setValue();
            }).then();
        }

        self.getRegion = function () {
            return { popover: $popover.region(), elem: $elem.region() };
        }

        self.getComponent = function () {
            return popoverController.getComponent();
        }
    };

    var createPopover = function (url) {
        return new Future(function (setValue, setError) {
            BASE.web.components.createComponent("ui-popover").then(function (popover) {
                setValue(popover);
            });
        });
    };


    components.ui.layouts.UIPopoverBehavior = function (elem) {
        var self = this;

        var $elem = $(elem);

        var $container = $elem.parent();

        $elem.data('popover', self);

        self.createPopover = function (options) {
            return new Future(function (setValue, setError) {
                createPopover().then(function (popover) {
                    var $popover = $(popover);
                    $popover.controller().setOptionsAsync(options).then(function(){
                        var popoverManager = {};
                        PopoverManager.call(popoverManager, $popover, $container, $elem);
                        setValue(popoverManager);
                    });
                });
            });
        };
    };

});