BASE.require([
		"jQuery"
], function () {
    var Future = BASE.async.Future;
    var Fulfillment = BASE.async.Fulfillment;

    BASE.namespace("components.gem.forms");

    components.gem.forms.OneToOneForm = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $form = $(tags["form"]);
        var form = $form.controller();
        var $cancel = $(tags["cancel"]);
        var $save = $(tags["save"]);
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
        var service = null;

        self.setConfigAsync = function (value) {
            var future;

            config = value;
            relationship = config.relationship;
            displayService = config.displayService;
            service = displayService.service;
            propertyName = relationship.hasOne;
            parentEntity = config.entity;
            entity = parentEntity[propertyName];

            if (entity == null && parentEntity[relationship.hasKey] !== null) {
                future = service.asQueryable(relationship.ofType).where(function (expBuilder) {
                    return expBuilder.property(relationship.withForeignKey).isEqualTo(parentEntity[relationship.hasKey]);
                }).firstOrDefault().chain(function (target) {
                    if (target == null) {
                        entity = new relationship.ofType();
                    } else {
                        entity = parentEntity[relationship.hasOne] = target;
                    }

                    return entity
                });
            } else if (entity == null) {
                entity = new relationship.ofType();
                future = Future.fromResult(entity);
            }

            return future.chain(function () {
                return form.setConfigAsync({
                    displayService: displayService,
                    entity: entity,
                    Type: relationship.ofType,
                    hiddenInputs: [relationship.hasKey, relationship.withOne]
                }).try();
            });
        };

        self.saveAsync = function () {
            return form.saveAsync().chain(function () {
                parentEntity[relationship.hasOne] = entity;
            });
        };

        self.validateAsync = function () {
            return form.validateAsync();
        };

    };
});