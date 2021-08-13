export function openInfoModal(modal) {
    if (modal == null) return;

    modal.classList.add('active');
    overlay.classList.add('active');

}


export function closeInfoModal(modal) {
    if (modal == null) return;

    modal.classList.remove('active')
    overlay.classList.remove('active')
}
