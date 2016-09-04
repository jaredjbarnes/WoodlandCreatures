BASE.require([
    "app.systems.ViewportSystem"
], function () {
    BASE.namespace("app.systems.ViewportSystem");

    var RenderSystem = app.systems.ViewportSystem;

    app.systems.FollowCameraSystem = function () {

    };

    BASE.extend(app.systems.FollowCameraSystem, RenderSystem);
});