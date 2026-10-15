(function () {
    'use strict';

    const dialog = document.getElementById('publicationImageDialog');
    // Keep the original-image links usable when native dialogs are unavailable.
    if (!dialog || typeof dialog.showModal !== 'function') return;

    const image = dialog.querySelector('.publication-lightbox-image');
    const title = dialog.querySelector('.publication-lightbox-title');
    const original = dialog.querySelector('.publication-lightbox-original');
    const closeButton = dialog.querySelector('.publication-lightbox-close');
    let opener = null;
    let startedOnBackdrop = false;

    // Filtering replaces publication cards with clones, so delegate the clicks.
    document.addEventListener('click', function (event) {
        const link = event.target instanceof Element && event.target.closest('.publication-image-link');
        if (!link || event.defaultPrevented || event.button !== 0 ||
            event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

        event.preventDefault();
        opener = link;
        title.textContent = link.dataset.publicationTitle;
        image.alt = 'Figure for ' + link.dataset.publicationTitle;
        // The href retains the original even when thumbnails become JPEG previews.
        image.src = link.href;
        original.href = link.href;
        dialog.showModal();
        document.body.classList.add('publication-lightbox-open');
        closeButton.focus({ preventScroll: true });
    });

    closeButton.addEventListener('click', function () {
        dialog.close();
    });

    function isBackdrop(event) {
        const bounds = dialog.getBoundingClientRect();
        return event.target === dialog && (event.clientX < bounds.left ||
            event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
    }

    dialog.addEventListener('pointerdown', function (event) {
        startedOnBackdrop = isBackdrop(event);
    });

    dialog.addEventListener('click', function (event) {
        if (startedOnBackdrop && isBackdrop(event)) dialog.close();
        startedOnBackdrop = false;
    });

    // Native dialogs handle Escape, focus containment, and an inert background.
    dialog.addEventListener('close', function () {
        document.body.classList.remove('publication-lightbox-open');
        image.removeAttribute('src');
        if (opener && opener.isConnected) opener.focus({ preventScroll: true });
        opener = null;
    });
}());
