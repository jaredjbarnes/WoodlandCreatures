BASE.require([
		"jQuery"
], function () {
    var Future = BASE.async.Future;

    BASE.namespace("components.gem.forms");

    components.gem.forms.CheckboxTableListItem = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var currentMappings = null;
        var currentConfig = null;
        var columns = {};
        var item = null;
        var $checkbox = null;

        var selectedState = function () {
            state = deselectedState;
            $checkbox.prop("checked", false);
            $elem.trigger({
                type: "itemDeselected",
                entity: item
            });
        };

        var deselectedState = function () {
            state = selectedState;
            $checkbox.prop("checked", true);
            $elem.trigger({
                type: "itemSelected",
                entity: item
            });
        };

        var state = deselectedState;

        var createColumn = function (column) {
            var name = column.name;
            var width = column.width;
            var left = column.left;

            var $column = $("<div></div>");
            $column.css({
                boxSizing: "border-box",
                height: "40px",
                fontSize: "14px",
                lineHeight: "40px",
                width: width + "px",
                paddingLeft: "10px",
                position: "absolute",
                top: "0",
                left: left + "px"
            });

            $column.attr("name", name);
            $column.addClass("ellipsis");

            return {
                $element: $column,
                text: function (value) {
                    var text = currentConfig.delegate.getPropertyDisplay(item, name);
                    $column.text(text);
                }
            };
        };

        var createCheckbox = function (column) {
            var name = column.name;
            var width = column.width;
            var left = column.left;

            var $column = $("<div></div>");
            $checkbox = $("<input/>");
            $checkbox.attr("type", "checkbox");
            $checkbox.addClass("gem-input");
            $checkbox.appendTo($column);

            $column.css({
                boxSizing: "border-box",
                height: "40px",
                fontSize: "14px",
                lineHeight: "40px",
                width: width + "px",
                paddingLeft: "10px",
                position: "absolute",
                top: "0",
                left: left + "px"
            });

            $column.attr("name", name);
            $column.addClass("ellipsis");

            return $column
        };

        self.setEntity = function (entity, index) {
            item = entity;

            Object.keys(columns).forEach(function (property, index) {
                var value = entity[property];

                if (value == null) {
                    value = "";
                }

                columns[property].text(value);
            });
        };

        self.setConfig = function (config) {
            if (currentConfig !== config) {
                currentConfig = config;
                $elem.empty();
                columns = {};
                config.columns.forEach(function (column, index) {
                    if (index === 0) {
                        $elem.append(createCheckbox);
                        return;
                    }

                    var columnData = createColumn(column);

                    columns[column.name] = columnData;
                    $elem.append(columnData.$element);

                    return columns;
                });
            }
        };

        self.select = function () {
            state = selectedState;
            $checkbox.prop("checked", true);
            $elem.addClass("selected");
        };

        self.deselect = function () {
            state = deselectedState;
            $checkbox.prop("checked", false);
            $elem.removeClass("selected");
        };

        $elem.on("click", function () {
            state();
        });

    };
});