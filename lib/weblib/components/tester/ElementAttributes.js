BASE.require([
    "jQuery"
], function (elem, tags) {

    BASE.namespace("components.tester");

    components.tester.ElementAttributes = function (elem, tags) {
        var self = this;
        var $elem = $(elem);

        var $addAttribute = $(tags["add-attribute"]);
        var $allAttributes = $(tags["all-attributes"]);
        var $template = $addAttribute.clone().removeAttr("tag");

        $addAttribute.find("[image='remove']").remove();

        var createAttribute = function () {
            var $attribute = $template.clone(true);
            $attribute.find("[image='remove']").on("click", function () {
                $attribute.remove();
            });
            $allAttributes.append($attribute);
            $attribute.find("input").first().focus();
            return $attribute;
        };

        self.getAttributes = function () {
            var attributes = {};
            var $attributes = $allAttributes.find("div");
            $attributes.each(function () {
                var $this = $(this);
                var $inputs = $this.find("input");
                var key = $inputs[0].value;
                var value = $inputs[1].value;

                if (key) {
                    attributes[key] = value;
                }
            });
            if ($attributes.length === 0) {
                attributes = null;
            }
            return attributes;
        };

        self.setAttributes = function (attributes) {
            var $attributes = $allAttributes.empty();

            Object.keys(attributes).forEach(function (key) {
                var $attr = createAttribute();
                var $inputs = $attr.find("input");
                $inputs[0].value = key;
                $inputs[1].value = attributes[key];
            });
        };

        $addAttribute.on("click", createAttribute);
    };


});