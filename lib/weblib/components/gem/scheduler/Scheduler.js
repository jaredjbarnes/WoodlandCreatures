BASE.require([
    "jQuery",
    "Date.prototype.format",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline"
], function () {
    var Fulfillment = BASE.async.Fulfillment;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var Future = BASE.async.Future;

    var createHideDateAnimation = function (dateElement, eventElement) {

        var dateElementAnimation = new ElementAnimation({
            target: dateElement,
            properties: {
                height: {
                    from: "300px",
                    to: "0px"
                }
            },
            easing: "easeOutExpo"
        });

        var eventElementAnimation = new ElementAnimation({
            target: eventElement,
            properties: {
                top: {
                    from: "300px",
                    to: "0px"
                }
            },
            easing: "easeOutExpo"
        });

        var timeline = new PercentageTimeline(500);

        timeline.add({
            animation: dateElementAnimation,
            startAt: 0,
            endAt: 1
        }, {
            animation: eventElementAnimation,
            startAt: 0,
            endAt: 1
        });

        return timeline;
    };

    var createShowDateAnimation = function (dateElement, eventElement) {

        var dateElementAnimation = new ElementAnimation({
            target: dateElement,
            properties: {
                height: {
                    from: "0px",
                    to: "300px"
                }
            },
            easing: "easeOutExpo"
        });

        var eventElementAnimation = new ElementAnimation({
            target: eventElement,
            properties: {
                top: {
                    from: "0px",
                    to: "300px"
                }
            },
            easing: "easeOutExpo"
        });

        var timeline = new PercentageTimeline(500);

        timeline.add({
            animation: dateElementAnimation,
            startAt: 0,
            endAt: 1
        }, {
            animation: eventElementAnimation,
            startAt: 0,
            endAt: 1
        });

        return timeline;
    };

    BASE.namespace("components.gem.scheduler");

    components.gem.scheduler.Scheduler = function (elem, tags, services) {
        var self = this;
        var $dayButton = $(tags["day-button"]);
        var $events = $(tags["events"]);
        var $monthButton = $(tags["month-button"]);
        var monthOverview = $(tags["month-overview"]).controller();
        var dailyOverview = $(tags["daily-overview"]).controller();
        var overviewStateManager = $(tags["overview-state-manager"]).controller();
        var dateSelector = $(tags["date-selector"]).controller();
        var eventSelector = $(tags["event-selector"]).controller();
        var hideDateAnimation = createHideDateAnimation(tags["date-selector"], tags["event-selector"]);
        var showDateAnimation = createShowDateAnimation(tags["date-selector"], tags["event-selector"]);
        var currentState = monthOverview;
        var types = [];


        var createTypeElement = function (typeConfig) {
            var typeDisplay = typeConfig.displayService.getDisplayByType(typeConfig.Type);
            var name = typeDisplay.labelInstance();

            var $div = $("<div><input type='checkbox' checked='true' />" + name + "</div>");
            var $input = $div.children("input");

            $div.css({
                color: typeConfig.color,
                cursor: "pointer"
            }).attr("unselectable", "unselectable");

            $input.on("click", function () {
                if ($input[0].checked) {
                    monthOverview.showType(typeConfig.Type);
                } else {
                    monthOverview.hideType(typeConfig.Type);
                }
                monthOverview.redraw();
                return false;
            });

            $div.on("click", function (event) {
                if ($input[0].checked) {
                    $input[0].checked = false;
                    monthOverview.hideType(typeConfig.Type);
                } else {
                    $input[0].checked = true;
                    monthOverview.showType(typeConfig.Type);
                }

                monthOverview.redraw();
                return false;
            });

            return $div;

        };

        var makeTypeCheckbox = function (typeConfig) {
            var $element = createTypeElement(typeConfig);
            $events.append($element);
        };

        self.setYear = function (value) {
            currentState.setYear(value);
        };

        self.setMonth = function (value) {
            currentState.setMonth(value);
        };

        self.prepareToActivateAsync = function () {
        };

        self.prepareToDeactivateAsync = function () {
        };

        self.activated = function () {
        };

        self.registerType = function (typeConfig) {
            types.push(typeConfig.Type);
            makeTypeCheckbox(typeConfig);

            monthOverview.registerType(typeConfig);
            //dailyOverview.registerType(typeConfig);
        };

        self.goToMonthOverviewAsync = function () {
            $dayButton.removeClass("selected");
            $monthButton.addClass("selected");
            currentState = monthOverview;
            return Future.all([
                overviewStateManager.replaceAsync("month-overview"),
                hideDateAnimation.seek(0).playToEndAsync()
            ]);
        };

        self.goToDailyOverviewAsync = function () {
            $dayButton.addClass("selected");
            $monthButton.removeClass("selected");
            currentState = dailyOverview;

            return Future.all([
                overviewStateManager.replaceAsync("daily-overview"),
                showDateAnimation.seek(0).playToEndAsync()
            ]);
        };

        overviewStateManager.pushAsync("month-overview").try();

        $dayButton.on("click", function () {
            self.goToDailyOverviewAsync().try()
        });

        $monthButton.on("click", function () {
            self.goToMonthOverviewAsync().try()
        });

        window.scheduler = this;

    };

});