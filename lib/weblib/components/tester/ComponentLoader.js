BASE.require([
    "jQuery",
    "Element.prototype.empty"
], function (elem, tags) {

    BASE.namespace("components.tester");

    components.tester.ComponentLoader = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var container = tags['component-container'];

        self.loadComponent = function (uri, html, attributes) {
            container.empty();
            attributes = attributes || {};
            var div = document.createElement("div");
            div.innerHTML = html;

            for (var i in attributes) {
                div.setAttribute(i, attributes[i]);
            }
            container.appendChild(div);
            var replaceFuture = BASE.web.components.replaceElementWith(div, uri).then(function (componentElement) {
                $(componentElement).find("[component]").triggerHandler("enteredView");
                $(componentElement).triggerHandler("enteredView");
                $elem.trigger("loaded", { component: componentElement, controller: $(componentElement).data("controller") });
            });
            return replaceFuture;
        };

        self.loadComponent.metaData = {
            wiki: "/libcdn/wiki/",
            arguments: {
                uri: "",

            }
        };
    };


});