let languageSelector, closeLanguagePopUpBtn, navDrawerButton;

import { openModal, closeModal } from './languageModal.js';
import { openDrawer } from './navDrawer.js';

window.onload = () => {

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