let languageButtons;
const pageBody = document.querySelector('.body-bg')

export function openLangModal(modal) {
    if (modal == null) return;

    modal.classList.add('active');
    overlay.classList.add('active');

    pageBody.style.overflowY = 'hidden'

    languageButtons = document.querySelectorAll('.language-pop-up__button');

    languageButtons.forEach(button => {
        button.addEventListener('click', () => {

            let language = {
                lang: button.innerText.toUpperCase()
            }

            fetch('/changeLang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(language)
            });

            window.location.reload();
        });
    });


}


export function closeLangModal(modal) {
    if (modal == null) return;

    modal.classList.remove('active')
    overlay.classList.remove('active')

    pageBody.style.overflowY = 'scroll'
}
