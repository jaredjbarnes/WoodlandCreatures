BASE.require([
    "app.properties.Collision",
    "app.properties.Transform"
], function () {
    BASE.namespace("app.systems");

    var Transform = app.properties.Transform;
    var Collision = app.properties.Collision;

    var isCollision = function (entity) {
        var collisionProperties = entity.properties["app.properties.Collision"];
        var transformProperties = entity.properties["app.properties.Transform"];
        return collisionProperties &&
            collisionProperties[0] &&
            transformProperties &&
            transformProperties[0]
    };

    var emptyFn = function () { };

    //TODO: For large maps we could use a enabled cells to optimize collision detection.
    app.systems.CollisionSystem = function (cellSize) {
        this.game = null;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.grid = [[]];
        this.entities = [];
        this.handlers = {};
        this.cellSize = cellSize || 50;
        this.totalCells = 0;
        this.lastCollisionsMap = {};
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
        var rect;

        // the total number of cells this grid will contain
        this.totalCells = gridWidth * gridHeight;

        // construct grid
        // NOTE: this is a purposeful use of the Array() constructor 
        this.grid = Array(gridWidth);

        // insert all entities into grid
        for (i = 0; i < this.entities.length; i++) {
            entity = this.entities[i];
            rect = entity.properties["app.properties.Transform"][0];

            // if entity is outside the grid extents, then ignore it
            if (
				rect.x < this.x || rect.x + rect.width > this.x + this.width
            || rect.y < this.y || rect.y + rect.height > this.y + this.height
			) {
                continue;
            }

            // Find the cells that the entity overlap.
            left = Math.floor((rect.x - this.x) / this.cellSize);
            right = Math.floor((rect.x + rect.width - this.x) / this.cellSize);
            top = Math.floor((rect.y - this.y) / this.cellSize);
            bottom = Math.floor((rect.y + rect.height - this.y) / this.cellSize);

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
        var transformA;
        var transformB;

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

                        collisionA = entityA.properties["app.properties.Collision"][0];
                        collisionB = entityB.properties["app.properties.Collision"][0];


                        // We don't need to check static objects to other static objects.
                        if (collisionA.isStatic && collisionB.isStatic) {
                            continue;
                        }

                        transformA = entityA.properties["app.properties.Transform"][0];
                        transformB = entityB.properties["app.properties.Transform"][0];

                        if (collisionA.enabled && collisionB.enabled && this.intersects(transformA, transformB)) {
                            pairs.push([entityA, entityB]);
                        }
                    }
                }
            }
        }

        return pairs;
    };

    app.systems.CollisionSystem.prototype.intersects = function (collisionA, collisionB) {
        var top = Math.max(collisionA.y, collisionB.y);
        var bottom = Math.min(collisionA.y + collisionA.height, collisionB.y + collisionB.height);
        var left = Math.max(collisionA.x, collisionB.x);
        var right = Math.min(collisionA.x + collisionA.width, collisionB.x + collisionB.width);

        return top < bottom && left < right;
    };

    app.systems.CollisionSystem.prototype.updateWorldSize = function () {
        var entity = this.game.rootEntity;
        var rect = entity.properties["app.properties.Transform"][0];

        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
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
        this.handlers = {};
        this.totalCells = 0;
        this.lastCollisionsMap = {};
    };
});