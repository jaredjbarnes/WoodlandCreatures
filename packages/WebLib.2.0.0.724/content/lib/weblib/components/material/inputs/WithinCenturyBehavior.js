BASE.require([], function () {
    var Future = BASE.async.Future;

    BASE.namespace("components.material.inputs");

    components.material.inputs.WithinCenturyBehavior = function (elem, tags, scope) {
        var self = this;

        self.registerValidator(
            function (value) {
                if (!(value instanceof Date)) {
                    return Future.fromResult();
                }

                var maxDate = new Date();
                maxDate.setFullYear(maxDate.getFullYear() + 50);

                var minDate = new Date();
                minDate.setFullYear(minDate.getFullYear() - 50);

                if (value < maxDate && value > minDate) {
                    return Future.fromResult();
                }

                return Future.fromError("Date must be within fifty years of today");
            }
        );
    };
});