BASE.require([
		"jQuery"
], function () {
    BASE.namespace("components.gem.forms");

    components.gem.forms.TableNameListItem = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var display = null;

        self.setDisplay = function (value) {
            display = value;
            $elem.text(display.labelList());
        };

        self.select = function () {
            $elem.addClass("selected");
        };

        self.deselect = function () {
            $elem.removeClass("selected");
        };

        self.setLoading = function () {
            $elem.text("Loading...");
        };

        $elem.on("click", function () {
            $elem.trigger({
                type: "collectionSelect",
                collectionName: display.labelList()
            });

            return false;
        });
    };
});