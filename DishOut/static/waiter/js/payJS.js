// Function which gets the CSRF token using fetch
async function get_CSRF() {
    // Fetches the CSRF token from the API
    const response = await fetch('/waiter/OrderTaking/get_csrf');
    // Converts the response to a JSON object
    const data = await response.json();
    // Gets the CSRF token from the JSON object
    return data.csrfToken;
};

// Uses xmlhttprequest to send order id to the API
function pay(TableNum, ordersDone, allorders){
    // Checks if all orders have been done
    if (ordersDone == allorders){
    // Regenerate the CSRF token and update the header
        get_CSRF().then((newCSRF) => {
            // Creates a new xmlhttprequest
            var xhr = new XMLHttpRequest();
            // Opens the request
            xhr.open("POST", "/waiter/Pay/payTable", true);
            // Sets the request header
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            // Sets the new CSRF token
            xhr.setRequestHeader("X-CSRFToken", newCSRF);
            // Sends the request
            xhr.send(JSON.stringify({TableNum: TableNum}));
        });
    }
    else{
        // If not all orders have been done, alert the user
        alert("Please complete all orders before paying");
    }
    // Refreses the page after .5 seconds
    setTimeout(function(){ window.location.reload(); }, 500);
};

// Refresh the page every 5 seconds
function refreshPage() {
    // Reload the page
    window.location.reload();
  }
setInterval(refreshPage, 5000);

