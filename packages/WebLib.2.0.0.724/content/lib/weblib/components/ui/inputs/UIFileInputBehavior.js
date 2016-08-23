BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.ui.inputs");

    var Future = BASE.async.Future;

    components.ui.inputs.UIFileInputBehavior = function (elem) {
        var self = this;
        var $elem = $(elem);
        var $fileInput = $('<input type="file">');

        $elem.data('fileInput', self);

        var getFileFromUri = function (uri) {
            return new Future(function (setValue, setError) {

                var readerFunction = window.resolveLocalFileSystemURL;

                if (typeof readerFunction !== "function") {
                    readerFunction = window.resolveLocalFileSystemURI;
                }

                readerFunction(uri, function (fileEntry) {
                    fileEntry.file(function (file) {
                        setValue(file);
                    }, function (error) {
                        setError(error);
                    });
                }, setError);

            }).then().ifError(function (error) {
                console.log(error);
            });
        }

        $fileInput.css({
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0,
            overflow: 'hidden',
            border: 0,
            top: 0,
            left: 0
        });

        $elem.append($fileInput);

        $fileInput.on('change', function (event) {
            event.stopPropagation();
            // IE fires clears the value of the input when you click "Browse", triggering a change
            if ($fileInput.val() !== "") {
                $elem.trigger({
                    type: 'change',
                    value: $fileInput.val().split('\\').pop(),
                    file: $fileInput[0].files[0]
                });
            }
        });

        $fileInput.on('cordovaChange', function (event) {
            var uri = event.value;
            getFileFromUri(uri).then(function(file){
                $elem.trigger({
                    type: 'change',
                    value: file.name,
                    file: file,
                });
            });
        });

        $fileInput.on('click', function (event) {
            this.value = null;
            if (typeof cordova !== 'undefined' && typeof imagePicker !== 'undefined') {
                event.preventDefault();
                window.imagePicker.getPictures(
                    function (results) {
                        $fileInput.trigger({
                            type: 'cordovaChange',
                            value: results[0]
                        });
                    }, function (error) {
                        console.log('Error: ' + error);
                    }, {
                        maximumImagesCount: 1,
                    }
                );
            }
        });

        self.getFileInput = function () {
            return $fileInput[0];
        };

        self.setFileInputName = function (name) {
            $fileInput.attr('name', name);
        };

        self.triggerClick = function () {
            $fileInput.trigger('click');
        }
    };
});