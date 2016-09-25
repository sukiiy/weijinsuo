(function ($) {
    $.fn.placeHolder = function () {
        return this.each(function () {
            var $that = $(this),
				color = $that.css('color'),
				holder = $.trim($that.attr('data-placeholder')),
				type = $that.attr('type'),
				val = $.trim($that.val());
            if (!val || val == holder) {
                if (type == 'password') {
                    $that.attr('placeholder', holder);
                } else {
                    $that.val(holder).css('color', '#a4a4a4');
                }
            }

            $that.focus(function () {
                var $this = $(this),
					curHolder = $.trim($this.attr('data-placeholder')),
					curType = $this.attr('type');
                if (curType == 'password') {
                    $this.removeAttr('placeholder');
                } else {
                    if ($.trim($this.val()) == curHolder) {
                        $this.val('').css('color', color);
                    }
                }

            });
            $that.blur(function () {
                var $this = $(this),
					curHolder = $.trim($this.attr('data-placeholder')),
					curType = $this.attr('type');
                if (curType == 'password') {
                    $this.attr('placeholder', curHolder);
                } else {
                    if ($.trim($this.val()) == '') {
                        $this.val(curHolder).css('color', '#a4a4a4');
                    } else {
                        $this.css('color', color);
                    }
                }
            });
        });
    }
})(jQuery);