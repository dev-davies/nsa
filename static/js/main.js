(function ($) {
    "use strict";

    // Global initialization function for SPA
    window.initializeSiteScripts = function() {
        // Dropdown on mouse hover
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);

        // Back to top button
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('.back-to-top').fadeIn('slow');
            } else {
                $('.back-to-top').fadeOut('slow');
            }
        });
        $('.back-to-top').click(function () {
            $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
            return false;
        });

        // Dynamic Facts Counter with Re-animation
        // Use IntersectionObserver to animate when in view and reset when out of view
        var counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                var $elem = $(entry.target);
                
                // If element is in view
                if (entry.isIntersecting) {
                    var targetVal = parseInt($elem.attr('data-target'));
                    
                    // Animate from 0 to target
                    $({ countNum: 0 }).animate({
                        countNum: targetVal
                    }, {
                        duration: 2000,
                        easing: 'linear',
                        step: function() {
                            $elem.text(Math.floor(this.countNum));
                        },
                        complete: function() {
                            $elem.text(this.countNum);
                        }
                    });
                } else {
                    // Reset to 0 when out of view so it can animate again
                    $elem.text('0');
                    // Stop any ongoing animation to prevent conflicts
                    $elem.stop(true, true); 
                }
            });
        }, {
            threshold: 0.5 // Trigger when 50% of the element is visible
        });

        // Initialize counters
        $('[data-toggle="counter-up"]').each(function() {
            var $this = $(this);
            // Store the target number firmly in data attribute
            if (!$this.attr('data-target')) {
                $this.attr('data-target', $this.text());
            }
            // Set initial state
            $this.text('0');
            // Observe
            counterObserver.observe(this);
        });

        // Remove any existing owl instances to prevent issues
        $('.courses-carousel').trigger('destroy.owl.carousel');
        $('.team-carousel').trigger('destroy.owl.carousel');
        $('.testimonial-carousel').trigger('destroy.owl.carousel');
        $('.related-carousel').trigger('destroy.owl.carousel');

        // Courses carousel
        $(".courses-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            loop: true,
            dots: false,
            nav: false,
            margin: 25,
            responsive: {
                0: {
                    items: 1
                },
                576: {
                    items: 3
                },
                768: {
                    items: 4
                },
                992: {
                    items: 5
                }
            }
        });

        // Team carousel
        $(".team-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            margin: 30,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
            responsive: {
                0: {
                    items: 1
                },
                576: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                }
            }
        });

        // Testimonials carousel
        $(".testimonial-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            items: 1,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
        });

        // Related carousel
        $(".related-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            margin: 30,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
            responsive: {
                0: {
                    items: 1
                },
                576: {
                    items: 1
                },
                768: {
                    items: 2
                }
            }
        });

        // Typed.js Initialization
        if ($('.typed-text-output').length == 1) {
            var typed_strings = "NOVELSOLAR ACADEMY!, The Future of Energy!, Innovation!, Sustainability!";
            var typed = new Typed('.typed-text-output', {
                strings: typed_strings.split(', '),
                typeSpeed: 100,
                backSpeed: 20,
                smartBackspace: false,
                loop: true
            });
        }
        
        // Refresh Waypoints
        Waypoint.refreshAll();
    };

    // Initial load
    $(document).ready(function () {
        // window.initializeSiteScripts(); 
        // Note: We intentionally DO NOT call it here because app.html's 'load' event checks for it 
        // OR the initial page load via SPA router will call it.
        // Actually, for the very first load if not handled by router immediately, we might need it.
        // But the router script in app.html triggers 'loadPage' on window.load, which calls renderPage, which will call this.
    });

})(jQuery);

