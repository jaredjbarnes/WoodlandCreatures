BASE.require([
    "jQuery"
], function () {

    BASE.namespace("components.tester");

    components.tester.TestRunnerResults = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var stateManager = null;
        var $done = $(tags["done"]);
        var $passedTest = $(tags["passed-tests"]);
        var $failedTest = $(tags["failed-tests"]);
        var navigationController = $(tags["navigation"]).controller();

        var setUp = function () {
            $done.on("click", function () {
                stateManager.pop();
            });
        };

        self.setStateManager = function (value) {
            stateManager = value;
        };

        self.setResults = function (results) {
            if (!Array.isArray(results)) {
                throw new Error("Expected an array of results.");
            }

            $passedTest.empty();
            $failedTest.empty();

            htmlResults = results.reduce(function (results, test) {
                if (test.passed) {
                    results.$passed.append($("<div class=\"passed-test\">" + test.message + "</div>"));
                } else {
                    results.$failed.append($("<div class=\"failed-test\">" + test.message + "</div>"));
                }
                return results;
            }, {
                $passed: $("<div></div>"),
                $failed: $("<div></div>")
            });

            if (htmlResults.$passed.children().length > 0) {
                $passedTest.removeClass("hide");
                $passedTest.append(htmlResults.$passed);
            } else {
                $passedTest.addClass("hide");
            }

            if (htmlResults.$failed.children().length > 0) {
                $failedTest.removeClass("hide");
                $failedTest.append(htmlResults.$failed);
            } else {
                $failedTest.addClass("hide");
            }
        };

        self.activate = function () {
            navigationController.redraw();
        };

        setUp();
    };

});