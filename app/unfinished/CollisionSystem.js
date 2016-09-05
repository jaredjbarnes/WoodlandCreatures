BASE.require([
    "app.components.Collision",
    "app.components.Transform"
], function () {
    BASE.namespace("app.systems");

    var Transform = app.properties.Transform;
    var Collision = app.properties.Collision;

    var isCollision = function (entity) {
        return entity.hasComponentByType(Collision) && entity.hasComponentByType(Transform);
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
        this.entities = this.game.rootEntity.filter(isCollision);
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
        var collisionA;
        var collisionB;

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
                        collisionA = entityA.getPropertyByType(Collision);
                        collisionB = entityB.getPropertyByType(Collision);
                        if (collisionA.isStatic && collisionB.isStatic) {
                            continue;
                        }

                        // create a unique key to mark this pair.
                        // use both combinations to ensure linear time
                        hashA = entityA.id + "|" + entityB.id;
                        hashB = entityB.id + "|" + entityA.id;

                        if (!checked[hashA] && !checked[hashB]) {

                            // mark this pair as checked
                            checked[hashA] = checked[hashB] = true;

                            if (collisionA.enabled && collisionB.enabled && this.intersects(entityA, entityB)) {
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
        var rect = entity.getPropertyByType(Transform);

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

    app.systems.CollisionSystem.prototype.executeBroadphase = function () {
        this.updateWorldSize();
        this.sweepAndPrune();
    };

    app.systems.CollisionSystem.prototype.update = function () {
        this.executeBroadphase();
        var pairs = this.queryForCollisions();
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