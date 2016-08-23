BASE.require([], function () {

    BASE.namespace("components.material.inputs");

    components.material.inputs.SubmitFormBehavior = function (elem) {
        var self = this;
        var $elem = $(elem);

        var $submitButton = $(elem).find("[submit]");
        $elem.on("keydown", function (e) {
            if (e.which === 13) {
                $submitButton.click();
            }
        });


    };

});