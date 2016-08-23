BASE.require([
    "jQuery",
], function () {
    var Fulfillment = BASE.async.Fulfillment;

    BASE.namespace("components.gem.scheduler");

    components.gem.scheduler.EventTypeSelector = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var currentFulfillment;
        var window;

        var createOption = function (typeConfig) {
            var typeDisplay = typeConfig.displayService.getDisplayByType(typeConfig.Type);
            var name = typeDisplay.labelInstance();

            var $div = $("<div>" + name + "</div>");

            $div.css({
                color: typeConfig.color,
                cursor: "pointer"
            }).attr("unselectable", "unselectable").addClass("ellipsis");

            $div.on("click", function (event) {
                currentFulfillment.setValue(typeConfig);
                window.closeAsync().try();
            });

            return $div;

        };

        var createList = function (typeConfigByType) {
            $elem.empty();
            var typeConfigs = typeConfigByType.getValues();

            if (typeConfigs.length < 6) {
                window.setSize({
                    width: 200,
                    height: typeConfigs.length * 40
                });
            } else {
                window.setSize({
                    width: 200,
                    height: 6 * 40
                });
            }

            typeConfigs.forEach(function (typeConfig) {
                var $option = createOption(typeConfig);
                $option.appendTo($elem);
            });
        };


        self.setTypeConfigAsync = function (typeConfigByType) {
            currentFulfillment = new Fulfillment();
            createList(typeConfigByType);

            return currentFulfillment;
        };

        self.init = function (newWindow) {
            window = newWindow;
            window.setName("Add Event");
            window.disableResize();
            window.setMinSize({
                width: 200,
                height: 300
            });
        };

    };

});