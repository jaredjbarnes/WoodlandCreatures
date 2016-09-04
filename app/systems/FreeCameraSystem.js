BASE.require([
    "app.systems.ViewportSystem"
], function () {
    BASE.namespace("app.systems.ViewportSystem");

    var RenderSystem = app.systems.ViewportSystem;

    app.systems.FreeCameraSystem = function () {

    };

    BASE.extend(app.systems.FreeCameraSystem, RenderSystem);
});