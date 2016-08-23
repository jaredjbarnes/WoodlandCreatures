BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.ui.layouts.UIContextMenu");

    var Future = BASE.async.Future;

    components.ui.layouts.UIContextMenu = function (elem, tags) {
        var self = this
        var $elem = $(elem);
        var actionControllers = [];
        var actionItems = [];
        var $itemContainerTransition = $(tags['item-container-transition']);
        var $itemContainer = $(tags['item-container']);
        var $itemContainerTable = $(tags['item-container-table']);
        var $contentContainer = $(tags['content-container']);

        self.isShowing = false;
        self.showTransition = {
            name: 'slideInBottomStayAtBottom',
            duration: 600,
            easing: 'easeOutExpo'
        };
        self.hideTransition = {
            name: 'slideOutBottomStayAtBottom',
            duration: 600,
            easing: 'easeOutExpo'
        };

        self.setNoActionsMessage = function (message) {
            $(tags['empty-message']).text(message);
        };

        self.show = function () {
            var showFuture = new Future.fromResult();
            if (!self.isShowing) {
                self.isShowing = true;
                showFuture = $itemContainerTransition.show().data('controller')[self.showTransition.name](self.showTransition.duration, self.showTransition.easing);
            }
            return showFuture;
        };

        self.hide = function () {
            var hideFuture = new Future.fromResult();
            if (self.isShowing) {
                self.isShowing = false;
                hideFuture = $(tags['item-container-transition']).data('controller')[self.hideTransition.name](self.hideTransition.duration, self.hideTransition.easing);
            }
            return hideFuture;
        };

        self.setItemContainerHeight = function (height) {
            $itemContainer.css('height', height);
        }

        self.setItemContainerPadding = function (padding) {
            $itemContainer.css('padding', padding);
        }

        self.setContentContainerPadding = function (padding) {
            $contentContainer.css('padding', padding);
        }

        self.addAction = function (actionElement) {
            var controller = $(actionElement).data("controller");
            if (!controller || (!typeof controller.isApplicableForItem === "function")) {
                throw new Error("Action must implement UIContextMenuActionBehavior");
            }
            actionControllers.push(controller);
            $itemContainerTable.append(actionElement);
        };

        self.removeAction = function (actionElement) {
            var controller = $(actionElement).data("controller");
            var controllerIndex = actionControllers.indexOf(controller);
            // fail silently if the action isn't already in the menu
            if (controllerIndex > -1) {
                actionControllers.splice(controllerIndex, 1);
                $(actionElement).detach();
            }
        };

        self.selectActionsForItems = function (items) {
            if (items.length === 0) {
                actionControllers.forEach(function (ac) {
                    ac.hide();
                });
                $(tags['item-container']).removeClass("none-applicable");
                $(tags['item-container']).addClass("empty").css('display', 'block');
            } else {
                $(tags['item-container']).removeClass("empty").css('display', 'block');
                var numApplicables = 0;
                actionControllers.forEach(function (ac) {
                    if (ac.isApplicableForItems(items)) {
                        ac.show();
                        numApplicables += 1;
                    } else {
                        ac.hide();
                    }
                });
                if (numApplicables === 0) {
                    $(tags['item-container']).addClass("none-applicable").css('display', 'block');
                } else {
                    $(tags['item-container']).removeClass("none-applicable");
                }
            }
        };

    };
});
