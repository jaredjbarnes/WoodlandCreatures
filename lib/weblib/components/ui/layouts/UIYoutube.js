BASE.require([
    "jQuery",
    "BASE.web.Url"
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UIYoutube = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var video = $elem.attr('video');
        var $videoContainer = $(tags['video-container']);
        var $overlay = $(tags['overlay']);
        var maxres = $elem.is('[maxres]');
        var url = new BASE.web.Url(video);
        var page = url.getPage();
        var queryString = url.getQuery();
        var queryParsed = url.getParsedQuery;

        var protocol = document.location.protocol;
        if (protocol === "file:") {
            protocol = "https:";
        }

        if (typeof queryParsed.v === "string") {
            page = queryString.v; //v stands for video id 
        }

        var imgSrc = protocol + '//img.youtube.com/vi/' + page + '/'
        if (maxres) {
            imgSrc += 'maxresdefault.jpg';
        }
        else {
            imgSrc += 'sddefault.jpg';
        }

        var img = new Image();

        

        $(img).on('load', function (event) {
            if (img.height > 100) {
                $overlay.css('cssText', 'background-image: url(' + imgSrc + '); background-position: 50% 50%; background-repeat: no-repeat; background-size: cover;');
            }
        }).attr('src', imgSrc);

        if (queryString === undefined) {
            queryString = '';
        }
        else {
            queryString = '&' + queryString;
        }
        var iframeSrc = protocol + '//www.youtube.com/embed/' + page + '?wmode=opaque&rel=0&showinfo=0&autoplay=1' + queryString;

        var replaceWithImage = function () {
            $overlay.removeClass('hide');
            $videoContainer.html('');
            $elem.trigger('stop');
        }

        var replaceWithVideo = function () {
            $overlay.addClass('hide');
            $videoContainer.html('<iframe class="fill-parent" src="'+iframeSrc+'" frameborder="0" allowfullscreen></iframe>');
            $elem.trigger('play');
        }
 
        self.stop = function () {
            replaceWithImage();
        }

        $overlay.on('click', replaceWithVideo);
        replaceWithImage();
    };
});