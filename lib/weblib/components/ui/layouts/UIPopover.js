BASE.require([
    "jQuery",
    "BASE.async.Future",
    "BASE.web.components"
], function () {
    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;

    components.ui.layouts.UIPopover = function (elem, tags) {
        var self = this;
        var $elem = $(elem);

        var $popover = $(tags.popover);
        var $popoverTitle = $(tags.popoverTitle);
        var $popoverContent = $(tags.popoverContent);
        var $popoverComponent = $(tags.popoverComponent);
        var $arrow = $(tags.arrow);
        var component = null;

        self.placement = 'top';
        self.popover = $popover;

        self.show = function () {
            return new Future(function (setValue, setError) {
                $popover.show();
                setValue();
            }).then();
            
        }

        self.hide = function () {
            return new Future(function (setValue, setError) {
                $popover.hide();
                setValue();
            }).then();
        }

        self.setMaxWidth = function (value) {
            $popover.css('max-width', value + 'px');
        }

        self.setOptionsAsync = function (options) {
            options = options || {};
            if (options.hideArrow === true) {
                $arrow.hide();
            }
            else {
                $arrow.show();
            }
            if (typeof options.placement !== 'undefined') {
                self.placement = options.placement;
                $popover.removeAttr('class').addClass(options.placement);
            }            
            if (typeof options.title === 'undefined') {
                $popoverTitle.hide();
            }
            else {
                $popoverTitle.show();
                $popoverTitle.html(options.title);
            }
            if (typeof options.content === 'undefined') {
                $popoverContent.hide();
            }
            else {
                $popoverContent.show();
                $popoverContent.html(options.content);
            }
            if (typeof options.component === 'undefined') {
                $popoverComponent.hide();
                component = null;
            }
            else {
                $popoverComponent.show();
                $popoverComponent.html();
                return BASE.web.components.createComponent(options.component, options.componentContent, options.componentAttributes).then(function (returnedComponent) {
                    component = returnedComponent;
                    $popoverComponent.append(component);
                    $(component).find("[component]").addBack().triggerHandler('enteredView');
                });
            }
            return Future.fromResult();
        }

        self.getComponent = function () {
            return component;
        };
    };
});