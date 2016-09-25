(function ($) {
    $.fn.extend({
        showMsg: function(val) {
            //if (!val) var val = '错误提示';
            var val = val ? val : '';
            return this.each(function () {
                var $this = $(this),
                    left = $this.offset().left,
                    top = $this.offset().top,
                    w = $this.outerWidth() - 12,
                    h = $this.outerHeight() - 2,
                    $body = $('body'),
                    $msg;
                //console.log(val)
                $msg = $('<div class="msg"></div>');
                $msg.css({ 'padding': '0 5px 0 5px', 'border-width': '1px' });
                $msg.css({ width: w + 'px', height: h + 'px', 'line-height': h + 'px', left: left + 'px', top: top + 'px' });
                $msg.text(val);
                $msg.appendTo($body);
                $msg.click(function () {
                    $(this).remove();
                    $this.focus();
                });
                $this.focus(function() {
                    $msg.remove();
                });
            });
        }
    })
})(jQuery);