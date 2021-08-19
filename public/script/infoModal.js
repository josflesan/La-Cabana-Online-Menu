export function openInfoModal(modal) {
    if (modal == null) return;

    let loadingAnim = document.querySelector('.loading-anim')
    loadingAnim.classList.add('active')

    modal.classList.add('active');
    overlay.classList.add('active');

}


export function closeInfoModal(modal) {
    if (modal == null) return;

    let loadingAnim = document.querySelector('.loading-anim')
    loadingAnim.classList.remove('active')

    modal.classList.remove('active')
    overlay.classList.remove('active')
}


export function loadDescription(description) {
    const modalBody = document.querySelector('.info-pop-up__content')

    let ingredientList = description.ingredients[description.active_lang]
    let optionList = description.options[description.active_lang]
    let labelList = description.labels

    let loadingAnim = document.querySelector('.loading-anim')
    loadingAnim.classList.remove('active')

    let ingredientsParagraph = document.createElement('p')
    ingredientsParagraph.innerText = ingredientList.join(', ')

    let optionsContainer = document.createElement('div')
    optionList.forEach((option) => {
        let optionLabel = document.createElement('h2')
        optionLabel.innerHTML = option
        optionsContainer.appendChild(optionLabel)
    })

    let labelContainer = document.createElement('div')
    labelList.forEach((label) => {
        let labelImage = document.createElement('img')
        labelImage.src = `../public/img/labels/${label}.png`
        labelContainer.appendChild(labelImage)
    })

    modalBody.appendChild(ingredientsParagraph)
    modalBody.appendChild(optionsContainer)
    modalBody.appendChild(labelContainer)

}
