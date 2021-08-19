let navDrawerButtonsLeft, navDrawerButtonsRight, page;

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
    navDrawerButtonsLeft = document.querySelectorAll('.nav-drawer__button--left');
    navDrawerButtonsRight = document.querySelectorAll('.nav-drawer__button--right');

    navDrawerButtonsLeft.forEach(button => {
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

            // Go to appropriate page
            fetch('/' + button.innerText, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            })

            // update current page
            //window.location.reload();

            // close navigation drawer
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        })
    })

    navDrawerButtonsRight.forEach(button => {
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

            // Go to appropriate page
            fetch('/' + button.innerText, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            })

            // update current page
            window.location.reload();

            // close navigation drawer
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        })
    })
}