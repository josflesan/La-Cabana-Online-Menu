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
                lang: button.textContent.toUpperCase(),
                url: window.location.pathname
            }

            const response = await fetch('/changeLang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const jsonRes = await response.json() 
            setTimeout(function(){document.location.href = jsonRes.body;}, 250)           
            
        });
    });


}


export function closeLangModal(modal) {
    if (modal == null) return;

    modal.classList.remove('active')
    overlay.classList.remove('active')

    pageBody.style.overflowY = 'scroll'
}
