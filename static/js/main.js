(function ($) {
    "use strict";

    // Global course navigation function
    window.navigateToCourse = function() {
        const select = document.getElementById('courseSelect');
        if (!select) {
            console.error('Course select element not found');
            return;
        }
        
        const courseUrl = select.value;
        console.log('Course selected:', courseUrl);
        
        if (courseUrl) {
            // Use loadPage if available (SPA mode), otherwise use direct navigation
            if (typeof loadPage === 'function') {
                console.log('Using SPA loadPage');
                loadPage(courseUrl);
            } else {
                console.log('Using direct navigation');
                window.location.href = courseUrl;
            }
        } else {
            alert('Please select a course first');
        }
    };

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

        // Remove any existing owl instances and reinitialize carousels
        $('.courses-carousel, .team-carousel, .testimonial-carousel, .related-carousel').trigger('destroy.owl.carousel');

        // Carousel factory function
        const initCarousel = (selector, config) => $(selector).owlCarousel(config);

        // Carousel configurations
        const carouselConfigs = {
            courses: {
                autoplay: true,
                smartSpeed: 1500,
                loop: true,
                dots: false,
                nav: false,
                margin: 25,
                responsive: {
                    0: { items: 1 },
                    576: { items: 3 },
                    768: { items: 4 },
                    992: { items: 5 }
                }
            },
            team: {
                autoplay: true,
                smartSpeed: 1000,
                margin: 30,
                dots: false,
                loop: true,
                nav: true,
                navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
                responsive: {
                    0: { items: 1 },
                    576: { items: 1 },
                    768: { items: 2 },
                    992: { items: 3 }
                }
            },
            testimonial: {
                autoplay: true,
                smartSpeed: 1500,
                items: 1,
                dots: false,
                loop: true,
                nav: true,
                navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>']
            },
            related: {
                autoplay: true,
                smartSpeed: 1000,
                margin: 30,
                dots: false,
                loop: true,
                nav: true,
                navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
                responsive: {
                    0: { items: 1 },
                    576: { items: 1 },
                    768: { items: 2 }
                }
            }
        };

        // Initialize all carousels
        initCarousel('.courses-carousel', carouselConfigs.courses);
        initCarousel('.team-carousel', carouselConfigs.team);
        initCarousel('.testimonial-carousel', carouselConfigs.testimonial);
        initCarousel('.related-carousel', carouselConfigs.related);

        // Typed.js Initialization
        if ($('.typed-text-output').length == 1) {
            var typed_strings = "NOVEL ACADEMY!, The Future of Energy!, Innovation!, Sustainability!";
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

    // List of countries with dial codes
    const countries = [
        { name: "Afghanistan", code: "+93" }, { name: "Albania", code: "+355" }, { name: "Algeria", code: "+213" },
        { name: "Andorra", code: "+376" }, { name: "Angola", code: "+244" }, { name: "Antigua and Barbuda", code: "+1-268" },
        { name: "Argentina", code: "+54" }, { name: "Armenia", code: "+374" }, { name: "Australia", code: "+61" },
        { name: "Austria", code: "+43" }, { name: "Azerbaijan", code: "+994" }, { name: "Bahamas", code: "+1-242" },
        { name: "Bahrain", code: "+973" }, { name: "Bangladesh", code: "+880" }, { name: "Barbados", code: "+1-246" },
        { name: "Belarus", code: "+375" }, { name: "Belgium", code: "+32" }, { name: "Belize", code: "+501" },
        { name: "Benin", code: "+229" }, { name: "Bhutan", code: "+975" }, { name: "Bolivia", code: "+591" },
        { name: "Bosnia and Herzegovina", code: "+387" }, { name: "Botswana", code: "+267" }, { name: "Brazil", code: "+55" },
        { name: "Brunei", code: "+673" }, { name: "Bulgaria", code: "+359" }, { name: "Burkina Faso", code: "+226" },
        { name: "Burundi", code: "+257" }, { name: "Cambodia", code: "+855" }, { name: "Cameroon", code: "+237" },
        { name: "Canada", code: "+1" }, { name: "Cape Verde", code: "+238" }, { name: "Central African Republic", code: "+236" },
        { name: "Chad", code: "+235" }, { name: "Chile", code: "+56" }, { name: "China", code: "+86" },
        { name: "Colombia", code: "+57" }, { name: "Comoros", code: "+269" }, { name: "Congo", code: "+242" },
        { name: "Costa Rica", code: "+506" }, { name: "Croatia", code: "+385" }, { name: "Cuba", code: "+53" },
        { name: "Cyprus", code: "+357" }, { name: "Czech Republic", code: "+420" }, { name: "Denmark", code: "+45" },
        { name: "Djibouti", code: "+253" }, { name: "Dominica", code: "+1-767" }, { name: "Dominican Republic", code: "+1-809" },
        { name: "East Timor", code: "+670" }, { name: "Ecuador", code: "+593" }, { name: "Egypt", code: "+20" },
        { name: "El Salvador", code: "+503" }, { name: "Equatorial Guinea", code: "+240" }, { name: "Eritrea", code: "+291" },
        { name: "Estonia", code: "+372" }, { name: "Eswatini", code: "+268" }, { name: "Ethiopia", code: "+251" },
        { name: "Fiji", code: "+679" }, { name: "Finland", code: "+358" }, { name: "France", code: "+33" },
        { name: "Gabon", code: "+241" }, { name: "Gambia", code: "+220" }, { name: "Georgia", code: "+995" },
        { name: "Germany", code: "+49" }, { name: "Ghana", code: "+233" }, { name: "Greece", code: "+30" },
        { name: "Grenada", code: "+1-473" }, { name: "Guatemala", code: "+502" }, { name: "Guinea", code: "+224" },
        { name: "Guinea-Bissau", code: "+245" }, { name: "Guyana", code: "+592" }, { name: "Haiti", code: "+509" },
        { name: "Honduras", code: "+504" }, { name: "Hong Kong", code: "+852" }, { name: "Hungary", code: "+36" },
        { name: "Iceland", code: "+354" }, { name: "India", code: "+91" }, { name: "Indonesia", code: "+62" },
        { name: "Iran", code: "+98" }, { name: "Iraq", code: "+964" }, { name: "Ireland", code: "+353" },
        { name: "Israel", code: "+972" }, { name: "Italy", code: "+39" }, { name: "Ivory Coast", code: "+225" },
        { name: "Jamaica", code: "+1-876" }, { name: "Japan", code: "+81" }, { name: "Jordan", code: "+962" },
        { name: "Kazakhstan", code: "+7" }, { name: "Kenya", code: "+254" }, { name: "Kiribati", code: "+686" },
        { name: "Kosovo", code: "+383" }, { name: "Kuwait", code: "+965" }, { name: "Kyrgyzstan", code: "+996" },
        { name: "Laos", code: "+856" }, { name: "Latvia", code: "+371" }, { name: "Lebanon", code: "+961" },
        { name: "Lesotho", code: "+266" }, { name: "Liberia", code: "+231" }, { name: "Libya", code: "+218" },
        { name: "Liechtenstein", code: "+423" }, { name: "Lithuania", code: "+370" }, { name: "Luxembourg", code: "+352" },
        { name: "Macao", code: "+853" }, { name: "Madagascar", code: "+261" }, { name: "Malawi", code: "+265" },
        { name: "Malaysia", code: "+60" }, { name: "Maldives", code: "+960" }, { name: "Mali", code: "+223" },
        { name: "Malta", code: "+356" }, { name: "Marshall Islands", code: "+692" }, { name: "Mauritania", code: "+222" },
        { name: "Mauritius", code: "+230" }, { name: "Mexico", code: "+52" }, { name: "Micronesia", code: "+691" },
        { name: "Moldova", code: "+373" }, { name: "Monaco", code: "+377" }, { name: "Mongolia", code: "+976" },
        { name: "Montenegro", code: "+382" }, { name: "Morocco", code: "+212" }, { name: "Mozambique", code: "+258" },
        { name: "Myanmar", code: "+95" }, { name: "Namibia", code: "+264" }, { name: "Nauru", code: "+674" },
        { name: "Nepal", code: "+977" }, { name: "Netherlands", code: "+31" }, { name: "New Zealand", code: "+64" },
        { name: "Nicaragua", code: "+505" }, { name: "Niger", code: "+227" }, { name: "Nigeria", code: "+234" },
        { name: "North Korea", code: "+850" }, { name: "North Macedonia", code: "+389" }, { name: "Norway", code: "+47" },
        { name: "Oman", code: "+968" }, { name: "Pakistan", code: "+92" }, { name: "Palau", code: "+680" },
        { name: "Palestine", code: "+970" }, { name: "Panama", code: "+507" }, { name: "Papua New Guinea", code: "+675" },
        { name: "Paraguay", code: "+595" }, { name: "Peru", code: "+51" }, { name: "Philippines", code: "+63" },
        { name: "Poland", code: "+48" }, { name: "Portugal", code: "+351" }, { name: "Qatar", code: "+974" },
        { name: "Romania", code: "+40" }, { name: "Russia", code: "+7" }, { name: "Rwanda", code: "+250" },
        { name: "Saint Kitts and Nevis", code: "+1-869" }, { name: "Saint Lucia", code: "+1-758" },
        { name: "Saint Vincent and the Grenadines", code: "+1-784" }, { name: "Samoa", code: "+685" },
        { name: "San Marino", code: "+378" }, { name: "Sao Tome and Principe", code: "+239" }, { name: "Saudi Arabia", code: "+966" },
        { name: "Senegal", code: "+221" }, { name: "Serbia", code: "+381" }, { name: "Seychelles", code: "+248" },
        { name: "Sierra Leone", code: "+232" }, { name: "Singapore", code: "+65" }, { name: "Slovakia", code: "+421" },
        { name: "Slovenia", code: "+386" }, { name: "Solomon Islands", code: "+677" }, { name: "Somalia", code: "+252" },
        { name: "South Africa", code: "+27" }, { name: "South Korea", code: "+82" }, { name: "South Sudan", code: "+211" },
        { name: "Spain", code: "+34" }, { name: "Sri Lanka", code: "+94" }, { name: "Sudan", code: "+249" },
        { name: "Suriname", code: "+597" }, { name: "Sweden", code: "+46" }, { name: "Switzerland", code: "+41" },
        { name: "Syria", code: "+963" }, { name: "Taiwan", code: "+886" }, { name: "Tajikistan", code: "+992" },
        { name: "Tanzania", code: "+255" }, { name: "Thailand", code: "+66" }, { name: "Timor-Leste", code: "+670" },
        { name: "Togo", code: "+228" }, { name: "Tonga", code: "+676" }, { name: "Trinidad and Tobago", code: "+1-868" },
        { name: "Tunisia", code: "+216" }, { name: "Turkey", code: "+90" }, { name: "Turkmenistan", code: "+993" },
        { name: "Tuvalu", code: "+688" }, { name: "Uganda", code: "+256" }, { name: "Ukraine", code: "+380" },
        { name: "United Arab Emirates", code: "+971" }, { name: "United Kingdom", code: "+44" },
        { name: "United States", code: "+1" }, { name: "Uruguay", code: "+598" }, { name: "Uzbekistan", code: "+998" },
        { name: "Vanuatu", code: "+678" }, { name: "Vatican City", code: "+379" }, { name: "Venezuela", code: "+58" },
        { name: "Vietnam", code: "+84" }, { name: "Yemen", code: "+967" }, { name: "Zambia", code: "+260" },
        { name: "Zimbabwe", code: "+263" }
    ];

    window.initializeRegistration = function() {
        const nationalitySearch = document.getElementById('nationalitySearch');
        const nationalitySelect = document.getElementById('nationality');
        const nationalityDropdown = document.getElementById('nationalityDropdown');
        const registrationForm = document.getElementById('registrationForm');
        
        if (!registrationForm) return;
        
        const formStartTime = document.getElementById('_form_start_time');
        if (formStartTime && !formStartTime.value) {
            formStartTime.value = (Date.now() / 1000).toString();
        }
        
        const formInputs = registrationForm.querySelectorAll('input, select, textarea');
        const feedbackDiv = document.getElementById('formFeedback');

        nationalitySelect.innerHTML = '<option value="">-- Select a Country --</option>';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name;
            option.textContent = country.name;
            nationalitySelect.appendChild(option);
        });

        function showDropdown(searchTerm = '') {
            nationalityDropdown.innerHTML = '';
            const term = searchTerm.toLowerCase().trim();

            const filteredCountries = term.length === 0
                ? countries
                : countries.filter(country => country.name.toLowerCase().includes(term));

            if (filteredCountries.length === 0) {
                nationalityDropdown.style.display = 'none';
                return;
            }

            filteredCountries.forEach(country => {
                const item = document.createElement('div');
                item.className = 'country-item';
                item.textContent = country.name;
                item.addEventListener('click', function (e) {
                    e.stopPropagation();
                    updateCountry(country);
                });
                nationalityDropdown.appendChild(item);
            });

            nationalityDropdown.style.display = 'block';
        }

        if (nationalitySearch) {
            nationalitySearch.addEventListener('input', function () { showDropdown(this.value); });
            nationalitySearch.addEventListener('focus', function () { showDropdown(this.value); });
            nationalitySearch.addEventListener('click', function (e) { e.stopPropagation(); showDropdown(this.value); });
        }

        function updateCountry(countryObj) {
            nationalitySearch.value = countryObj.name;
            nationalitySelect.value = countryObj.name;
            nationalityDropdown.style.display = 'none';
            clearFieldError(nationalitySearch);

            const phoneInput = document.getElementById('phoneNumber');
            if (countryObj.code) {
                phoneInput.value = countryObj.code + " ";
                phoneInput.focus();
            }
        }

        document.addEventListener('click', function (e) {
            if (e.target !== nationalitySearch && e.target !== nationalityDropdown && nationalityDropdown) {
                nationalityDropdown.style.display = 'none';
            }
        });

        formInputs.forEach(input => {
            input.addEventListener('blur', function () { validateField(this); });
            input.addEventListener('focus', function () { clearFieldError(this); });
        });

        registrationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;
            formInputs.forEach(input => {
                if (input.type !== 'checkbox' && input.id !== 'nationality' && !validateField(input)) {
                    isValid = false;
                }
            });

            const nationalityValue = nationalitySelect.value;
            if (!nationalityValue || nationalityValue === '') {
                showFieldError(nationalitySearch, 'Please select your nationality');
                isValid = false;
            }

            if (!document.getElementById('terms').checked) {
                showFeedback('error', 'Please agree to the Terms and Conditions.');
                isValid = false;
            }

            if (isValid) {
                const formData = new FormData(registrationForm);
                const data = Object.fromEntries(formData.entries());
                data.terms = document.getElementById('terms').checked;
                
                const formStartTimeField = document.getElementById('_form_start_time');
                if (formStartTimeField && formStartTimeField.value) {
                    data._form_start_time = formStartTimeField.value;
                } else {
                    data._form_start_time = (Date.now() / 1000).toString();
                }
                
                data.website = '';
                data.email_confirm = '';

                const csrfToken = document.getElementById('csrf_token')?.value || '';

                fetch("/submit_registration", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken
                    },
                    body: JSON.stringify(data),
                })
                .then(response => response.json())
                .then(result => {
                    if (result.status === 'error') {
                        showFeedback('error', result.message || 'An error occurred. Please try again.');
                    } else if (result.redirect) {
                        if (typeof window.loadPage === 'function') {
                            window.loadPage(result.redirect);
                        } else {
                            window.location.href = result.redirect;
                        }
                    } else {
                        showFeedback('success', 'Registration submitted successfully! We will contact you soon.');
                        setTimeout(() => {
                            registrationForm.reset();
                            nationalitySearch.value = '';
                            if(nationalityDropdown) nationalityDropdown.style.display = 'none';
                            feedbackDiv.classList.remove('success', 'error');
                            feedbackDiv.style.display = 'none';
                        }, 3000);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showFeedback('error', 'An error occurred. Please try again.');
                });
            }
        });

        function validateField(field) {
            const value = field.value.trim();
            const type = field.type;
            const name = field.id;
            let isValid = true;

            clearFieldError(field);

            if (!value && field.hasAttribute('required')) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else if (value) {
                if (type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        showFieldError(field, 'Please enter a valid email address');
                        isValid = false;
                    }
                }
                else if (name === 'phoneNumber' && value.length < 10) {
                    showFieldError(field, 'Please enter a valid phone number');
                    isValid = false;
                }
                else if (name === 'fullName' && value.length < 3) {
                    showFieldError(field, 'Name must be at least 3 characters');
                    isValid = false;
                }
                else if (name === 'state' && value.length < 2) {
                    showFieldError(field, 'Please enter a valid state');
                    isValid = false;
                }
                else if (name === 'courseGoals' && value.length < 10) {
                    showFieldError(field, 'Please provide more details about your goals');
                    isValid = false;
                }
            }
            return isValid;
        }

        function showFieldError(field, message) {
            field.classList.add('is-invalid');
            const errorMsg = field.parentElement.querySelector('.error-text');
            if (errorMsg) {
                errorMsg.textContent = message;
                errorMsg.style.display = 'block';
            }
        }

        function clearFieldError(field) {
            field.classList.remove('is-invalid');
            const errorMsg = field.parentElement.querySelector('.error-text');
            if (errorMsg) {
                errorMsg.style.display = 'none';
            }
        }

        function showFeedback(type, message) {
            feedbackDiv.className = `form-feedback ${type}`;
            feedbackDiv.textContent = message;
        }
    };

})(jQuery);

