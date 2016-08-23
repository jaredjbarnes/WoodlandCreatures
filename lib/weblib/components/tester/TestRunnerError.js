BASE.require([
    "jQuery"
], function () {

    BASE.namespace("components.tester");

    components.tester.TestRunnerError = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $close = $(tags["close"]);
        var $message = $(tags["message"]);
        var navigation = $(tags["navigation"]).controller();
        var stateManager = null;

        var setUp = function () {
            $close.on("click", function () {
                stateManager.pop();
            });
        };

        self.setMessage = function (message) {
            $message.text(message);
        };

        self.setStateManager = function (value) {
            stateManager = value;
        };

        self.activate = function () {
            navigation.redraw();
        };

        setUp();
    };

});