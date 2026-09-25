(function () {
    'use strict';

    function report(button, message) {
        const panel = button.closest('.publication-bibtex-collapse');
        const status = panel && panel.querySelector('.bibtex-copy-status');
        if (status) status.textContent = message;
    }

    function selectCitation(source) {
        source.focus({ preventScroll: true });
        source.select();
        source.setSelectionRange(0, source.value.length);
    }

    async function copyCitation(button) {
        const source = document.getElementById(button.dataset.bibtexTarget);
        if (!source || !source.value.trim()) {
            report(button, 'Citation unavailable.');
            return;
        }

        button.disabled = true;
        report(button, 'Copying BibTeX…');
        let copied = false;

        try {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                try {
                    await navigator.clipboard.writeText(source.value);
                    copied = true;
                } catch (error) {
                    // Clipboard access may be blocked; keep manual copying available.
                }
            }

            if (!copied) {
                selectCitation(source);
                try {
                    copied = typeof document.execCommand === 'function' && document.execCommand('copy');
                } catch (error) {
                    copied = false;
                }
            }

            report(button, copied ? 'Copied BibTeX.' : 'BibTeX selected. Press Ctrl+C or ⌘C to copy.');
        } finally {
            button.disabled = false;
            if (copied && button.isConnected) button.focus({ preventScroll: true });
        }
    }

    // Publication filters replace entries with clones, so use delegated events.
    document.addEventListener('click', function (event) {
        const button = event.target instanceof Element && event.target.closest('[data-bibtex-copy]');
        if (!button || button.disabled) return;
        event.preventDefault();
        copyCitation(button);
    });
}());
