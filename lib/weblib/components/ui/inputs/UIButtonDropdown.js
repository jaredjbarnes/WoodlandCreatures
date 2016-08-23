BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.ui.inputs");

    components.ui.inputs.UIButtonDropdown = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $button = $(tags['button']);
        var $text = $(tags['text']);
        var $icon = $(tags['icon']);
        var $space = $(tags['space']);
        var $submenuButton = $(elem).find('li.submenu > [ui-button], li.submenu > a');
        var $menuItemButton = $(elem).find('li > [ui-button], li > a').not($submenuButton);


        var resetIcon = function () {
            $icon.addClass('hide');
            $space.addClass('hide');
        }

        var resetText = function () {
            $text.addClass('hide');
            $space.addClass('hide');
        }

        $button.attr('class', $elem.attr('class'));
        if ($elem.attr('text') === '') {
            resetText();
        }
        $text.html($elem.attr('text'));
        if ($elem.attr('icon') === '') {
            resetIcon();
        }
        $icon.attr({
            'image': $elem.attr('icon'),
            'class': $elem.attr('icon-class')
        });
        var $ul = $elem.find('ul');
        $ul.css({
            visibility: 'hidden',
            display: 'block',
        });
        $elem.find('li.submenu > ul.dropleft').each(function () {
            var $this = $(this);
            $this.css('left', '-' + $this.outerWidth() + 'px');
        });
        $elem.find('li.submenu > ul.dropup').each(function () {
            var $this = $(this);
            $this.css('top', '-' + ($this.outerHeight() - 33) + 'px');
        });
        $ul.css({
            visibility: '',
            display: '',
        });

        self.setDisabled = function () {
            $button.attr('disabled', '');
        }

        self.removeDisabled = function () {
            $button.removeAttr('disabled');
        }

        self.setText = function (text) {
            $text.removeClass('hide').html(text);
            if ($icon.attr('image') !== '') {
                $space.removeClass('hide');
            }
            else {
                $space.addClass('hide');
            }
            $elem.trigger({ type: 'change', value: self.getText() });
        }

        self.getText = function () {
            return $text.html();
        }

        self.setIcon = function (icon, iconClass) {
            if (icon) {
                $icon.removeClass('hide');
                iconClass = iconClass || $icon.attr('class');
                $icon.attr({
                    'image': icon,
                    'class': iconClass
                });
                if ($text.text() !== '') {
                    $space.removeClass('hide');
                }
                else {
                    $space.addClass('hide');
                }
            } else {
                resetIcon();
            }
            $elem.trigger({ type: 'change', value: self.getText() });
        }

        self.hideText = function () {
            $text.addClass('hide');
            $space.addClass('hide');
        }

        self.hideIcon = function () {
            $icon.addClass('hide');
            $space.addClass('hide');
        }

        self.getIcon = function () {
            return $icon.attr('image');
        }

        self.setClass = function (classNames) {
            $elem.attr('class', classNames);
            $button.attr('class', classNames);
        }

        self.triggerMousedown = function () {
            $button.trigger('mousedown');
        }

        $button.on('blur', function () {
            $button.removeClass('focused');
        });

        $button.on('mousedown touchstart', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if ($button.is('.focused')) {
                $button.blur();
            }
            else {
                $button.addClass('focused');
                $button.focus();
            }
            $elem.trigger('click');
        });

        $submenuButton.on('mousedown touchstart', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $button.addClass('focused');
            $button.focus();
        });

        $menuItemButton.on('mousedown touchmove', function (event) {
            event.preventDefault();
        });

        $menuItemButton.on('click', function () {
            $button.blur();
        });
    };
});