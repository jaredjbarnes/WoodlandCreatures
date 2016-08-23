BASE.require([
    "jQuery",
    "BASE.collections.Hashmap",
    "Array.prototype.orderBy"
], function () {

    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var formByTypes = new Hashmap();

    BASE.namespace("components.gem.forms");

    components.gem.forms.DynamicForm = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var entity = null;
        var Type = null;
        var displayService = null;
        var currentConfig = null;
        var typeDisplay = null;
        var currentForm = null;
        var hiddenTools = [];
        var hiddenInputs = [];
        var inputControllerHash = {};

        var generateMainTool = function (mainInputs) {
            var mainTab = document.createElement("div");
            var $mainTab = $(mainTab);

            $mainTab.attr({
                name: "General",
                component: "gem-input-form"
            });

            var inputs = mainInputs.orderBy(function (input) {
                return typeof input.sortOrder === "number" ? input.sortOrder : Infinity;
            });

            if (inputs.length > 0) {
                inputs.map(function (inputDisplay) {
                    return generateInput(inputDisplay);;
                }).forEach(function (input) {
                    $mainTab.append(input);
                });
            }

            return $mainTab;
        };

        var generateInput = function (inputDisplay) {
            var input = document.createElement("div");
            var $input = $(input);

            $input.attr({
                component: inputDisplay.component.name,
                span: inputDisplay.span,
                "input-name": inputDisplay.name
            }).css({
                padding: "15px"
            });

            return $input;
        };

        var generateTool = function (toolDisplay) {
            var tab = document.createElement("div");
            var $tab = $(tab);
            $tab.attr("name", toolDisplay.label());

            $tab.attr({
                component: toolDisplay.component.name
            }).addClass("absolute-fill-parent");

            return $tab;
        };

        var generateTools = function (tools) {
            var tabBody = document.createElement("div");
            var $tabBody = $(tabBody);

            var mainTab = generateMainTool(typeDisplay.mainInputs || []);
            $tabBody.append(mainTab);

            $tabBody.attr({
                "component": "gem-tabs"
            }).addClass("absolute-fill-parent");

            tools.orderBy(function (tool) {
                return typeof tool.sortOrder === "number" ? tool.sortOrder : Infinity;
            }).map(function (tool) {
                return generateTool(tool);
            }).forEach(function (tab) {
                $tabBody.append(tab);
            });

            return $tabBody;
        };

        var createFormAsync = function () {
            var tabs = generateTools(typeDisplay.tools || []);

            tabs.addClass("absolute-fill-parent").css("overflow", "hidden");

            return BASE.web.components.loadAsync(tabs).chain(function (form) {


                formByTypes.add(Type, form);

                return form;
            });
        };

        var getFormAsync = function (Type) {
            var form = formByTypes.get(Type);

            if (form == null) {
                return createFormAsync(Type);
            } else {
                return Future.fromResult(form);
            }
        };

        self.setConfigAsync = function (config) {
            entity = config.entity;
            Type = config.Type;
            currentConfig = config;
            displayService = config.displayService;
            typeDisplay = displayService.getDisplayByType(Type);
            hiddenTools = config.hiddenTools || [];
            hiddenInputs = config.hiddenInputs || [];

            $elem.children().detach();

            return getFormAsync(Type).chain(function (form) {
                var tabController = $(form).controller();
                var tabs = tabController.getTabs();

                currentForm = form;
                var tabNames = Object.keys(tabs);

                var mainInputs = typeDisplay.mainInputs.filter(function (input) {
                    return hiddenInputs.indexOf(input.propertyName) === -1;
                });

                var tabMapping = typeDisplay.tools.reduce(function (tabMapping, tool) {
                    tabMapping[tool.label()] = tool.name;
                    return tabMapping;
                }, {});

                tabNames.forEach(function (tabName) {
                    if (hiddenTools.indexOf(tabMapping[tabName]) >= 0) {
                        tabController.hideTab(tabName);
                    } else {
                        tabController.showTab(tabName);
                    }
                });

                tabNames.forEach(function (tabName) {
                    var tab = $(tabs[tabName]).controller();
                    var config = displayService.getToolByLabel(Type, tabName) || { hiddenInputs: hiddenInputs };

                    config.displayService = displayService;
                    config.Type = Type;
                    config.entity = entity;
                    config.typeDisplay = typeDisplay;

                    tab.setConfigAsync(config).try();
                });

                if (mainInputs.length > 0) {
                    tabController.showTab("General");
                    tabController.selectTabAsync(tabNames[0]).try();
                } else {
                    tabController.hideTab("General");
                    tabController.selectTabAsync(tabNames[1]).try();
                }

                if (typeDisplay.tools.length === 0) {
                    tabController.hideAllTabs();
                } else {
                    tabController.showAllTabs();
                }

                $elem.append(form);
            });
        };

        self.saveAsync = function () {
            var tabs = $(currentForm).controller().getTabs();

            var futures = Object.keys(tabs).map(function (tabName) {
                var tab = $(tabs[tabName]).controller();

                return tab.saveAsync(currentConfig);
            });

            return Future.all(futures).chain(function () {
                if (typeof typeDisplay.saveAsync === "function") {
                    return typeDisplay.saveAsync(currentConfig);
                }
            });
        };

        self.validateAsync = function () {
            var $form = $(currentForm);
            var formController = $form.controller();
            var tabs = formController.getTabs();

            var inputControllerHash = $(tabs["General"]).controller().getInputControllers();

            var futures = Object.keys(tabs).map(function (tabName) {
                var tab = $(tabs[tabName]).controller();

                return tab.validateAsync(currentConfig, inputControllerHash);
            });

            return Future.all(futures).chain(function () {
                if (typeof typeDisplay.validateAsync === "function") {
                    return typeDisplay.validateAsync(currentConfig, inputControllerHash);
                }
            });
        };

        self.resize = function () {
            return getFormAsync(Type).chain(function (form) {
                var tabController = $(form).controller();
                tabController.resize();
            }).try();
        };
    };
});