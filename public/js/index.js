// Front end

    //carousel
        var slider = tns({
            container: ".my-slider",
            items: 1,
            navPosition: "bottom",
            arrowKeys: true,
            speed: 1000,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            mouseDrag: true,
            prevButton: ".carousel-control-prev",
            nextButton: ".carousel-control-next",
            autoplayButtonOutput: false,
            navContainer: ".carousel-indicators",
            responsive: {
                768: {
                    items: 2,
                },
            },
        });


