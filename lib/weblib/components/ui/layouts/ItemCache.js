BASE.require([
    "Array.prototype.asQueryable",
    "BASE.async.Future",
    "Array.prototype.orderBy"
], function () {

    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var delayAsync = BASE.async.delayAsync;
    var emptyFuture = Future.fromResult();

    BASE.namespace("components.ui.layouts");

    var QueryableRange = function (queryable, start, end) {
        this.queryable = queryable;
        this.start = start >= 0 ? start : 0;
        this.end = end;
        this.future = null;
    };

    QueryableRange.prototype.toArray = function () {
        if (this.future == null) {
            return this.future = this.queryable.skip(this.start).take(this.end - this.start).toArray();
        } else {
            return this.future;
        }
    };

    QueryableRange.prototype.getItemByIndexAsync = function (index) {
        if (index < this.start || index >= this.end) {
            throw new Error("Index isn't within the range for this queryable. Index: " + index + ", range: (" + this.start + "," + (this.end) + ")");
        }
        var start = this.start;
        var end = this.end;
        return this.toArray().chain(function (array) {
            var offsetIndex = index - start;
            return array[offsetIndex] || Future.fromCanceled("Out of Range.");
        });
    };

    QueryableRange.prototype.isWithinRange = function (index) {
        return index < this.end && index >= this.start;

    };

    var ItemCache = function (queryable, spread) {
        var self = this;

        this.queryable = queryable;
        this.spread = spread || 100;
        this.ranges = [];
        this.maxRangesLength = 20;
    };

    ItemCache.prototype.clear = function () {
        this.ranges = [];
    };

    ItemCache.prototype.manageCache = function () {
        var range;
        if (this.ranges.length > this.maxRangesLength) {
            while (this.ranges.length >= this.maxRangesLength / 2) {
                range = this.ranges.shift();
                range.future.cancel();
            }
        }
    };

    ItemCache.prototype.getItemByIndexAsync = function (index) {
        this.manageCache();

        var range = this.ranges.filter(function (range) {
            return range.isWithinRange(index);
        })[0];

        if (range == null) {
            var start = index - this.spread;

            start = this.ranges.reduce(function (start, range) {
                if (start >= range.start && start < range.end) {
                    return range.end;
                }

                return start;
            }, start);

            start = start >= 0 ? start : 0;

            var end = this.ranges.reduce(function (end, range) {
                if (end >= range.start && end < range.end) {
                    return range.start;
                }
                return end;
            }, start + this.spread);

            if (index === end) {
                end++;
            }

            range = new QueryableRange(this.queryable, start, end);
            this.ranges.push(range);

        }

        return range.getItemByIndexAsync(index);

    };

    components.ui.layouts.ItemCache = ItemCache;

});