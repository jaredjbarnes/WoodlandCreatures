BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.material.inputs");

    components.material.inputs.SingleSelectItem = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $name = $(tags["name"]);
        var item = null;

        self.setValue = function (value, name) {
            $name.text(name)
            item = value;
        };

        $elem.on("click", function () {
            var event = {
                type: "selectedItem",
                item: item
            };

            $elem.trigger(event);
            return false;
        });

    };
});