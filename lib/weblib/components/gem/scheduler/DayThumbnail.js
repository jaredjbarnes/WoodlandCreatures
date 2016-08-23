BASE.require([
    "jQuery",
    "jQuery.fn.region",
    "BASE.collections.Hashmap",
    "BASE.data.DataContext",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline"
], function () {

    var Hashmap = BASE.collections.Hashmap;
    var DataContext = BASE.data.DataContext;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var Future = BASE.async.Future;

    var createTransformAnimation = function ($element, top, left, easing, duration) {
        var element = $element[0];
        var animation = new ElementAnimation({
            target: element,
            properties: {
                translateX: {
                    from: element.translateX || "0%",
                    to: left
                },
                translateY: {
                    from: element.translateY || "0%",
                    to: top
                }
            },
            easing: easing || "easeOutExpo",
            duration: duration || 500
        });

        return animation;
    };

    var createFadeInAddEventAnimation = function ($addButton) {
        var bottom = $addButton.css("bottom");
        var animation = new ElementAnimation({
            target: $addButton[0],
            properties: {
                bottom: {
                    from: $addButton.css("bottom"),
                    to: "3%"
                },
                opacity: {
                    from: $addButton.css("opacity"),
                    to: 1
                }
            },
            easing: "easeOutExpo",
            duration: 500
        });

        return animation;
    }

    var createFadeOutAddEventAnimation = function ($addButton) {
        var animation = new ElementAnimation({
            target: $addButton[0],
            properties: {
                bottom: {
                    from: $addButton.css("bottom"),
                    to: "10%"
                },
                opacity: {
                    from: $addButton.css("opacity"),
                    to: 0
                }
            },
            easing: "easeOutExpo",
            duration: 200
        });

        return animation;
    }

    var intersects = function (date, startDate, endDate) {
        endDate.setHours(23, 59, 59, 999);
        endDate.setHours(0, 0, 0, 0);

        var time = date.getTime();

        return (time >= startDate.getTime() && time <= endDate.getTime())
    };

    var isSameDay = function (date1, date2) {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
    };

    BASE.namespace("components.gem.scheduler");

    components.gem.scheduler.DayThumbnail = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $dayOfTheMonth = $(tags["day-of-the-month"]);
        var $dateHeader = $(tags["date-header"]);
        var $addButton = $(tags["add-button"]);
        var $editButton = $(tags["edit-button"]);
        var $deleteButton = $(tags["delete-button"]);
        var $closeSelectButton = $(tags["close-select-button"]);
        var $selectMenu = $(tags["select-menu"]);
        var $eventsContainer = $(tags["events-container"]);
        var $first = $(tags["0"]);
        var $second = $(tags["1"]);
        var $third = $(tags["2"]);
        var $fourth = $(tags["3"]);
        var currentDate = null;
        var editWindowsByType = new Hashmap();
        var eventSelectorFuture = null;
        var typeConfigByType = null;
        var currentSlotHeight = 0;
        var currentAddAnimationFuture = Future.fromResult();
        var currentlySelectedEvent = null;
        var delegate = null;

        var getEditWindowByTypeAsync = function (Type) {
            var entityFormFuture = editWindowsByType.get(Type);

            if (entityFormFuture == null) {
                return entityFormFuture = services.get("windowService").createModalAsync({
                    componentName: "gem-independent-entity-form",
                    height: 500,
                    width: 800
                });

                editWindowsByType.add(Type, entityFormFuture);
            }

            return entityFormFuture;
        };

        var getEventSelectorWindowByTypeAsync = function () {
            if (eventSelectorFuture == null) {
                return eventSelectorFuture = services.get("windowService").createModalAsync({
                    componentName: "gem-scheduler-event-type-selector",
                    height: 300,
                    width: 200
                });
            }

            return eventSelectorFuture;
        };

        var createLeftArrow = function (color) {
            var $div = $("<div></div>");
            var height = currentSlotHeight / 2;

            $div.css({
                height: 0,
                width: 0,
                borderTop: height + "px solid transparent",
                borderBottom: height + "px solid transparent",
                borderRight: height + "px solid " + color
            }).attr("left-arrow", "left-arrow");

            return $div;
        };

        var setLeftArrowHeight = function ($arrow) {
            var height = currentSlotHeight / 2;

            $arrow.css({
                height: 0,
                width: 0,
                borderTopWidth: height,
                borderBottomWidth: height,
                borderRightWidth: height
            }).attr("left-arrow", "left-arrow");
        };

        var createRightArrow = function (color) {
            var $div = $("<div></div>");
            var height = currentSlotHeight / 2;

            $div.css({
                height: 0,
                width: 0,
                borderTop: height + "px solid transparent",
                borderBottom: height + "px solid transparent",
                borderLeft: height + "px solid " + color
            }).attr("right-arrow", "right-arrow");

            return $div;
        };

        var setRightArrowHeight = function ($arrow) {
            var height = currentSlotHeight / 2;

            $arrow.css({
                height: 0,
                width: 0,
                borderTopWidth: height,
                borderBottomWidth: height,
                borderLeftWidth: height
            }).attr("right-arrow", "right-arrow");
        };

        var createEventElement = function (event) {
            var $event = $("<div></div>");
            var typeDisplay = event.displayService.getDisplayByType(event.Type);
            var $label = $("<div></div>");

            $label.addClass("ellipsis").appendTo($event);

            $event.css({
                backgroundColor: event.color,
                color: event.fontColor || "rgba(255,255,255,0.8)",
                height: currentSlotHeight + "px",
                paddingLeft: "4px",
                position: "relative",
                width: "100%",
                top: 0,
                left: 0,
                cursor: "pointer",
                boxSizing: "border-box"
            });

            var tempEndDate = new Date(event.endDate);
            var tempStartDate = new Date(event.startDate);
            var tempCurrentDate = new Date(currentDate);

            if (currentDate && event.startDate && event.endDate && intersects(currentDate, event.startDate, event.endDate)) {

                tempStartDate.setHours(0, 0, 0, 0);
                tempEndDate.setHours(23, 59, 59, 999);
                tempCurrentDate.setHours(0, 0, 0, 0);

                if (isSameDay(tempCurrentDate, tempStartDate)) {
                    $label.text(typeDisplay.displayInstance(event.entity));
                    $event.css({
                        "border-top-left-radius": "2px",
                        "border-bottom-left-radius": "2px",
                        "left": "2%",
                        "width": "98%"
                    });
                }

                if (isSameDay(tempCurrentDate, tempEndDate)) {
                    $event.css({
                        "border-top-right-radius": "2px",
                        "border-bottom-right-radius": "2px",
                        "width": "92%"
                    });
                }


                if (isSameDay(tempStartDate, tempEndDate)) {
                    $event.css({
                        "width": "90%"
                    });
                }

                if (currentDate.getDay() === 6 &&
                    currentDate.getTime() < event.endDate.getTime()) {
                    var $arrow = createRightArrow(event.color);
                    $arrow.css({
                        position: "absolute",
                        top: 0,
                        right: 0,
                        transform: "translate(100%, 0)"
                    }).prependTo($event);

                    $event.css({
                        "width": "90%"
                    });
                }

                var tempStartDate = new Date(event.startDate);
                tempStartDate.setHours(0, 0, 0, 0);

                if (currentDate.getDay() === 0 &&
                    currentDate.getTime() !== tempStartDate.getTime()) {
                    $label.text("..." + typeDisplay.displayInstance(event.entity));
                    var $arrow = createLeftArrow(event.color);
                    $arrow.css({
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transform: "translate(-100%, 0)"
                    }).prependTo($event);

                    $event.css({
                        "width": "90%",
                        left: "10%"
                    });
                }

                if (currentDate.getDate() === 1 &&
                    currentDate.getTime() !== tempStartDate.getTime()) {
                    $label.text("..." + typeDisplay.displayInstance(event.entity));
                    var $arrow = createLeftArrow(event.color);
                    $arrow.css({
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transform: "translate(-100%, 0)"
                    }).prependTo($event);

                    $event.css({
                        "width": "90%",
                        left: "10%"
                    });
                }

                var lastDayDate = new Date(currentDate);
                lastDayDate.setDate(1);
                lastDayDate.setMonth(lastDayDate.getMonth() + 1);
                lastDayDate.setDate(0);
                lastDayDate.setHours(23, 59, 59, 999);

                if (isSameDay(lastDayDate, tempCurrentDate) && tempEndDate.getTime() > lastDayDate.getTime()) {
                    var $arrow = createRightArrow(event.color);
                    $arrow.css({
                        position: "absolute",
                        top: 0,
                        right: 0,
                        transform: "translate(100%, 0)"
                    }).prependTo($event);

                    $event.css({
                        "width": "90%"
                    });
                }

                if (!isSameDay(lastDayDate, tempStartDate) && !isSameDay(lastDayDate, tempEndDate) && isSameDay(lastDayDate, tempCurrentDate)) {
                    $event.css({
                        "width": "80%"
                    });
                }

            }

            $event.on("mouseenter", function () {
                delegate.selectEvent(event);
            });

            $event.on("mouseleave", function () {
                delegate.deselectEvent(event);
            });

            $event.on("click", function () {
                showSelectionMenuAsync(event).try();
            });

            return $event;
        };

        var showSelectionMenuAsync = function (event) {
            currentlySelectedEvent = event;

            $selectMenu.removeClass("hide");

            var timeline = new PercentageTimeline(500);
            var editAnimation = createTransformAnimation($editButton, "-100%", "-100%");
            var deleteAnimation = createTransformAnimation($deleteButton, "-100%", "100%");

            var menuAnimation = new ElementAnimation({
                target: $selectMenu[0],
                properties: {
                    opacity: {
                        from: $selectMenu.css("opacity"),
                        to: 1
                    }
                }
            });

            timeline.add({
                animation: editAnimation,
                startAt: 0,
                endAt: 1
            });

            timeline.add({
                animation: deleteAnimation,
                startAt: 0,
                endAt: 1
            });

            timeline.add({
                animation: menuAnimation,
                startAt: 0,
                endAt: 1
            });

            return Future.all([timeline.playToEndAsync(), hideAddButtonAsync()]);

        };

        var hideSelectionMenuAsync = function (event) {
            currentlySelectedEvent = event;

            var timeline = new PercentageTimeline(200);
            var editAnimation = createTransformAnimation($editButton, "0%", "0%", "linear", 200);
            var deleteAnimation = createTransformAnimation($deleteButton, "0%", "0%", "linear", 200);

            var menuAnimation = new ElementAnimation({
                target: $selectMenu[0],
                properties: {
                    opacity: {
                        from: $selectMenu.css("opacity"),
                        to: 0
                    }
                }
            });

            timeline.add({
                animation: editAnimation,
                startAt: 0,
                endAt: 1
            });

            timeline.add({
                animation: deleteAnimation,
                startAt: 0,
                endAt: 1
            });

            timeline.add({
                animation: menuAnimation,
                startAt: 0,
                endAt: 1
            });

            return timeline.playToEndAsync().chain(function () {
                $selectMenu.addClass("hide");
            });

        };

        var showAddButtonAsync = function () {
            if (currentDate != null) {
                var animation = createFadeInAddEventAnimation($addButton);

                $addButton.removeClass("hide");
                currentAddAnimationFuture.cancel();
                return currentAddAnimationFuture = animation.playToEndAsync();
            }

            return Future.fromResult();
        };

        var hideAddButtonAsync = function () {
            if (currentDate != null) {
                var animation = createFadeOutAddEventAnimation($addButton);

                currentAddAnimationFuture.cancel();
                return currentAddAnimationFuture = animation.playToEndAsync().then(function () {
                    $addButton.addClass("hide");
                });
            }
            return Future.fromResult();
        };

        var getFirstSlotElement = function () {
            return $eventsContainer.find("[inactive]").first().removeAttr("inactive");
        };

        var getSlotByIndex = function (index) {
            return $(tags[index]).removeAttr("inactive");
        };

        var redraw = function () {
            requestAnimationFrame(function () {
                var region = $dateHeader.region();
                var height = region.height;

                var fontSize = parseInt(height * .65, 10)
                var css = {
                    lineHeight: height + "px",
                    fontSize: fontSize + "px",
                    height: height + "px"
                };

                currentSlotHeight = height;
                $eventsContainer.children().css(css);
                $eventsContainer.children().children().css(css);

                setLeftArrowHeight($eventsContainer.find("[left-arrow]"));
                setRightArrowHeight($eventsContainer.find("[right-arrow]"));
            });
        };

        self.selectEvent = function (event) {
            //console.log("Select");
        };

        self.deselectEvent = function (event) {
            //console.log("Deselect");
        };

        self.setDelegate = function (value) {
            delegate = value;
        };

        self.setDate = function (date) {
            if (!(date instanceof Date) || date == null) {
                $dayOfTheMonth.text("");
                $elem.css("background-color", "#f9f9f9");
                currentDate = null;
            } else {
                $dayOfTheMonth.text(date.getDate());
                $elem.css("background-color", "");
                currentDate = date;
                currentDate.setHours(0, 0, 0, 0);
            }

            self.clearEvents();
            redraw();
        };

        // event.color, event.type, event.displayService, event.entity, event.slotIndex
        self.addEvent = function (event) {
            var $event = createEventElement(event);
            var $slot;


            if (event.slotIndex == null) {
                $slot = getFirstSlotElement();
            } else {
                $slot = getSlotByIndex(event.slotIndex);
            }

            $slot.empty();
            event.slotIndex = parseInt($slot.attr("tag"), 10);
            $slot.append($event);
        };

        self.addEvents = function (events) {
            events.forEach(self.addEvent);
        };

        self.clearEvents = function () {
            $eventsContainer.children().empty().attr("inactive", "true");
        };

        $addButton.on("click", function () {
            getEventSelectorWindowByTypeAsync().chain(function (windowManager) {
                var controller = windowManager.controller;
                var future = controller.setTypeConfigAsync(services.get("typeConfigByType"));

                windowManager.window.showAsync().try();

                return future;
            }).chain(function (typeConfig) {
                var entity = new typeConfig.Type();
                var typeDisplay = typeConfig.displayService.getDisplayByType(typeConfig.Type);
                var dataContext = new DataContext(typeConfig.displayService.service);
                dataContext.addEntity(entity);
                var window;

                entity[typeConfig.startPropertyName] = new Date(currentDate);
                entity[typeConfig.endPropertyName] = new Date(currentDate);

                return getEditWindowByTypeAsync(typeConfig.Type).chain(function (windowManager) {
                    var controller = windowManager.controller;

                    window = windowManager.window;
                    windowManager.window.setName("Edit " + typeDisplay.labelInstance());

                    var future = controller.setConfigAsync({
                        entity: entity,
                        displayService: typeConfig.displayService
                    });

                    windowManager.window.showAsync().try();

                    return future;
                }).chain(function () {
                    return dataContext.saveChangesAsync();
                }).chain(function () {
                    $elem.trigger("eventChange");
                }).catch(function () {
                    console.log("ERROR");
                }).finally(function () {
                    dataContext.dispose();
                    window.closeAsync().try();
                })
            }).try();

        });

        $closeSelectButton.on("click", function () {
            hideSelectionMenuAsync().try();
            showAddButtonAsync().try();
        });

        $editButton.on("click", function () {
            var event = currentlySelectedEvent;
            var typeDisplay = event.displayService.getDisplayByType(event.Type);
            var dataContext = new DataContext(event.displayService.service);
            var entity = dataContext.loadEntity(event.entity);
            var window;

            return getEditWindowByTypeAsync(event.Type).chain(function (windowManager) {
                var controller = windowManager.controller;

                window = windowManager.window;
                windowManager.window.setName("Edit " + typeDisplay.labelInstance());

                var future = controller.setConfigAsync({
                    entity: entity,
                    displayService: event.displayService
                });

                windowManager.window.showAsync().try();

                return future;
            }).chain(function () {
                return dataContext.saveChangesAsync();
            }).chain(function () {
                $elem.trigger("eventChange");
            }).catch(function () {
                console.log("ERROR");
            }).finally(function () {
                dataContext.dispose();
                window.closeAsync().try();
            }).try();
        });

        $deleteButton.on("click", function () {
            var event = currentlySelectedEvent;
            var typeDisplay = event.displayService.getDisplayByType(event.Type);
            var dataContext = new DataContext(event.displayService.service);
            var entity = dataContext.loadEntity(event.entity);

            dataContext.removeEntity(entity);
            dataContext.saveChangesAsync().chain(function () {
                $elem.trigger("eventChange");
            }).try();

            hideSelectionMenuAsync().try();
        });

        $elem.on("mouseenter", function () {
            showAddButtonAsync().try();
        });

        $elem.on("mouseleave", function () {
            hideAddButtonAsync().try();
            hideSelectionMenuAsync().try();
        });

        $elem.on("windowResize", redraw);
    };

});