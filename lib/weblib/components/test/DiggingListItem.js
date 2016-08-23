BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.test");

    components.test.DiggingListItem = function (elem, tags, scope) {
        var self = this;
        var $name = $(tags["name"]);
        var $content = $(tags["content"]);
        var $loading = $(tags["loading"]);

        self.setLoading = function () {
            $content.addClass("hide");
        };

        self.setItem = function (fruit) {
            $name.text(fruit.name);
            $content.removeClass("hide");
        };
    };
});