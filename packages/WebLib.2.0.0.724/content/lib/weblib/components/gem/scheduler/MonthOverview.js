BASE.require([
    "jQuery",
    "Date.prototype.format",
    "BASE.collections.Hashmap",
    "Array.prototype.orderBy"
], function () {
    var Fulfillment = BASE.async.Fulfillment;
    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;

    var intersects = function (date, startDate, endDate) {
        endDate.setHours(23, 59, 59, 999);
        endDate.setHours(0, 0, 0, 0);

        var time = date.getTime();

        return (time >= startDate.getTime() && time <= endDate.getTime())
    };

    var isValidDate = function (date) {
        return date instanceof Date && !isNaN(date.getTime());
    };

    var TypeConfig = function (typeConfig) {
        if (typeConfig.Type == null ||
            typeConfig.displayService == null ||
            typeConfig.startPropertyName == null ||
            typeConfig.endPropertyName == null ||
            typeConfig.color == null) {
            throw new Error("typeConfig needs to have these properties: Type, displayService, startPropertyName, endPropertyName, color.");
        }

        this.Type = typeConfig.Type;
        this.color = typeConfig.color;
        this.displayService = typeConfig.displayService;
        this.startPropertyName = typeConfig.startPropertyName;
        this.endPropertyName = typeConfig.endPropertyName;
        this.service = typeConfig.displayService.service;
        this.fontColor = typeConfig.fontColor;
    };

    TypeConfig.prototype.getEventsAsync = function (startDate, endDate) {
        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            throw new Error("StartDate and endDate need to be valid date.");
        }

        var startPropertyName = this.startPropertyName;
        var endPropertyName = this.endPropertyName;

        return this.service.asQueryable(this.Type).where(function (expBuilder) {
            return expBuilder.or(
                expBuilder.and(
                    expBuilder.property(endPropertyName).isGreaterThanOrEqualTo(startDate),
                    expBuilder.property(endPropertyName).isLessThan(endDate)
                    ),
                expBuilder.and(
                    expBuilder.property(startPropertyName).isGreaterThanOrEqualTo(startDate),
                    expBuilder.property(endPropertyName).isLessThan(endDate)
                    ),
                expBuilder.and(
                expBuilder.property(startPropertyName).isLessThan(startDate),
                expBuilder.property(endPropertyName).isGreaterThanOrEqualTo(endDate)
                ),
                expBuilder.and(
                    expBuilder.property(startPropertyName).isGreaterThanOrEqualTo(startDate),
                    expBuilder.property(startPropertyName).isLessThan(endDate)
                )
           )
        }).toArrayAsync();
    };

    BASE.namespace("components.gem.scheduler");

    components.gem.scheduler.MonthOverview = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var dates = [];
        var $displayDate = $(tags["display-date"]);
        var $select = $(tags["select"]);
        var $dates = $(tags["dates"]);
        var $previousMonth = $(tags["previous-month"]);
        var $nextMonth = $(tags["next-month"]);
        var $lastSelect = $();
        var todaysDate = new Date();
        var offset = 0;
        var year = todaysDate.getFullYear();
        var month = todaysDate.getMonth();
        var entityViewsByType = new Hashmap();
        var typeConfigByType = new Hashmap();
        var hiddenTypes = [];

        var dayThumbnailDelegate = {
            selectEvent: function (event) {
                var tempDate = new Date(event.startDate);

                while (tempDate.getMonth() === month &&
                    tempDate.getFullYear() === year &&
                    tempDate.getDate() <= event.endDate.getDate()) {
                    dates[tempDate.getDate() + offset].controller().selectEvent(event);
                    tempDate.setDate(tempDate.getDate() + 1);
                }

            },
            deselectEvent: function (event) {
                var tempDate = new Date(event.startDate);
                while (tempDate.getMonth() === month &&
                    tempDate.getFullYear() === year &&
                    tempDate.getDate() <= event.endDate.getDate()) {
                    dates[tempDate.getDate() + offset].controller().deselectEvent(event);
                    tempDate.setDate(tempDate.getDate() + 1);
                }
            }
        };

        services.set("typeConfigByType", typeConfigByType);

        //Save all the date slots into an array.
        for (var x = 0; x < 42; x++) {
            dates.push($(tags[x]));
        }

        var getEntityViewFuture = function (Type, viewComponent) {
            var entityViewFuture = Hashmap.get(Type);
            if (entityViewFuture == null) {
                entityViewFuture = services.get("windowService").createModalAsync({
                    componentName: viewComponent.name,
                    height: viewComponent.size && viewComponent.size.height || 500,
                    width: viewComponent.size && viewComponent.size.width || 800
                });
                entityViewsByType.add(Type, entityViewFuture);
            }
            return entityViewFuture;
        };

        var getControllerForDate = function (dayOfTheMonth) {
            return dates[offset + dayOfTheMonth - 1].controller();
        };

        var getControllerByIndex = function (index) {
            return dates[index].controller();
        };

        var clearDates = function () {
            Object.keys(dates).forEach(function (key) {
                getControllerByIndex(key).setDate(null);
            });
        };

        var redrawCalendar = function (year, month) {
            var date = new Date();
            date.setFullYear(year);
            date.setHours(0, 0, 0, 0);
            date.setMonth(month);
            date.setDate(1);

            clearDates();

            var startDate = new Date(date);

            month = date.getMonth();
            year = date.getFullYear();

            $displayDate.text(date.format("mmmm yyyy"));

            offset = date.getDay();

            var currentDate;

            do {
                currentDate = date.getDate();
                getControllerForDate(currentDate).setDate(new Date(date));
                date.setDate(currentDate + 1);
            } while (date.getDate() !== 1)

            var endDate = new Date(date);
            endDate.setMonth(endDate.getMonth() + 1);

            var results = typeConfigByType.getValues().filter(function (config) {
                return hiddenTypes.indexOf(config.Type) === -1;
            }).map(function (config) {
                return config.getEventsAsync(startDate, endDate).chain(function (results) {
                    return {
                        config: config,
                        results: results
                    };
                });
            });

            Future.all(results).chain(function (allEventTypes) {
                var events = allEventTypes.reduce(function (accumulator, typeData) {
                    var results = typeData.results;
                    var config = typeData.config;

                    return accumulator.concat(results.map(function (entity) {
                        return {
                            Type: config.Type,
                            entity: entity,
                            startDate: entity[config.startPropertyName],
                            endDate: entity[config.endPropertyName],
                            displayService: config.displayService,
                            color: config.color,
                            fontColor: config.fontColor
                        }
                    }));
                }, []).orderBy(function (event) {
                    return event.startDate;
                });

                var currentDate;
                var date = new Date(startDate);
                var controller;
                do {
                    currentDate = date.getDate();
                    controller = getControllerForDate(currentDate);

                    controller.clearEvents();
                    events.forEach(function (event) {
                        if (intersects(date, event.startDate, event.endDate)) {
                            controller.addEvent(event);
                        }
                    });

                    date.setDate(currentDate + 1);
                } while (date.getMonth() === month && date.getFullYear() === year)

            }).try();
        };

        var redrawCalendarByDate = function (date) {
            date.setFullYear(date.getFullYear());
            date.setMonth(date.getMonth());
            redrawCalendar(year, month);
        };

        var setDelegate = function () {
            Object.keys(dates).forEach(function (key) {
                var controller = dates[key].controller();
                controller.setDelegate(dayThumbnailDelegate);
            });
        };

        self.setYear = function (value) {
            year = value;
            redrawCalendar(value, month);
        };

        self.setMonth = function (value) {
            month = value;
            redrawCalendar(year, value);
        };

        self.prepareToActivateAsync = function () {

        };

        self.prepareToDeactivateAsync = function () {

        };

        self.activated = function () {
        };

        self.registerType = function (typeConfig) {
            var config = new TypeConfig(typeConfig);
            typeConfigByType.add(typeConfig.Type, config);

            redrawCalendar(year, month);
        };

        self.hideType = function (Type) {
            if (typeConfigByType.hasKey(Type)) {
                hiddenTypes.push(Type);
            }
        };

        self.showType = function (Type) {
            if (typeConfigByType.hasKey(Type)) {
                var index = hiddenTypes.indexOf(Type);
                if (index >= 0) {
                    hiddenTypes.splice(index, 1);
                }
            }
        };

        self.addAsync = function () { };

        self.redraw = function () {
            redrawCalendar(year, month);
        };

        $dates.find(".calendar-square").on("click", function () {
            //TODO make a popup with a choice on what to add.
        });

        $previousMonth.on("click", function () {
            self.setMonth(month - 1);
        });

        $nextMonth.on("click", function () {
            self.setMonth(month + 1);
        });

        $elem.on("eventChange", function () {
            redrawCalendar(year, month);
            return false;
        });

        setDelegate();

        redrawCalendar(year, month);

    };

});