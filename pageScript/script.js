 document.addEventListener('DOMContentLoaded', function() {
    // slider 
    var swiper = new Swiper(".js-courseReviews-swiper", {
        slidesPerView: 'auto',
        spaceBetween: 16,
        navigation: {
            nextEl: ".courseReviews-swiper__next",
            prevEl: ".courseReviews-swiper__prev",
        },
    });
    // иконки в карточках генерируются с помощью fetch и innerHTML в виде svg
    const icons = document.querySelectorAll(".gCoursesCard-icon");
    icons.forEach((icon, index) => {
        const svgPath = icon.getAttribute("data-svg-code");
        const bgInitial = icon.getAttribute("data-bg-initial");
        const gradient1 = icon.getAttribute("data-gradient-1");
        const gradient2 = icon.getAttribute("data-gradient-2");
        const gradientId = `customGradient-${index}`;

        if (svgPath) {
            fetch(svgPath)
                .then(response => {
                    if (!response.ok) throw new Error("SVG load failed");
                    return response.text();
                })
                .then(svgContent => {
                    icon.innerHTML = svgContent;
                    const svgElement = icon.querySelector("svg");

                    if (svgElement && bgInitial && gradient1 && gradient2) {
                        // Create <defs> and <linearGradient>
                        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
                        const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");

                        linearGradient.setAttribute("id", gradientId);
                        linearGradient.setAttribute("x1", "0");
                        linearGradient.setAttribute("y1", "0");
                        linearGradient.setAttribute("x2", svgElement.getAttribute("width") || "100%");
                        linearGradient.setAttribute("y2", svgElement.getAttribute("height") || "100%");
                        linearGradient.setAttribute("gradientUnits", "userSpaceOnUse");

                        const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                        stop1.setAttribute("offset", "0%");
                        stop1.setAttribute("stop-color", gradient1);

                        const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                        stop2.setAttribute("offset", "100%");
                        stop2.setAttribute("stop-color", gradient2);

                        linearGradient.appendChild(stop1);
                        linearGradient.appendChild(stop2);
                        defs.appendChild(linearGradient);
                        svgElement.insertBefore(defs, svgElement.firstChild);
                        const shapes = svgElement.querySelectorAll("path, rect, circle, ellipse, polygon, polyline");
                    
                        shapes.forEach(original => {
                            const clone = original.cloneNode(true);
                            original.setAttribute("fill", bgInitial);
                            original.style.transition = "opacity 0.4s ease";
                            original.style.opacity = "1";
                            clone.setAttribute("fill", `url(#${gradientId})`);
                            clone.style.transition = "opacity 0.4s ease";
                            clone.style.opacity = "0";
                            original.parentNode.insertBefore(clone, original.nextSibling);
                        });
                        
                        icon.parentNode.addEventListener("mouseenter", () => {
                            const allShapes = icon.querySelectorAll("path, rect, circle, ellipse, polygon, polyline");
                            allShapes.forEach((shape, i) => {
                                if (i % 2 === 0) {
                                    shape.style.opacity = "0";
                                } else {
                                    shape.style.opacity = "1";
                                }
                            });
                        });
                        
                        icon.parentNode.addEventListener("mouseleave", () => {
                            const allShapes = icon.querySelectorAll("path, rect, circle, ellipse, polygon, polyline");
                            allShapes.forEach((shape, i) => {
                                if (i % 2 === 0) {
                                    shape.style.opacity = "1";
                                } else {
                                    shape.style.opacity = "0";
                                }
                            });
                        });
                        
                    }
                })
                .catch(err => {
                    console.error("SVG load or gradient application failed:", err);
                });
        }
    });

    
    // FORM VALIDATION AND SUBMIT
    const _form = document.getElementById('_form');
    if (_form) {
        _form.addEventListener('submit', formSend);
        async function formSend(e) {
            e.preventDefault(); 
            let error = formValidate(_form);
            if (error != 0) {
                // "Form has errors";
            } else {
                // "Form is valid";
                _form.reset();
            }
        }
    }
    
    function formValidate(form) {
        let error = 0;
        let formReq = form.querySelectorAll('._req'); 

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemove_Req_Error(input); 
            if (input.classList.contains('_name_len')) {
                if (input.value === '') {
                    formAddReq(input); 
                    error++;
                }
                else if (input.value.length <= 1 ) {
                    formAddError(input); 
                    error++;
                }
            }
            else if (input.classList.contains('_email')) {
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
    
    
    
})