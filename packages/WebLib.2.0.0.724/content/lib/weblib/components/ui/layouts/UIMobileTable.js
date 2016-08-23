BASE.require([
    "jQuery",
], function () {
    BASE.namespace("components.ui.layouts");
 
    var isIE8 = function () {
        return document.all && !document.addEventListener;
    };

    components.ui.layouts.UIMobileTable = function (elem, tags) {
        var self = this;
        var $elem = $(elem);

        self.setup = function () {
            if (!isIE8()) {
                var $th = $elem.find('th');
                for (i = 0; i < $th.length; i++) {
                    var $tdAtIndex = $elem.find('tbody > tr > td:nth-of-type(' + (i + 1) + ')');
                    var $beforeSpan = $('<span class="before hide-desktop hide-tablet">' + $th.eq(i).text() + '</span>');
                    $tdAtIndex.prepend($beforeSpan);
                }
            }
        }

        self.setup();
    }
});