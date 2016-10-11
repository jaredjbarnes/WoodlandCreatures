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
    "app.systems.SelectionSystem",
    "app.systems.BrushSystem",
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
    var SelectionSystem = app.systems.SelectionSystem;
    var BrushSystem = app.systems.BrushSystem;
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
        var $canvasContainer = $(tags["canvas-container"]);
        var verticalScrollbar = $(tags["vertical-scrollbar"]).controller();
        var horizontalScrollbar = $(tags["horizontal-scrollbar"]).controller();
        var scale;
        var size;
        var game;
        var player;
        var camera;

        var calculateCanvasSize = function () {
            var width = $canvasContainer.width();
            var height = $canvasContainer.height();
            size = getSize(width, height);

            scale = {
                x: width / size.width,
                y: height / size.height
            };

            canvas.width = size.width;
            canvas.height = size.height;

            $canvas.css({
                width: width + "px",
                height: height + "px"
            });

            verticalScrollbar.setViewportHeight(size.height);
            horizontalScrollbar.setViewportWidth(size.width);
        };

        var initialize = function (canvas, scale) {
            calculateCanvasSize()

            // Entities
            var stage = new Stage();
            var timer = new Timer();

            camera = new Camera();
            player = new Player();

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
            var brushSystem = new BrushSystem(canvas, camera, scale);
            var cameraSystem = new CameraSystem(canvas, camera, scale);

            var keyboardInputSystem = new KeyboardInputSystem(document, {
                37: "left",
                38: "up",
                39: "right",
                40: "down"
            });

            game = new Game(stage, timer);

            // Input Systems
            game.appendSystem(keyboardInputSystem);

            // Logic Systems
            game.appendSystem(playerStateMachineSystem);

            // Collision Systems
            game.appendSystem(positionConstraintSystem);
            game.appendSystem(broadPhaseCollisionSystem);
            game.appendSystem(narrowPhaseCollisionSystem);

            //Render Systems
            game.appendSystem(cameraSystem);
            game.appendSystem(spriteSystem);
            game.appendSystem(gridSystem);
            game.appendSystem(brushSystem);

            hookupScrollbars();

            game.play();

            window.game = game;
        };

        var hookupScrollbars = function () {
            var stage = game.stage;
            var stageSize = stage.getProperty("size");

            verticalScrollbar.setDelegate({
                positionChange: function (y) {
                    var position = camera.getProperty("position");
                    position.y = Math.floor(y);
                },
                limitPositionChange: function (y) {
                    stageSize.height = Math.floor(y + size.height);
                }
            });


            horizontalScrollbar.setDelegate({
                positionChange: function (x) {
                    var position = camera.getProperty("position");
                    position.x = Math.floor(x);
                },
                limitPositionChange: function (x) {
                    stageSize.width = Math.floor(x + size.width);
                }
            });

            verticalScrollbar.setMaxValue(stageSize.height - size.height);
            horizontalScrollbar.setMaxValue(stageSize.width - size.width);
        };

        initialize(canvas, scale);

        $elem.on("windowResize", function () {
            calculateCanvasSize();
            hookupScrollbars();
        });

    };

});