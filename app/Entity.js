BASE.require([
    "BASE.util.Guid"
], function () {
    BASE.namespace("app");

    var Guid = BASE.util.Guid;
    var returnTrue = function () { return true; };

    var invokeMethod = function (obj, methodName, args) {
        if (obj && typeof obj[methodName] === "function") {
            return obj[methodName].apply(obj, args);
        }
    };

    app.Entity = function () {
        this["@class"] = "app.Entity";
        this.type = null;
        this.children = [];
        this.parent = null;
        this.components = {};
        this.properties = {};
        this.delegate = null;
        this.id = Guid.create();
    };

    app.Entity.prototype.addComponent = function (component) {
        var components = this.components[component.type];

        if (!Array.isArray(components)) {
            components = this.components[component.type] = [];
        }

        components.push(property);
    };

    app.Entity.prototype.removeComponent = function (component) {
        var components = this.components[component.type];

        if (!Array.isArray(components)) {
            components = this.components[component.type] = [];
        }

        var index = components.indexOf(component);

        if (index > -1) {
            components.splice(index, 1);
        }
    };

    app.Entity.prototype.addProperty = function (property) {
        var properties = this.properties[property.type];
        if (!Array.isArray(properties)) {
            properties = this.properties[property.type] = [];
        }
        properties.push(property);
    };

    app.Entity.prototype.removeProperty = function (property) {
        var properties = this.properties[property.type];

        if (!Array.isArray(properties)) {
            properties = this.properties[property.type] = [];
        }

        var index = properties.indexOf(property);

        if (index > -1) {
            properties.splice(index, 1);
        }
    };

    app.Entity.prototype.notify = function (eventName, args) {
        invokeMethod(this.delegate, eventName, args);

        if (this.parent !== null) {
            this.parent.notify(eventName, args);
        }
    };

    app.Entity.prototype.appendChild = function (entity) {
        entity.parent = this;
        this.children.push(entity);
        this.notify("entityAdded", [entity]);
    };

    app.Entity.prototype.removeChild = function (entity) {
        var index = this.children.indexOf(entity);

        if (index > -1) {
            entity.parent = null;
            this.children.splice(index, 1);
            this.notify("entityRemoved", [entity]);
        }
    };

    app.Entity.prototype.insertChildBefore = function (entity, referenceEntity) {
        entity.parent = this;

        var index = this.children.indexOf(referenceEntity);
        if (index > -1) {
            this.children.splice(index, 0, entity);
            this.notify("entityAdded", [entity]);
        }
    };

    app.Entity.prototype.filter = function (filter, accumulator) {
        if (typeof filter !== "function") {
            filter = returnTrue;
        }

        var results = accumulator || [];
        var child = null;
        var children = this.children;
        var length = children.length;

        if (filter(this)) {
            results.push(this);
        }

        for (var x = 0 ; x < length; x++) {
            child = children[x];
            child.filter(filter, results);
        }

        return results;
    };

});