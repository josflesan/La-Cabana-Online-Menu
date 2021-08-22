let languageSelector, closeLanguagePopUpBtn, mainBody, overlay;

import { openLangModal, closeLangModal } from './languageModal.js';
import { parallax } from './parallax.js';

window.onload = () => {

    overlay = document.querySelector('#overlay')
    mainBody = document.querySelector('.home-content');
    languageSelector = document.querySelector('.language-selector');
    closeLanguagePopUpBtn = document.querySelector('.language-pop-up__header--close');

    languageSelector.addEventListener('click', () => {
        const modal = document.querySelector('.language-pop-up');
        openLangModal(modal);
    });

    closeLanguagePopUpBtn.addEventListener('click', () => {
        const modal = document.querySelector('.language-pop-up');
        closeLangModal(modal);
    });

}

window.addEventListener('scroll', function() {
    parallax('.logo-area', window.scrollY, 1);
});