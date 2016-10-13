BASE.require([
    "app.entities.Tree",
    "app.entities.BlueHouse",
    "app.entities.WitchHut"
], function () {

    BASE.namespace("app.systems.cursorModes");

    app.systems.cursorModes.brushes = [{
        name: "tree",
        displayName: "Tree",
        Type: app.entities.Tree,
        category: "Plants"
    }, {
        name: "blue-house",
        displayName: "Blue House",
        Type: app.entities.BlueHouse,
        category: "Structures"
    }, {
        name: "witch-hut",
        displayName: "Witch Hut",
        Type: app.entities.WitchHut,
        category: "Structures"
    }];
});