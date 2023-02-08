// Declare a variable to store the scroll position
let scrollPosition;

// Function to store the scroll position before page reload
function storeScrollPosition() {
  // Get the current vertical scroll position of the page
  scrollPosition = window.pageYOffset;
}

// Function to refresh the page
function refreshPage() {
  // Reload the page
  window.location.reload();
}

// Function to restore the scroll position after page reload
function restoreScrollPosition() {
  // Scroll to the stored scroll position
  window.scrollTo(0, scrollPosition);
}

// Listen for the 'beforeunload' event to store the scroll position
window.addEventListener('beforeunload', storeScrollPosition);

// Listen for the 'load' event to restore the scroll position
window.addEventListener('load', restoreScrollPosition);

// Refresh the page every 5 seconds
setInterval(refreshPage, 5000);


