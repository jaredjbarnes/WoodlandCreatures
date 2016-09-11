﻿BASE.require([
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

        components.push(component);
    };

    app.Entity.prototype.getComponents = function (name) {
        return this.components[name] || [];
    };

    app.Entity.prototype.getComponent = function (name) {
        return (this.components[name] && this.components[name][0]) || null;
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

    app.Entity.prototype.hasComponents = function (components) {
        for (var x = 0 ; x < components.length; x++) {
            if (this.components[components[x]] == null) {
                return false;
            }
        }
        return true;
    };

    app.Entity.prototype.addProperty = function (property) {
        var properties = this.properties[property.type];
        if (!Array.isArray(properties)) {
            properties = this.properties[property.type] = [];
        }
        properties.push(property);
    };

    app.Entity.prototype.getProperties = function (name) {
        return this.properties[name] || [];
    };

    app.Entity.prototype.getProperty = function (name) {
        return (this.properties[name] && this.properties[name][0]) || null;
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

    app.Entity.prototype.hasProperties = function (properties) {
        for (var x = 0 ; x < properties.length; x++) {
            if (this.properties[properties[x]] == null) {
                return false;
            }
        }
        return true;
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