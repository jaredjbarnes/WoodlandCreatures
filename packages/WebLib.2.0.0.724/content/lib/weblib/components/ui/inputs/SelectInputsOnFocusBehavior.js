BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.ui.inputs");

    components.ui.inputs.SelectInputsOnFocusBehavior = function (elem) {
        var $elem = $(elem);

        $elem.find("input[type='text']").each(function () {
            var $this = $(this);

            if ($this.data("hasSelectInputsOnFocusBehavior") !== true) {
                $this.data("hasSelectInputsOnFocusBehavior", true);
                $this.on("focus", function () {
                    this.setSelectionRange(0, 0);
                });
            }

        });
    };
});