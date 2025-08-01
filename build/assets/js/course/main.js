function openAuthorInfo() {
    const btn = document.querySelector('.courseFromAuthor-info__open')
    const content = document.querySelector('.courseFromAuthor-info__list')
    if (!btn) return

    btn.addEventListener('click', (e) => {
        e.preventDefault()

        btn.classList.add('hidden')
        content.classList.add('full')
    })
}

openAuthorInfo()



function changeType() {
    const items = document.querySelectorAll('.eichIntensive-form__item')
    const inputs = document.querySelectorAll('.eichIntensive-form__radio input')
    if (!items.length) return

    items.forEach(item => {
        item.addEventListener('click', () => {

            if (item.classList.contains('active')) return

            items.forEach(i => i.classList.remove('active'))
            inputs.forEach(i => i.checked = false)
            item.classList.add('active')

            const input = item.querySelector('.eichIntensive-form__radio input')
            input.checked = true

            updateInstallmentPrice(input.value);
        })
    })
}

changeType()

function changeCard() {
    const items = document.querySelectorAll('.eichIntensive-form__radio .change-card')
    const cards = document.querySelectorAll('.eichIntensive-form__item-card.card')
    if (!items.length) return

    items.forEach(item => {
        item.addEventListener('change', () => {
            const tp = item.dataset.type

            cards.forEach(i => i.classList.remove('active'))

           // document.querySelector(`.eichIntensive-form__item-card.card[data-type="${tp}"]`).classList.add('active')

            const activeCard = document.querySelector(`.eichIntensive-form__item-card.card[data-type="${tp}"]`);
            activeCard.classList.add('active');

            updateInstallmentPrice(tp);
        })
    })
}

changeCard()





function isEmailValid(email) {
    return /\S+@\S+\.\S+/.test(email);
}

function isPhoneValid(phone) {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
}

const ajaxSend = async formData => {
    const fetchResp = await fetch('./form.php', {
        method: 'POST',
        body: formData
    });
    if (!fetchResp.ok) {
        throw new Error(`${url}, ${fetchResp.status}`);
    }
    return await fetchResp.text();
};

function checkEmailFormSend() {
    const forms = document.querySelectorAll('.form');
    if (!forms.length) return;

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const inputEmail = form.querySelector('input[data-email]');
            const phoneInput = form.querySelector('input[data-phone]');

            // Check email
            if (!isEmailValid(inputEmail.value) && inputEmail) {
                inputEmail.classList.add('error');
            } else {
                inputEmail.classList.remove('error');
            }

            // Check phone
            if (!isPhoneValid(phoneInput.value) && phoneInput) {
                phoneInput.classList.add('error');
            } else {
                phoneInput.classList.remove('error');
            }

            const errorInputs = form.querySelectorAll('.error')

            if (!errorInputs.length) form.classList.add('send')



        });
    })


}

checkEmailFormSend();
