BASE.require([
		"jQuery",
        "BASE.collections.Hashmap",
        "components.material.animations.createFadeInAnimation",
        "components.material.animations.createFadeOutAnimation"
], function () {
    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var createFadeInAnimation = components.material.animations.createFadeInAnimation;
    var createFadeOutAnimation = components.material.animations.createFadeOutAnimation;

    BASE.namespace("components.gem.forms");

    components.gem.forms.CheckboxTable = function (elem, tags, scope) {
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
        var headers;

        var veilFadeInAnimation = createFadeInAnimation($veil[0], 200);
        var veilFadeOutAnimation = createFadeOutAnimation($veil[0], 200);

        var currentVeilAnimationFuture = Future.fromResult();
        var lastQueryableFuture = Future.fromResult();

        var createHeader = function (column) {
            var name = column.name;
            var label = column.label;
            var left = column.left;
            var width = column.width;

            var $header = $("<div></div>");
            var $icon = $("<i></i>").addClass("material-icons");

            $header.text(label).addClass("gem-column-headers");
            $header.append($icon);
            $header.css({
                boxSizing: "border-box",
                height: "40px",
                fontSize: "16px",
                lineHeight: "40px",
                width: width + "px",
                paddingLeft: "10px",
                textAlign: "left",
                position: "absolute",
                top: "0",
                left: left + "px"
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
            $headers.css("width", currentWidth);
            return columns.reduce(function (columns, column) {
                var $column = createHeader(column);
                columns[column.name] = $column;

                $headers.append($column);

                return columns;
            }, {});

        };

        var createColumns = function (properties) {
            currentWidth = 0;
            var checkboxColumn = {
                name: "__checkbox__",
                display: function () {
                    return "";
                },
                label: function () {
                    return "";
                },
                width: 40,
                left: currentWidth
            };

            currentWidth += 40;

            columns = properties.map(function (propertyName) {
                var width = delegate.getPropertyWidth(propertyName) || 200;

                var column = {
                    name: propertyName,
                    label: delegate.getPropertyLabel(propertyName),
                    width: width,
                    left: currentWidth
                };

                currentWidth += width;

                return column;
            });

            columns.unshift(checkboxColumn);
            return columns;
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


        self.setDelegate = function (value) {
            var properties;
            delegate = value;
            properties = delegate.getPropertyNames();
            columns = createColumns(properties);
            headers = createHeaders(columns);
            primaryKeyProperty = delegate.getPrimaryKeyPropertyName();

            listItemConfig = {
                columns: columns,
                delegate: delegate
            };

            list.getLayout().setWidth(currentWidth);
        };

        self.setQueryableAsync = function (value) {
            queryable = value;
            lastQueryableFuture.cancel();

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

            if (selectedItems.hasKey(item[primaryKeyProperty])) {
                controller.select();
            } else {
                controller.deselect();
            }
        };

        $elem.on("itemSelected", function (event) {
            selectedItems.add(event.entity[primaryKeyProperty], event.entity);

            $elem.trigger({
                type: "selectionChange",
                selectedItems: selectedItems
            });

            return false;
        });

        $elem.on("itemDeselected", function (event) {
            selectedItems.remove(event.entity[primaryKeyProperty]);

            $elem.trigger({
                type: "selectionChange",
                selectedItems: selectedItems
            });

            return false;
        });

        $list.on("scroll", function () {
            $headerContainer.scrollLeft($list.scrollLeft());
        });

    };
});