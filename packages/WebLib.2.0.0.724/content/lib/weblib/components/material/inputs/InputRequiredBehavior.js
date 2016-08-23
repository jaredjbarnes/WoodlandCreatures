BASE.require([
    "String.prototype.trim"
], function () {
    var Future = BASE.async.Future;

    BASE.namespace("components.material.inputs");

    components.material.inputs.InputRequiredBehavior = function (elem, tags, scope) {
        var self = this;

        self.registerValidator(
            function (value) {
                if (typeof value === "string") {
                    value = value.trim();
                }

                if (value === "" || typeof value === "undefined" || value === null) {
                    return Future.fromError("Required");
                }
                else {
                    return Future.fromResult();
                }
            }
        );
    };
});