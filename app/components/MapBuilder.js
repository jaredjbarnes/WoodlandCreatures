BASE.require([
    "jQuery",
    "app.Game",
    "app.Entity",
    "app.systems.TouchInputSystem",
    "app.systems.BroadPhaseCollisionSystem",
    "app.systems.BroadphaseCollisionDrawerSystem",
    "app.systems.PositionConstraintSystem",
    "app.systems.FollowEntityCameraSystem",
    "app.systems.CameraSystem",
    "app.systems.RigidBodyDrawerSystem",
    "app.systems.SpriteSystem",
    "app.systems.StateMachineSystem",
    "app.systems.PlayerStateMachineSystem",
    "app.systems.PlayerCollisionSystem",
    "app.systems.KeyboardInputSystem",
    "app.systems.NarrowPhaseCollisionSystem",
    "app.systems.AnimationSystem",
    "app.systems.CursorSystem",
    "app.systems.GridSystem",
    "app.systems.MapSystem",
    "app.entities.Map",
    "app.entities.Player",
    "app.entities.Camera",
    "app.entities.Tree",
    "app.entities.Stage",
    "app.Timer"
], function () {

    BASE.namespace("app.components");

    var Game = app.Game;
    var Entity = app.Entity;
    var BroadphaseCollisionDrawerSystem = app.systems.BroadphaseCollisionDrawerSystem;
    var BroadPhaseCollisionSystem = app.systems.BroadPhaseCollisionSystem;
    var PositionConstraintSystem = app.systems.PositionConstraintSystem;
    var CameraSystem = app.systems.CameraSystem;
    var MapSystem = app.systems.MapSystem;
    var RigidBodyDrawerSystem = app.systems.RigidBodyDrawerSystem;
    var SpriteSystem = app.systems.SpriteSystem;
    var StateMachineSystem = app.systems.StateMachineSystem;
    var PlayerStateMachineSystem = app.systems.PlayerStateMachineSystem;
    var PlayerCollisionSystem = app.systems.PlayerCollisionSystem;
    var KeyboardInputSystem = app.systems.KeyboardInputSystem;
    var NarrowPhaseCollisionSystem = app.systems.NarrowPhaseCollisionSystem;
    var AnimationSystem = app.systems.AnimationSystem;
    var CursorSystem = app.systems.CursorSystem;
    var GridSystem = app.systems.GridSystem;
    var Stage = app.entities.Stage;
    var Player = app.entities.Player;
    var Camera = app.entities.Camera;
    var Tree = app.entities.Tree;
    var Timer = app.Timer;

    app.components.MapBuilder = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var canvas = tags["canvas"];
        var mapCanvas = tags["map"];
        var $mapCanvas = $(mapCanvas);
        var $canvas = $(canvas);
        var $header = $(tags["header"]);
        var $canvasContainer = $(tags["canvas-container"]);

        var isMapMouseDown = false;

        var $selectionButton = $(tags["selection-button"]);
        var $panButton = $(tags["pan-button"]);
        var $eraser = $(tags["eraser-button"]);
        var $terrainButton = $(tags["terrain-button"]);
        var $plantsButton = $(tags["plants-button"]);
        var $structuresButton = $(tags["structures-button"]);
        var $groundColor = $(tags["ground-color"]);

        var terrain = $(tags["terrain"]).controller();
        var plants = $(tags["plants"]).controller();
        var structures = $(tags["structures"]).controller();
        var stateManager = $(tags["state-manager"]).controller();

        // Entities
        var stage = new Stage();
        var timer = new Timer();

        var camera = new Camera();
        var player = new Player();

        stage.appendChild(player);
        stage.appendChild(camera);

        // Systems 
        var narrowPhaseCollisionSystem = new NarrowPhaseCollisionSystem();
        var positionConstraintSystem = new PositionConstraintSystem();
        var playerStateMachineSystem = new PlayerStateMachineSystem();
        var playerCollisionSystem = new PlayerCollisionSystem();
        var spriteSystem = new SpriteSystem();

        var gridSystem = new GridSystem(canvas, camera);
        var broadPhaseCollisionSystem = new BroadPhaseCollisionSystem(camera);
        var cursorSystem = new CursorSystem(canvas, camera);
        var cameraSystem = new CameraSystem(canvas, camera);
        var broadPhaseCollisionDrawerSystem = new BroadphaseCollisionDrawerSystem(canvas, camera);
        var rigidBodyDrawerSystem = new RigidBodyDrawerSystem(canvas, camera);
        var animationSystem = new AnimationSystem();
        var mapSystem = new MapSystem(mapCanvas, stage, 100);

        var keyboardInputSystem = new KeyboardInputSystem(document, {
            37: "left",
            38: "up",
            39: "right",
            40: "down"
        });

        var game = new Game(stage, timer);

        // Input Systems
        game.appendSystem(keyboardInputSystem);

        // Logic Systems
        game.appendSystem(playerStateMachineSystem);
        game.appendSystem(animationSystem);

        // Collision Systems
        game.appendSystem(positionConstraintSystem);
        game.appendSystem(broadPhaseCollisionSystem);
        game.appendSystem(narrowPhaseCollisionSystem);
        game.appendSystem(playerCollisionSystem);

        //Render Systems
        game.appendSystem(spriteSystem);
        game.appendSystem(cameraSystem);
        game.appendSystem(gridSystem);
        game.appendSystem(cursorSystem);
        game.appendSystem(mapSystem);
        //game.appendSystem(rigidBodyDrawerSystem);
        //game.appendSystem(broadPhaseCollisionDrawerSystem);

        game.play();

        window.cursorSystem = cursorSystem;
        window.cameraSystem = cameraSystem;
        window.broadPhaseCollisionSystem = broadPhaseCollisionSystem;

        brushSystem = cursorSystem.modes.brush;

        terrain.initialize(brushSystem, "Terrain");
        plants.initialize(brushSystem, "Plants");
        structures.initialize(brushSystem, "Structures");

        var deselectButtons = function () {
            $header.children().removeClass("selected");
        };

        self.changeMode = function (mode, buttonTagName) {
            buttonTagName = buttonTagName || mode;
            cursorSystem.changeMode(mode);
            deselectButtons();
            $header.children("[tag='" + buttonTagName + "-button']").addClass("selected");
        };

        $elem.on("windowResize", function () {
            cursorSystem.canvasScaler.scaleCanvas();
        });

        var interval = setInterval(function () {
            if ($elem.parents("body").length > 0) {
                clearInterval(interval);
                cursorSystem.canvasScaler.scaleCanvas();
            }
        }, 100);

        $selectionButton.on("click", function () {
            self.changeMode("selection");
        });

        $panButton.on("click", function () {
            self.changeMode("pan");
        });

        $eraser.on("click", function () {
            self.changeMode("eraser");
        });

        $terrainButton.on("click", function () {
            stateManager.pushAsync("terrain").chain(function () {
                return terrain.getBrushNameAsync();
            }).chain(function (brushName) {
                self.changeMode("brush", "terrain");
                cursorSystem.modes.brush.selectBrushByName(brushName);
            }).finally(function () {
                return stateManager.replaceAsync("default");
            }).try();
        });

        $structuresButton.on("click", function () {
            stateManager.pushAsync("structures").chain(function () {
                return structures.getBrushNameAsync();
            }).chain(function (brushName) {
                self.changeMode("brush", "structures");
                cursorSystem.modes.brush.selectBrushByName(brushName);
            }).finally(function () {
                return stateManager.replaceAsync("default");
            }).try();
        });

        var positionCamera = function (event) {
            var rect = mapCanvas.getBoundingClientRect();
            var size = stage.getProperty("size");
            var cameraSize = camera.getProperty("size");
            var cameraPosition = camera.getProperty("position");

            var offset = {
                x: cameraSize.width / 2,
                y: cameraSize.height / 2
            };

            var clickPosition = {
                x: event.pageX - rect.left,
                y: event.pageY - rect.top
            };

            var scaleX = size.width / rect.width;
            var scaleY = size.height / rect.height;

            var position = {
                x: (clickPosition.x * scaleX) - offset.x,
                y: (clickPosition.y * scaleY) - offset.y
            };

            cameraPosition.x = position.x;
            cameraPosition.y = position.y;
        };

        $mapCanvas.on("click", positionCamera);

        $mapCanvas.on("mousedown", function () {
            isMapMouseDown = true;
        });

        $mapCanvas.on("mouseout", function () {
            isMapMouseDown = false;
        });

        $mapCanvas.on("mouseup", function () {
            isMapMouseDown = false;
        });

        $mapCanvas.on("mousemove", function (event) {
            if (isMapMouseDown) {
                positionCamera(event);
            }
        });

        stateManager.pushAsync("default").try();

    };

});