BASE.require([
		"jQuery",
        "BASE.collections.Hashmap",
        "components.material.animations.createFadeInAnimation",
        "components.material.animations.createFadeOutAnimation",
        "jQuery.fn.region"
], function () {
    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var createFadeInAnimation = components.material.animations.createFadeInAnimation;
    var createFadeOutAnimation = components.material.animations.createFadeOutAnimation;
    var $body = $(document.body);

    BASE.namespace("components.gem.forms");

    components.gem.forms.Table = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $headers = $(tags["header"]);
        var $veil = $(tags["veil"]);
        var $headerContainer = $(tags["header-container"]);
        var $list = $(tags["list"]);
        var list = $list.controller();
        var layout = list.getLayout();
        var selectedItems = new Hashmap();
        var queryable = null;
        var delegate = null;
        var columns = null;
        var listItemConfig = null;
        var primaryKeyProperty = "id";
        var currentWidth = 0;
        var headers = {};
        var columnWidths = {};
        var properties;

        var veilFadeInAnimation = createFadeInAnimation($veil[0], 200);
        var veilFadeOutAnimation = createFadeOutAnimation($veil[0], 200);

        var currentVeilAnimationFuture = Future.fromResult();
        var lastQueryableFuture = Future.fromResult();

        var createResizeHandle = function (headerName) {
            var startPosition = {
                x: 0,
                y: 0
            };

            var delta = {
                x: 0,
                y: 0
            };

            var handleStartRight = -12;

            var mouseMove = function (event) {
                delta.x = event.pageX - startPosition.x;
                delta.y = event.pageY - startPosition.y;

                $resizeHandle.css({
                    top: 0,
                    right: handleStartRight - delta.x
                });

                return false;
            };

            var mouseUp = function (event) {
                var $header = headers[headerName];
                var region = $header.region();
                var newWidth = region.width + delta.x;

                newWidth = newWidth > 50 ? newWidth : 50;

                columnWidths[headerName] = newWidth;
                updateColumns(properties);
                updateHeaders(properties);

                $body.off("mousemove", mouseMove);
                $body.off("mouseup", mouseUp);
                $body.off("mouseleave", mouseUp);

                $resizeBar.addClass("hide");
                $resizeHandle.css("right", "-12px")

                return false;
            };

            var mouseDown = function (event) {
                handleStartRight = parseInt($resizeHandle.css("right"), 10);

                startPosition.x = event.pageX;
                startPosition.y = event.pageY;
                delta.x = 0;
                delta.y = 0;

                $body.on("mousemove", mouseMove);
                $body.on("mouseup", mouseUp);
                $body.on("mouseleave", mouseUp);

                $resizeBar.removeClass("hide");

                return false;
            };

            var $resizeBar = $("<div></div>").css({
                width: "8px",
                position: "absolute",
                top: 0,
                left: "8px",
                height: "100%",
                backgroundColor: "#000",
                opacity: 0.3
            }).addClass("hide");

            var $resizeHandle = $("<div></div>").css({
                position: "absolute",
                top: 0,
                right: "-12px",
                width: "25px",
                height: "100%",
                zIndex: 1,
                cursor: "ew-resize"
            }).on("mousedown", mouseDown).append($resizeBar).on("click", function () {
                return false;
            });

            return $resizeHandle;
        };

        var createHeader = function (column) {
            var name = column.name;
            var label = column.label;
            var left = column.left;
            var width = column.width;

            var $header = $("<div></div>");
            var $label = $("<div></div>").text(label).css({
                paddingLeft: "10px"
            }).addClass("ellipsis").appendTo($header);

            var $icon = $("<i></i>").addClass("material-icons");
            $label.append($icon);

            var $resizeHandle = createResizeHandle(name);
            $header.addClass("gem-column-headers");
            $header.append($resizeHandle);
            $header.css({
                boxSizing: "border-box",
                height: "40px",
                fontSize: "16px",
                lineHeight: "40px",
                width: width + "px",
                textAlign: "left",
                position: "absolute",
                top: "0",
                left: left + "px",
            });

            $header.on("click", function () {
                var orderBy = $header.attr("order-by");
                $headers.children().removeAttr("order-by");

                if (orderBy === "asc") {
                    $header.attr("order-by", "desc");
                } else {
                    $header.attr("order-by", "asc");
                }

                delegate.orderBy(self.getOrderAscendingColumns(), self.getOrderDescendingColumns());
            });

            return $header;
        };

        var createHeaders = function (columns) {
            $headers.empty();
            return headers = columns.reduce(function (columns, column) {
                var $column = createHeader(column);
                columns[column.name] = $column;

                $headers.append($column);

                return columns;
            }, {});
        };

        var updateColumns = function (properties) {
            currentWidth = 0;
            columns = properties.map(function (propertyName) {
                var width = columnWidths[propertyName];

                var column = {
                    name: propertyName,
                    label: delegate.getPropertyLabel(propertyName),
                    width: width,
                    left: currentWidth
                };

                currentWidth += width;

                return column;
            });

            list.getLayout().setWidth(currentWidth);
            $headers.css("width", currentWidth + "px");
            return columns;
        };

        var cacheColumnWidths = function (properties) {
            columnWidths = {};
            return properties.forEach(function (propertyName) {
                var width = delegate.getPropertyWidth(propertyName) || 200;
                columnWidths[propertyName] = width;
            });
        };

        var showVeilAsync = function () {
            currentVeilAnimationFuture.cancel();
            return currentVeilAnimationFuture = veilFadeInAnimation.seek(0).playToEndAsync().chain(function () {
                $veil.removeClass("hide");
            });
        };

        var hideVeilAsync = function () {
            currentVeilAnimationFuture.cancel();
            return currentVeilAnimationFuture = veilFadeOutAnimation.seek(0).playToEndAsync().chain(function () {
                $veil.addClass("hide");
            });
        };

        var buildColumns = function (properties) {
            updateColumns(properties);
            createHeaders(columns);
        };

        var updateHeaders = function () {
            columns.forEach(function (column) {
                var $header = headers[column.name];
                $header.css({
                    left: column.left + "px",
                    width: column.width + "px"
                });
            });

            listItemConfig = {
                columns: columns,
                delegate: delegate
            };

            list.redrawItems(queryable);
        };

        self.setDelegate = function (value) {
            delegate = value;
            properties = delegate.getPropertyNames();
            cacheColumnWidths(properties);
            buildColumns(properties);
            primaryKeyProperty = delegate.getPrimaryKeyPropertyName();

            listItemConfig = {
                columns: columns,
                delegate: delegate
            };
        };

        self.setFutureArrayAsync = function (futureArray) {
            selectedItems.clear();

            lastQueryableFuture.cancel();

            if (typeof delegate.onSearch === "function") {
                delegate.onSearch();
            }

            return showVeilAsync().chain(function () {
                return futureArray.chain(function (results) {
                    return queryable = results.asQueryable();
                });
            }).chain(function (queryable) {
                return list.setQueryableAsync(queryable);
            }).chain(function () {
                return hideVeilAsync();
            });
        };

        self.setQueryableAsync = function (value) {
            queryable = value;
            selectedItems.clear();

            lastQueryableFuture.cancel();

            if (typeof delegate.onSearch === "function") {
                delegate.onSearch();
            }

            return lastQueryableFuture = showVeilAsync().chain(function () {
                return list.setQueryableAsync(queryable);
            }).chain(function () {
                return hideVeilAsync();
            });
        };

        self.redrawItems = function () {
            return list.redrawItems();
        };

        self.getSelectedItems = function () {
            return selectedItems;
        };

        self.getOrderAscendingColumns = function () {
            return Object.keys(headers).filter(function (key) {
                $column = headers[key];
                return $column.attr("order-by") === "asc";
            });
        };

        self.getOrderDescendingColumns = function () {
            return Object.keys(headers).filter(function (key) {
                $column = headers[key];
                return $column.attr("order-by") === "desc";
            });
        };

        layout.prepareElement = function (element, item, index) {
            var controller = $(element).controller();

            controller.setConfig(listItemConfig);
            controller.setEntity(item, index);

            if (selectedItems.hasKey(item[primaryKeyProperty]) || selectedItems.hasKey(item)) {
                controller.select();
            } else {
                controller.deselect();
            }
        };

        $elem.on("itemSelected", function (event) {
            var key = event.entity[primaryKeyProperty];

            if (!event.isMultiselect) {
                selectedItems.clear();
            }

            if (key == null) {
                selectedItems.add(event.entity, event.entity);
            } else {
                selectedItems.add(key, event.entity);
            }


            $elem.trigger({
                type: "selectionChange",
                selectedItems: selectedItems
            });

            list.redrawItems();

            return false;
        });

        $elem.on("itemDeselected", function (event) {
            var key = event.entity[primaryKeyProperty];

            if (!event.isMultiselect) {
                selectedItems.clear();
            }

            if (key == null) {
                selectedItems.remove(event.entity, event.entity);
            } else {
                selectedItems.remove(key, event.entity);
            }

            $elem.trigger({
                type: "selectionChange",
                selectedItems: selectedItems
            });

            list.redrawItems();

            return false;
        });

        $list.on("scroll", function () {
            $headerContainer.scrollLeft($list.scrollLeft());
        });

    };
});