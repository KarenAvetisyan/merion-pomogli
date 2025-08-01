const modal = document.getElementById('subscriptionModal');
const modalObj = new bootstrap.Modal('#subscriptionModal');
const courseName = document.getElementById('course-name').value;

function modalS() {
    let modalClosed = localStorage.getItem('modal-' + courseName);
    modal.addEventListener('hidden.bs.modal', function () {
        localStorage.setItem('modal-' + courseName, 'true');
    });
    if (!modalClosed) {
        setTimeout(() => {
            modalObj.show();
        }, 25000);
    }
}

modalS();


sendEmail = function (type, courseID) {
    event.preventDefault();

    let trialBlock = document.getElementsByClassName("trial-block");
    let trialBlockSuccess = document.getElementsByClassName("trial-block-success");
    let trialBlockFailure = document.getElementsByClassName("trial-block-failure");
    let elements = document.getElementsByClassName("trial-" + type);
    let buttons = Array.from(document.querySelectorAll('button[class*="Demo-form__btn"]'));

    for (let btn of buttons) {
        btn.classList.add("button--loading");
        btn.disabled = true;
    }

    document.getElementById('trial-form-modal').style.display = 'none';
    let loader = document.getElementById('pay-loader-modal');
    loader.style.display = "block";

    let formData = new FormData();
    for (let i = 0; i < elements.length; i++) {
        formData.append(elements[i].name, elements[i].value);
    }

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)  {
            loader.style.display = "none";

            if (xmlHttp.responseText != "error") {
                for (let tbs of trialBlockSuccess) {
                    tbs.style.display = "block";
                }

                if (type === "modal") {
                    document.querySelector('.modal-subscription-success').style.display = 'block';

                    setTimeout(() => {
                        modalObj.hide();
                        let courseName = document.getElementById('course-name').value;
                        localStorage.setItem('modal-' + courseName, 'true');
                    }, 3000);
                }

                let links = document.getElementsByClassName('tg-fl-link');

                for (let i = 0; i < links.length; i++) {
                    links[i].href = "https://tg.pulse.is/MerionAcademy_bot?start=611f4274b885ab028959d95c|uuid=" + xmlHttp.responseText;
                }
            } else {
                for (let tbf of trialBlockFailure) {
                    tbf.style.display = "block";
                }

                for (let btn of buttons) {
                    btn.classList.remove("button--loading");
                    btn.disabled = false;
                }
            }
        }
    };


    formData.append("type", "free-lesson");
    formData.append("course_id", courseID);
    console.log(formData)
    xmlHttp.open("post", "/api/v1/course/free-lesson");
    xmlHttp.send(formData);

    AdvCakePush(formData.get("email"), invoiceID, courseID, courseTitle, price, discountCode)
};


function sendEmail2(type, courseID) {
    event.preventDefault();

    let trialBlock = document.getElementsByClassName("trial-block");
    let trialBlockSuccess = document.getElementsByClassName("trial-block-success");
    let trialBlockFailure = document.getElementsByClassName("trial-block-failure");

    let elements = document.getElementsByClassName("trial-" + type);
    let buttons = Array.from(document.querySelectorAll('button[class*="Demo-form__btn"]'));

    let form = document.getElementsByClassName('free-lesson-form');
    let errorElement = document.getElementsByClassName('email-error');
    let thanksText =document.getElementsByClassName('thanks-text');
    let errorText = document.getElementsByClassName('error-text');

    for (let btn of buttons) {
        btn.classList.add("button--loading");
        btn.disabled = true;
    }

    document.getElementById('trial-form-modal').style.display = 'none';
    let loader = document.getElementById('pay-loader-modal');
    loader.style.display = "block";

    let formData = new FormData();
    for (let i = 0; i < elements.length; i++) {
        formData.append(elements[i].name, elements[i].value);
    }
    console.log(elements)
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            loader.style.display = "none";

            if (xmlHttp.responseText != "error") {
                for (let tbs of trialBlockSuccess) {
                    tbs.style.display = "block";
                }

                for (let f of form){
                    f.classList.add('hidden');
                }

                for (let tt of thanksText){
                    tt.classList.add('show');
                }


                if (type === "modal") {
                    document.querySelector('.modal-subscription-success').style.display = 'block';

                    setTimeout(() => {
                        modalObj.hide();
                        let courseName = document.getElementById('course-name').value;
                        localStorage.setItem('modal-' + courseName, 'true');
                    }, 3000);
                }

                let links = document.getElementsByClassName('tg-fl-link');

                for (let i = 0; i < links.length; i++) {
                    links[i].href = "https://tg.pulse.is/MerionAcademy_bot?start=611f4274b885ab028959d95c|uuid=" + xmlHttp.responseText;
                }
            } else {
                for (let tbf of trialBlockFailure) {
                    tbf.style.display = "block";
                }

                for (let btn of buttons) {
                    btn.classList.remove("button--loading");
                    btn.disabled = false;
                }

                form.classList.add('snow');
                errorText.classList.add('show');
            }
        }
    };

    formData.append("type", "free-lesson");
    formData.append("course_id", courseID);

    xmlHttp.open("post", "/api/v1/course/free-lesson");
    xmlHttp.send(formData);
    AdvCakePush(formData.get("email"), invoiceID, courseID, courseTitle, 0, discountCode)
};

