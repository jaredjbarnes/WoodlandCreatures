BASE.require([], function () {

    BASE.namespace("app");

    var blacklistedProperties = {
        "verticies": true,
        "normals": true,
        "activeCollisions": true
    };

    var toNonCircularObject = function (obj, objectArray) {
        var clone;
        objectArray = objectArray || []

        if (objectArray.indexOf(obj) === -1) {
            objectArray.push(obj);

            if (Array.isArray(obj)) {
                clone = new Array();

                obj.forEach(function (item) {
                    var itemClone;
                    if (typeof item === "object" && item != null) {
                        itemClone = toNonCircularObject(item, objectArray);
                        if (typeof itemClone !== "undefined") {
                            clone.push(itemClone);
                        }
                    } else {
                        clone.push(item);
                    }
                });
            } else {
                clone = {};
                var keys = Object.keys(obj);

                keys.forEach(function (key) {
                    if (blacklistedProperties[key]) {
                        return;
                    }

                    var item = obj[key];

                    if (typeof item === "object" && item != null) {
                        itemClone = toNonCircularObject(item, objectArray);
                        if (typeof itemClone !== "undefined") {
                            clone[key] = itemClone;
                        }
                    } else {
                        clone[key] = item;
                    }
                });
            }

            return clone;
        } else {
            return undefined;
        }
    };

    app.Serializer = function () {

    };

    app.Serializer.prototype.walk = function (obj, callback) {
        var self = this;

        Object.keys(obj).forEach(function (key) {
            var property = obj[key];

            if (property != null && typeof property === "object") {
                self.walk(property, callback);
            }
        });

        return callback(obj);
    };

    app.Serializer.prototype.clone = function (object) {
        var self = this;
        var clonedObject;
        var Type = Object;

        if (Array.isArray(object)) {
            clonedObject = [];
            object.forEach(function (item) {
                if (typeof item === "object" && item !== null) {
                    clonedObject.push(self.clone(item));
                } else {
                    clonedObject.push(item);
                }
            });
        } else {

            if (object["@class"]) {
                Type = BASE.getObject(object["@class"]) || Object;
            }

            clonedObject = new Type();
            for (var x in object) {
                if (typeof object[x] === "object" && object[x] !== null) {
                    clonedObject[x] = self.clone(object[x]);
                } else {
                    clonedObject[x] = object[x];
                }
            }

            if (object["@class"] === "app.Entity") {
                clonedObject.children.forEach(function (child) {
                    child.parent = clonedObject;
                });
            }
        }

        return clonedObject;
    };

    app.Serializer.prototype.getRequiredNamespaces = function (obj) {
        var namespaces = {};
        this.walk(obj, function (obj) {
            var klass = obj["@class"];

            if (typeof klass === "string") {
                namespaces[klass] = klass;
            }
        });
        return Object.keys(namespaces);
    };

    app.Serializer.prototype.loadAsync = function (obj) {
        var namespaces = this.getRequiredNamespaces(obj);
        var self = this;

        return BASE.require(namespaces).chain(function () {
            return self.clone(obj);
        });
    };

    app.Serializer.prototype.toJson = function (game) {
        var array = [game];
        return JSON.stringify(toNonCircularObject(game.stage, array));
    };

    app.Serializer.prototype.parseAsync = function (json) {
        var obj = JSON.parse(json);
        return this.loadAsync(obj);
    };

});