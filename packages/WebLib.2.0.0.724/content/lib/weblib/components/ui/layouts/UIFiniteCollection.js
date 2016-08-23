BASE.require([
    "jQuery",
    "components.ui.layouts.collections.ListLayout",
    "Array.prototype.asQueryable",
    "BASE.async.Continuation",
    "Array.prototype.except",
    "jQuery.fn.transition"
], function () {
    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Continuation = BASE.async.Continuation;

    components.ui.layouts.UIFiniteCollection = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var layout = null;
        var queryable = [].asQueryable();
        var $scroll = $(tags["content"]);
        var $items = [];
        var resizeFuture = new Future();
        var redrawFuture = new Future();
        var currentLength = 0;
        var currentArray = [];
        var shouldAnimateIn = false;

        var createItem = function () {
            var attributes = {};
            if (layout.componentController) {
                attributes.controller = layout.componentController;
            }
            return BASE.web.components.createComponent(layout.component, "", attributes);
        };

        var createChildren = function () {
            return new Future(function (setValue, setError) {
                var task = new Task();
                var currentLength = currentArray.length;
                var count = 0;

                for (var x = 0 ; (x + $items.length) < currentLength; x++) {
                    task.add(createItem());
                }

                task.start().whenAny(function (future) {
                    $(future.value).css({
                        "position": "absolute"
                    });
                    $items.push(future.value);
                }).whenAll(setValue);
            }).then();
        };

        self.setLayout = function (value) {
            if (layout !== value) {
                layout = value;
            }
        };

        self.getLayout = function () {
            return layout;
        };

        self.prepareLayout = function () {
            var width = elem.offsetWidth;
            var height = elem.offsetHeight;

            layout.scrollViewport = { width: width, height: height };
        };

        self.setQueryable = function (value) {
            if (queryable !== value) {
                queryable = value;
                shouldAnimateIn = true;
                self.update();
            }
        };

        self.getQueryable = function () {
            return queryable;
        };

        self.resize = function () {
            resizeFuture.cancel();

            resizeFuture = queryable.toArray().then(function (array) {
                currentArray = array;
                var width = layout.getWidth(array.length);
                var height = layout.getHeight(array.length);

                if (height === 0 || height === "0px") {
                    height = "auto";
                }

                $scroll.css({
                    "width": width,
                    "height": height
                });

            });

            return resizeFuture;
        };

        self.redraw = function () {
            self.prepareLayout();
            redrawFuture.cancel();
            return redrawFuture = new Future(function (setValue, setError) {
                new Continuation(self.resize()).then(function () {
                    return createChildren();
                }).then(function () {
                    var animatedIn = false;

                    if (shouldAnimateIn) {
                        shouldAnimateIn = false;
                        animatedIn = true;
                    }

                    var activeElements = [];
                    currentArray.forEach(function (item, index) {
                        var element = $items[index];
                        var $element = $(element);
                        var css = layout.getCss(index);
                        css.display = "block";

                        if (animatedIn) {
                            css.opacity = 0;
                            css.transform = "translate3d(100%,0,0)";
                        }

                        layout.prepareElement(element, item, index);
                        activeElements.push(element);

                        $element.css(css);


                        if (!element.parentElement) {
                            $scroll.append(element);
                        }
                        $element.triggerHandler("enteredView");

                        if (animatedIn) {

                            $element.transition({
                                opacity: {
                                    to: 1,
                                    duration: 500
                                },
                                transform: {
                                    to: "translate3d(0,0,0)",
                                    duration: 900,
                                    easing: "easeOutExpo"
                                }
                            });
                        }
                    });

                    $items.except(activeElements).forEach(function (element) {
                        $(element).css("display", "none");
                    });

                    setValue();
                });

            }).then();
        };

        self.update = function () {
            self.prepareLayout();
            self.redraw();
        };

        self.updateWithAnimation = function () {
            shouldAnimateIn = true;
            self.prepareLayout();
            self.redraw();
        };

        $elem.on("enteredView", function () {
            window.addEventListener("resize", function () {
                self.redraw();
            });
        });

    };
});