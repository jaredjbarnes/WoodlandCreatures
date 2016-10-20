BASE.require([
    "app.entities.Tree",
    "app.entities.TopLeftHedge",
    "app.entities.TopRightHedge",
    "app.entities.VerticalTopHedge",
    "app.entities.VerticalHedge",
    "app.entities.VerticalBottomHedge",
    "app.entities.HorizontalHedge",
    "app.entities.RightHorizontalHedge",
    "app.entities.LeftHorizontalHedge",
    "app.entities.BottomLeftHedge",
    "app.entities.BottomRightHedge",
    "app.entities.Grass",
    "app.entities.LongGrass",
    "app.entities.CobbleStone",
    "app.entities.FlagStone",
    "app.entities.BlueHouse",
    "app.entities.RedFlagStoneHouse",
    "app.entities.LargeRedHouse",
    "app.entities.GrassRoofHouse",
    "app.entities.FairyFountain",
    "app.entities.FacingCliff",
    "app.entities.LeftCliff",
    "app.entities.LeftFacingCliff",
    "app.entities.RightFacingCliff",
    "app.entities.RightCliff",
    "app.entities.WindVane",
    "app.entities.WitchHut",
    "app.entities.Flower"
], function () {

    BASE.namespace("app.systems.cursorModes");

    app.systems.cursorModes.brushes = [
       {
           name: "grass",
           displayName: "Grass",
           Type: app.entities.Grass,
           category: "Terrain"
       }, {
           name: "flower",
           displayName: "Flower",
           Type: app.entities.Flower,
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
           name: "top-left-hedge",
           displayName: "Top Left Hedge",
           Type: app.entities.TopLeftHedge,
           category: "Terrain"
       }, {
           name: "top-right-hedge",
           displayName: "Top Right Hedge",
           Type: app.entities.TopRightHedge,
           category: "Terrain"
       }, {
           name: "vertical-top-hedge",
           displayName: "Vertical Top Hedge",
           Type: app.entities.VerticalTopHedge,
           category: "Terrain"
       }, {
           name: "vertical-hedge",
           displayName: "Vertical Hedge",
           Type: app.entities.VerticalHedge,
           category: "Terrain"
       }, {
           name: "vertical-bottom-hedge",
           displayName: "Vertical Bottom Hedge",
           Type: app.entities.VerticalBottomHedge,
           category: "Terrain"
       }, {
           name: "left-horizontal-hedge",
           displayName: "LeftHorizontal Hedge",
           Type: app.entities.LeftHorizontalHedge,
           category: "Terrain"
       }, {
           name: "horizontal-hedge",
           displayName: "Horizontal Hedge",
           Type: app.entities.HorizontalHedge,
           category: "Terrain"
       }, {
           name: "right-horizontal-hedge",
           displayName: "Right Horizontal Hedge",
           Type: app.entities.RightHorizontalHedge,
           category: "Terrain"
       }, {
           name: "bottom-left-hedge",
           displayName: "Bottom Left Hedge",
           Type: app.entities.BottomLeftHedge,
           category: "Terrain"
       }, {
           name: "bottom-right-hedge",
           displayName: "Bottom Right Hedge",
           Type: app.entities.BottomRightHedge,
           category: "Terrain"
       }, {
           name: "tree",
           displayName: "Tree",
           Type: app.entities.Tree,
           category: "Terrain"
       }, {
           name: "left-cliff",
           displayName: "Left Cliff",
           Type: app.entities.LeftCliff,
           category: "Terrain"
       }, {
           name: "left-facing-cliff",
           displayName: "Left Facing Cliff",
           Type: app.entities.LeftFacingCliff,
           category: "Terrain"
       }, {
           name: "right-facing-cliff",
           displayName: "Right Facing Cliff",
           Type: app.entities.RightFacingCliff,
           category: "Terrain"
       }, {
           name: "facing-cliff",
           displayName: "Facing Cliff",
           Type: app.entities.FacingCliff,
           category: "Terrain"
       }, {
           name: "right-cliff",
           displayName: "Right Cliff",
           Type: app.entities.RightCliff,
           category: "Terrain"
       }, {
           name: "blue-house",
           displayName: "Blue House",
           Type: app.entities.BlueHouse,
           category: "Structures"
       }, {
           name: "red-flag-stone-house",
           displayName: "Red Flag Stone House",
           Type: app.entities.RedFlagStoneHouse,
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
       }
    ];
});