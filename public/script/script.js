let languageSelector, closeLanguagePopUpBtn, navDrawerButton, appBar, logoArea, mainBody;

import { openModal, closeModal } from './languageModal.js';
import { openDrawer } from './navDrawer.js';
import { parallax, resetDefaultStyling } from './parallax.js';

window.onload = () => {

    appBar = document.querySelector('.app-bar');
    logoArea = document.querySelector('.logo-area');
    mainBody = document.querySelector('.menu-content');
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

    navDrawerButton = document.querySelector('.app-bar__nav-button');

    navDrawerButton.addEventListener('click', () => {
        const navDrawer = document.querySelector('.nav-drawer');
        openDrawer(navDrawer);
    })

}

window.addEventListener('scroll', function() {
    parallax('.logo-area', window.scrollY, 1);

    let mainBodyYPos = mainBody.getBoundingClientRect().top;

    if(mainBodyYPos <= window.innerHeight*0.1) {
        logoArea.style.visibility = "hidden";
        this.document.querySelector('.app-bar__logo').style.visibility = "visible";
        appBar.classList.remove('app-bar-inactive');
        appBar.classList.add('app-bar-active');
    } else if (mainBodyYPos > -20) {
        resetDefaultStyling();
    }

});