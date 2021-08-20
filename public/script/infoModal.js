const pageBody = document.querySelector('.body-bg')

export function openInfoModal(modal) {
    if (modal == null) return;

    let loadingAnim = document.querySelector('.loading-anim')
    loadingAnim.classList.add('active')

    modal.classList.add('active')
    overlay.classList.add('active')

    pageBody.style.overflowY = "hidden"

}


export function closeInfoModal(modal) {
    if (modal == null) return;

    let loadingAnim = document.querySelector('.loading-anim')
    loadingAnim.classList.remove('active')

    const modalBody = document.querySelector('.info-pop-up__content')
    const modalFooter = document.querySelector('.info-pop-up__footer')
    modalBody.innerHTML = ""
    modalFooter.innerHTML = ""

    modal.classList.remove('active')
    overlay.classList.remove('active')

    pageBody.style.overflowY = "scroll"

    modalBody.appendChild(loadingAnim)
}


export function loadDescription(description) {
    const modalBody = document.querySelector('.info-pop-up__content')
    const modalFooter = document.querySelector('.info-pop-up__footer')

    let ingredientList = description.ingredients[description.active_lang]
    let optionList = description.options[description.active_lang]
    let labelList = description.labels
    let priceList = description.prices

    let loadingAnim = document.querySelector('.loading-anim')
    loadingAnim.classList.remove('active')

    let ingredientsParagraph = document.createElement('p')
    ingredientsParagraph.innerText = ingredientList.join(', ')
    ingredientsParagraph.classList.add('info-pop-up__content__ingredients')

    let optionsContainer = document.createElement('div')
    optionsContainer.classList.add('info-pop-up__content__options-container')
    for (let i = 0; i < optionList.length; i++) {
        let optionLabel = document.createElement('div')
        optionLabel.classList.add('info-pop-up__content__options-container--option')
        
        let optionName = document.createElement('p')
        optionName.classList.add('info-pop-up__content__options-container--option-name')
        optionName.innerText = optionList[i]
        let optionPrice = document.createElement('p')
        optionPrice.classList.add('info-pop-up__content__options-container--option-price')
        optionPrice.innerText = priceList[i]

        optionLabel.appendChild(optionName)
        optionLabel.appendChild(optionPrice)

        optionsContainer.appendChild(optionLabel)
    }

    if (optionsContainer.children.length == 0) {
        let noOptionsLabel = document.createElement('p')
        noOptionsLabel.classList.add('info-pop-up__content__options-container--noOptions')
        noOptionsLabel.innerText = "no other options available for this dish" 
        optionsContainer.appendChild(noOptionsLabel)
    }

    let labelContainer = document.createElement('div')
    labelContainer.classList.add('info-pop-up__footer__labels-container')
    labelList.forEach((label) => {
        if (label != "") {
            let labelImage = document.createElement('div')
            labelImage.classList.add('info-pop-up__footer__labels-container--label')
            labelImage.style.backgroundImage = `url('../public/img/labels/${label}.png')`
            labelContainer.appendChild(labelImage)
        }
    })

    modalBody.appendChild(ingredientsParagraph)
    modalBody.appendChild(optionsContainer)
    modalFooter.appendChild(labelContainer)

}
