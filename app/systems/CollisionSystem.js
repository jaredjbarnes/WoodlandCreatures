BASE.require([
    "app.components.Collidable",
    "app.components.Transform"
], function () {
    BASE.namespace("app.systems");

    var Transform = app.components.Transform;
    var Collidable = app.components.Collidable;

    var isCollidable = function (entity) {
        return entity.hasComponentByType(Collidable) && entity.hasComponentByType(Transform);
    };

    var emptyFn = function () { };


    //TODO: For large maps we could use a enabled cells to optimize collision detection.
    app.systems.CollisionSystem = function (cellSize) {
        this.game = null;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.left = 0;
        this.grid = [[]];
        this.entities = [];
        this.handlers = {};
        this.cellSize = cellSize || 100;
        this.totalCells = 0;
        this.lastCollisionsMap = {};
        this.isReady = true;
    };

    app.systems.CollisionSystem.prototype.cacheEntities = function () {
        this.entities = this.game.rootEntity.filter(isCollidable);
    };

    app.systems.CollisionSystem.prototype.registerHandlers = function (entityType1, entityType2, handlers) {
        var key1 = entityType1 + "|" + entityType2;
        var key2 = entityType2 + "|" + entityType1;

        // Iterate through the events and reverse the arguments.
        var reverseHandlers = Object.keys(handlers).reduce(function (obj, key) {
            obj[key] = function (entityA, entityB) {
                return handlers[key].call(obj, entityB, entityA);
            };
            return obj;
        }, {});

        this.handlers[key1] = handlers;
        this.handlers[key2] = reverseHandlers;
    };

    app.systems.CollisionSystem.prototype.getHandlerByEntities = function (entityA, entityB) {
        return this.handlers[entityA.type + "|" + entityB.type] || emptyFn;
    };

    app.systems.CollisionSystem.prototype.sweepAndPrune = function () {

        var gridWidth = Math.floor((this.max.x - this.min.x) / this.cellSize);
        var gridHeight = Math.floor((this.max.y - this.min.y) / this.cellSize);
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
        var rect;

        // the total number of cells this grid will contain
        this.totalCells = gridWidth * gridHeight;

        // construct grid
        // NOTE: this is a purposeful use of the Array() constructor 
        this.grid = Array(gridWidth);

        // insert all entities into grid
        for (i = 0; i < this.entities.length; i++) {
            entity = this.entities[i];
            rect = entity.getComponentByType(Transform);

            // if entity is outside the grid extents, then ignore it
            if (
				rect.left < this.left || rect.right > this.right
				|| rect.top < this.top || rect.bottom > this.bottom
			) {
                continue;
            }

            // Find the cells that the entity overlap.
            left = Math.floor((rect.left - this.left) / this.cellSize);
            right = Math.floor((rect.right - this.left) / this.cellSize);
            top = Math.floor((rect.top - this.top) / this.cellSize);
            bottom = Math.floor((rect.bottom - this.top) / this.cellSize);

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
        var checked = {};
        var pairs = [];
        var entityA;
        var entityB;
        var hashA;
        var hashB;
        var i;
        var j;
        var k;
        var l;
        var gridCol;
        var gridCell;
        var collidableA;
        var collidableB;

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

                        // We don't need to check static objects to other static objects.
                        collidableA = entityA.getComponentByType(Collidable);
                        collidableB = entityB.getComponentByType(Collidable);
                        if (collidableA.isStatic && collidableB.isStatic) {
                            continue;
                        }

                        // create a unique key to mark this pair.
                        // use both combinations to ensure linear time
                        hashA = entityA.id + "|" + entityB.id;
                        hashB = entityB.id + "|" + entityA.id;

                        if (!checked[hashA] && !checked[hashB]) {

                            // mark this pair as checked
                            checked[hashA] = checked[hashB] = true;

                            if (collidableA.enabled && collidableB.enabled && this.intersects(entityA, entityB)) {
                                pairs.push([entityA, entityB]);
                            }
                        }
                    }
                }
            }
        }

        return pairs;
    };

    app.systems.CollisionSystem.prototype.intersects = function (entityA, entityB) {
        var top = Math.max(entityA.top, entityB.top);
        var bottom = Math.min(entityA.bottom, entityB.bottom);
        var left = Math.max(entityA.left, entityB.left);
        var right = Math.min(entityA.right, entityB.right);

        return top < bottom && left < right;
    };

    app.systems.CollisionSystem.prototype.updateWorldSize = function () {
        var entity = this.game.rootEntity;
        var rect = entity.getComponentByType(Transform);

        this.top = rect.top;
        this.right = rect.right;
        this.bottom = rect.bottom;
        this.left = rect.bottom;
    };

    app.systems.CollisionSystem.prototype.invokeMethod = function (obj, methodName, args) {
        args = args || [];
        if (typeof obj[methodName] === "function") {
            return obj[methodName].apply(obj, args);
        }
    };

    app.systems.CollisionSystem.prototype.handleCollision = function (pair, currentCollisionsMap) {
        var entityA = pair[0];
        var entityB = pair[1];
        var key1 = entityA.id + "|" + entityB.id;
        var key2 = entityB.id + "|" + entityA.id;
        var handlers = this.getHandlersByEntities(entityA, entityB);

        // New collision.
        if (!this.lastCollisionsMap[key1] && !this.lastCollisionsMap[key2]) {
            this.invokeMethod(obj, "collisionStart", pair);
        }

        this.invokeMethod(obj, "collision", pair);

        currentCollisionsMap[key1] = {
            pair: pair,
            otherKey: key2
        };

        currentCollisionsMap[key2] = {
            pair: pair,
            otherKey: key1
        };
    };

    app.systems.CollisionSystem.prototype.executeBroadphase = function () {
        this.updateWorldSize();
        this.sweepAndPrune();
    };

    app.systems.CollisionSystem.prototype.findApplicablePoints = function (entityA, entityB) {
        var rectA  = entityA.getComponentByType(Transform);
        var rectB  = entityB.getComponentByType(Transform);
    };

    app.systems.CollisionSystem.prototype.getNormals = function (collidable) {
        
    };

    app.systems.CollisionSystem.prototype.getPenetration = function (pair) {
        var entityA = pair[0];
        var entityB = pair[1];

        var collidableA = entityA.getComponentByType(Collidable);
        var collidableB = entityB.getComponentByType(Collidable);


    };

    app.systems.CollisionSystem.prototype.handleCollisions = function (pairs) {
        var pair = null;
        var currentCollisionsMap = {};

        // Handles collisionStart, and collision
        for (var x = 0 ; x < pairs.length; x++) {
            pair = pairs[x];
            this.handleCollision(pair, currentCollisionsMap);
        }

        // Handles collisionEnd
        var key = null;
        var lastCollisionsMap = this.lastCollisionsMap;
        var lastMapKeys = Object.keys(lastCollisionsMap);
        var collision = null;
        var handlerCalledMap = {};

        for (var x = 0 ; x < lastMapKeys; x++) {
            key = lastCollisionsMap[x];
            collision = currentCollisionsMap[key];

            if (!handlerCalledMap[key] && !collision) {

                handlerCalledMap[collision.otherKey] = true;
                handlerCalledMap[key] = true;
                handlers = this.getHandlersByEntities(pair[0], pair[1]);

                this.invokeMethod(handlers, "collisionEnd", pair);
            }
        }

        this.lastCollisionsMap = currentCollisionsMap;
    };

    app.systems.CollisionSystem.prototype.update = function () {
        this.executeBroadphase();

        var pairs = this.queryForCollisions();

        this.handleCollisions(pairs);
    };

    app.systems.CollisionSystem.prototype.activated = function (game) {
        this.game = game;
        this.cacheEntities();
        this.updateWorldSize();
    };

    app.systems.CollisionSystem.prototype.deactivated = function () {
        this.game = null;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.left = 0;
        this.grid = [[]];
        this.entities = [];
        this.handlers = {};
        this.totalCells = 0;
        this.lastCollisionsMap = {};
    };
});