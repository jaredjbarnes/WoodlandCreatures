BASE.require([
    "jQuery",
    "BASE.async.Fulfillment"
], function () {

    BASE.namespace("app.components");

    var Fulfillment = BASE.async.Fulfillment;

    app.components.BrushSelector = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $closeButton = $(tags["close-button"]);
        var $container = $(tags["container"]);

        var brushSystem = null;
        var entities = [];
        var category = null;
        var fulfillment = new Fulfillment();

        var cacheAllEntities = function () {
            if (brushSystem != null) {
                entities = brushSystem.entities.filter(function (entity) {
                    return category == null || entity.category === category;
                });
            }
        };

        var getImageTexture = function (brush) {
            var entity = new brush.Type();
            return entity.getProperty("image-texture");
        };

        var createBrushImage = function (imageTexture) {
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var image = new Image();

            image.src = imageTexture.path;
            image.onload = function () {
                context.drawImage(image,
                    imageTexture.position.x,
                    imageTexture.position.y,
                    imageTexture.size.width,
                    imageTexture.size.height,
                    0,
                    0,
                    imageTexture.size.width,
                    imageTexture.size.height);
            };

            canvas.width = imageTexture.size.width;
            canvas.height = imageTexture.size.height;
            canvas.style.width = (canvas.width * 2) + "px";
            canvas.style.height = (canvas.height * 2) + "px";

            return canvas;
        };

        var createBrushSelector = function (brush) {
            var $div = $("<div></div>");
            var imageTexture = getImageTexture(brush);
            var image = createBrushImage(imageTexture);

            $div.css({
                float: "left",
                margin: "5px",
                overflow: "visible",
                borderRadius: "4px",
                backgroundColor: "#fff",
                padding: "5px",
                width: (imageTexture.size.width * 2) + "px",
                height: (imageTexture.size.height * 2) + "px",
            });

            $div.append(image).addClass("lifted-item");

            $div.attr("brush-name", brush.name);

            $div.on("click", function () {
                fulfillment.setValue(brush.name);
            });

            return $div;
        };

        var createBrushes = function () {
            $container.empty();
            entities.forEach(function (brush) {
                var $brush = createBrushSelector(brush);
                $container.append($brush);
            });
        };

        self.getBrushNameAsync = function () {
            fulfillment = new Fulfillment();
            return fulfillment;
        }

        self.initialize = function (newBrushSystem, newCategory) {
            brushSystem = newBrushSystem;
            category = newCategory;
            cacheAllEntities();
            createBrushes();
        };

        self.activated = function () {
            $container.children().removeClass("selected");
            $container.children("[brush-name='" + brushSystem.currentBrushName + "']").addClass("selected");
        };

        self.deactivate = function () { };

        $closeButton.on("click", function () {
            fulfillment.cancel();
        });
    };

});