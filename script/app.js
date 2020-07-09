var mainBody;
var languageSelector;
var menuItems;
var banner;
var logo;

window.onload = function () {
    mainBody = document.querySelector('.main');
    languageSelector = document.querySelector('.language-selector');
    banner = document.querySelector('.banner');
    logo = document.querySelector('.logo-box');
    menuItems = document.querySelectorAll('.menu-item');
}

function parallax(element, distance, speed) {

    var item;

    if (element != '.menu-item') {
        item = document.querySelector(element);    
        item.style.transform = `translateY(${distance * speed}px)`;
    }
}

function stickMainSection() {
    mainBody.style.position = `relative`;
    mainBody.style.clipPath = `none`;
}

function stickLanguageSelector() {
    languageSelector.style.position = `fixed`;
    languageSelector.style.top = `-1.5%`;
    languageSelector.style.transform = `scale(${0.7})`;
}

function stickLogo() {
    logo.style.top = `0`;
    logo.style.transform = `scale(${0.7})`;

    document.querySelector('.restaurant_name').innerHTML = "La Cabaña";
}

window.addEventListener('scroll', function() {
    parallax('.header', window.scrollY, 1);

    mainBodyYPos = mainBody.getBoundingClientRect().top;

    if(mainBodyYPos <= -42) {
        stickLanguageSelector();
        stickLogo();
        banner.style.backgroundColor = `#C5B488`;
    } else if (mainBodyYPos <= -150) {
        stickMainSection();
    } else if (mainBodyYPos > -10) {
        languageSelector.style.position = `absolute`;
        languageSelector.style.top = `20%`;
        languageSelector.style.transform = `scale(${1.0})`;
        logo.style.transform = `scale(${1.0})`;
        logo.style.top = `5%`;
        banner.style.backgroundColor = `transparent`;
        document.querySelector('.restaurant_name').innerHTML = "";
    }

    console.log(mainBodyYPos);

});