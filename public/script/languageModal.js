let languageSelector;
let openLanguagePopUpBtn;

window.onload = () => {
    languageSelector = document.querySelector('.language-selector');
    closeLanguagePopUpBtn = document.querySelector('.language-pop-up__header--close');

    languageSelector.addEventListener('click', () => {
        const modal = document.querySelector('.language-pop-up');
        openModal(modal);
    });

    closeLanguagePopUpBtn.addEventListener('click', () => {
        const modal = document.querySelector('.language-pop-up');
        closeModal(modal);
    });
}

function openModal(modal) {
    if (modal == null) return;

    modal.classList.add('active');
    overlay.classList.add('active');

    languageButtons = document.querySelectorAll('.language-pop-up__button');

    languageButtons.forEach(button => {
        button.addEventListener('click', () => {

            language = {
                lang: button.innerText
            }

            fetch('/changeLang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(language)
            });

            window.location.reload(true);
        });
    });


}


function closeModal(modal) {
    if (modal == null) return;

    modal.classList.remove('active')
    overlay.classList.remove('active')
}
