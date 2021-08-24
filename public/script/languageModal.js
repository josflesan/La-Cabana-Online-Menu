let languageButtons;
const pageBody = document.querySelector('.body-bg')

export async function openLangModal(modal) {
    if (modal == null) return;

    modal.classList.add('active');
    overlay.classList.add('active');

    pageBody.style.overflowY = 'hidden'

    languageButtons = document.querySelectorAll('.language-pop-up__button');

    languageButtons.forEach(button => {
        button.addEventListener('click', () => {

            let data = {
                lang: button.innerText.toUpperCase(),
                url: window.location.pathname
            }

            fetch('/changeLang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
            }).then((res) => {
                window.location = res.url
            })
            
        });
    });


}


export function closeLangModal(modal) {
    if (modal == null) return;

    modal.classList.remove('active')
    overlay.classList.remove('active')

    pageBody.style.overflowY = 'scroll'
}
