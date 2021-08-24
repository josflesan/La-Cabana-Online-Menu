let navDrawerButtonsLeft, navDrawerButtonsRight, page;
const pageBody = document.querySelector('.body-bg')

export function openDrawer(drawer) {
    if (drawer == null) return;

    // show drawer and activate overlay
    drawer.classList.add('active')
    overlay.classList.add('active')

    pageBody.style.overflowY = 'hidden'  // Block scrolling on body if open

    // close drawer if user clicks outside
    overlay.addEventListener('click', () => {
        drawer.classList.remove('active')
        overlay.classList.remove('active')
        pageBody.style.overflowY = 'scroll'  // Re-Enable scrolling on body if closed
    })

    // set up navigation buttons
    navDrawerButtonsLeft = document.querySelectorAll('.nav-drawer__button--left');
    navDrawerButtonsRight = document.querySelectorAll('.nav-drawer__button--right');

    navDrawerButtonsLeft.forEach(button => {
        button.addEventListener('click', () => {
            // close navigation drawer
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        })
    })

    navDrawerButtonsRight.forEach(button => {
        button.addEventListener('click', () => {
            // close navigation drawer
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        })
    })
}