BASE.require([
		"jQuery"
], function () {
    var Future = BASE.async.Future;
    var Fulfillment = BASE.async.Fulfillment;

    BASE.namespace("components.gem.forms");

    components.gem.forms.OneToManyCollectionEntityForm = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $form = $(tags["form"]);
        var form = $form.controller();
        var $cancel = $(tags["cancel"]);
        var $save = $(tags["save"]);
        var $ok = $(tags["ok"]);
        var actionStateManager = $(tags["actions-state-manager"]).controller();
        var fulfillment = null;
        var config = null;
        var relationship = null;
        var displayService = null;
        var entityDisplay = null;
        var entity = null;
        var parentEntity = null;
        var propertyName = null;
        var properties = null;
        var primaryKeyPropertyName = null;
        var window = null;

        var saveAsync = function () {
            return form.validateAsync().chain(function () {
                return form.saveAsync();
            }).chain(function () {
                fulfillment.setValue(config.entity);
            });
        };

        self.setConfigAsync = function (value) {
            fulfillment = new Fulfillment();

            config = value;
            relationship = config.relationship;
            displayService = config.displayService;
            propertyName = relationship.withOne;
            parentEntity = config.parentEntity;
            entity = config.entity;
            entityDisplay = displayService.getDisplayByType(relationship.ofType);

            var edm = displayService.service.getEdm();
            var keys = edm.getPrimaryKeyProperties(relationship.ofType).concat(edm.getAllKeyProperties(relationship.ofType));

            form.setConfigAsync({
                displayService: displayService,
                entity: entity,
                parentEntity: parentEntity,
                Type: relationship.ofType,
                hiddenInputs: keys.concat(relationship.withOne),
                hiddenTools: [relationship.withOne]
            }).chain(function () {
                if (entity[edm.getPrimaryKeyProperties(relationship.ofType)[0]] == null) {
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

        self.deactivated = function () {
            fulfillment.cancel();
        };

        self.activated = function () {
            $form.scrollTop(0);
            form.resize();
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
            saveAsync().try();
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