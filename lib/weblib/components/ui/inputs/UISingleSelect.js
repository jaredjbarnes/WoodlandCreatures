BASE.require([
    "jQuery",
    "jQuery.fn.region",
    "Array.prototype.asQueryable",
    "BASE.async.Future",
    "BASE.async.Task",
    "BASE.async.delay",
    "BASE.web.components"
], function () {

    BASE.namespace("components.ui.inputs");

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var delay = BASE.async.delay;

    var UP_ARROW = 38;
    var DOWN_ARROW = 40;
    var RIGHT_ARROW = 39;
    var LEFT_ARROW = 37;
    var RETURN = 13;
    var BACKSPACE = 8;
    var TAB = 9;

    var emptyResults = { results: [], elements: [] };

    components.ui.inputs.UISingleSelect = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var limit = 20;
        var componentName = null;
        var componentHtml = null;
        var selectedItem = null;
        var searchThrottle = Future.fromResult();
        var delayFuture = Future.fromResult();
        var $placeholder = $(tags["placeholder"]);
        var placeholderAttribute = $elem.attr("placeholder") || "--Select--";
        var $placeholderName = $(tags["placeholderName"]);
        var $dropdown = $(tags["dropdown"]);
        var dropdownNavigation = $(tags["navigation"]).controller();
        var $search = $(tags["search"]);
        var $componentContainer = $(tags["componentContainer"]);
        var $results = $(tags["results"]);
        var $loading = $(tags["loading"]);
        var $resultsContainer = $(tags["resultsContainer"]);
        var $searchContainer = $(tags["searchContainer"]);
        var $noResults = $(tags["noResults"]);
        var index = -1;
        var delayAmount = 0;

        var currentResults = emptyResults;

        var showDropdown = function () {
            var css = {
                "border-left": "1px solid #ccc",
                "border-right": "1px solid #ccc",
                "border-bottom": "1px solid #ccc",
                "-webkit-box-shadow": "0px 2px 5px 0px rgba(50, 50, 50, 0.75)",
                "-moz-box-shadow": " 0px 2px 5px 0px rgba(50, 50, 50, 0.75)",
                "box-shadow": "0px 2px 5px 0px rgba(50, 50, 50, 0.75)",
                height: "100px"
            }
            $dropdown.css(css);
        };
        var hideDropdown = function () {
            var css = {
                "border-left": "0",
                "border-right": "0",
                "border-bottom": "0",
                "-webkit-box-shadow": "",
                "-moz-box-shadow": "",
                "box-shadow": "",
                height: "0px"
            }
            $dropdown.css(css);
        };

        var showSearch = function (e) {
            //$dropdown.show();
            showDropdown();
            dropdownNavigation.redraw();
            search($search.val());

            if (document.activeElement !== $search[0]) {
                $search.focus();
            }

            return Future.fromResult(undefined);
        };

        var hideSearch = function () {
            //$dropdown.hide();
            hideDropdown();
            var future = Future.fromResult(null);
            $elem.triggerHandler("blur");

            return future;
        };

        var setSelectedName = function (name) {
            $placeholderName.text(name);
        };

        var toggleSearch = function () {
            if ($dropdown.css("height") === "0px") {
                showSearch();
            } else {
                hideSearch();
            }
        };

        var getComponentName = function () {
            return "list-item-container";
        };

        var getComponentInnerHtml = function () {
            var value = $componentContainer.html();
            return value || "";
        };

        var styleElement = function ($element) {
            $element.css({
                height: "35px",
                width: "100%",
                borderBottom: "1px solid #ccc",
                backgroundColor: "white",
                lineHeight: "35px",
                boxSizing: "border-box",
                paddingLeft: "5px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
            });
        };

        var focusElement = function ($element) {
            $element.css({
                backgroundColor: "#014A81",
                color: "white"
            });
        };

        var blurElement = function ($element) {
            $element.css({
                backgroundColor: "white",
                color: ""
            });
        };

        var fillElement = function (element, item, index) {
            var $element = $(element);
            var controller = $(element).controller();

            var title = item === null ? placeholderAttribute : self.titleForItem(item);


            styleElement($element);
            $element.text(title);

            $element.on("mousedown touchstart", function () {
                self.setValue(item);
            });

            $element.on("mouseenter", function () {
                focusElement($element);
            });

            $element.on("mouseleave", function () {
                blurElement($element);
            });

        };

        var createComponents = function (limit) {
            var components = [];
            for (var x = 0 ; x < limit; x++) {
                components.push(document.createElement("div"));
            }
            return components;
        };

        var adjustDropdownToFocusedElement = function ($element) {
            var dropDownRegion = $resultsContainer.region();
            var elementRegion = $element.region();

            if (elementRegion.bottom > dropDownRegion.bottom) {
                $resultsContainer.scrollTop((elementRegion.bottom - dropDownRegion.bottom) + $resultsContainer.scrollTop());
            }

            if (elementRegion.top < dropDownRegion.top) {
                $resultsContainer.scrollTop((elementRegion.top - dropDownRegion.top) + $resultsContainer.scrollTop());
            }
        };

        var focusIndex = function (value) {
            var elements = currentResults.elements;
            index = value;

            elements.forEach(function (element, i) {

                var $element = $(element);
                if (i === value) {
                    focusElement($element);
                    adjustDropdownToFocusedElement($element);
                } else {
                    blurElement($element);
                }

            });
        };

        var selectIndex = function (value) {
            if (value >= 0 && value <= currentResults.results.length) {
                self.setValue(currentResults.results[value]);
            }
            hideSearch();
        };

        var handleUserKeySelection = function (keycode) {
            if (keycode === UP_ARROW || keycode === LEFT_ARROW) {
                index--;
                index = index < 0 ? 0 : index;
            } else if (keycode === DOWN_ARROW || keycode === RIGHT_ARROW) {
                index++;
                var length = currentResults.results.length;
                index = index < length ? index : length - 1;
            } else if (keycode === RETURN) {
                selectIndex(index);
            }

            focusIndex(index);
        };

        var isSpecialKey = function (keycode) {
            if (keycode >= 48 && keycode <= 90 ||
                (keycode >= 96 && keycode <= 105) ||
                keycode === BACKSPACE) {

                return false;
            }
            return true;
        };

        var handleKeyup = function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (isSpecialKey(keycode)) {
                handleUserKeySelection(keycode);
            } else {
                var value = $search.val();
                search(value);

                var event = jQuery.Event("searchChange");
                event.value = value;
                $elem.triggerHandler(event);
            }
        };

        var fitResults = function () {

            var region = $results.region();
            var height = region.height;
            var headerHeight = $searchContainer.region().height;
            height = height + headerHeight;
            height = height > 400 ? 400 : height;

            $dropdown.css({ "height": height + "px" });

            dropdownNavigation.redraw();

        };

        var setDropdownToDefaultHeight = function () {
            var headerHeight = $searchContainer.region().height;
            $dropdown.css({ "height": (headerHeight + 35) + "px" });
        };

        var showNoResults = function () {
            setDropdownToDefaultHeight();
            $noResults.show();
        };

        var hideNoResults = function () {
            $noResults.hide();
        };

        var draw = function () {
            if (selectedItem === null) {
                setSelectedName(placeholderAttribute);
            } else {
                setSelectedName(self.titleForItem(selectedItem));
            }
        };

        var search = function (keywords) {
            delayFuture.cancel();
            delayFuture = delay(delayAmount);

            $results.empty();
            $loading.show();
            setDropdownToDefaultHeight();
            hideNoResults();
            index = -1;
            currentResults = emptyResults;

            var startTime = new Date().getTime();
            var queryableStartTime = new Date().getTime();
            var componentStartTime = new Date().getTime();

            delayFuture.then(function () {
                searchThrottle.cancel();

                searchThrottle = new Future(function (setValue, setError) {
                    var queryableFuture = self.filter(keywords);

                    if (!(queryableFuture instanceof Future)) {
                        queryableFuture = Future.fromResult(queryableFuture);
                    }

                    queryableFuture.then(function (queryable) {
                        queryable.take(limit).toArray().then(function (results) {
                            var newLimit = limit;
                            newLimit = newLimit > results.length ? results.length : newLimit;

                            setValue({
                                elements: createComponents(newLimit),
                                results: results
                            });
                        });
                    });

                }).then(function (results) {

                    var elements = results.elements;

                    currentResults = results;

                    if (results.results.length > 0) {
                        //results.results.unshift(null);

                        var documentfragment = document.createDocumentFragment();

                        results.results.forEach(function (item, index) {
                            var element = elements[index];
                            fillElement(element, item, index);
                            $(element).appendTo(documentfragment);
                        });

                        $results.append(documentfragment);

                        fitResults();
                    } else {
                        showNoResults();
                    }

                    $loading.hide();

                });
            });

        };

        self.filter = function (search) {
            return Future.fromResult([].asQueryable());
        };



        self.setValue = function (value) {
            var oldValue = selectedItem;
            if (value !== oldValue) {
                selectedItem = value;

                draw();

                $elem.trigger({
                    type: "change",
                    oldValue: oldValue,
                    newValue: value,
                    value: value
                });
            }
        };

        self.setLimit = function (value) {
            limit = value;
        };

        self.setDelay = function (value) {
            delayAmount = value;
        };

        self.titleForItem = function (obj) {
            return obj.toString();
        };

        self.getValue = function () {
            return selectedItem;
        };

        self.redraw = function () {
            draw();
        };

        $search.on("keyup", handleKeyup).on("change", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        $search.on("keydown", function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (isSpecialKey(keycode)) {

                var interval = setInterval(function () {
                    handleUserKeySelection(keycode);
                }, 100);

                var keyup = function () {
                    clearInterval(interval);
                };

                $search.one("keyup", keyup);
            }
        });

        $placeholder.on("mousedown touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            toggleSearch();
        });

        $search.on("blur", function (e) {
            selectIndex(index);
            e.stopPropagation();
            e.preventDefault();
        });

        $search.attr("tabindex", $elem.attr("tabindex"));

        $elem.removeAttr("tabindex");

        self.clear = function () {
            self.setValue(null);
        };

        $search.on("focus", function (e) {
            showSearch();
            e.stopPropagation();
            e.preventDefault();
        });


        componentName = getComponentName();
        componentHtml = getComponentInnerHtml();

        setSelectedName(placeholderAttribute);

    };

});