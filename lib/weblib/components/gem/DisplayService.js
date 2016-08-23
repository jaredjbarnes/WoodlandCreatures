BASE.require([
    "BASE.collections.Hashmap"
], function () {

    var Hashmap = BASE.collections.Hashmap;

    BASE.namespace("components.gem");

    components.gem.DisplayService = function (service) {
        var self = this;
        var displays = new Hashmap();
        var cachedRelationships = new Hashmap();

        self.service = service;
        self.edm = service.getEdm();

        self.addDisplay = function (display) {
            displays.add(display.type, display);
        };

        self.removeDisplay = function (display) {
            displays.remove(display.type);
        };

        self.getDisplayByType = function (Type) {
            return displays.get(Type);
        };

        self.getDisplays = function () {
            return displays.clone();
        };

        self.getToolByName = function (Type, name) {
            var display = displays.get(Type);
            if (display == null) {
                return null;
            }

            return display.tools.filter(function (tool) { return tool.name === name; })[0] || null;
        };

        self.getListPropertyByName = function (Type, name) {
            var display = displays.get(Type);
            if (display == null) {
                return null;
            }

            return display.listProperty.filter(function (listProperty) { return listProperty.name === name; })[0] || null;
        };

        self.getMainInputByName = function (Type, name) {
            var display = displays.get(Type);
            if (display == null) {
                return null;
            }

            return display.mainInputs.filter(function (mainInput) { return mainInput.name === name; })[0] || null;
        };

        self.getToolByLabel = function (Type, name) {
            var display = displays.get(Type);
            if (display == null) {
                return null;
            }

            return display.tools.filter(function (tool) { return tool.label() === name; })[0] || null;
        };

        self.getListPropertyByLabel = function (Type, name) {
            var display = displays.get(Type);
            if (display == null) {
                return null;
            }

            return display.listProperty.filter(function (listProperty) { return listProperty.label() === name; })[0] || null;
        };

        self.getMainInputByLabel = function (Type, name) {
            var display = displays.get(Type);
            if (display == null) {
                return null;
            }

            return display.mainInputs.filter(function (mainInput) { return mainInput.label() === name; })[0] || null;
        };

        self.getRelationshipsByType = function (Type) {
            var relationships = cachedRelationships.get(Type);
            if (relationships) {
                return relationships;
            }

            relationships = {};
            var instance = new Type();
            var edm = self.edm;

            edm.getOneToOneRelationships(instance).forEach(function (relationship) {
                relationships[relationship.hasOne] = relationship;
            });

            edm.getOneToManyRelationships(instance).forEach(function (relationship) {
                relationships[relationship.hasMany] = relationship;
            });

            edm.getManyToManyRelationships(instance).forEach(function (relationship) {
                relationships[relationship.hasMany] = relationship;
            });

            edm.getOneToOneAsTargetRelationships(instance).forEach(function (relationship) {
                relationships[relationship.withOne] = relationship;
            });

            edm.getOneToManyAsTargetRelationships(instance).forEach(function (relationship) {
                relationships[relationship.withOne] = relationship;
            });

            edm.getManyToManyAsTargetRelationships(instance).forEach(function (relationship) {
                relationships[relationship.withMany] = relationship;
            });

            cachedRelationships.add(Type, relationships);

            return relationships;
        };
    };

});