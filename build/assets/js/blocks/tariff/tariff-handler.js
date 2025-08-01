async function chooseProduct(productId) {
    paymentFormLoadProduct(productId)
    showFormContent(productId)
}

function showFormContent(productId) {
    showFormHead(productId)
    showFormBottom(productId)
}

function showFormHead(productId) {
    const formHeads = document.querySelectorAll('.form__head-wrap')
    for (let index = 0; index < formHeads.length; index++) {
        formHeads[index].style.display = 'none';
    }
    const productFormHead = document.querySelector(`.form__head-wrap[data-content-product="${productId}"]`)
    productFormHead.style.display = 'block';
}

function showFormBottom(productId) {
    const formBottoms = document.querySelectorAll('.form__bottom-info')
    for (let index = 0; index < formBottoms.length; index++) {
        formBottoms[index].style.display = 'none';
    }
    const productFormBottom = document.querySelector(`.form__bottom-info[data-content-product="${productId}"]`)
    productFormBottom.style.display = 'block';
}
