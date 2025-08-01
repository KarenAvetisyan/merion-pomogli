document.addEventListener('DOMContentLoaded', function(){

    // STEP CONTENT CHANGE
    const steps = document.querySelectorAll('[data-step-target]');
    const sections = document.querySelectorAll('[data-step-section]');
    function switchTab(event) {

        const targetTab = event.target.getAttribute('data-step-target');
        steps.forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
        sections.forEach(section => {
        if (section.getAttribute('data-step-section') === targetTab) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
        });
    }
    steps.forEach(tab => {
        tab.addEventListener('click', switchTab);
    });
    if (steps.length > 0) {
        steps[0].click();
    }

    // FLAGS SELECT
    const formFlagSelect = document.querySelector('.form__flag-select');
    if (formFlagSelect) {
        const selectElement = formFlagSelect.querySelector('.select');
        const selectFlagImage = formFlagSelect.querySelector('.select img.flag__img');
        const selectCodeInput = formFlagSelect.querySelector('.select .flag__code');
        const inputField = formFlagSelect.querySelector('.select__input');
        const options = formFlagSelect.querySelectorAll('.option');
        const defaultOption = formFlagSelect.querySelector('.option.selected');
        const searchInput = formFlagSelect.querySelector('.search');
        const iconSearch = document.querySelector('.icon-search');
        const iconSearchClose = document.querySelector('.icon-search-close');
        const optionContainerWrap = formFlagSelect.querySelector('.option-container-wrap');
        const phoneInput = document.querySelector('.phone-mask');

        if (defaultOption) {
            updateSelection(defaultOption);
            applyPhoneMask(defaultOption.getAttribute('data-code'));
        }
        if(selectElement){
            selectElement.addEventListener('click', () => {
                formFlagSelect.classList.toggle('active');
            });
        }
        if (searchInput && iconSearch && iconSearchClose) {
            function toggleIcons() {
                const isEmpty = !searchInput.value.trim();
                iconSearch.style.display = isEmpty ? 'inline-block' : 'none';
                iconSearchClose.style.display = isEmpty ? 'none' : 'inline-block';
            }

            searchInput.addEventListener('input', (e) => {
                filterOptions(e.target.value);
                toggleIcons();
            });

            iconSearchClose.addEventListener('click', () => {
                searchInput.value = ''; // Clear the input
                toggleIcons(); // Update the icons
                resetOptionsOrder()
            });

            // Initialize the icon visibility on page load
            toggleIcons();
        }

        options.forEach(option => {
            option.addEventListener('click', () => {
                updateSelection(option);
                resetOptionsOrder();
                formFlagSelect.classList.remove('active');
                resetSearch();
                resetOptionsVisibility();
                resetPhoneInput();
                applyPhoneMask(option.getAttribute('data-code'));
            });
        });

        document.addEventListener('click', (e) => {
            if (!formFlagSelect.contains(e.target) && formFlagSelect.classList.contains('active')) {
                formFlagSelect.classList.remove('active');
            }
        });

        function updateSelection(option) {
            inputField.value = option.getAttribute('data-country');
            selectFlagImage.setAttribute('src', option.querySelector('img.flag').src);
            selectCodeInput.value = option.getAttribute('data-code');
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        }
        function resetScrollPosition() {
            optionContainerWrap.scrollTop = 0;
        }
        function filterOptions(query) {
            const filter = query.toUpperCase();
            options.forEach(option => {
                const text = option.textContent || option.innerText;
                if (text.toUpperCase().includes(filter)) {
                    option.style.order = '-1';
                    resetScrollPosition();
                } else {
                    option.style.order = '';
                }
            });
        }
        function resetOptionsOrder() {
            options.forEach(option => {
                option.style.order = '';
            });
        }
        function resetSearch() {
            if (searchInput) {
                searchInput.value = '';
            }
        }
        function resetOptionsVisibility() {
            options.forEach(option => {
                option.style.display = '';
            });
        }
        function resetPhoneInput() {
            if (phoneInput) {
                phoneInput.value = '';
            }
        }
        function applyPhoneMask(countryCode) {
            if (phoneInput) {
                const maskPattern = getPhoneMaskPattern(countryCode);
                if (maskPattern) {
                    Inputmask(maskPattern).mask(phoneInput);
                }
            }
        }
        function getPhoneMaskPattern(countryCode) {
            const countryElement = document.querySelector(`[data-code="${countryCode}"]`);
            if (countryElement) {
                return countryElement.getAttribute('data-mask') || '';
            }
            return '';
        }
    }

    // SLIDE TOGGLE
    HTMLElement.prototype.slideToggle = function(duration, callback) {

        if (this.clientHeight === 0) {
          _s(this, duration, callback, true);

        } else {
          _s(this, duration, callback);

        }
    };
    HTMLElement.prototype.slideUp = function(duration, callback) {
    _s(this, duration, callback);
    };
    HTMLElement.prototype.slideDown = function (duration, callback) {
    _s(this, duration, callback, true);
    };
    function _s(el, duration, callback, isDown) {

    if (typeof duration === 'undefined') duration = 1000;
    if (typeof isDown === 'undefined') isDown = false;

    el.style.overflow = "hidden";
    el.classList.add('is-open');

    var elStyles        = window.getComputedStyle(el);

    var elHeight        = parseFloat(elStyles.getPropertyValue('height'));
    var elPaddingTop    = parseFloat(elStyles.getPropertyValue('padding-top'));
    var elPaddingBottom = parseFloat(elStyles.getPropertyValue('padding-bottom'));
    var elMarginTop     = parseFloat(elStyles.getPropertyValue('margin-top'));
    var elMarginBottom  = parseFloat(elStyles.getPropertyValue('margin-bottom'));

    var stepHeight        = elHeight        / duration;
    var stepPaddingTop    = elPaddingTop    / duration;
    var stepPaddingBottom = elPaddingBottom / duration;
    var stepMarginTop     = elMarginTop     / duration;
    var stepMarginBottom  = elMarginBottom  / duration;

    var start;

    function step(timestamp) {

        if (start === undefined) start = timestamp;

        var elapsed = timestamp - start;

        if (isDown) {
        el.style.height        = (stepHeight        * elapsed) + "px";
        el.style.paddingTop    = (stepPaddingTop    * elapsed) + "px";
        el.style.paddingBottom = (stepPaddingBottom * elapsed) + "px";
        el.style.marginTop     = (stepMarginTop     * elapsed) + "px";
        el.style.marginBottom  = (stepMarginBottom  * elapsed) + "px";
        } else {
        el.style.height        = elHeight        - (stepHeight        * elapsed) + "px";
        el.style.paddingTop    = elPaddingTop    - (stepPaddingTop    * elapsed) + "px";
        el.style.paddingBottom = elPaddingBottom - (stepPaddingBottom * elapsed) + "px";
        el.style.marginTop     = elMarginTop     - (stepMarginTop     * elapsed) + "px";
        el.style.marginBottom  = elMarginBottom  - (stepMarginBottom  * elapsed) + "px";
        }

        if (elapsed >= duration) {
        el.style.height        = "";
        el.style.paddingTop    = "";
        el.style.paddingBottom = "";
        el.style.marginTop     = "";
        el.style.marginBottom  = "";
        el.style.overflow      = "";
        if (!isDown) el.classList.remove('is-open');
        if (typeof callback === 'function') callback();
        } else {
        window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
    }
    document.addEventListener("click", function(e){

        if(!e.target.classList.contains('drop-head')){
        }
        else {
            e.target.classList.toggle('active');
            var nextPanel = e.target.nextElementSibling;
            nextPanel.slideToggle(400);
        }
    })

    // Рассрочка на: слайды
    const radios = document.querySelectorAll('.installments__wrap input[name="installment-month"]');
    const slider = document.querySelector('.installments__wrap .slider');
    function updateSlider() {
    const selectedRadio = document.querySelector('.installments__wrap input[name="installment-month"]:checked');
    if (!selectedRadio) return;
    const selectedLabel = selectedRadio.closest('.installments__wrap .installment__label');
    const labelLeft = selectedLabel.offsetLeft;
    const labels = document.querySelectorAll('.installments__wrap .installment__label'); // Get all labels
    const numOfLabels = labels.length;
    slider.className = 'i_slider';
    slider.classList.add(`one_${numOfLabels}`);
    slider.style.transform = `translateX(${labelLeft}px)`;
    }
    radios.forEach(radio => {
    radio.addEventListener('change', updateSlider);
    });
    updateSlider();

    // COPY TOOLTIP
    if (window.innerWidth > 1024) {
        const copyLinks = document.querySelectorAll('.copy-link');
        copyLinks.forEach(link => {
            if (link) {
                const tooltip = document.createElement('span');
                tooltip.classList.add('tooltip');
                tooltip.textContent = link.getAttribute('data-tooltip');
                link.appendChild(tooltip);
                let tooltipClicked = false;

                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (!tooltipClicked) {
                        tooltip.style.visibility = 'visible';
                        tooltip.style.opacity = '1';
                        link.classList.add('clicked');
                    }
                });

                tooltip.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!tooltipClicked) {
                        tooltipClicked = true;
                        tooltip.textContent = "Скопировано";
                        const textToCopy = link.href.replace(/^(mailto:|tel:|https?:\/\/)/, '');
                        navigator.clipboard.writeText(textToCopy)
                            .then(() => {
                                console.log('Скопировано: ', textToCopy);
                            })
                            .catch(err => {
                                console.error('Error copying text: ', err);
                            });
                    }
                });

                document.addEventListener('click', function(e) {
                    if (!link.contains(e.target) && !tooltip.contains(e.target)) {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = '0';
                        link.classList.remove('clicked');
                        tooltipClicked = false;
                        tooltip.textContent = link.getAttribute('data-tooltip');  // Reset the tooltip text
                    }
                });
            }
        });
    }
    // POPUP FOR TELEGRAM LINK
    if (window.innerWidth < 1024) {
        const telegramLink = document.getElementById('telegram-link');
        if (telegramLink) {
            telegramLink.addEventListener('click', function(e) {
                e.preventDefault();
                const existingPopup = document.querySelector('.social-popup');
                if (existingPopup) {
                    return;
                }
                const popup = document.createElement('div');
                popup.classList.add('social-popup');
                popup.innerHTML = `
                    <p>Вы хотите перейти в Telegram?</p>
                    <a href="${telegramLink.href}" target="_blank">Да, перейти</a>
                    <button id="close-popup">Закрыть</button>
                `;
                document.body.appendChild(popup);
                setTimeout(() => popup.classList.add('show'), 10);
                document.getElementById('close-popup').addEventListener('click', function() {
                    popup.classList.remove('show');
                    setTimeout(() => {
                        if (popup.parentElement) {
                            popup.parentElement.removeChild(popup);
                        }
                    }, 300);
                });
                document.addEventListener('click', function(e) {
                    if (!popup.contains(e.target) && !telegramLink.contains(e.target)) {
                        popup.classList.remove('show');
                        setTimeout(() => {
                            if (popup.parentElement) {
                                popup.parentElement.removeChild(popup);
                            }
                        }, 300);
                    }
                });
            });
        }
    }

    // STEP 2 RADIO BUTTONS FUNCTIONS
    const paymentVariants = document.querySelectorAll('.payment__variant');
    const paymentContents = document.querySelectorAll('.payment__variant-content');
    function hideAllPaymentContent() {
        paymentContents.forEach(function(content) {
            content.style.display = 'none';
            // Remove active class from parent div as well
            const parent = content.closest('.payment__content');
            if (parent) {
                parent.classList.remove('active');
            }
        });
    }
    function showPaymentContent(variantContentId) {
        console.log("showPaymentContent")
        const contentToShow = document.getElementById(variantContentId);
        if (contentToShow) {
            contentToShow.style.display = 'block';
            // Add active class to the parent div when content is shown
            const parent = contentToShow.closest('.payment__content');
            if (parent) {
                parent.classList.add('active');
            }
        }
    }
    paymentVariants.forEach(function(paymentVariant) {
        paymentVariant.addEventListener('click', function(event) {
            const radioButton = event.target && event.target.classList.contains('radio__input-variant') ? event.target : null;

            if (radioButton) {
                radioButton.checked = true;
                const variantContentId = radioButton.dataset.variantContent;
                paymentVariants.forEach(function(variant) {
                    variant.classList.remove('active');
                });
                paymentVariant.classList.add('active');
                hideAllPaymentContent();
                showPaymentContent(variantContentId);
            } else {
                const firstRadioButton = paymentVariant.querySelector('.radio__input-variant');
                if (!paymentVariant.classList.contains('active')) {
                    if (firstRadioButton && !firstRadioButton.checked) {
                        firstRadioButton.checked = true;
                    }
                    paymentVariants.forEach(function(variant) {
                        variant.classList.remove('active');
                    });
                    paymentVariant.classList.add('active');
                    hideAllPaymentContent();
                    const variantContentId = firstRadioButton.dataset.variantContent;
                    showPaymentContent(variantContentId);
                }
            }
        });
    });
    // window.addEventListener('load', function() {
    //
    // });

    const checkedRadioButton = document.querySelector('.radio__input-variant:checked');
    if (checkedRadioButton) {
        const variantContentId = checkedRadioButton.dataset.variantContent;
        hideAllPaymentContent();
        showPaymentContent(variantContentId);
        paymentVariants.forEach(function(variant) {
            variant.classList.remove('active');
        });
        const activeVariant = checkedRadioButton.closest('.payment__variant');
        activeVariant.classList.add('active');
    }

    // UNDER 1024
    function moveContentUnder1024px() {
        if (window.innerWidth <= 1024) {
            const variants = document.querySelectorAll('.payment__variant');

            variants.forEach(variant => {
                const contentId = variant.getAttribute('data-content');
                const contentDiv = document.querySelector(`#${contentId}`);

                if (contentDiv) {
                    const variantBox = variant.querySelector('.payment__variant-box');
                    if (variantBox && !variantBox.contains(contentDiv)) {
                        variantBox.appendChild(contentDiv);
                    }
                }
            });
        }
    }
    window.addEventListener('load', moveContentUnder1024px);
    window.addEventListener('resize', moveContentUnder1024px);


})





