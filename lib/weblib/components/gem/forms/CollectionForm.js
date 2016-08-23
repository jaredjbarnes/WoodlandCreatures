BASE.require([
		"jQuery",
        "String.prototype.trim"
], function () {
    var Future = BASE.async.Future;

    var delegateInterface = [
        "addAsync",
        "editAsync",
        "removeAsync",
        "search",
        "getPropertyLabel",
        "getPropertyDisplay",
        "getPropertyNames",
        "getPrimaryKeyPropertyName",
        "getPropertyWidth"
    ];

    var implementsInterface = function (methodNames, obj) {
        return methodNames.every(function (methodName) {
            return typeof obj[methodName] === "function";
        });
    };

    BASE.namespace("components.gem.forms");

    components.gem.forms.CollectionForm = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $search = $(tags["search"]);
        var $searchArea = $(tags["search-area"]);
        var $edit = $(tags["edit"]);
        var $add = $(tags["add"]);
        var $delete = $(tags["delete"]);
        var $table = $(tags["table"]);
        var table = $table.controller();
        var delegate = null;
        var orderBy = null;

        var handleActionButtons = function (selectedItems) {
            var selectedAmount = selectedItems.getKeys().length;
            if (selectedAmount === 0) {
                $edit.attr("disabled", "disabled");
                $delete.attr("disabled", "disabled");
            } else if (selectedAmount > 0) {
                $edit.removeAttr("disabled");
                $delete.removeAttr("disabled");
            }

            if (selectedAmount > 1) {
                $edit.attr("disabled", "disabled");
            }
        };

        var editItemAsync = function (item) {
            return delegate.editAsync(item).chain(function () {
                var selectedItems = table.getSelectedItems();
                selectedItems.clear();
                handleActionButtons(selectedItems);
                return table.redrawItems();
            });
        };

        var setUpCrudUserInterface = function (delegate) {
            // Setup default CRUD
            delegate.canAdd = typeof delegate.canAdd === "boolean" ? delegate.canAdd : true;
            delegate.canEdit = typeof delegate.canEdit === "boolean" ? delegate.canEdit : true;
            delegate.canDelete = typeof delegate.canDelete === "boolean" ? delegate.canDelete : true;

            if (!delegate.canAdd) {
                $add.parent().addClass("hide");
            } else {
                $add.parent().removeClass("hide");
            }

            if (!delegate.canEdit) {
                $edit.parent().addClass("hide");
            } else {
                $edit.parent().removeClass("hide");
            }

            if (!delegate.canDelete) {
                $delete.parent().addClass("hide");
            } else {
                $delete.parent().removeClass("hide");
            }

            if (!delegate.canAdd && !delegate.canDelete && !delegate.canEdit) {
                $searchArea.addClass("search-only");
                $table.addClass("search-only");
            } else {
                $searchArea.removeClass("search-only");
                $table.removeClass("search-only");
            }
        };

        var onSearch = function () {
            handleActionButtons(table.getSelectedItems());
        };

        self.setDelegate = function (value) {
            delegate = value;

            var isValidDelegate = implementsInterface(delegateInterface, value);

            if (!isValidDelegate) {
                throw new Error("Invalid delegate it needs to implement all these methods." + delegateInterface.join(", "));
            }

            delegate.selectAsync = delegate.selectAsync || delegate.editAsync;
            delegate.onSearch = onSearch;

            delegate.orderBy = function (orderByAsc, orderByDesc) {
                self.searchAsync(undefined, orderByAsc, orderByDesc).try();
            };

            setUpCrudUserInterface(delegate);
            table.setDelegate(delegate);
            self.searchAsync().try();
        };

        self.searchAsync = function (text, orderByAscending, orderByDescending) {
            if (typeof text !== "string") {
                text = $search.val();
            } else {
                $search.val(text);
            }

            orderByAscending = orderByAscending || table.getOrderAscendingColumns();
            orderByDescending = orderByDescending || table.getOrderDescendingColumns();


            if (typeof delegate.searchAsync === "function") {
                var futureArray = delegate.searchAsync(text, orderByAscending, orderByDescending);
                return table.setFutureArrayAsync(futureArray);
            } else {
                return table.setQueryableAsync(delegate.search(text, orderByAscending, orderByDescending));
            }

        };

        $elem.on("selectionChange", function (event) {
            var selectedItems = event.selectedItems;
            handleActionButtons(selectedItems);
        });

        $edit.on("click", function () {
            editItemAsync(table.getSelectedItems().getValues()[0]).chain(function () {
                return self.searchAsync("");
            }).finally(function () {
                handleActionButtons(table.getSelectedItems());
            }).try();
        });

        $delete.on("click", function () {
            delegate.removeAsync(table.getSelectedItems().getValues()).chain(function () {
                return self.searchAsync("");
            }).try();
        });

        $add.on("click", function () {
            delegate.addAsync().chain(function () {
                return self.searchAsync("");
            }).try();
        });

        $elem.on("itemDoubleClicked", function (event) {
            var item = event.entity;
            if (delegate.canEdit) {
                delegate.selectAsync(item).chain(function () {
                    //TODO: WHY DO THIS?
                    //return self.searchAsync("");
                    return Future.fromResult();
                }).try();
            }
            return false;
        });

        $search.on("keyup", function () {
            self.searchAsync().try();
        });

    };
});