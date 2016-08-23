BASE.require([
    'jQuery',
    'BASE.web.Url',
    'BASE.web.components'
], function (elem, tags) {

    BASE.namespace("components.tester");
    var Url = BASE.web.Url;
    var baseComponents = BASE.web.components;

    components.tester.ComponentTester = function (elem, tags) {
        var self = this;
        var $elem = $(elem);

        var url = new Url(location.href);
        var component = url.getParsedQuery();
        var alias = component.alias;
        var content = component.content;
        delete component.alias;
        delete component.content;
        
        baseComponents.createComponentAsync(alias, content, component).then(function (element) {
            // This will allow for methods to be call via console.
            window.controller = $(element).controller();
            window.component = element;
            $elem.append(element);
        });
    };

});