BASE.require([
    "jQuery",
    "jQuery.fn.region"
], function () {

    var Future = BASE.async.Future;

    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UIDropdownBehavior = function (elem) {
        var self = this;
        var $elem = $(elem);

        var $content = $(null);

        var openState = {
            toggle: function () {
                state = movingState;
                return new Future(function (setValue, setError) {
                    state = closeState;
                    $content.detach();
                    $content.trigger({
                        type: "hidingDropdown"
                    });
                    setValue();
                }).then();
            },
            show: function () {
                return Future.fromResult(undefined);
            },
            hide: function () {
                openState.toggle();
            }
        };

        var movingState = {
            toggle: function () {
                return Future.fromResult(undefined);
            },
            show: function () {
                return movingState.toggle();
            },
            hide: function () {
                return movingState.toggle();
            }
        };

        var closeState = {
            toggle: function () {
                state = movingState;
                return new Future(function (setValue, setError) {
                    state = openState;
                    var region = $elem.region();

                    var offset = {
                        top: region.bottom,
                        left: region.left
                    };

                    $content.detach().appendTo($elem).offset(offset);

                    $content.trigger({
                        type: "showingDropdown"
                    });

                    setValue();

                }).then();
            },
            show: function () {
                closeState.toggle();
            },
            hide: function () {
                return Future.fromResult(undefined);
            }
        };

        var state = closeState;

        self.setDropdownContent = function (content) {
            $content = $(content);
            $content.css("display", "block");
        };

        self.toggleDropdown = function () {
            return state.toggle();
        };

        self.showDropdown = function () {
            return state.show();
        };

        self.hideDropdown = function () {
            return state.hide();
        };

    };

});