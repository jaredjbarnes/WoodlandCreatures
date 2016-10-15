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
        this.properties = {};
        this.delegate = null;
        this.id = Guid.create();
    };

    app.Entity.prototype.getProperties = function (name) {
        return this.properties[name] || [];
    };

    app.Entity.prototype.getProperty = function (name) {
        var properties = this.properties;

        if (Array.isArray(properties[name]) && properties[name].length > 0) {
            return properties[name][0];
        }

        return null;
    };

    app.Entity.prototype.getPropertyById = function (id) {
        var propertiesByName = this.properties;
        var keys = Object.keys(propertiesByName);
        var length = keys.length;
        var properties;
        var property;
        var x;
        var px;

        for (x = 0 ; x < length; x++) {
            properties = propertiesByName[keys[x]];

            for (px = 0 ; px < properties.length; px++) {
                property = properties[px];

                if (property.id === id) {
                    return property;
                }
            }

        }

        return null;
    };

    app.Entity.prototype.addProperty = function (property) {
        var properties = this.properties[property.type];
        if (!Array.isArray(properties)) {
            properties = this.properties[property.type] = [];
        }
        property.id = Guid.create();
        properties.push(property);

        this.notify("propertyAdded", [this, property]);
    };

    app.Entity.prototype.removeProperty = function (property) {
        if (property == null) {
            return;
        }

        var properties = this.properties[property.type];

        if (!Array.isArray(properties)) {
            properties = this.properties[property.type] = [];
        }

        var index = properties.indexOf(property);

        if (index > -1) {
            properties.splice(index, 1);

            this.notify("propertyRemoved", [this, property]);
        }
    };

    app.Entity.prototype.hasProperties = function (properties) {
        var allProperties;
        for (var x = 0 ; x < properties.length; x++) {
            allProperties = this.properties[properties[x]];
            if (!Array.isArray(allProperties) || allProperties.length === 0) {
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