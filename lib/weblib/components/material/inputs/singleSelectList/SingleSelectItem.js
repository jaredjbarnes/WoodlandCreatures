BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.material.inputs.singleSelectList");

    components.material.inputs.singleSelectList.SingleSelectItem = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $name = $(tags["name"]);
        var item = null;

        self.setValue = function (value, name) {
            $name.text(name)
            item = value;
        };

        $elem.on("click", function (event) {
            event.stopPropagation();

            $elem.trigger({
                type: "selectedItem",
                item: item
            });
        });

    };
});