BASE.require([
		"jQuery"
], function () {


    BASE.namespace("components.gem.forms");

    components.gem.forms.DatabaseManager = function (elem, tags, scope) {
        var self = this;
        var $elem = $(elem);
        var $container = $(tags["table-container"]);
        var $name = $(tags["name"]);
        var $tableNameList = $(tags["table-names-list"]);
        var tableNameList = $tableNameList.controller();
        var selectedCollectionName = null;
        var layout = tableNameList.getLayout();
        var mapping = null;
        var modelNameToModelType = null;
        var stateManager = null;
        var states = null;

        layout.prepareElement = function (element, item, index) {
            var controller = $(element).controller();
            controller.setDisplay(item);

            if (item.labelList() === selectedCollectionName) {
                controller.select();
            } else {
                controller.deselect();
            }
        };

        var createIndependentCollection = function (name) {
            var $div = $("<div></div>");
            $div.attr("component", "gem-independent-collection");
            $div.attr("name", name);
            $div.addClass("absolute-fill-parent gem-form");
            return $div;
        };

        var createIndependentCollectionsAsync = function (displayService, models) {
            $container.empty();
            mapping = {};
            modelNameToModelType = {};

            var fragment = document.createDocumentFragment();

            var collectionDisplays = models.map(function (model) {
                var collectionDisplay = displayService.getDisplayByType(model.type);

                var label = collectionDisplay.labelList();
                createIndependentCollection(label).appendTo(fragment);
                mapping[label] = collectionDisplay;
                modelNameToModelType[label] = model;

                return collectionDisplay;
            });

            return BASE.web.components.createComponentAsync("absolute-state-manager", fragment).chain(function (element) {
                var $stateManager = $(element);
                $stateManager.css("overflow", "visible");
                $stateManager.addClass("absolute-fill-parent");
                stateManager = $stateManager.controller();
                states = stateManager.getStates();

                Object.keys(states).forEach(function (stateName) {
                    var collectionController = $(states[stateName]).controller();
                    var collectionManager = mapping[stateName];
                    var model = modelNameToModelType[stateName];

                    collectionController.setDisplay(model.type, displayService)
                });

                $container.append(element);
                tableNameList.setQueryableAsync(collectionDisplays.asQueryable()).try();
                self.selectCollectionByNameAsync(Object.keys(states)[0]).try();
            });
        };

        var getApplicableModels = function (displayService) {

            var service = displayService.service;
            var edm = service.getEdm();
            var models = edm.getModels().getValues();

            var mappingTypes = edm.getMappingTypes();


            return models.filter(function (model) {
                var entity = new model.type();

                var isOptionalOneToOne = edm.getOneToOneAsTargetRelationships(entity).every(function (relationship) {
                    return relationship.optional;
                });

                var isOptionalOneToMany = edm.getOneToManyAsTargetRelationships(entity).every(function (relationship) {
                    return relationship.optional;
                });

                return isOptionalOneToOne && isOptionalOneToMany && !mappingTypes.hasKey(model.type);

            });

        };

        self.setDisplayServiceAsync = function (value, config) {
            config = config || {};
            var types = config.rootTypes;
            var edm = value.service.getEdm();
            var applicableModels = [];

            if (types == null) {
                applicableModels = getApplicableModels(value);
            } else {
                applicableModels = types.map(function (Type) {
                    return edm.getModelByType(Type);
                });
            }

            return createIndependentCollectionsAsync(value, applicableModels).chain(function () {
                displayService = value;
            });
        };

        self.selectCollectionByNameAsync = function (name) {
            $name.text(name);
            selectedCollectionName = name;
            var state = stateManager.getState(name);
            var controller = $(state).controller();

            return stateManager.pushAsync(name).chain(function () {
                controller.refreshAsync().try();
                return tableNameList.redrawItems();
            });
        };

        $elem.on("collectionSelect", function (event) {
            self.selectCollectionByNameAsync(event.collectionName).try();
        });
    };
});