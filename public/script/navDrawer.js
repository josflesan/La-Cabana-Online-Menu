let navDrawerButtons;

export function openDrawer(drawer) {
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