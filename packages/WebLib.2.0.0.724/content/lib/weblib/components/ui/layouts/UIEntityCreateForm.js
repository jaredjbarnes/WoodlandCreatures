BASE.require([
    "jQuery",
    "BASE.async.Fulfillment"
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UIEntityCreateForm = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $formContainer = $(tags['formContainer']);
        var $createButton = $(tags['createButton']);
        var $cancelButton = $(tags['cancelButton']);
        var entity = null;

        self.setEntity = function (value) {
            entity = value;
            var entityFormController = $(tags.formContainer.children[0]).controller();
            entityFormController.setEntity(value);
        };

        var getEntity = function () {
            return entity;
        };

        $createButton.on("click", function (e) {
            $elem.trigger("create");
        });

        $cancelButton.on("click", function (e) {
            $elem.trigger("cancel");
        });


        
    };
});