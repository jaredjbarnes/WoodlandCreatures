BASE.require([
    "jQuery",
    "components.ui.layouts.collections.ListLayout",
    "Array.prototype.asQueryable",
    "BASE.async.Continuation",
    "Array.prototype.except",
    "jQuery.fn.transition",
    "Array.prototype.empty"
], function () {
    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Continuation = BASE.async.Continuation;

    components.ui.layouts.UIDiggingCollection = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var layout = null;
        var queryable = [].asQueryable();
        var $content = $(tags["content"]);
        var $items = [];
        var requery = true;
        var resizeFuture = new Future();
        var redrawFuture = new Future();
        var currentLength = 0;
        var currentArray = [];
        var shouldAnimateIn = false;
        var skip = 0;
        var take = 10;
        var $loadMoreResults = $(tags['load-more-results']);

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

        var isScrolledIntoView = function (checkElem) {
            var elemViewTop = $elem.scrollTop();
            var elemViewBottom = elemViewTop + $elem.outerHeight();

            var $checkElem = $(checkElem);

            var checkElemTop = parseInt($checkElem.css('top'), 10);
            var checkElemBottom = checkElemTop + $checkElem.height();

            return ((checkElemBottom <= elemViewBottom + 3000) && (checkElemTop >= elemViewTop - 3000));
        }

        var scrollHandler = function () {
            $content.children().removeClass('hide').filter(function () {
                return !isScrolledIntoView(this);
            }).addClass('hide');
        }

        self.setTake = function (value) {
            take = value;
        }

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
                queryable.count().then(function (value) {
                    count = value;
                });
                shouldAnimateIn = true;
                self.update();
            }
        };

        self.getQueryable = function () {
            return queryable;
        };

        self.resize = function () {
            resizeFuture.cancel();

            if (requery) {
                resizeFuture = queryable.skip(skip).take(skip + take).toArray();
                requery = false;
            }
            else {
                resizeFuture = new Future(function (setValue, setError) {
                    setValue([]);
                });
            }

            resizeFuture.then(function (array) {
                if (array.length > 0) {
                    currentArray = currentArray.concat(array);
                }
                var width = layout.getWidth(currentArray.length);
                var height = layout.getHeight(currentArray.length);

                if (height === 0 || height === "0px") {
                    height = "auto";
                }

                $content.css({
                    "width": width,
                    "height": height
                });

            });

            var tempSkip = skip + take;
            queryable.skip(tempSkip).take(tempSkip + 1).ifNone(function () {
                $loadMoreResults.remove();
            });

            return resizeFuture;
        };

        self.redraw = function () {
            $items.empty();
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


                    currentArray.forEach(function (item, index) {
                        var element = $items[index];
                        var $element = $(element);
                        var css = layout.getCss(index);
                        css.display = "block";

                        if (animatedIn && index >= skip) {
                            css.opacity = 0;
                            css.transform = "translate3d(0,100%,0) perspective(" + $items[0].offsetHeight + "px) rotateX(90deg)";
                        }

                        $element.css(css);

                        if (isScrolledIntoView($element)) {
                            $element.removeClass('hide');
                            layout.prepareElement(element, item, index);

                            if (!element.parentElement) {
                                $content.append(element);
                            } 
                        }
                        else {
                            $element.addClass('hide');
                        }

                        
                        $element.triggerHandler("enteredView");

                        if (animatedIn) {

                            $element.transition({
                                opacity: {
                                    to: 1,
                                    duration: 500
                                },
                                transform: {
                                    to: "translate3d(0,0,0) perspective(" + $items[0].offsetHeight + "px) rotateX(0deg)",
                                    duration: 600,
                                    easing: "easeOutExpo"
                                }
                            });
                        }
                    });

                    setValue();
                });

            }).then();
        };

        self.update = function () {
            self.redraw();
        };

        self.updateWithAnimation = function () {
            shouldAnimateIn = true;
            self.redraw();
        };

        $elem.on("enteredView", function () {
            window.addEventListener("resize", function () {
                self.redraw();
            });
        });

        $elem.on('scroll', function () {
            clearTimeout($.data(this, 'scrollTimer'));
            $.data(this, 'scrollTimer', setTimeout(function () {
                self.redraw();
            }, 250));   
        });

        $loadMoreResults.on('click', function () {
            skip = skip + take;
            requery = true;
            self.updateWithAnimation();
        });

    };
});