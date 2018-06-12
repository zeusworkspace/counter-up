/*!
* jquery.counterup.js 1.0
*
* Copyright 2013, Benjamin Intal http://gambit.ph @bfintal
* Released under the GPL v2 License
*
* Date: Jun 12, 2018
*/
(function ($) {
    "use strict";

    $.fn.counterUp = function (options) {

        // Defaults
        var settings = $.extend({
            'time': 400,
            'delay': 10,
            'from': 0,
            'formatter': false
        }, options);

        return this.each(function () {

            // Store the object
            var $this = $(this);
            var $settings = settings;

            var counterUpper = function () {
                var nums = [];
                var divisions = $settings.time / $settings.delay;
                var num = $this.attr('data-num') ? $this.attr('data-num') : $this.text();
                var isComma = /[0-9]+,[0-9]+/.test(num);
                num = num.replace(/,/g, '');
                var isInt = /^[0-9]+$/.test(num);
                var isFloat = /^[0-9]+\.[0-9]+$/.test(num);
                var from = isFloat ? parseFloat($settings.from) : $settings.from;
                var decimalPlaces = isFloat ? (num.split('.')[1] || []).length : 0;

                // Generate list of incremental numbers to display
                for (var i = divisions; i > 1; i--) {

                    // Preserve as int if input was int
                    var newNum = Math.round(((num - from) / divisions * i) + from);

                    // Preserve float if input was float
                    if (isFloat) {
                        newNum = parseFloat(((num - from) / divisions * i) + from).toFixed(decimalPlaces);
                    }

                    // Preserve commas if input had commas
                    if (isComma) {
                        while (/(\d+)(\d{3})/.test(newNum.toString())) {
                            newNum = newNum.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
                        }
                    }

                    // Formatter value
                    if (settings.formatter) {
                        newNum = settings.formatter.call(this, newNum);
                    }

                    nums.unshift(newNum);
                }

                $this.data('counterup-nums', nums);
                $this.text(from);

                // Updates the number until we're done
                var f = function () {
                    if (!$this.data('counterup-nums')) {
                        return;
                    }
                    $this.text($this.data('counterup-nums').shift());
                    if ($this.data('counterup-nums').length) {
                        setTimeout($this.data('counterup-func'), $settings.delay);
                    } else {
                        delete $this.data('counterup-nums');
                        $this.data('counterup-nums', null);
                        $this.data('counterup-func', null);
                    }
                };
                $this.data('counterup-func', f);

                // Start the count up
                setTimeout($this.data('counterup-func'), $settings.delay);
            };

            // Perform counts when the element gets into view
            $this.waypoint(counterUpper, {offset: '100%', triggerOnce: true});
        });

    };

})(jQuery);
