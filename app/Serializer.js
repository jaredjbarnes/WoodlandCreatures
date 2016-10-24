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

    app.Serializer.prototype.load = function (obj) {

    };

    app.Serializer.prototype.toJson = function (stage) {
        return JSON.stringify(toNonCircularObject(stage));
    };

    app.Serializer.prototype.parse = function (json) {

    };

});