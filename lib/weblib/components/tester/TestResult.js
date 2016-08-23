BASE.require([

], function () {

    BASE.namespace("components.tester");

    components.tester.TestResult = function (passed, message) {
        var self = this;

        self.message = typeof message !== "string" ? "" : message;
        self.passed = typeof passed !== "boolean" ? false : passed;
    };

});