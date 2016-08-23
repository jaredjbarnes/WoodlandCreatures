BASE.require([
    "jQuery",
    "BASE.async.Task",
    "BASE.web.HttpRequest",
    "BASE.web.components",
    "BASE.async.Future.prototype.toContinuation",
    "components.tester.TestResult"
], function () {

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var HttpRequest = BASE.web.HttpRequest;
    var webComponents = BASE.web.components;
    var TestResult = components.tester.TestResult;

    var passedText = "OK Passed";

    var Assert = function () {
        var self = this;
        var results = self.results = [];

        self.isEqualTo = self["==="] = function (value, desiredValue, errorMessage) {
            if (value === desiredValue) {
                results.push(new TestResult(true, passedText));
            } else {
                results.push(new TestResult(false, errorMessage));
            }
        };

        self.isNotEqualTo = self["!=="] = function (value, desiredValue, errorMessage) {
            if (value !== desiredValue) {
                results.push(new TestResult(true, passedText));
            } else {
                results.push(new TestResult(false, errorMessage));
            }
        };

        self.isGreaterThan = self[">"] = function (value, desiredValue, errorMessage) {
            if (value > desiredValue) {
                results.push(new TestResult(true, passedText));
            } else {
                results.push(new TestResult(false, errorMessage));
            }
        };

        self.isLessThan = self[">"] = function (value, desiredValue, errorMessage) {
            if (value < desiredValue) {
                results.push(new TestResult(true, passedText));
            } else {
                results.push(new TestResult(false, errorMessage));
            }
        };

        self.isGreaterThanOrEqualTo = self[">="] = function (value, desiredValue, errorMessage) {
            if (value >= desiredValue) {
                results.push(new TestResult(true, passedText));
            } else {
                results.push(new TestResult(false, errorMessage));
            }
        };

        self.isLessThanOrEqualTo = self["<="] = function (value, desiredValue, errorMessage) {
            if (value <= desiredValue) {
                results.push(new TestResult(true, passedText));
            } else {
                results.push(new TestResult(false, errorMessage));
            }
        };
    };

    BASE.namespace("components.tester");

    components.tester.TestRunner = function (elem, tags, scope) {
        var self = this;
        var stateManagerController = $(tags["state-manager"]).controller();
        var $loadComponentButton = $(tags["load-component"]);
        var $componentUrl = $(tags["component-url"]);
        var $componentContainer = $(tags["component-container"]);
        var $componentContainerName = $(tags["component-container-name"]);
        var $closeComponentContainer = $(tags["close-component-container"]);
        var $error = $(tags["error"]);
        var currentTestFuture = Future.fromResult();
        var errorController = $error.controller();

        var showError = function (message) {
            errorController.setMessage(message);
            stateManagerController.push("error");
        };

        var setUp = function () {

            $loadComponentButton.on("click", function (e) {
                var url = $componentUrl.val();
                localStorage.testComponentUrl = url;
                $componentContainerName.text(url);

                currentTestFuture = runTest(url).then(function (results) {

                    if (!Array.isArray(results)) {
                        showError("Expected an array of TestResults");
                        return;
                    }

                    var $resultsComponent = $(stateManagerController.getStateByName("results"));
                    var resultsController = $resultsComponent.controller();

                    resultsController.setResults(results);
                    stateManagerController.push("results");


                }).ifTimedOut(function () {
                    showError("The component timed out. The component may not have loaded, or you may have a javascript error.");

                }).ifError(function (e) {
                    showError(e.message);
                });
            });

            $closeComponentContainer.on("click", function () {
                currentTestFuture.cancel();
                stateManagerController.pop();
            });

            $componentUrl.val(localStorage.testComponentUrl || "");

        };

        var convertUrlToTestNamespace = function (url) {
            url = url.replace(/\..*?$/, "");
            var splitArray = url.split("/").reduce(function (values, item) {
                if (item) {
                    values.push(item);
                }
                return values;
            }, []);

            splitArray.unshift("tests");
            return splitArray.join(".");
        };

        var loadComponent = function (url) {
            return webComponents.createComponent(url);
        };

        var loadComponentTest = function (url) {
            var testNamespace = convertUrlToTestNamespace(url);
            return new Future(function (setValue, setError) {
                BASE.require([testNamespace], function () {
                    setValue(BASE.getObject(testNamespace));
                }).ifError(setError);
            });
        };

        var runTest = function (url, content) {
            var runTestFuture = new Future(function (setValue, setError) {
                if (url === "") {
                    setError(new Error("Cannot have the url set to nothing."));
                } else {

                    var task = new Task(loadComponent(url), loadComponentTest(url));
                    task.start().whenAll(function (futures) {
                        if (futures[0].error !== null) {
                            setError(futures[0].error);
                            return;
                        }

                        if (futures[1].error !== null) {
                            setError(futures[1].error);
                            return;
                        }

                        var Test = futures[1].value;
                        var component = futures[0].value;
                        var $component = $(component);
                        var test = new Test(component);

                        $componentContainer.empty();
                        $componentContainer.append($component);
                        $component.find("[component]").triggerHandler("enteredView");
                        $component.triggerHandler("enteredView");

                        stateManagerController.push("component-container").then(function () {
                            var initializeFuture;

                            if (typeof test.initialize === "function") {
                                initializeFuture = test.initialize();
                            }

                            if (!(initializeFuture instanceof Future)) {
                                initializeFuture = Future.fromResult();
                            }

                            initializeFuture.toContinuation().then(function () {
                                if (typeof test.run !== "function") {
                                    setError(new Error("Test didn't have a run method on the test."));
                                    return;
                                }

                                var assert = new Assert();
                                var testResult = test.run(assert);
                                if (!(testResult instanceof Future)) {
                                    testResult = Future.fromResult();
                                }

                                return new Future(function (setValue, setError) {
                                    testResult.then(function () {
                                        setValue(assert.results);
                                    });

                                    testResult.ifError(setError);
                                });
                            }).then(setValue);
                        });
                    });
                }
            }).setTimeout(10000);

            return runTestFuture;
        };

        stateManagerController.push("component-name-veil");

        setUp();

        window.stateManager = stateManagerController;
    };

});