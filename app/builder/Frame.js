BASE.require([
    "jQuery"
], function () {
    BASE.namespace("app.builder");

    app.builder.Frame = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $frame = $(tags["frame"]);
        var color = $elem.attr("color");

        $frame.css("background-color", color || "#0094ff");
    };
});