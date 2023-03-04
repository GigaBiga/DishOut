function updateStatus(){
    // Get all the elements with class "StatusChain"
    const statusChains = document.querySelectorAll('.StatusChain');

    // Loop through each element
    statusChains.forEach((statusChain) => {
    // Get all the child elements with class "Status"
    const statuses = statusChain.querySelectorAll('.Status');
    // Makes a variable to store if the current status has been passed
    let passedCurrent = false; 
    // Loop through each child element
    statuses.forEach((status, index) => {
        // Add "CurrentStatus" class to the current status element
        if (status.textContent === statusChain.dataset.status) {
        status.classList.add('CurrentStatus');
        // Set the passedCurrent variable to true to indicate that the current status has been passed
        passedCurrent = true;
        }
        // Else if the current status has not been passed go to the next iteration of the loop
        else if (!passedCurrent) {
            return;
        }
        // Add "IncompleteStatus" class to the elements after the current status element
        else if (index > Array.from(statuses).findIndex((s) => s.classList.contains('current'))) {
        status.classList.add('IncompleteStatus');
        }
    });
    });
};

// Function which gets the CSRF token using fetch
async function get_CSRF() {
    // Fetches the CSRF token from the API
    const response = await fetch('/waiter/OrderTaking/get_csrf');
    // Converts the response to a JSON object
    const data = await response.json();
    // Gets the CSRF token from the JSON object
    return data.csrfToken;
};



let OrderOfStatus = ["New Order", "Preparing", "Cooking", "Ready"];

// Function to move the status to the next one
function progressOrder(status, orderID){
    // finds the index of the current status
    let index = OrderOfStatus.indexOf(status);
    // Increments the index by 1 and saves the new status
    let newStatus = OrderOfStatus[index + 1];
    // Changes the status in the database using xhr
    get_CSRF().then((newCSRF) => {
        // Creates a new xmlhttprequest
        var xhr = new XMLHttpRequest();
        // Opens the request
        xhr.open("POST", "/kitchen/progressOrder", true);
        // Sets the request header
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        // Sets the new CSRF token
        xhr.setRequestHeader("X-CSRFToken", newCSRF);
        // Sends the request
        xhr.send(JSON.stringify({
            Status: newStatus,
            OrderID: orderID
        }));
    });
    // Refreshes the page after .5 seconds
    setTimeout(() => { window.location.reload(); }, 100);
};



// Run the updateStatus function when the page loads
updateStatus();

