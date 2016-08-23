BASE.require([
		"jQuery",
        "jQuery.fn.region"
], function () {
    var Future = BASE.async.Future;

    BASE.namespace("components.gem");

    components.gem.Tabs = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $tabsContainer = $(tags["tabs-container"]);
        var $tabsOverflow = $(tags["tabs-overflow"]);
        var $tabsOverflowVeil = $(tags["tabs-overflow-veil"]);
        var $content = $(tags["state-manager"]);
        var stateManager = $content.controller();
        var currentName = null;
        var removedTabs = [];

        var showTabsOverflow = function () {
            $tabsOverflow.removeClass("hide");
            $tabsOverflowVeil.removeClass("hide");

            var region = $tabsContainer.children("[name='More']").region();
            var left = region.right - $tabsOverflow.width();

            $tabsOverflow.offset({
                top: region.bottom,
                left: left
            });
        };

        var hideTabsOverflow = function () {
            $tabsOverflow.addClass("hide");
            $tabsOverflowVeil.addClass("hide");
        };

        var createTab = function (name) {
            var $tab = $("<button></button>");
            $tab.text(name).addClass("gem-tab");
            $tab.attr("name", name);
            $tab.on("click", function () {
                self.selectTabAsync(name).try();
            });
            return $tab;
        };

        var createMoreTab = function () {
            var $tab = $("<button></button>");
            var $arrow = $("<i class='material-icons'>arrow_drop_down</i>").css("font-size", "24px");
            $tab.html("More").append($arrow).addClass("gem-tab");
            $tab.attr("name", "More");
            $tab.on("click", function () {
                showTabsOverflow();
            });
            $tab.addClass("hide");
            return $tab;
        };

        var createTabs = function () {
            var states = stateManager.getStates();

            var keys = Object.keys(states)

            keys.forEach(function (name) {
                var $tabContent = $(states[name]).addClass("absolute-fill-parent");
                var $tab = createTab(name);
                $tab.appendTo($tabsContainer);
            });

            var $moreTab = createMoreTab();
            $moreTab.appendTo($tabsContainer);

            self.selectTabAsync(keys[0]).try();
        };

        var hideOverflowingTabs = function () {
            var $moreTab = $tabsContainer.children("[name='More']");
            $moreTab.detach();

            var children = $tabsContainer.children().toArray();

            children.forEach(function (element) {
                var $element = $(element);
                if (removedTabs.indexOf($element.attr("name")) === -1) {
                    $element.removeClass("hide");
                }
            });

            var windowRegion = $elem.region();

            var lastVisibleTabIndex = children.reduce(function (lastIndex, element, index) {
                var elementRegion = $(element).region();
                var union = windowRegion.union(elementRegion);

                if (windowRegion.equals(union)) {
                    return index;
                }

                return lastIndex;
            }, 0);

            $moreTab.appendTo($tabsContainer);

            if (lastVisibleTabIndex === children.length - 1) {
                $moreTab.addClass("hide");
                return;
            }

            $moreTab.removeClass("hide");

            // Hide visible tabs.
            var hiddenTabs = children.slice(lastVisibleTabIndex);
            hiddenTabs.forEach(function (element) {
                var $element = $(element);
                $(element).addClass("hide");
            });

            // Show visible tabs.
            children.slice(0, lastVisibleTabIndex).forEach(function (element) {
                $(element).removeClass("hide");
            });

            $tabsOverflow.empty();

            hiddenTabs.forEach(function (tab) {
                var name = $(tab).attr("name");
                var $tab = $("<div>" + name + "</div>");
                $tab.attr("name", name);
                $tab.addClass("ellipsis");
                $tab.on("click", function () {
                    self.selectTabAsync(name).try();
                    hideTabsOverflow();
                });

                $tabsOverflow.append($tab);
            });

        };

        self.selectTabAsync = function (name) {
            return Future.fromResult().chain(function () {
                currentName = name;
                var $tab = $tabsContainer.children("[name='" + name + "']");
                var $moreTab = $tabsOverflow.children("[name='" + name + "']");

                $tabsContainer.children().removeClass("selected");
                $tabsOverflow.children().removeClass("selected");

                $tab.addClass("selected");
                $moreTab.addClass("selected");

                if ($moreTab.length > 0) {
                    $tabsContainer.children("[name='More']").addClass("selected");
                }

                return stateManager.replaceAsync(name);
            });
        };

        self.hideTab = function (name) {
            var $tab = $tabsContainer.children("[name='" + name + "']");
            $tab.addClass("hide");

            var index = removedTabs.indexOf(name);

            if (index === -1) {
                removedTabs.push(name);
            }
        };

        self.showTab = function (name) {
            var $tab = $tabsContainer.children("[name='" + name + "']");
            $tab.removeClass("hide");
            var index = removedTabs.indexOf(name);

            if (index > -1) {
                removedTabs.splice(index, 1);
            }
        };

        self.getTabs = function () {
            return stateManager.getStates();
        };

        self.hideAllTabs = function () {
            $tabsContainer.addClass("hide");
            $content.css({
                "top": "0"
            });
        };

        self.showAllTabs = function () {
            $tabsContainer.removeClass("hide");
            $content.css({
                "top": "45px"
            });
        };

        self.resize = function () {
            hideTabsOverflow();
            hideOverflowingTabs();
            self.selectTabAsync(currentName).try();
        };

        $tabsOverflowVeil.on("click", function () {
            hideTabsOverflow();
        });

        createTabs();
    };
});