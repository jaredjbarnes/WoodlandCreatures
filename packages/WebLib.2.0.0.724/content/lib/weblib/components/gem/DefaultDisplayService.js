BASE.require([
    "components.gem.DisplayService",
    "components.gem.TypeDisplay"
], function () {

    var DisplayService = components.gem.DisplayService;
    var TypeDisplay = components.gem.TypeDisplay;

    components.gem.DefaultDisplayService = function (service) {
        var self = this;

        DisplayService.call(self, service);

        var models = service.getEdm().getModels().getValues();

        models.forEach(function (model) {
            var typeDisplay = new TypeDisplay(model.type, service);
            self.addDisplay(typeDisplay);
        });
    };

    BASE.extend(components.gem.DefaultDisplayService, DisplayService);

});