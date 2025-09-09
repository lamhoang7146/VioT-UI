// JavaScript Document
$(document).ready(function () {

    "use strict";

    // Modal functionality
    const contactForm = $('#contact-form');
    const contactBtn = $('#contact-form-link');
    const closeBtn = $('#closeContactForm');

    // Open modal
    contactBtn.on('click', function (e) {
        e.preventDefault();
        contactForm.addClass('show');
        $('body').css('overflow', 'hidden');
        $('body').addClass('modal-open');

        // Focus on first input
        setTimeout(() => {
            $('#contactName').focus();
        }, 300);
    });

    // Close modal
    function closeModal() {
        contactForm.removeClass('show');
        resetForm();

        // Force reset body overflow immediately - override all CSS
        $('body').removeClass('modal-open wsactive');
        $('body').removeAttr('style');
        $('html').removeAttr('style');

        // Force enable scrolling with !important
        $('body').css({
            'overflow': 'auto !important',
            'overflow-x': 'hidden !important',
            'overflow-y': 'auto !important'
        });

        $('html').css({
            'overflow': 'auto !important',
            'overflow-x': 'hidden !important',
            'overflow-y': 'auto !important'
        });

        // Additional reset with delay
        setTimeout(() => {
            $('body').removeClass('modal-open wsactive');
            $('body').removeAttr('style');
            $('html').removeAttr('style');
            $('body').css({
                'overflow': 'auto !important',
                'overflow-x': 'hidden !important',
                'overflow-y': 'auto !important'
            });
            $('html').css({
                'overflow': 'auto !important',
                'overflow-x': 'hidden !important',
                'overflow-y': 'auto !important'
            });
        }, 300);

        // Final safety reset
        setTimeout(() => {
            $('body').removeClass('modal-open wsactive');
            $('body').css({
                'overflow': 'auto !important',
                'overflow-x': 'hidden !important',
                'overflow-y': 'auto !important'
            });
            $('html').css({
                'overflow': 'auto !important',
                'overflow-x': 'hidden !important',
                'overflow-y': 'auto !important'
            });
        }, 600);
    }

    closeBtn.on('click', closeModal);
    contactForm.on('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Close on Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && contactForm.hasClass('show')) {
            closeModal();
        }
    });

    // Form validation
    function validateField(field, value) {
        const fieldGroup = field.closest('.form-group');
        const errorElement = fieldGroup.find('.error-message');
        let isValid = true;
        let errorMessage = '';

        // Remove previous states
        fieldGroup.removeClass('error success');
        field.removeClass('error success');

        // Name validation
        if (field.attr('name') === 'name') {
            if (!value.trim()) {
                errorMessage = 'Full name is required';
                isValid = false;
            } else if (value.trim().length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
        }

        // Email validation
        if (field.attr('name') === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value.trim()) {
                errorMessage = 'Email address is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }

        // Phone validation
        if (field.attr('name') === 'phone') {
            if (!value.trim()) {
                errorMessage = 'Contact number is required';
                isValid = false;
            } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }

        // Subject validation
        if (field.attr('name') === 'subject') {
            if (!value) {
                errorMessage = 'Please select a subject';
                isValid = false;
            }
        }

        // Message validation
        if (field.attr('name') === 'message') {
            if (!value.trim()) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.trim().length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
        }

        // Update UI
        if (isValid) {
            fieldGroup.addClass('success');
            field.addClass('success');
            errorElement.text('');
        } else {
            fieldGroup.addClass('error');
            field.addClass('error');
            errorElement.text(errorMessage);
        }

        return isValid;
    }

    // Real-time validation
    $('.contact-form').on('input blur change', 'input, select, textarea', function () {
        validateField($(this), $(this).val());
    });

    // Form submission
    $(".contact-form").submit(function (e) {
        e.preventDefault();

        const form = $(this);
        const submitBtn = $('#submitContactForm');
        const btnText = submitBtn.find('.btn-text');
        const btnLoading = submitBtn.find('.btn-loading');

        // Validate all required fields
        let isFormValid = true;
        const requiredFields = ['name', 'email', 'phone', 'message'];

        requiredFields.forEach(function (fieldName) {
            const field = $(`[name="${fieldName}"]`);
            if (!validateField(field, field.val())) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // Focus on first error field
            const firstError = $('.form-group.error').first().find('input, select, textarea');
            if (firstError.length) {
                firstError.focus();
            }
            return false;
        }

        // Show loading state
        submitBtn.addClass('loading').prop('disabled', true);
        btnText.hide();
        btnLoading.show();

        // Collect form data
        const formData = {
            name: $('#contactName').val(),
            email: $('#contactEmail').val(),
            phone: $('#contactPhone').val(),
            message: $('#contactMessage').val()
        };

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success message
            $('.loading').fadeIn('slow').html('<font color="#48af4b">Message sent successfully! We will get back to you soon.</font>').delay(3000).fadeOut('slow');

            // Reset form and close modal
            setTimeout(() => {
                closeModal();
            }, 2000);
        }, 2000);

        // In a real application, you would send the data to your server:
        /*
        $.ajax({
            type: "POST",
            data: formData,
            url: "php/contactForm.php",
            cache: false,
            success: function (d) {
                $(".form-control").removeClass("success");
                if(d == 'success') {
                    $('.loading').fadeIn('slow').html('<font color="#48af4b">Mail sent Successfully.</font>').delay(3000).fadeOut('slow');
                    setTimeout(() => {
                        closeModal();
                    }, 2000);
                } else {
                    $('.loading').fadeIn('slow').html('<font color="#ff5607">Mail not sent. Please try again.</font>').delay(3000).fadeOut('slow');
                }
            },
            error: function() {
                $('.loading').fadeIn('slow').html('<font color="#ff5607">An error occurred. Please try again.</font>').delay(3000).fadeOut('slow');
            },
            complete: function() {
                submitBtn.removeClass('loading').prop('disabled', false);
                btnText.show();
                btnLoading.hide();
            }
        });
        */

        return false;
    });

    // Reset form function
    function resetForm() {
        $('.contact-form')[0].reset();
        $('.form-group').removeClass('error success');
        $('.form-control').removeClass('error success');
        $('.error-message').text('');
        $('#submitContactForm').removeClass('loading').prop('disabled', false);
        $('#submitContactForm .btn-text').show();
        $('#submitContactForm .btn-loading').hide();
        $('.loading').hide();
    }

    // Reset button functionality
    $("#reset").on('click', function () {
        resetForm();
    });

    // Ensure body scroll is restored on page load
    $(window).on('load', function () {
        forceEnableScrolling();
    });

    // Force enable scrolling function
    function forceEnableScrolling() {
        $('body').removeClass('modal-open wsactive');
        $('body').removeAttr('style');
        $('html').removeAttr('style');

        $('body').css({
            'overflow': 'auto !important',
            'overflow-x': 'hidden !important',
            'overflow-y': 'auto !important'
        });

        $('html').css({
            'overflow': 'auto !important',
            'overflow-x': 'hidden !important',
            'overflow-y': 'auto !important'
        });
    }

    // Additional safety: reset on page unload
    $(window).on('beforeunload', function () {
        forceEnableScrolling();
    });

    // Force enable scrolling when window is resized or focused
    $(window).on('resize focus', function () {
        if (!contactForm.hasClass('show')) {
            forceEnableScrolling();
        }
    });

    // Monitor for any changes to body classes or styles
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' &&
                (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                if (!contactForm.hasClass('show')) {
                    setTimeout(forceEnableScrolling, 100);
                }
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    // Debug function to check body state
    function debugBodyState() {
        console.log('Body overflow:', $('body').css('overflow'));
        console.log('Body classes:', $('body').attr('class'));
        console.log('Body style:', $('body').attr('style'));
    }

    // Add debug to close modal
    function closeModalWithDebug() {
        console.log('Before closing modal:');
        debugBodyState();

        closeModal();

        setTimeout(() => {
            console.log('After closing modal:');
            debugBodyState();
        }, 100);
    }

    // Replace close modal calls with debug version
    closeBtn.off('click').on('click', closeModalWithDebug);
    contactForm.off('click').on('click', function (e) {
        if (e.target === this) {
            closeModalWithDebug();
        }
    });

})



