BASE.require([
    "jQuery",
    "BASE.async.Future",
    "BASE.web.isCORSEnabled",
    "BASE.async.delay"
], function () {
    BASE.namespace("components.legacy");

    var Future = BASE.async.Future;
    components.legacy.LegacyLeavittProfileImage = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var apiUri = BASE.web.isCORSEnabled() ? "https://api.leavitt.com/" : "/webapi/";
        var imageElement = tags["legacy-leavitt-profile-image"];
        var $image = $(imageElement);
        var loadedPersonId = 0;
        var backgrondColor = $elem.attr('background-color') || '#ccc';

        var personToImageSourceHash = {};
        personToImageSourceHash[0] = "https://libcdn.leavitt.com/libcdn/images/no-profile-image.png"; //Default image

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

        var setImageSrc = function (src) {
            $image.attr("src", src);
            $image.css({
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
                setImageSrc(src);
            });
        }

        self.init = function () {

            //Put the default profile picture in on load...
            return self.getImageSrcAsync(0).chain(function (src) {
                setImageSrc(src);
            })["try"]();
        };

        self.init();

    };
});