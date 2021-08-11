export function parallax(element, distance, speed) {

    var item;

    if (element != '.menu-content__row') {
        item = document.querySelector(element);    
        item.style.transform = `translateY(${distance * speed}px)`;
    }
}

export function resetDefaultStyling() {
    // Reset default dropdown icon
    document.querySelector('.app-bar__logo').style.visibility = "hidden";
    document.querySelector('.logo-area').style.visibility = "visible";
    document.querySelector('.app-bar').classList.add('app-bar-inactive')
}