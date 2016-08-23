BASE.require([
    "jQuery",
    "components.ui.layouts.collections.GridLayout",
    "components.ui.layouts.collections.ListLayout",
    "Array.prototype.asQueryable",
    "BASE.async.Continuation",
    "Array.prototype.except",
    "Array.prototype.asQueryable",
    "LG.core.dataModel.testing.Service",
    "BASE.data.DataContext"
], function () {
    BASE.namespace("components.test");

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Continuation = BASE.async.Continuation;
    var DataContext = BASE.data.DataContext;
    var Service = LG.core.dataModel.testing.Service;

    components.test.DiggingCollectionTest = function (elem, tags) {
        var $collection = $(tags['collection']);
        var collectionController = $collection.controller();

        var gridLayout = new components.ui.layouts.collections.GridLayout({ width: 200, height: 125 });
        gridLayout.component = "lib/components/test/DiggingListItem.html";
        collectionController.setLayout(gridLayout);

        var token = "iedZbhHXflL4fR5QWmWSnEONfhUz1ecuxX1/75yiYROidnwN21cvKY67Qswo6mVPpC8e7O3jpRUEjVN6zFoWkEFur4y4OMtR3r+2hHZWT711U2Ku4nW985YcaIkXIA69q2ylYXzW1U4lSkT7TwzpTWAnufz3j7M7G3cgMmgf2fE=";
        var service = new Service(token);
        //var dataContext = new DataContext(service);

        collectionController.setQueryable(service.asQueryable(LG.core.dataModel.testing.Fruit));

    };
});