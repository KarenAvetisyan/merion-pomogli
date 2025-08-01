function processPayment(paymentData) {

    switch (paymentData.payment.provider) {
        case "cloud-payments":
            payWithCloudPayments(paymentData);
            break;
        case "paytoday":
            payWithPayToday(paymentData);
            break;
        case "dolyame":
            payWithDolyame(paymentData);
            break;
        case "tinkoff-installment":
            payWithTinkoffInstallment(paymentData);
            break;
        case "sberbank-installment":
            payWithSberbankInstallment(paymentData);
            break;
        case "alfabank-installment":
            payWithAlfabankInstallment(paymentData);
            break;
        case "sng-installment":
            payWithSngInsyallment(paymentData);
            break;
        case "legal-entity":
            payWithLegalEntity(paymentData);
            break;
        case "corporate":
            payWithCorporate(paymentData);
            break;
        default:
            console.error("Неизвестный способ оплаты");
    }
}


async function payWithCorporate(data) {
    console.log("Оплата через работодателя", data);
    const payment = await sendPaymentRequest(data, 'corporate')
}

async function applyPromoCode(productId, promocode) {
    try {
        const response = await fetch('/api/v1/promocode/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                code: promocode,
                product_id: productId
            })
        });

        if (!response.ok && (response.status !== 422 && response.status !== 404) ) {
            console.log(response.ok, response.status)
            throw new Error(`HTTP error! status: ${response.status}`);
        }


        const responseJson = await response.json();

        if (!response.ok && response.status === 404) {
            return {
                success: false,
                message: responseJson.message || 'Ошибка промокода'
            };
        }

        const data = responseJson.data;

        if (data && typeof data.product.full_price !== 'undefined' &&
            typeof data.product.price !== 'undefined') {
            return data;
        }
        return {
            success: false,
            message: responseJson.message || 'Invalid response format'
        };

    } catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to apply promo code'
        };
    }
}

async function payWithCloudPayments(data) {
    console.log("Оплата Cloud Payments", data);
    const payment = await sendPaymentRequest(data, 'cloud-payments')

    if (payment.success !== undefined && payment.success === false) {
        window.dispatchEvent(new CustomEvent('paymentStatusFail', {
            detail: {
                type: 'fail',
                reason: payment.message,
                data: data,
                payment: payment
            }
        }));
        return;
    }
    let widget = new cp.CloudPayments();
    widget.pay('charge',
        {
            publicId: payment.provider.public_id,
            description: payment.invoice.description,
            amount: payment.invoice.price,
            invoiceId: payment.invoice.invoice_id,
            currency: 'RUB',
            skin: "classic",
            email: payment.invoice.lead.email,
            accountId: payment.invoice.lead.email,
            requireEmail: true,
            data: {
                name: payment.invoice.lead.name,
                phone: payment.invoice.lead.phone
            },
            configuration: {
                common: {
                    successRedirectUrl: payment.provider.success_url,
                    failRedirectUrl:payment.provider.fail_url
                }
            },
        },
        {
            onSuccess: function (options) { // success
                console.log("Success payment", options)
                window.dispatchEvent(new CustomEvent('paymentStatusSuccess', {
                    detail: {
                        type: 'success',
                        data: options,
                        payment: payment
                    }
                }));
            },
            onFail: function (reason, options) { // fail
                console.log("Fail payment", reason,options)
                window.dispatchEvent(new CustomEvent('paymentStatusFail', {
                    detail: {
                        type: 'fail',
                        reason: reason,
                        data: options,
                        payment: payment
                    }
                }));
            },
            onComplete: function (paymentResult, options) {
                console.log("Complete payment", options)
                window.dispatchEvent(new CustomEvent('paymentStatusComplete', {
                    detail: {
                        type: 'complete',
                        result: paymentResult,
                        data: options,
                        payment: payment
                    }
                }));

                if (paymentResult.success === true) {
                    if (IsSafari()) {
                        window.location.href = link;
                    } else {
                        window.open(payment.provider.success_url, '_blank').focus();
                    }
                }
            }
        }
    )

}

