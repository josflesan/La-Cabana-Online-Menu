export function scrollButtons(menuRowContainers) {
    // Scroll Button logic restricted for desktop usage
    menuRowContainers.forEach((row) => {

        if (window.innerWidth >= 1100) {

            let leftScrollBtn = row.childNodes[0];
            let rightScrollBtn = row.childNodes[1];
            let menuRow = row.childNodes[2];  // Get container to scroll
    
            // If left row, left scroll button starts hidden
            // If right row, right scroll button starts hidden
            if (menuRow.classList.contains('menu-content__row-left')) leftScrollBtn.style.visibility = 'hidden'
            else if (menuRow.classList.contains('menu-content__row-right')) rightScrollBtn.style.visibility = 'hidden'
    
            // If there is nothing to scroll, then hide both scroll buttons
            if (menuRow.scrollWidth - menuRow.clientWidth <= 0) {
                leftScrollBtn.style.visibility = 'hidden'
                rightScrollBtn.style.visibility = 'hidden'
            }
    
            leftScrollBtn.addEventListener('click', () => {
                menuRow.scrollLeft -= window.innerWidth / 1.2
            })
    
            rightScrollBtn.addEventListener('click', () => {
                menuRow.scrollLeft += window.innerWidth / 1.2
            })
    
            // Update scroll buttons on row scroll
            menuRow.addEventListener('scroll', () => {
                menuRow.scrollLeft < 50 ? leftScrollBtn.style.visibility = 'hidden' : leftScrollBtn.style.visibility = 'visible';
                menuRow.scrollLeft > menuRow.scrollWidth - menuRow.clientWidth - 50 ? rightScrollBtn.style.visibility = 'hidden' : rightScrollBtn.style.visibility = 'visible';
            })
    
        }

    })
}