BASE.require([
"jQuery",
"BASE.web.components"
], function () {
    BASE.namespace("components.ui.layouts");

    var Future = BASE.async.Future;
    var Observable = new BASE.util.Observable();

    $(window).on('resize', function () {
        Observable.notify({
            type: "resize"
        });
    });

    components.ui.layouts.UIPopup = function (elem, tags) {
        var self = this;

        var veilController = $(tags.veil).controller();
        var transitionController = $(tags.contentTransition).controller();

        $(tags.contentTransition).on('click', function (event) {
            event.stopPropagation();
        });

        var observer;

        self.show = function (transition) {
            if (!transition || (!typeof transition.name === "string")) {
                transition = {
                    name: "slideInTopCenter",
                    duration: 600,
                    easing: 'easeOutExpo'
                };
            }
            return new BASE.async.Future(function (setValue, setError) {
                new BASE.async.Task(
                    veilController.fadeIn({ duration: transition.duration, easing: transition.easing }),
                    transitionController[transition.name]({ duration: transition.duration, easing: transition.easing })
                ).start().whenAll(setValue);
            }).then(function () {
                observer = Observable.observeType("resize", function () {
                    var controller = $(self.content).controller();
                    if (typeof controller.onResize === "function") {
                        controller.onResize();
                    }
                });
            });
        };

        self.hide = function (transition) {
            if (!transition || (!typeof transition.name === "string")) {
                transition = {
                    name: "slideOutTopCenter",
                    duration: 600,
                    easing: 'easeOutExpo'
                };
            }
            return new BASE.async.Future(function (setValue, setError) {
                new BASE.async.Task(
                    veilController.fadeOut({ duration: transition.duration, easing: transition.easing }),
                    transitionController[transition.name]({ duration: transition.duration, easing: transition.easing })
                ).start().whenAll(setValue);
            }).then(function () {
                observer.dispose();
            });
        };

        self.content = $(elem).find('[popup-content]')[0];
        self.veil = tags['ui-popup-veil'];
    };
});