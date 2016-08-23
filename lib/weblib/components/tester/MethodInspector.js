BASE.require([], function () {
    BASE.namespace("components.tester");

    components.tester.MethodInspector = function (elem, tags) {
        var self = this;
        var $methodsContainer = $(tags['methods']);
        var getMetaData = function (method) {

        };

        $(window).on('componentLoaded', function () {
            $methodsContainer.empty();
            for (var m in controller) {
                if (typeof controller[m] == "function") {
                    var metaData = getMetaData();
                    $methodsContainer.append('<li><div ui-join class="input-block-level"><input placeholder="'+m+'" type="text"/><span ui-button class="add-on"><span ui-icon image="play"></span></span></div></li>');
                }
            }
            $methodsContainer.find('[ui-button]').on('click', function () {
                console.log(controller[$(this).prev().attr('placeholder')].apply(controller, eval($(this).prev().val())));
            });
        });
        

       /* var $methodName = $(tags["methodName"]);
        var $parametersContainer = $(tags["parameter-container"]);
        var $parameters = $(tags["parameters"]);
        var $description = $(tags["description"]);

        var parameterComponentUrl = "?";

        var addParameter = function () {
            return new Future(function (setValue, setError) {
                BASE.web.component.createComponent(parameterComponentUrl).then(function (element) {
                    setValue(element);
                });
            });
        };

        self.setMethodProperties = function (properties) {
            $description.text(properties.description);
        };

        self.setMethodName = function (name) {
            $methodName.text(name);
        };*/
    };
});