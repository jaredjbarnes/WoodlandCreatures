BASE.require([
    "jQuery",
    "BASE.async.Future",
    "BASE.web.components"
], function () {

    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;
    var webComponents = BASE.web.components;

    var PopupManager = function (elem, container, transitionIn, transitionOut) {
        var self = this;
        var popupController = $(elem).controller();

        self.show = function () {
            $(container).append(elem);
            return popupController.show(transitionIn);
        };

        self.hide = function () {
            return popupController.hide(transitionOut).then(function () {
                $(elem).detach();
            });
        };

        self.popup = elem;
        self.popupController = popupController;

    };

    var createPopup = function (url) {
        return new Future(function (setValue, setError) {
            webComponents.createComponent("ui-popup", "<div popup-content component='" + url + "'></div>").then(function (popup) {
                setValue(popup);
            });
        });
    };


    components.ui.layouts.UIPopupManagerBehavior = function (elem) {
        var self = this;

        var $elem = $(elem);

        if ($elem.css("position") === "static") {
            $elem.css("position", "relative");
        }

        self.createPopup = function (url, transitionIn, transitionOut) {
            return new Future(function (setValue, setError) {
                createPopup(url).then(function (popupComponent) {
                    $(popupComponent).css({position: 'absolute', top: 0, left: 0, zIndex: 3000, width: '100%', height: '100%'});
                    var popupManager = {};
                    PopupManager.call(popupManager, popupComponent, elem, transitionIn, transitionOut);
                    setValue(popupManager);
                });
            });
        };

    };

});