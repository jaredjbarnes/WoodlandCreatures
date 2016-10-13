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
    "app.systems.CursorSystem",
    "app.systems.GridSystem",
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
    var BroadPhaseCollisionSystem = app.systems.BroadPhaseCollisionSystem;
    var PositionConstraintSystem = app.systems.PositionConstraintSystem;
    var CameraSystem = app.systems.CameraSystem;
    var RigidBodyDrawerSystem = app.systems.RigidBodyDrawerSystem;
    var SpriteSystem = app.systems.SpriteSystem;
    var StateMachineSystem = app.systems.StateMachineSystem;
    var PlayerStateMachineSystem = app.systems.PlayerStateMachineSystem;
    var PlayerCollisionSystem = app.systems.PlayerCollisionSystem;
    var KeyboardInputSystem = app.systems.KeyboardInputSystem;
    var NarrowPhaseCollisionSystem = app.systems.NarrowPhaseCollisionSystem;
    var CursorSystem = app.systems.CursorSystem;
    var GridSystem = app.systems.GridSystem;
    var Stage = app.entities.Stage;
    var Player = app.entities.Player;
    var Camera = app.entities.Camera;
    var Tree = app.entities.Tree;
    var Timer = app.Timer;

    var getSize = function (width, height) {
        var ratio;

        if (width > height) {
            ratio = width / height;
            return {
                width: 480,
                height: 480 / ratio
            };
        } else {
            ratio = height / width;
            return {
                width: 480 / ratio,
                height: 480
            }
        }
    };

    app.components.MapBuilder = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var canvas = tags["canvas"];
        var $canvas = $(tags["canvas"]);
        var $header= $(tags["header"]);
        var $canvasContainer = $(tags["canvas-container"]);

        var $selectionButton = $(tags["selection-button"]);
        var $eraser = $(tags["eraser-button"]);
        var $terrain = $(tags["terrain-button"]);
        var $groundColor = $(tags["ground-color"]);

        var stateManager = $(tags["state-manager"]).controller();

        // Entities
        var stage = new Stage();
        var timer = new Timer();

        var camera = new Camera();
        var player = new Player();

        stage.appendChild(player);
        stage.appendChild(camera);

        // Systems 
        var broadPhaseCollisionSystem = new BroadPhaseCollisionSystem();
        var narrowPhaseCollisionSystem = new NarrowPhaseCollisionSystem();
        var positionConstraintSystem = new PositionConstraintSystem();
        var playerStateMachineSystem = new PlayerStateMachineSystem();
        var playerCollisionSystem = new PlayerCollisionSystem();
        var spriteSystem = new SpriteSystem();

        var gridSystem = new GridSystem(canvas, camera);
        var cursorSystem = new CursorSystem(canvas, camera);
        var cameraSystem = new CameraSystem(canvas, camera);

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
        //game.appendSystem(playerStateMachineSystem);

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

        game.play();

        window.cursorSystem = cursorSystem;
        window.cameraSystem = cameraSystem;

        var deselectButtons = function () {
            $header.children().removeClass("selected");
        };

        self.changeMode = function (mode) {
            cursorSystem.changeMode(mode);
            deselectButtons();
            $header.children("[tag='"+mode+"-button']").addClass("selected");
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

        $terrain.on("click", function () {
            self.changeMode("terrain");
        });

        $eraser.on("click", function () {
            self.changeMode("eraser");
        });

        stateManager.pushAsync("default").try();

    };

});