BASE.require([], function () {
    BASE.namespace("components.tester");

    var components = BASE.web.components;

    components.tester.Parameter = function (elem, tags) {
        var self = this;

        var $name = $(tags["name"]);
        var $value = $(tags["value"]);
    };
});