BASE.require([], function () {

    BASE.namespace("app.properties");

    app.properties.State = function () {
        this["@class"] = "app.properties.State";
        this.type = "state";
        this.name = null;
        this.stateMachineName = null;
    };

});