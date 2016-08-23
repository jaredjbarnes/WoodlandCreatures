BASE.require([
    "jQuery",
    "BASE.async.Future",
    "BASE.web.isCORSEnabled",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.ElementPathAnimation",
    "BASE.web.animation.PercentageTimeline",
    "BASE.async.delay"
], function () {
    BASE.namespace("components.leavitt");

    var Future = BASE.async.Future;
    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var ElementPathAnimation = BASE.web.animation.ElementPathAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;

    components.leavitt.LeavittProfileImage = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var apiUri = BASE.web.isCORSEnabled() ? "https://api.leavitt.com/" : "/webapi/";
        var imageElement = tags["leavitt-profile-image"];
        var $image = $(imageElement);
        var loadedPersonId = 0;
        var backgrondColor = $elem.attr('background-color') || '#ccc'; 

        var personToImageSourceHash = {};
        personToImageSourceHash[0] = "https://libcdn.leavitt.com/libcdn/images/no-profile-image.png"; //Default image

        var travelUpAnimation = new ElementPathAnimation({
            target: imageElement,
            easing: "easeInQuad",
            unit: "%",
            from: {
                x: -150,
                y: 150
            },
            to: {
                x: 0,
                y: 0
            },
            controls: [
                {
                    x: 0,
                    y: 150
                }
            ],
            duration: 0
        });

        var scaleDownAnimation = new ElementAnimation({
            target: imageElement,
            properties: {
                scaleX: {
                    from: 0.3,
                    to: 0.3
                },
                scaleY: {
                    from: 0.3,
                    to: 0.3
                }
            }
        });

        var opacityInAnimation = new ElementAnimation({
            target: imageElement,
            easing: "easeInQuad",
            properties: {
                opacity: {
                    from: 0,
                    to: 1
                }
            }
        });

        var scaleUpAnimation = new ElementAnimation({
            target: imageElement,
            easing: "easeOutQuad",
            properties: {
                scaleX: {
                    from: 0.2,
                    to: 1
                },
                scaleY: {
                    from: 0.2,
                    to: 1
                }
            }
        });

        var travelUpExpandTimeLine = new PercentageTimeline(550);

        travelUpExpandTimeLine.add({
            animation: travelUpAnimation,
            startAt: 0,
            endAt: 0.70
        },
        {
            animation: opacityInAnimation,
            startAt: 0,
            endAt: 0.5
        },
        {
            animation: scaleDownAnimation,
            startAt: 0,
            endAt: 0
        }, {
            animation: scaleUpAnimation,
            startAt: 0.7,
            endAt: 1
        });


        var travelUpAsync = function () {
            return new Future(function (setValue) {
                travelUpExpandTimeLine.restart();
                var observer = travelUpExpandTimeLine.observe("end", function () {
                    observer.dispose();
                    setValue();
                });
            });
        }

        self.getImageSrcAsync = function (personId) {
            return new Future(function (setValue, setError) {

                //Invalid personId's get the default image src...
                if (typeof personId === "undefined" || personId === null || personId === 0) {
                    setValue(personToImageSourceHash[0]);
                    return;
                }

                //Try and find the personId from the hash of previously looked up values
                if (personToImageSourceHash[personId]) {
                    setValue(personToImageSourceHash[personId]);
                    return;
                }

                var xhr = new XMLHttpRequest();
                var src;
                xhr.onreadystatechange = function (event) {
                    if (xhr.readyState === 4) {
                        if (xhr.status < 300 && xhr.status >= 200) {
                            try {
                                var response = JSON.parse(xhr.responseText);
                                if (response.Data[0] === undefined || response.Data[0].Length === 0) {
                                    setValue(personToImageSourceHash[0]);
                                    return;
                                }
                                else {

                                    personToImageSourceHash[personId] = apiUri + "Core/ProfilePictureAttachmentFiles/" + response.Data[0].Id + "?X-LGAppId=9";
                                    setValue(personToImageSourceHash[personId]);
                                    return;
                                }
                            } catch (e) {
                                setValue(personToImageSourceHash[0]);
                                return;
                            }
                        } else {
                            setValue(personToImageSourceHash[0]);
                            return;
                        }
                    }
                }
                xhr.open("GET", apiUri + "Core/ProfilePictureAttachments?X-LGAppId=9&$filter=OwnerId eq " + personId, true);
                xhr.send();
            });

        }

        var setForegroundImageSrc = function (src) {
            $image.attr("src", src);
            $image.css({
                "background-color": backgrondColor
            });

        };

        var setBackgroundImage = function (src) {
            $elem.css({
                "background-image": "url(\"" + src + "\")",
                "background-size": "cover",
                "background-color": backgrondColor
            });
        };

        self.loadImage = function (personId) {
            self.loadImageAsync(personId)["try"]();
        }

        self.loadImageAsync = function (personId) {
            return self.getImageSrcAsync(personId).chain(function (src) {

                if (loadedPersonId === personId)
                    return;

                loadedPersonId = personId;

                setForegroundImageSrc(src);
                travelUpAsync().then(function () {
                    setBackgroundImage(src);
                });
            });
        }

        self.init = function () {

            //Put the default profile picture in on load...
            return self.getImageSrcAsync(0).then(function (src) {

                setBackgroundImage(src);
            });
        };

        self.init();

    };
});