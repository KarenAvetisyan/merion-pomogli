function headerActions() {
    const header = document.querySelector('._header');
    const input = header.querySelector('._header-search__input');
    const searchResultUrl = input.getAttribute('data-search-result') ?? "/courses";
    const searchDropdown = header.querySelector('._header-search__dropdown');
    const clearBtn = header.querySelector('._header-search__clear');
    const returnBtn = header.querySelector('._header-search__back');
    const dropdown = header.querySelector('._header-dropdown');
    const openBtn = header.querySelector('._header-course');
    const coursesText = document.getElementsByClassName("_header-search__item-txt");
    const coursesBlock = document.getElementsByClassName("_header-search__list-item");
    const dropdownLink = header.querySelector('._header-search__dropdown-link');

    input.addEventListener('focusin', function () {
        header.classList.add('show-search');
    });
    input.addEventListener('focusout', function () {
        if (!this.value) {
            header.classList.remove('show-search');
            searchDropdown.classList.remove('has-result', 'visible');
        }
    });
    window.addEventListener('click', function (e) {
        if ((!header.contains(e.target)) && (window.innerWidth > 1024)){
            header.classList.remove('active');
            dropdown.classList.remove('visible');
            openBtn.classList.remove('active');
        }
    });
    input.addEventListener('input', function () {
        if (this.value) {
            searchDropdown.classList.add('visible');
            clearBtn.classList.add('visible');
            header.classList.add('show-search');


            let visibleCardsCount = 0;
            let searchPhrase = this.value.toUpperCase();
            for (let i = 0; i < coursesText.length; i++) {
                let txtValue = coursesText[i].textContent || coursesText[i].innerText;
                if (txtValue.toUpperCase().indexOf(searchPhrase) > -1) {
                    coursesBlock[i].style.display = "block";
                    visibleCardsCount++;
                } else {
                    coursesBlock[i].style.display = "none";
                }
            }


            if (visibleCardsCount > 0) {
                searchDropdown.classList.add('has-result');
                dropdownLink.innerHTML = "Все курсы по запросу «" + this.value + "» (" + visibleCardsCount + ")";
                let encoded = encodeURIComponent(this.value);
                dropdownLink.href = searchResultUrl+"?search=" + encoded + utmPath;
            } else {
                searchDropdown.classList.remove('has-result');
            }

        } else {
            header.classList.remove('show-search');
            clearBtn.classList.remove('visible');
            searchDropdown.classList.remove('visible');
        }
    });

    function clear() {
        header.classList.remove('show-search');
        clearBtn.classList.remove('visible');
        input.value = '';
        searchDropdown.classList.remove('has-result', 'visible');
    }

    clearBtn.addEventListener('click', function (e) {
        e.preventDefault();
        clear();
    });
    returnBtn.addEventListener('click', function (e) {
        e.preventDefault();
        clear();
    });
    openBtn.addEventListener('click', function (e) {
        e.preventDefault();
        this.classList.toggle('active');
        header.classList.toggle('active');
        dropdown.classList.toggle('visible');
    });
}

headerActions();

// bitrix pop-up
(function (w, d, u) {
    var s = d.createElement('script');
    s.async = true;
    s.src = u + '?' + (Date.now() / 60000 | 0);
    var h = d.getElementsByTagName('script')[0];
    h.parentNode.insertBefore(s, h);
})(window, document, 'https://cdn-ru.bitrix24.ru/b1964057/crm/site_button/loader_8_e6ny4f.js');

// footer toggle
function slideToggle() {
    var linkToggle = document.querySelectorAll('.footer-item__head');
    linkToggle.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            if (window.innerWidth < 767) {
                var container = document.getElementById(this.dataset.container);
                item.classList.toggle('active');
                if (!container.classList.contains('active')) {
                    container.classList.add('active');
                    container.style.height = 'auto';
                    var height = container.clientHeight + 'px';
                    container.style.height = '0px';
                    setTimeout(function () {
                        container.style.height = height;
                    }, 0);
                } else {
                    container.style.height = '0px';
                    container.addEventListener('transitionend', function () {
                        container.classList.remove('active');
                    }, {
                        once: true
                    });
                }
            }
        });
    });
}

slideToggle();
