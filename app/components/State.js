BASE.require([], function () {

    BASE.namespace("app.components");

    app.components.State = function () {
        this.name = null;
        this.entity = null;
        this.isInitialized = false;
    };

    app.components.State.prototype.initialize = function (entity) {
        this.entity = entity;
    };

});