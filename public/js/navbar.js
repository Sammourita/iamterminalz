
    //navbar
    (function ($) {
        "use strict";

        $(function () {
            var header = $(".start-nav");
            var offCanvas = $(".offcanvas");
            $(window).scroll(function () {
                var scroll = $(window).scrollTop();

                if (scroll >= 10) {
                    header.addClass("solid-bg");
                    
                } else {
                    header.removeClass("solid-bg");
                }
            });
        });
    })(jQuery);