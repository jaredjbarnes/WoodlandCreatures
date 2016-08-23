BASE.require([
		"jQuery"
], function () {
    var Future = BASE.async.Future;
    var Fulfillment = BASE.async.Fulfillment;

    BASE.namespace("components.gem.forms");

    components.gem.forms.IndependentEntityForm = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $form = $(tags["form"]);
        var form = $form.controller();
        var $cancel = $(tags["cancel"]);
        var $save = $(tags["save"]);
        var $ok = $(tags["ok"]);
        var actionStateManager = $(tags["actions-state-manager"]).controller();
        var displayService = null;
        var entityDisplay = null;
        var entity = null;
        var fulfillment = null;
        var window = null;
        var properties = null;

        var saveAsync = function () {
            return form.validateAsync().chain(function () {
                return form.saveAsync();
            }).chain(function () {
                fulfillment.setValue(config.entity);
            });
        };

        self.setConfigAsync = function (value) {
            config = value;
            fulfillment = new Fulfillment();
            displayService = config.displayService;
            entity = config.entity;

            var Type = entity.constructor;
            var edm = displayService.service.getEdm();
            var keys = edm.getPrimaryKeyProperties(Type).concat(edm.getAllKeyProperties(Type));

            form.setConfigAsync({
                displayService: displayService,
                parentEntity: null,
                entity: entity,
                Type: Type,
                hiddenInputs: keys
            }).chain(function () {
                if (entity[edm.getPrimaryKeyProperties(Type)[0]] == null) {
                    actionStateManager.replaceAsync("save-changes").try();
                } else {
                    actionStateManager.replaceAsync("close").try();
                }
                form.resize();
            }).try();

            return fulfillment;
        };

        self.init = function (windowManager) {
            window = windowManager;
        };

        self.activated = function () {
            $form.scrollTop(0);
            form.resize();
        };

        self.deactivated = function () {
            fulfillment.cancel();
        };

        self.windowResize = function () {
            form.resize();
        };

        $cancel.on("click", function () {
            window.closeAsync().try();
            fulfillment.cancel();
        });

        $save.on("click", function () {
            saveAsync().try();
        });

        $ok.on("click", function () {
            fulfillment.cancel();
        });

        $elem.on("keydown", function (event) {
            if (event.which === 13) {
                saveAsync().try();
            }
        });

        $elem.on("save-needed", function () {
            actionStateManager.replaceAsync("save-changes").try();
            return false;
        });

    };
});