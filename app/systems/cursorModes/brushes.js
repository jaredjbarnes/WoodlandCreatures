BASE.require([
    "app.entities.Tree",
    "app.entities.TopLeftHedge",
    "app.entities.TopRightHedge",
    "app.entities.VerticalHedge",
    "app.entities.HorizontalHedge",
    "app.entities.BottomLeftHedge",
    "app.entities.BottomRightHedge",
    "app.entities.Grass",
    "app.entities.LongGrass",
    "app.entities.CobbleStone",
    "app.entities.FlagStone",
    "app.entities.BlueHouse",
    "app.entities.LargeRedHouse",
    "app.entities.GrassRoofHouse",
    "app.entities.FairyFountain",
    "app.entities.WindVane",
    "app.entities.WitchHut",
    "app.entities.Flower"
], function () {

    BASE.namespace("app.systems.cursorModes");

    app.systems.cursorModes.brushes = [
        {
            name: "tree",
            displayName: "Tree",
            Type: app.entities.Tree,
            category: "Plants"
        }, {
            name: "top-left-hedge",
            displayName: "Top Left Hedge",
            Type: app.entities.TopLeftHedge,
            category: "Plants"
        }, {
            name: "top-right-hedge",
            displayName: "Top Right Hedge",
            Type: app.entities.TopRightHedge,
            category: "Plants"
        }, {
            name: "vertical-hedge",
            displayName: "Vertical Hedge",
            Type: app.entities.VerticalHedge,
            category: "Plants"
        }, {
            name: "horizontal-hedge",
            displayName: "Horizontal Hedge",
            Type: app.entities.HorizontalHedge,
            category: "Plants"
        }, {
            name: "bottom-left-hedge",
            displayName: "Bottom Left Hedge",
            Type: app.entities.BottomLeftHedge,
            category: "Plants"
        }, {
            name: "bottom-right-hedge",
            displayName: "Bottom Right Hedge",
            Type: app.entities.BottomRightHedge,
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
            name: "large-red-house",
            displayName: "Large Red House",
            Type: app.entities.LargeRedHouse,
            category: "Structures"
        }, {
            name: "grass-roof-house",
            displayName: "Grass Roof House",
            Type: app.entities.GrassRoofHouse,
            category: "Structures"
        }, {
            name: "witch-hut",
            displayName: "Witch Hut",
            Type: app.entities.WitchHut,
            category: "Structures"
        }, {
            name: "wind-vane",
            displayName: "Wind Vane",
            Type: app.entities.WindVane,
            category: "Structures"
        }, {
            name: "fairy-fountain",
            displayName: "Fairy Fountain",
            Type: app.entities.FairyFountain,
            category: "Structures"
        }, {
            name: "flower",
            displayName: "Flower",
            Type: app.entities.Flower,
            category: "Terrain"
        }
    ];
});