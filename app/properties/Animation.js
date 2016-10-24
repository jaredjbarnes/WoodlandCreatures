BASE.require([
], function () {

    BASE.namespace("app.properties");

    app.properties.Animation = function () {
        this["@class"] = "app.properties.Animation";
        this.type = "animation";
        this.name = null;
        this.startTime = 0;
        this.duration = 0;
        this.easing = "linear";
        this.startValue = 0;
        this.currentValue = 0;
        this.endValue = 0;
        this.repeat = 1;
        this.iterations = 0;
        this.direction = 0;
        this.repeatDirection = 0;
        this.progress = 0;
    };

    app.properties.Animation.REPEAT_DEFAULT = 0;
    app.properties.Animation.REPEAT_ALTERATE = 0;

});