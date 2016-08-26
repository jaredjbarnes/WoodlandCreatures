﻿(function () {
    BASE.namespace("app");

    var returnTrue = function () { return true; };
    var id = 0;

    app.Entity = function () {
        this.type = null;
        this.children = [];
        this.parent = null;
        this.components = [];
        this.id = id++;
    };

    app.Entity.prototype.appendChild = function (entity) {
        entity.parent = this;
        this.children.push(entity);
    };

    app.Entity.prototype.removeChild = function (entity) {

        var index = this.children.indexOf(entity);
        if (index > -1) {
            entity.parent = null;
            this.children.splice(index, 1);
        }
    };

    app.Entity.prototype.insertChildBefore = function (entity, referenceEntity) {
        entity.parent = this;

        var index = this.children.indexOf(referenceEntity);
        if (index > -1) {
            this.children.splice(index, 0, entity);
        }
    };

    app.Entity.prototype.hasComponentByType = function (Type) {
        return this.getComponentByType(Type) != null;
    };

    app.Entity.prototype.hasComponentOfType = function (Type) {
        return this.getComponentOfType(Type) != null;
    };

    app.Entity.prototype.getComponentByType = function (Type) {
        return this.getComponentsByType(Type)[0] || null;
    };

    app.Entity.prototype.getComponentsByType = function (Type) {
        var matches = [];
        var component = null;

        for (var x = 0 ; x < this.components.length; x++) {
            component = this.components[x];
            if (component.constructor === Type) {
                matches.push(component);
            }
        }

        return matches;
    };

    app.Entity.prototype.getComponentsOfType = function (Type) {
        var matches = [];
        var component = null;

        for (var x = 0 ; x < this.components.length; x++) {
            component = this.components[x];
            if (component instanceof Type) {
                matches.push(component);
            }
        }

        return matches;
    };

    app.Entity.prototype.filter = function (filter) {
        if (typeof filter !== "function") {
            filter = returnTrue;
        }

        var results = [];
        var child = null;

        if (filter(this)) {
            results.push(this);
        }

        for (var x = 0 ; x < this.children.length; x++) {
            child = this.children[x];
            results = results.concat(child.filter(filter));
        }

        return results;
    };

    app.Entity.prototype.reduce = function (callback, accumulator) {
        if (typeof callback !== "function") {
            throw new Error("Expected a callback.");
        }

        var child = null;

        accumulator = callback(accumulator, this);

        for (var x = 0 ; x < this.children.length; x++) {
            child = this.children[x];
            accumulator = results.concat(child.reduce(callback, accumulator));
        }

        return accumulator;
    };

    app.Entity.prototype.map = function (callback) {
        if (typeof callback !== "function") {
            throw new Error("Expected a callback.");
        }

        var child = null;
        var results = [];

        results.push(callback(this));

        for (var x = 0 ; x < this.children.length; x++) {
            child = this.children[x];
            results = results.concat(child.map(callback));
        }

        return results;
    };

}());