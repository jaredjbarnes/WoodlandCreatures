BASE.require([
    "jQuery",
    "app.Game",
    "app.Entity",
    "app.CanvasScaler",
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
    var BroadphaseCollisionDrawerSystem = app.systems.BroadphaseCollisionDrawerSystem;
    var BroadPhaseCollisionSystem = app.systems.BroadPhaseCollisionSystem;
    var PositionConstraintSystem = app.systems.PositionConstraintSystem;
    var CameraSystem = app.systems.CameraSystem;
    var FollowEntityCameraSystem = app.systems.FollowEntityCameraSystem;
    var RigidBodyDrawerSystem = app.systems.RigidBodyDrawerSystem;
    var SpriteSystem = app.systems.SpriteSystem;
    var StateMachineSystem = app.systems.StateMachineSystem;
    var TouchInputSystem = app.systems.TouchInputSystem;
    var PlayerStateMachineSystem = app.systems.PlayerStateMachineSystem;
    var PlayerCollisionSystem = app.systems.PlayerCollisionSystem;
    var KeyboardInputSystem = app.systems.KeyboardInputSystem;
    var NarrowPhaseCollisionSystem = app.systems.NarrowPhaseCollisionSystem;
    var AnimationSystem = app.systems.AnimationSystem;
    var GridSystem = app.systems.GridSystem;
    var Stage = app.entities.Stage;
    var Player = app.entities.Player;
    var Camera = app.entities.Camera;
    var Tree = app.entities.Tree;
    var Timer = app.Timer;

    app.components.MobilePlayer = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var canvas = tags["canvas"];
        var $canvas = $(tags["canvas"]);
        var $header = $(tags["header"]);
        var $canvasContainer = $(tags["canvas-container"]);
        var playerController = $(tags["player-controller"]).controller();
        var stateManager = $(tags["state-manager"]).controller();

        var canvasScaler = new app.CanvasScaler(canvas);

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
        var followEntityCameraSystem = new FollowEntityCameraSystem(canvas, camera, player);
        var broadPhaseCollisionDrawerSystem = new BroadphaseCollisionDrawerSystem(canvas, camera);
        var rigidBodyDrawerSystem = new RigidBodyDrawerSystem(canvas, camera);
        var animationSystem = new AnimationSystem();

        var keyboardInputSystem = new KeyboardInputSystem(document, {
            37: "left",
            38: "up",
            39: "right",
            40: "down"
        });

        var game = new Game(stage, timer);

        for (var x = 0 ; x < 1000; x++) {
            var tree = new Tree();
            var position = tree.getProperty("position");

            position.x = Math.round(Math.random() * 2000);
            position.y = Math.round(Math.random() * 2000);

            stage.appendChild(tree);
        }

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
        game.appendSystem(followEntityCameraSystem);
        //game.appendSystem(cameraSystem);
        //game.appendSystem(rigidBodyDrawerSystem);
        //game.appendSystem(broadPhaseCollisionDrawerSystem);

        $elem.on("windowResize", function () {
            canvasScaler.scaleCanvas();
        });

        var interval = setInterval(function () {
            if ($elem.parents("body").length > 0) {
                clearInterval(interval);
                canvasScaler.scaleCanvas();
            }
        }, 100);

        game.play();
        window.game = game;
        stateManager.pushAsync("default").try();
        followEntityCameraSystem.cacheCanvases();
        playerController.setTouchInput(player.getProperty("touch-input"));

    };

});