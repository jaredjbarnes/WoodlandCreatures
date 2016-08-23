BASE.require([
    "jQuery"
    // more requirements here
], function() {
    BASE.namespace("ui");

    ui.UITemplate = function (elem, tags) {
        var self = this;
        // elem represents the markup that wants to use this script to control it
        var $elem = $(elem);
        
        // you may listen to an "enteredVew" event on the element
        $elem.on("enteredView", function() {
            // I'm here!
        });
    };

});