BASE.require.loader.setObject('jQuery.fn.datetimepicker', 'lib/plugins/dateTimePicker/datetimepicker.js');

BASE.require([
    'jQuery',
    'jQuery.fn.datetimepicker'
], function () {

    BASE.namespace('components.ui.inputs');

    components.ui.inputs.UIDateTimePicker = function (elem, tags) {
        var self = this;
        var $elem = $(elem);
        var $picker = $(elem);

        var emitChangeEvent = function () {
            if (!$elem.is("[disabled]")) {
                $elem.trigger({
                    type: 'change',
                    utcDate: self.getUTCDate(),
                    value: self.getValue()
                });
            }
        };

        $elem.on("mousedown", function (e) {
            if ($elem.is("[disabled]")) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        $picker.datetimepicker({
            language: 'en',
            pick12HourFormat: !$(elem).is('[military]'),
            pickDate: !$(elem).is('[time-only]'),
            pickTime: !$(elem).is('[date-only]'),
            pickSeconds: $(elem).is('[seconds]')
        }).on('changeDate', function (event) {
            emitChangeEvent();
        });

        self.getUTCDate = function () {
            return $picker.data('datetimepicker').getDate();
        }

        self.getValue = function () {
            return $picker.data('datetimepicker').getLocalDate();
        }

        self.setUTCDate = function (date) {
            $picker.data('datetimepicker').setDate(date);
            emitChangeEvent();
        }

        self.setValue = function (date) {
            $picker.data('datetimepicker').setLocalDate(date);
            emitChangeEvent();
        }

        self.toString = function (format, date) {
            return $picker.data('datetimepicker').formatDate(format, date);
        }

        self.minDate = function (date) {
            if (self.getValue().getTime() <= date.getTime()) {
                self.setValue(date);
            }
            $picker.data('datetimepicker').setStartDate(date);
        }

        self.maxDate = function (date) {
            if (self.getValue().getTime() >= date.getTime()) {
                self.setValue(date);
            }
            $picker.data('datetimepicker').setEndDate(date);
        }

        self.show = function () {
        	$picker.data('datetimepicker').show();
        };

        self.hide = function () {
        	$picker.data('datetimepicker').hide();
        };
    }
});