let languageSelector, closeLanguagePopUpBtn, closeInfoPopUpButton, navDrawerButton, appBar, logoArea, mainBody, infoBtns;

import { openInfoModal, closeInfoModal } from './infoModal.js';
import { openLangModal, closeLangModal } from './languageModal.js';
import { openDrawer } from './navDrawer.js';
import { parallax, resetDefaultStyling } from './parallax.js';

window.onload = () => {

    appBar = document.querySelector('.app-bar');
    logoArea = document.querySelector('.logo-area');
    mainBody = document.querySelector('.menu-content');
    languageSelector = document.querySelector('.language-selector');
    infoBtns = Array.from(document.querySelectorAll('.info-btn'));
    closeInfoPopUpButton = document.querySelector('.info-pop-up__header--close');
    closeLanguagePopUpBtn = document.querySelector('.language-pop-up__header--close');

    languageSelector.addEventListener('click', () => {
        const modal = document.querySelector('.language-pop-up');
        openLangModal(modal);
    });

    closeLanguagePopUpBtn.addEventListener('click', () => {
        const modal = document.querySelector('.language-pop-up');
        closeLangModal(modal);
    });

    infoBtns.forEach((btn) => {
        btn.addEventListener('click', (_) => {
            const modal = document.querySelector('.info-pop-up');
            openInfoModal(modal);
        })
    })

    closeInfoPopUpButton.addEventListener('click', (_) => {
        const modal = document.querySelector('.info-pop-up');
        closeInfoModal(modal);
    })  

    navDrawerButton = document.querySelector('.app-bar__nav-button');

    navDrawerButton.addEventListener('click', () => {
        const navDrawer = document.querySelector('.nav-drawer');
        openDrawer(navDrawer);
    })

    let rightAlignedRows = Array.from(document.getElementsByClassName('menu-content__row-right'))
    rightAlignedRows.forEach((label) => {
        label.scrollLeft = label.scrollWidth;
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