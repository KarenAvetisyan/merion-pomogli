document.addEventListener('DOMContentLoaded', function (){



    // window.addEventListener('paymentStatusSuccess', this.handlePaymentSuccess);
    // window.addEventListener('paymentStatusFail', this.handlePaymentFail);
    // window.addEventListener('paymentStatusComplete', this.handlePaymentComplete);

    // STEP 1 FORM FORM VALIDATION AND SUBMIT
    const mainForm = document.getElementById('main-form');
    const legalForm = document.getElementById('legal-form');

    /**
     * Текущий ProductId
     */
    const element = document.querySelector('[data-content-product]');
    let loadedProductId = element.dataset.contentProduct;
    console.log("Loaded Product", loadedProductId)


    const paymentVariantForm = document.getElementById('payment-variant-form');

    const promocodeElement = document.querySelector('[data-used-promocode]');
    const promoCode = promocodeElement?.getAttribute('data-used-promocode');
    let usedPromoCode = promoCode;
    if (usedPromoCode) {
        console.log("Loaded promocode", usedPromoCode)
    }
    let selectedInstallmentPeriod = "12 мес";
    let productInstallmentPrices = null;

    const step__1 = document.querySelector('.step--box__tab[data-step-target="step-1"]');
    const step__2 = document.querySelector('.step--box__tab[data-step-target="step-2"]');
    const step__3 = document.querySelector('.step--box__tab[data-step-target="step-3"]');
    const step__4 = document.querySelector('.step--box__tab[data-step-target="step-4"]');


    // Блоки статусов оплат
    const failPaymentBlock = document.getElementById('payment-failed-block');
    const waitingPaymentBlock = document.getElementById('payment-waiting-block');
    showPaymentResultBlock(waitingPaymentBlock)

    let leadFormData = null

    if (mainForm) {
        mainForm.addEventListener('submit', mainFormSend);
        async function mainFormSend(e) {
            e.preventDefault();

            let error = formValidate(mainForm);

           //  error = 0;
            if (error != 0) {
                // "Form has errors";
            } else {
                leadFormData = new FormData(mainForm);

                if(step__2){
                    step__2.click()
                }
            }
        }
    }
    if (legalForm) {
        legalForm.addEventListener('submit', legalFormSend);
        async function legalFormSend(e) {
            e.preventDefault();
            let error = formValidate(legalForm);
            console.log(error)
            if (error != 0) {
                // "Form has errors";
                // e.target.classList.add('hide');
                // document.getElementById('legal-form-fail').classList.add('show');
            } else {
                const legalFormData = new FormData(legalForm);

                const legalRequest = {
                    lead: {
                        name: legalFormData.get("name"),
                        email: legalFormData.get("email"),
                        phone: legalFormData.get("phone"),
                        company: legalFormData.get("company"),
                        message: legalFormData.get("message"),
                    },
                    course: {
                        product_id: loadedProductId,
                    },
                    payment: {
                        provider: "corporate",
                    }
                };

                processPayment(legalRequest);
                // "Form is valid";
                e.target.classList.add('hide');
                document.getElementById('legal-form-success').classList.add('show');
            }
        }
    }


    /**
     * Подписка на эвенты платежей
     */
    window.addEventListener('paymentStatusFail', (event) => {
        const { reason, data, payment } = event.detail;
        console.log('Оплата не прошла [paymentStatusFail]', reason, data, payment);
        if (reason === "User has cancelled") {
            step__2.click();
            return;
        }
        showPaymentResultBlock(failPaymentBlock)
    });

    window.addEventListener('paymentStatusComplete', (event) => {
        const { data, payment, result } = event.detail;
        console.log('Оплата прошла [paymentStatusComplete]', result, data, payment);
        step__4.click()
    });


    //async function applyPromoCode()

    async function applyPromoCodeFormSend(e) {
        console.log("applyPromoCodeFormSend")
        e.preventDefault();
        const paymentContent = document.querySelector(".payment__content.active")
        const promocodeInputElement = paymentContent.querySelector('.promocode__input');
        if(!promocodeInputElement) {
            return;
        }
        const promoCodeValidationError = document.querySelectorAll("#promocode-validation-error")
        const promoCodeContainers = document.querySelectorAll(".promocode")
        // Собрасываем ошибки
        promoCodeContainers.forEach(t => {
            const err = t.closest('.error__text');
            if(err) {
                err.style.display = "none"
            }
        })
        const promocodeData = await applyPromoCode(loadedProductId, promocodeInputElement.value)
        console.log("error", promocodeData)
        if (promocodeData.success === false) {
            if(promoCodeValidationError) {
                promoCodeValidationError.forEach(err => {
                    err.innerText = promocodeData.message
                    err.style.display = 'block'
                })
            }
            return;
        }

        usedPromoCode = promocodeData.promocode.code;

        const product = promocodeData.product;

        productPromocode = product.used_promocodes[0] ?? null
        updateStockInfo(
            productPromocode && productPromocode.is_additive ? product.no_promocode_discount : product.discount,
            product.discount_end_at,
            productPromocode ? productPromocode.code  : null,
            productPromocode ? (productPromocode.is_additive ? productPromocode.discount : null) : null
        )
        updateProductInstallmentPrices(product.installment_prices)
        updatePaymentSchedule(product.payment_schedule, product.dolyami_price)
        promoCodeContainers.forEach(t => {
            t.innerHTML = ""
        });

        animatePrice(product.price, 200)


    }


    if (paymentVariantForm) {

        paymentVariantForm.addEventListener('submit', paymentVariantFormSend);



        async function paymentVariantFormSend(e) {
            e.preventDefault();
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            const paymentMethod = selectedPayment ? selectedPayment.dataset.paymentMethod : null;
            const formData = new FormData(paymentVariantForm);


            const paymentData = {
                lead: {
                    name: leadFormData.get("name"),
                    email: leadFormData.get("email"),
                    phone: leadFormData.get("phone"),
                    code: leadFormData.get("phone_code"),
                },
                course: {
                    product_id: loadedProductId,
                },
                payment: {
                    provider: paymentMethod,
                    installment_period: formData.get("installment-month"),
                    code: usedPromoCode
                }
            };

            console.log(paymentData)

            // Вызов обработки оплаты
            processPayment(paymentData);

            if(step__3){
                step__3.click()
            }
        }
    }

    function hide (elements) {
        elements = elements.length ? elements : [elements];
        for (var index = 0; index < elements.length; index++) {
            elements[index].style.display = 'none';
        }
    }

    function showPaymentResultBlock(block) {
        hide([failPaymentBlock, waitingPaymentBlock]);
        block.style.display = 'block';
    }




    function formValidate(form) {
        let error = 0;
        let formReq = form.querySelectorAll('._req');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemove_Req_Error(input);

            if (input.classList.contains('_email')) {
                if (input.value.trim() == '') {
                    formAddReq(input);
                    error++;
                } else if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            }
            else if (input.classList.contains('_phone')) {
                if (input.value.trim() == '') {
                    formAddReq(input);
                    error++;
                } else if (!isPhoneLengthValid(input)) {
                    formAddError(input);
                    error++;
                }
            }
            else {
                if (input.value === '') {
                    formAddReq(input);
                    error++;
                }
            }
        }

        return error;
    }
    function isPhoneLengthValid(input) {
        const phoneMaskLength = getPhoneMaskLength(input); // Get the expected mask length
        return input.value.replace(/\D/g, '').length === phoneMaskLength; // Check if value length matches the expected length
    }
    function getPhoneMaskLength(input) {
        const countryCode = document.querySelector('.flag__code').value;
        const countryElement = document.querySelector(`[data-code="${countryCode}"]`);

        if (countryElement) {
            const mask = countryElement.getAttribute('data-mask');
            const digitCount = (mask.match(/9/g) || []).length;
            return digitCount;
        }
        return 0;
    }
    function formAddReq(input) {
        input.parentElement.classList.add('req_error');
    }
    function formAddError(input) {
        input.parentElement.classList.add('error_error');
    }
    function formRemove_Req_Error(input) {
        input.parentElement.classList.remove('req_error');
        input.parentElement.classList.remove('error_error');
    }
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }
    const textarea = document.querySelectorAll('.autoResizeTextarea');
    textarea.forEach(t=>{
        if(t){
            t.addEventListener('input', function (e) {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 186) + 'px';
            });
        }
    })


    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.submit.orange-btn[data-action="reload-payment"]');
        if(e.target.type === "radio" && e.target.name === "installment-month") {
            updateInstallmentPrice(e.target.value)
        }
        if (btn) {
            step__2.click()
        }
        if (e.target.classList.contains("promocode__btn")) {
            applyPromoCodeFormSend(e)
        }
    });


    function updateInstallmentPrice(period = null) {
        if (period) {
            selectedInstallmentPeriod = period
        }
        const priceContainers = document.querySelectorAll('.price__monthly[data-price-type="installment"]')

        for (let index = 0; index < priceContainers.length; index++) {

            let price = null;
            if(!productInstallmentPrices) {
                if (selectedInstallmentPeriod === "6 мес") {
                    price = priceContainers[index].dataset['installmentPricePeriod-6'];
                }
                if (selectedInstallmentPeriod === "12 мес") {
                    price = priceContainers[index].dataset['installmentPricePeriod-12'];
                }
            } else {
                price = productInstallmentPrices[selectedInstallmentPeriod]
            }
            if (price) {
                if (typeof price === 'string' || price instanceof String) {
                    price = Number(
                        price.replace(/\s/g, '')
                    );
                }

                if (!isNaN(price)) {
                    const formattedPrice = price.toLocaleString('ru-RU');
                    priceContainers[index].innerHTML = `${formattedPrice}<span class="currency"> ₽</span>`;
                } else {
                    console.error('Invalid price format:', price);
                }
            }
        }
    }


    function updateFormPrices(price, oldPrice = null) {
        const prices = document.querySelectorAll('.price[data-price-type="regular"]')
        const pricesTotal = document.querySelectorAll('.price__total[data-price-type="regular"]')
        const pricesOld = document.querySelectorAll('.price__old[data-price-type="regular"]')
        for (let index = 0; index < prices.length; index++) {
            prices[index].innerHTML = price.toLocaleString('ru-RU')+'<span class="currency"> ₽</span>';
        }
        for (let index = 0; index < pricesTotal.length; index++) {
            pricesTotal[index].textContent = "Всего "+price.toLocaleString('ru-RU')+' ₽';
        }
        if(oldPrice) {
            for (let index = 0; index < pricesOld.length; index++) {
                pricesOld[index].textContent = oldPrice.toLocaleString('ru-RU') + ' ₽';
                if (price === oldPrice) {
                    pricesOld[index].style.display = "none";
                } else {
                    pricesOld[index].style.display = "block";
                }
            }
        }

    }

    function updateStockInfo(discount, endAt = null, promoCode = null, additiveDiscount = null) {
        const stockInfoContainers = document.querySelectorAll('.payment__stock-info[data-promocode-affected="true"]')
        let str = "";
        if(promoCode && !additiveDiscount) {
            str += "Цена с промокодом <strong>" + promoCode + "</strong> - "+ discount+"%";
        } else {
            str += "Цена со скидкой <strong>" + discount + "%</strong>";
        }
        if (endAt) {
            str += " Акция действует до "+endAt;
        }

        if (additiveDiscount) {
            str += `<div class="promocode">+ скидка по промокоду <strong>${promoCode}</strong> - ${additiveDiscount}% </div>`
        }
        stockInfoContainers.forEach(t => {
            t.innerHTML = str;
        });
    }


    /**
     * Обновление данных рассрочки из полученного продукта
     * @param prices
     */
    function updateProductInstallmentPrices(prices) {
        productInstallmentPrices = {
            "6 мес" : prices["6m"] ?? 0,
            "12 мес" : prices["12m"] ?? 0,
            "24 мес" : prices["24m"] ?? 0,
        }
        updateInstallmentPrice(selectedInstallmentPeriod)
    }

    function updatePaymentSchedule(schedule, payment) {
        const scheduleContainer = document.querySelector(".part__wrap")
        let scheduleHtml = ""
        if(!scheduleContainer) {
            return;
        }
        if (typeof payment === 'string' || payment instanceof String) {
            payment = Number(
                payment.replace(/\s/g, '')
            );
        }
        schedule.forEach((item, index) => {
            const activePart = index === 0 ? " active" : "";
            scheduleHtml += `<div class="part${activePart}">
                                                    <div class="part__info">
                                                        <div class="part__info-date">${item}</div>
                                                        <div class="part__info-price">${payment.toLocaleString('ru-RU')} ₽</div>
                                                    </div>
                                                </div>`;
        })

        scheduleContainer.innerHTML = scheduleHtml;
    }

     paymentFormLoadProduct = async function (productId) {
         console.log("Loaded Product", loadedProductId, productId)
         const product = await loadProduct(productId, usedPromoCode)
         updateFormPrices(product.price, product.full_price)
         productPromocode = product.used_promocodes[0] ?? null
         updateStockInfo(
             productPromocode && productPromocode.is_additive ? product.no_promocode_discount : product.discount,
             product.discount_end_at,
             productPromocode ? productPromocode.code  : null,
             productPromocode ? (productPromocode.is_additive ? productPromocode.discount : null) : null
         )

         updateProductInstallmentPrices(product.installment_prices)
         updatePaymentSchedule(product.payment_schedule, product.dolyami_price)
         loadedProductId = productId;
        }


    function animatePrice(newPrice, duration = 300) {
        const paymentContent = document.querySelector(".payment__content.active")
        const priceElement = paymentContent.querySelector('.price');
        if(!priceElement) {
            updateFormPrices(newPrice)
            return;
        }
        const currentPrice = parseInt(priceElement.textContent.replace(/\s/g, '').replace('₽', ''));
        const steps = 10; // Количество шагов анимации
        const stepTime = duration / steps; // Время на каждый шаг (по длительности всей анимации)

        let step = 0;

        const interval = setInterval(() => {
            const currentValue = currentPrice + (newPrice - currentPrice) * (step / steps);
            priceElement.innerHTML = Math.round(currentValue).toLocaleString() + ' ₽';
            step++;

            if (step >= steps) {
                clearInterval(interval);
                priceElement.innerHTML = newPrice.toLocaleString() + ' ₽'; // Финальное значение
                updateFormPrices(newPrice)
            }
        }, stepTime);
    }


});
