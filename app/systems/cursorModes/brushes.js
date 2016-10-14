BASE.require([
    "app.entities.Tree",
    "app.entities.Grass",
    "app.entities.LongGrass",
    "app.entities.CobbleStone",
    "app.entities.FlagStone",
    "app.entities.BlueHouse",
    "app.entities.WitchHut"
], function () {

    BASE.namespace("app.systems.cursorModes");

    app.systems.cursorModes.brushes = [
        {
            name: "tree",
            displayName: "Tree",
            Type: app.entities.Tree,
            category: "Plants"
        }, {
            name: "grass",
            displayName: "Grass",
            Type: app.entities.Grass,
            category: "Terrain"
        }, {
            name: "long-grass",
            displayName: "LongGrass",
            Type: app.entities.LongGrass,
            category: "Terrain"
        }, {
            name: "cobble-stone",
            displayName: "CobbleStone",
            Type: app.entities.CobbleStone,
            category: "Terrain"
        }, {
            name: "flag-stone",
            displayName: "FlagStone",
            Type: app.entities.FlagStone,
            category: "Terrain"
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
        }
    ];
});