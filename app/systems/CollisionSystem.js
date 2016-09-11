BASE.require([
    "app.properties.Collision",
    "app.properties.Transform"
], function () {
    BASE.namespace("app.systems");

    var Transform = app.properties.Transform;
    var Collision = app.properties.Collision;

    var isCollision = function (entity) {
        return entity.hasProperties(["collision", "position", "size"]);
    };

    var emptyFn = function () { };
    var emptyArray = [];

    //TODO: For large maps we could use a enabled cells to optimize collision detection.
    app.systems.CollisionSystem = function (cellSize) {
        this.game = null;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.grid = [[]];
        this.entities = [];
        this.cellSize = cellSize || 50;
        this.totalCells = 0;
        this.currentTimestamp = 0;
        this.isReady = true;
    };

    app.systems.CollisionSystem.prototype.sweepAndPrune = function () {
        var gridWidth = Math.floor((this.height) / this.cellSize);
        var gridHeight = Math.floor((this.width) / this.cellSize);
        var left;
        var right;
        var top;
        var bottom;
        var i;
        var j;
        var entity;
        var cX;
        var cY;
        var gridCol;
        var gridCell;
        var size;
        var position;

        // the total number of cells this grid will contain
        this.totalCells = gridWidth * gridHeight;

        // construct grid
        // NOTE: this is a purposeful use of the Array() constructor 
        this.grid = Array(gridWidth);

        // insert all entities into grid
        for (i = 0; i < this.entities.length; i++) {
            entity = this.entities[i];
            size = entity.properties["size"][0];
            position = entity.properties["position"][0];

            // if entity is outside the grid extents, then ignore it
            if (
				position.x < this.x || position.x + size.width > this.x + this.width
            || position.y < this.y || position.y + size.height > this.y + this.height
			) {
                continue;
            }

            // Find the cells that the entity overlap.
            left = Math.floor((position.x - this.x) / this.cellSize);
            right = Math.floor((position.x + size.width - this.x) / this.cellSize);
            top = Math.floor((position.y - this.y) / this.cellSize);
            bottom = Math.floor((position.y + size.height - this.y) / this.cellSize);

            // Insert entity into each cell it overlaps
            for (cX = left; cX <= right; cX++) {

                // Make sure a column exists, initialize if not to grid height length
                // NOTE: again, a purposeful use of the Array constructor 
                if (!this.grid[cX]) { this.grid[cX] = Array(gridHeight); }

                gridCol = this.grid[cX];

                // Loop through each cell in this column
                for (cY = top; cY <= bottom; cY++) {

                    // Ensure we have a bucket to put entities into for this cell
                    if (!gridCol[cY]) {
                        gridCol[cY] = [];
                    }

                    gridCell = gridCol[cY];

                    // Add entity to cell
                    gridCell.push(entity);
                }
            }
        }
    };

    app.systems.CollisionSystem.prototype.queryForCollisions = function () {
        var pairs = [];
        var entityA;
        var entityB;
        var hash;
        var i;
        var j;
        var k;
        var l;
        var gridCol;
        var gridCell;
        var collisionA;
        var collisionB;
        var sizeA;
        var positionA;
        var sizeB;
        var positionB;
        var top;
        var bottom;
        var left;
        var right;
        var collisionIndex;

        // for every column in the grid...
        for (i = 0; i < this.grid.length; i++) {

            gridCol = this.grid[i];

            // ignore columns that have no cells
            if (!gridCol) { continue; }

            // for every cell within a column of the grid...
            for (j = 0; j < gridCol.length; j++) {

                gridCell = gridCol[j];

                // ignore cells that have no objects
                if (!gridCell) { continue; }

                // for every object in a cell...
                for (k = 0; k < gridCell.length; k++) {

                    entityA = gridCell[k];

                    // for every other object in a cell...
                    for (l = k + 1; l < gridCell.length; l++) {
                        entityB = gridCell[l];

                        collisionA = entityA.properties["collision"][0];
                        collisionB = entityB.properties["collision"][0];

                        // We don't need to check static objects to other static objects.
                        if (collisionA.isStatic && collisionB.isStatic) {
                            continue;
                        }

                        positionA = entityA.properties["position"][0];
                        sizeA = entityA.properties["size"][0];

                        positionB = entityB.properties["position"][0];
                        sizeB = entityB.properties["size"][0];

                        if (collisionA.enabled && collisionB.enabled && this.intersects(positionA, sizeA, positionB, sizeB)) {
                            pairs.push([entityA, entityB]);
                        }
                    }
                }
            }
        }

        return pairs;
    };

    app.systems.CollisionSystem.prototype.intersects = function (positionA, sizeA, positionB, sizeB) {
        var top = Math.max(positionA.y, positionB.y);
        var bottom = Math.min(positionA.y + sizeA.height, positionB.y + sizeB.height);
        var left = Math.max(positionA.x, positionB.x);
        var right = Math.min(positionA.x + sizeA.width, positionB.x + sizeB.width);

        return top < bottom && left < right;
    };

    app.systems.CollisionSystem.prototype.updateWorldSize = function () {
        var entity = this.game.rootEntity;
        var position = entity.getProperty("position");
        var size = entity.getProperty("size");

        if (position == null || size == null) {
            return;
        }

        this.y = position.y;
        this.x = position.x;
        this.height = size.height;
        this.width = size.width;
    };

    app.systems.CollisionSystem.prototype.invokeMethod = function (obj, methodName, args) {
        args = args || [];
        if (typeof obj[methodName] === "function") {
            return obj[methodName].apply(obj, args);
        }
    };

    app.systems.CollisionSystem.prototype.invokeCollisionHandlers = function (entityA, entityB, handlerName) {
        var collisionHandler;

        var collisionHandlers = entityA.components["collision-handler"];

        if (collisionHandlers == null) {
            return;
        }

        var collision = entityB.properties["collision"][0];
        var length = collisionHandlers.length;

        for (var x = 0 ; x < length; x++) {
            collisionHandler = collisionHandlers[x];

            if (!collisionHandler.isInitialized && typeof collisionHandler.initialize === "function") {
                collisionHandler.initialize(entityA);
                collisionHandler.isInitialized = true;
            }

            if ((collisionHandler.name == null || collisionHandler.name === collision.name) &&
                typeof collisionHandler[handlerName] === "function") {
                collisionHandler[handlerName](entityB);
            }
        }

    };


    app.systems.CollisionSystem.prototype.handleCollisionHandlers = function () {
        var entities = this.entities;
        var length = entities.length;
        var entity;
        var collisions;
        var collision;
        var keys;
        var key;
        var keysLength;

        for (var x = 0 ; x < length ; x++) {
            entity = entities[x];
            collisions = entity.properties["collision"][0].activeCollisions;
            keys = Object.keys(collisions);
            keysLength = keys.length;

            for (var y = 0; y < keysLength; y++) {
                key = keys[y];
                collision = collisions[key];

                // CollisionStartHandlers
                if (collision.timestamp === collision.startTimestamp && collision.timestamp === this.currentTimestamp) {
                    this.invokeCollisionHandlers(entity, collision.entity, "collisionStart");
                }

                // CollisionActiveHandlers
                if (collision.timestamp === this.currentTimestamp) {
                    this.invokeCollisionHandlers(entity, collision.entity, "collisionActive");
                }

                // CollisionEndHandlers
                if (collision.timestamp !== this.currentTimestamp) {
                    this.invokeCollisionHandlers(entity, collision.entity, "collisionEnd");

                    // Allow for some time to pass, before removing, because its likely they'll hit again.
                    if (this.currentTimestamp - collision.timestamp > 3000) {
                        delete collisions[key];
                    }
                }
            }
        }
    };

    app.systems.CollisionSystem.prototype.executeBroadphase = function () {
        this.updateWorldSize();
        this.sweepAndPrune();
    };

    app.systems.CollisionSystem.prototype.assignTimeStamp = function (pairs) {
        var pair;
        var entityA;
        var entityB;
        var collisionDataA;
        var collisionDataB;

        for (var x = 0; x < pairs.length; x++) {
            pair = pairs[x];
            entityA = pair[0];
            entityB = pair[1];

            collisionDataA = entityA.properties["collision"][0].activeCollisions[entityB.id];
            collisionDataB = entityB.properties["collision"][0].activeCollisions[entityA.id];

            if (collisionDataA == null) {
                collisionDataA = entityA.properties["collision"][0].activeCollisions[entityB.id] = {
                    startTimestamp: this.currentTimestamp
                };
            }

            if (collisionDataB == null) {
                collisionDataB = entityB.properties["collision"][0].activeCollisions[entityA.id] = {
                    startTimestamp: this.currentTimestamp
                };
            }

            collisionDataA.timestamp = this.currentTimestamp;
            collisionDataA.startTimestamp = this.currentTimestamp;
            collisionDataA.entity = entityB;

            collisionDataB.timestamp = this.currentTimestamp;
            collisionDataB.startTimestamp = this.currentTimestamp;
            collisionDataB.entity = entityA;

        }

    };

    app.systems.CollisionSystem.prototype.update = function () {
        this.currentTimestamp = this.game.timer.now();
        this.executeBroadphase();

        var pairs = this.queryForCollisions();
        this.assignTimeStamp(pairs);
        this.handleCollisionHandlers();
    };

    app.systems.CollisionSystem.prototype.activated = function (game) {
        this.game = game;
        this.entities = game.rootEntity.filter(isCollision);
        this.updateWorldSize();
    };

    app.systems.CollisionSystem.prototype.deactivated = function () {
        this.game = null;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.grid = [[]];
        this.entities = [];
        this.totalCells = 0;
    };
});