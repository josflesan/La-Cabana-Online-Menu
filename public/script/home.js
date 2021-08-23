let languageSelector, closeLanguagePopUpBtn, mainBody, overlay, cards, transforms, carousel, lastSwipe;

import { openLangModal, closeLangModal } from './languageModal.js';
import { parallax } from './parallax.js';

window.onload = () => {

    overlay = document.querySelector('#overlay')
    mainBody = document.querySelector('.home-content');
    languageSelector = document.querySelector('.language-selector');
    closeLanguagePopUpBtn = document.querySelector('.language-pop-up__header--close');

    carousel = document.querySelector('.carousel-gallery')
    cards = document.getElementsByClassName('carousel-gallery__img')

    lastSwipe = "left"
    
    transforms = [
        {
            x: 0,
            z: 0,
            scale: 1,
            opacity: 1
        },
        {
            x: '-45%',
            z: '-50px',
            scale: 0.8,
            opacity: 0.8
        },
        {
            x: '45%',
            z: '-50px',
            scale: 0.8,
            opacity: 0.8 
        }
    ]

    languageSelector.addEventListener('click', () => {
        const modal = document.querySelector('.language-pop-up');
        openLangModal(modal);
    });

    closeLanguagePopUpBtn.addEventListener('click', () => {
        const modal = document.querySelector('.language-pop-up');
        closeLangModal(modal);
    });

    carousel.addEventListener('click', (e) => {
        if (e.clientX >= window.innerWidth / 2) {
            nextLeft()
        } else {
            nextRight()
        }
    })

    carousel.addEventListener('swiped-left', () => {
        nextLeft()
    })

    carousel.addEventListener('swiped-right', () => {
        nextRight()
    })

}

function nextTransform(x) {
    if (x >= cards.length - 1) {
        x = 0
    } else {
        x++
    }
    return x
}

function resetTransform() {
    transforms = [
        {
            x: 0,
            z: 0,
            scale: 1,
            opacity: 1
        },
        {
            x: '-45%',
            z: '-50px',
            scale: 0.8,
            opacity: 0.8
        },
        {
            x: '45%',
            z: '-50px',
            scale: 0.8,
            opacity: 0.8 
        }
    ]
}

function nextLeft() {
    if (lastSwipe == "right") resetTransform()

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.transform = `translateX(${transforms[nextTransform(i)].x}) translateZ(${transforms[nextTransform(i)].z}) scale(${transforms[nextTransform(i)].scale})`
        cards[i].style.opacity = transforms[nextTransform(i)].opacity
    }

    transforms.push(transforms.shift())
    lastSwipe = "left"
}

function nextRight() {
    if (lastSwipe == "left") resetTransform()

    for (let i = 0; i < cards.length; i++) {
        cards[i].style.transform = `translateX(${transforms[nextTransform(i)].x}) translateZ(${transforms[nextTransform(i)].z}) scale(${transforms[nextTransform(i)].scale})`
        cards[i].style.opacity = transforms[nextTransform(i)].opacity
    }

    transforms.unshift(transforms.pop())
    lastSwipe = "right"
}

window.addEventListener('scroll', function() {
    parallax('.logo-area', window.scrollY, 1);
});