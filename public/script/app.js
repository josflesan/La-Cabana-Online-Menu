// Static Items Variables
var mainBody;
var languageSelector;
var menuItems;
var banner;
var logo;
var mainTitle;

// Language Pop-Up Variables
var openLanguagePopUpBtn;
var altOpenLanguagePopUpBtn;
var closeLanguagePopUpBtn;
var overlay;

// Nav-Drawer Variables
var navDrawerOpen;
var navDrawerButtons;

// Language Selection Variable
var language;

// Page Selection Variable
var page;


window.onload = function () {
    mainBody = document.querySelector('.main');
    languageSelector = document.querySelector('.language-selector');
    banner = document.querySelector('.banner');
    logo = document.querySelector('.logo-box');
    mainTitle = window.getComputedStyle(
        document.querySelector('.main-title',),
        ':after'
    );
    menuItems = document.querySelectorAll('.menu-item');

    // Language-Pop-Up Selections
    openLanguagePopUpBtn = document.querySelector('.language-selector__button');
    altOpenLanguagePopUpBtn = document.querySelector('.language-selector__flag-box');
    closeLanguagePopUpBtn = document.querySelector('.language-pop-up__header--close');
    overlay = document.getElementById('overlay');

    altOpenLanguagePopUpBtn.addEventListener('click', () => {
        const modal = document.querySelector('.language-pop-up');
        openModal(modal);
    });

    openLanguagePopUpBtn.addEventListener('click', () => {
        const modal = document.querySelector('.language-pop-up');
        openModal(modal);
    });

    closeLanguagePopUpBtn.addEventListener('click', () => {
        const modal = document.querySelector('.language-pop-up');
        closeModal(modal);
    });

    // Nav-Drawer Selection
    navDrawerOpen = document.querySelector('.banner__nav-drawer-open');

    navDrawerOpen.addEventListener('click', () => {
        const navDrawer = document.querySelector('.nav-drawer');
        openDrawer(navDrawer);
    })
    
}

function openDrawer(drawer) {
    if (drawer == null) return;

    // show drawer and activate overlay
    drawer.classList.add('active');
    overlay.classList.add('active');

    // close drawer if user clicks outside
    overlay.addEventListener('click', () => {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
    })

    // set up navigation buttons
    navDrawerButtons = document.querySelectorAll('.nav-drawer__button');

    navDrawerButtons.forEach(button => {
        button.addEventListener('click', () => {
            // update current page
            page = {
                selected: button.innerText
            }

            // change page
            fetch('/changePage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(page)
            });

            // update current page
            window.location.reload(true);

            console.log(button.innerText);  // temporary debug code

            // close navigation drawer
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        })
    })
}


function openModal(modal) {
    if (modal == null) return;

    modal.classList.add('active');
    overlay.classList.add('active');

    languageButtons = document.querySelectorAll('.language-pop-up__button');

    languageButtons.forEach(button => {
        button.addEventListener('click', () => {

            language = {
                lang: button.innerText
            }

            fetch('/changeLang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(language)
            });

            window.location.reload();
        });
    });


}


function closeModal(modal) {
    if (modal == null) return;

    modal.classList.remove('active')
    overlay.classList.remove('active')
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
    languageSelector.classList.remove('language-selector-large');
    languageSelector.classList.add('language-selector-small');
    // Change dropdown icon to white for better contrast
    document.querySelector('.language-selector__button').childNodes[0].setAttribute("src", "/img/DropdownWhite.svg");
}

function stickLogo() {
    logo.classList.remove('logo-box-large');
    logo.classList.add('logo-box-small');

    // document.querySelector('.banner__restaurant_name').innerHTML = "La Cabaña";
    document.querySelector('.banner__restaurant_name').style.backgroundColor = "red";
}

function resetDefaultStyling() {
    languageSelector.classList.remove('language-selector-small');
    languageSelector.classList.add('language-selector-large');
    // Reset default dropdown icon
    document.querySelector('.language-selector__button').childNodes[0].setAttribute("src", "/img/DropdownBlack.svg");
    logo.classList.add('logo-box-large');
    logo.classList.remove('logo-box-small');
    banner.style.backgroundColor = `transparent`;
    // document.querySelector('.banner__restaurant_name').innerHTML = "";
    document.querySelector('.banner__restaurant_name').style.backgroundColor = "transparent";

    // Hide Nav-Drawer Button
    navDrawerOpen.classList.remove('active');
}

window.addEventListener('scroll', function() {
    parallax('.header', window.scrollY, 1);

    mainBodyYPos = mainBody.getBoundingClientRect().top;

    if(mainBodyYPos <= -42) {
        stickLanguageSelector();
        stickLogo();
        banner.style.backgroundColor = `#1a180b`;
        navDrawerOpen.classList.add('active');
    } else if (mainBodyYPos <= -150) {
        stickMainSection();
    } else if (mainBodyYPos > -10) {
        resetDefaultStyling();
    }

});