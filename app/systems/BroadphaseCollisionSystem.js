BASE.require([
    "BASE.collections.Hashmap",
], function () {
    BASE.namespace("app.systems");

    var Hashmap = BASE.collections.Hashmap;

    var isCollision = function (entity) {
        return entity.hasProperties(["collidable", "position", "size"]);
    };

    var BroadphaseCollision = function () {
        this.startTimestamp = null;
        this.endTimestamp = null;
        this.timestamp = null;
        this.entityId = null;
    };

    var BroadPhaseEntity = function () {
        this.entityId = null;
        this.collidable = null;
        this.position = null;
        this.size = null;
    };

    var emptyFn = function () { };
    var emptyArray = [];

    app.systems.BroadPhaseCollisionSystem = function (cellSize) {
        this.game = null;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.grid = [[]];
        this.broadPhaseEntities = [];
        this.entityToBroadPhase = new Hashmap();
        this.broadPhaseToEntity = new Hashmap();
        this.cellSize = cellSize || 50;
        this.totalCells = 0;
        this.currentTimestamp = 0;
        this.isReady = true;
        this.stagePosition = null;
        this.stageSize = null;
    };

    app.systems.BroadPhaseCollisionSystem.prototype.sweepAndPrune = function () {
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
        var broadPhaseEntities = this.broadPhaseEntities;

        // the total number of cells this grid will contain
        this.totalCells = gridWidth * gridHeight;

        // construct grid
        // NOTE: this is a purposeful use of the Array() constructor 
        this.grid = Array(gridWidth);

        // insert all entities into grid
        for (i = 0; i < broadPhaseEntities.length; i++) {
            entity = broadPhaseEntities[i];
            size = entity.size;
            position = entity.position;

            // if entity is outside the grid extents, then ignore it
            //if (
            //	position.x < this.x || position.x + size.width > this.x + this.width
            //|| position.y < this.y || position.y + size.height > this.y + this.height
            //) {
            //    continue;
            //}

            // Find the cells that the entity overlaps.
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

    app.systems.BroadPhaseCollisionSystem.prototype.queryForCollisions = function () {
        var pairs = [];
        var broadPhaseA;
        var broadPhaseB;
        var hash;
        var i;
        var j;
        var k;
        var l;
        var gridCol;
        var gridCell;
        var collidableA;
        var collidableB;
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

                    broadPhaseA = gridCell[k];

                    // for every other object in a cell...
                    for (l = k + 1; l < gridCell.length; l++) {
                        broadPhaseB = gridCell[l];

                        collidableA = broadPhaseA.collidable;
                        collidableB = broadPhaseB.collidable;

                        // We don't need to check static or disabled objects to other static objects.
                        if ((collidableA.isStatic && collidableB.isStatic) || !collidableA.enabled || !collidableB.enabled) {
                            continue;
                        }

                        positionA = broadPhaseA.position;
                        sizeA = broadPhaseA.size;

                        positionB = broadPhaseB.position;
                        sizeB = broadPhaseB.size;

                        if (this.intersects(positionA, sizeA, positionB, sizeB)) {
                            pairs.push([broadPhaseA, broadPhaseB]);
                        }
                    }
                }
            }
        }

        return pairs;
    };

    app.systems.BroadPhaseCollisionSystem.prototype.intersects = function (positionA, sizeA, positionB, sizeB) {
        var top = Math.max(positionA.y, positionB.y);
        var bottom = Math.min(positionA.y + sizeA.height, positionB.y + sizeB.height);
        var left = Math.max(positionA.x, positionB.x);
        var right = Math.min(positionA.x + sizeA.width, positionB.x + sizeB.width);

        return top <= bottom && left <= right;
    };

    app.systems.BroadPhaseCollisionSystem.prototype.updateWorldSize = function () {
        var entity = this.game.stage;
        var position = this.stagePosition;
        var size = this.stageSize;

        if (position == null || size == null) {
            return;
        }

        this.y = position.y;
        this.x = position.x;
        this.height = size.height;
        this.width = size.width;
    };

    app.systems.BroadPhaseCollisionSystem.prototype.invokeMethod = function (obj, methodName, args) {
        args = args || [];
        if (typeof obj[methodName] === "function") {
            return obj[methodName].apply(obj, args);
        }
    };

    app.systems.BroadPhaseCollisionSystem.prototype.handleCollisionEnds = function () {
        var entities = this.broadPhaseEntities;
        var length = entities.length;
        var entity;
        var collisions;
        var collision;
        var keys;
        var key;
        var keysLength;

        for (var x = 0 ; x < length ; x++) {
            entity = entities[x];
            collisions = entity.collidable.activeCollisions;
            keys = Object.keys(collisions);
            keysLength = keys.length;

            for (var y = 0; y < keysLength; y++) {
                key = keys[y];
                collision = collisions[key];

                // We know the collision ended if the timestamp didn't update.
                if (collision.timestamp !== this.currentTimestamp) {
                    collision.endTimestamp = this.currentTimestamp;

                    // Allow for some time to pass, before removing, because its likely they'll hit again.
                    if (this.currentTimestamp - collision.timestamp > 3000) {
                        delete collisions[key];
                    }
                }
            }
        }
    };

    app.systems.BroadPhaseCollisionSystem.prototype.executeBroadphase = function () {
        this.updateWorldSize();
        this.sweepAndPrune();
    };

    app.systems.BroadPhaseCollisionSystem.prototype.assignTimeStamp = function (pairs) {
        var pair;
        var broadPhaseA;
        var broadPhaseB;
        var collisionDataA;
        var collisionDataB;
        var activeCollisionsA;
        var activeCollisionsB;

        for (var x = 0; x < pairs.length; x++) {
            pair = pairs[x];
            broadPhaseA = pair[0];
            broadPhaseB = pair[1];

            activeCollisionsA = broadPhaseA.collidable.activeCollisions;
            activeCollisionsB = broadPhaseB.collidable.activeCollisions;
            collisionDataA = activeCollisionsA[broadPhaseB.entityId];
            collisionDataB = activeCollisionsB[broadPhaseA.entityId];

            if (collisionDataA == null) {

                collisionDataA = activeCollisionsA[broadPhaseB.entityId] = new BroadphaseCollision();
                collisionDataA.startTimestamp = this.currentTimestamp;
                collisionDataA.timestamp = this.currentTimestamp;
                collisionDataA.endTimestamp = null;
                collisionDataA.entity = this.broadPhaseToEntity.get(broadPhaseB);

            } else {
                collisionDataA.timestamp = this.currentTimestamp;
                collisionDataA.endTimestamp = null;
            }

            if (collisionDataB == null) {
                collisionDataB = activeCollisionsB[broadPhaseA.entityId] = new BroadphaseCollision();
                collisionDataB.startTimestamp = this.currentTimestamp;
                collisionDataB.timestamp = this.currentTimestamp;
                collisionDataB.endTimestamp = null;
                collisionDataB.entity = this.broadPhaseToEntity.get(broadPhaseA);

            } else {
                collisionDataB.timestamp = this.currentTimestamp;
                collisionDataB.endTimestamp = null;
            }

        }

    };

    app.systems.BroadPhaseCollisionSystem.prototype.update = function () {
        this.currentTimestamp = this.game.timer.now();
        this.executeBroadphase();
        var pairs = this.queryForCollisions();
        this.assignTimeStamp(pairs);
        this.handleCollisionEnds();
    };

    app.systems.BroadPhaseCollisionSystem.prototype.entityAdded = function (entity) {
        if (entity.hasProperties(["position", "size", "collidable"])) {
            var broadPhaseEntity = new BroadPhaseEntity();
            broadPhaseEntity.position = entity.properties["position"][0];
            broadPhaseEntity.size = entity.properties["size"][0];
            broadPhaseEntity.collidable = entity.properties["collidable"][0];
            broadPhaseEntity.entityId = entity.id;

            this.entityToBroadPhase.add(entity, broadPhaseEntity);
            this.broadPhaseToEntity.add(broadPhaseEntity, entity);
            this.broadPhaseEntities.push(broadPhaseEntity);
        }
    };

    app.systems.BroadPhaseCollisionSystem.prototype.entityRemoved = function (entity) {
        var broadPhaseEntity = this.entityToBroadPhase.remove(entity);
        var index = this.broadPhaseEntities.indexOf(broadPhaseEntity);

        this.broadPhaseToEntity.remove(broadPhaseEntity);

        if (index > -1) {
            this.broadPhaseEntities.splice(index, 1);
        }
    };

    app.systems.BroadPhaseCollisionSystem.prototype.activated = function (game) {
        var self = this;
        this.game = game;
        this.stagePosition = game.stage.getProperty("position");
        this.stageSize = game.stage.getProperty("size");

        game.stage.filter().forEach(function (entity) {
            self.entityAdded(entity);
        });

        this.updateWorldSize();
    };

    app.systems.BroadPhaseCollisionSystem.prototype.deactivated = function () {
        this.game = null;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.grid = [[]];
        this.broadPhaseEntities = [];
        this.entityToBroadPhase = new Hashmap();
        this.broadPhaseToEntity = new Hashmap();
        this.cellSize = cellSize || 50;
        this.totalCells = 0;
        this.currentTimestamp = 0;
        this.isReady = true;
        this.stagePosition = null;
        this.stageSize = null;
    };
});