async function payWithPayToday(data) {
    console.log("Оплата Pay Today", data);
    const payment = await sendPaymentRequest(data, 'paytoday')

    if (payment.success !== undefined && payment.success === false) {
        window.dispatchEvent(new CustomEvent('paymentStatusFail', {
            detail: {
                type: 'fail',
                reason: payment.message,
                data: data,
                payment: payment
            }
        }));
        return;
    }
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET",payment.provider.link);
    xmlHttp.send();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            let res = JSON.parse(xmlHttp.responseText);
            let link = res["payment_link"];

            if (IsSafari()) {
                window.location.href = link;
            } else {
                window.open(link, '_blank').focus();
            }

        } else {

        }
    };

}


async function payWithDolyame(data) {
    console.log("Оплата долями", data);
    const payment = await sendPaymentRequest(data, 'dolyame')
    if (payment.success !== undefined && payment.success === false) {
        window.dispatchEvent(new CustomEvent('paymentStatusFail', {
            detail: {
                type: 'fail',
                reason: payment.message,
                data: data,
                payment: payment
            }
        }));
        return;
    }
    const link = payment.provider.link;
    if (IsSafari()) {
        window.location.href = link;
    } else {
        window.open(link, '_blank').focus();
    }

}

async function payWithTinkoffInstallment(data) {
    console.log("Оплата рассрочкой Тинькофф", data);
    const payment = await sendPaymentRequest(data, 'tinkoff-installment')

    if (payment.success !== undefined && payment.success === false) {
        window.dispatchEvent(new CustomEvent('paymentStatusFail', {
            detail: {
                type: 'fail',
                reason: payment.message,
                data: data,
                payment: payment
            }
        }));
        return;
    }
    const items = payment.invoice.products.map(function (item) {
        return {name: item.payment_description, price: item.atm_price, quantity: item.quantity}
    })

    const installmentData = {
        sum: payment.invoice.price,
        items: items,
        demoFlow: 'sms',
        promoCode: payment.provider.code,
        shopId: payment.provider.shop_id,
        showcaseId: payment.provider.showcase_id,
        orderNumber: payment.provider.installment_id,
        webhookURL: payment.provider.webhook_url,
        successURL: payment.provider.success_url,
        failURL: payment.provider.fail_url,
    };

    tinkoff.create(
        installmentData,
        {view: 'newTab'}
    );


}

function payWithAlfabankInstallment(data) {
    console.log("Оплата рассрочкой Альфабанк", data);
}

function payWithSngInsyallment(data) {
    console.log("Оплата рассрочка СНГ", data);
}

function payWithSberbankInstallment(data) {
    console.log("Оплата рассрочкой Сбербанк", data);
}


async function payWithLegalEntity(data) {
    console.log("Оплата через работодателя", data);
    const payment = await sendPaymentRequest(data, 'legal-entity')
    if (payment.success !== undefined && payment.success === false) {
        window.dispatchEvent(new CustomEvent('paymentStatusFail', {
            detail: {
                type: 'fail',
                reason: payment.message,
                data: data,
                payment: payment
            }
        }));
        return;
    }

    if (payment.provider && payment.provider.success_url) {
        window.location.href = payment.provider.success_url;
    }

}

async function loadProduct(productId, promoCode = null) {
    try {
        const params = new URLSearchParams({ promocode: promoCode });
        const url = `/api/v1/product/info/${productId}?${params.toString()}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseJson = await response.json();
        return  responseJson.data;
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to apply promo code'
        };
    }
}

async function sendPaymentRequest(data, provider) {
    try {
        const response = await fetch('/api/v1/payment/new/'+provider, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseJson = await response.json();
        return  responseJson.data;
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Failed to apply promo code'
        };
    }
}


