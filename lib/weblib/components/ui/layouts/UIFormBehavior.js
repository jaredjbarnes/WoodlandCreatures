BASE.require([
    "jQuery"
], function () {
    BASE.namespace("components.ui.layouts");

    components.ui.layouts.UIFormBehavior = function (elem) {
        var self = this
        var $elem = $(elem);

        $elem.data('form', self);

        $elem.on('click', '[type="submit"]', function () {
            $elem.find('[placeholder]').each(function () {
                var $this = $(this);
                if ($this.val() === $this.attr('placeholder')) {
                    $this.val('').blur();
                }
            });
            $elem.trigger('submit');
        });
        $elem.on('keydown', function (event) {
            if (event.which === 13) {
                $elem.find('[type="submit"]').trigger('click');
            }
        });
        self.clearForm = function () {
            $elem.find('input, select, textarea').each(function () {
                $(this).val('').blur();
            });
        }
    };
});
