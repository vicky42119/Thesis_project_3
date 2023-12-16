// script4.js

// Function to check if an element is in the viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to handle scroll events
function handleScroll(entries) {
    entries.forEach((entry, index) => {
        if (isElementInViewport(entry) && !entry.classList.contains('show')) {
            // Display the date and entry gradually
            const date = entry.querySelector('.date');
            const entryContent = entry.querySelector('.entry');

            // Add a class to show the date and entry
            date.classList.add('show');
            entryContent.classList.add('show');

            // Move to the next entry
            const nextEntry = entries[index + 1];
            if (nextEntry) {
                handleScroll(entries.slice(index + 1));
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const entries = document.querySelectorAll('.dateandentry');
    handleScroll(entries);

    // Add a scroll event listener to trigger the display
    window.addEventListener('scroll', () => handleScroll(entries));
});

