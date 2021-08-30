let languageButtons;
const pageBody = document.querySelector('.body-bg')

export async function openLangModal(modal) {
    if (modal == null) return;

    modal.classList.add('active');
    overlay.classList.add('active');

    pageBody.style.overflowY = 'hidden'

    languageButtons = document.querySelectorAll('.language-pop-up__button');

    languageButtons.forEach(button => {
        button.addEventListener('click', async () => {

            let data = {
                lang: button.innerText.toUpperCase(),
                url: window.location.pathname
            }

            const response = await fetch('/changeLang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(data)
            })

            const jsonRes = await response.json()
            window.location.assign(jsonRes.body)
            
        });
    });


}


export function closeLangModal(modal) {
    if (modal == null) return;

    modal.classList.remove('active')
    overlay.classList.remove('active')

    pageBody.style.overflowY = 'scroll'
}
