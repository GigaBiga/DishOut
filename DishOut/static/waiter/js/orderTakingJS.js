// Creates the order taking class that will take care of search, selection of dishes and storing them in the order list
class OrderTaking{
    // Used to initialise the starting variables
    constructor(){
        // 2D array of the current order
        this.current_order = [["DishID"],["Quantity"],["Note"]];
        // Stores the total price
        this.totalPrice = 0;
        // Define an empty array to store dish information
        this.DishesList = []; 
    };
    search(){
        alert('You searched for: ' + searchBar.value)
    }    

    // Retrive dish data
    get_dishInfo(){
        // Fetches all the dish information from this address
        fetch('/waiter/OrderTaking/get_dishInfo')
            // Converts the JSON response to an object array in JavaScript
            .then(response => response.json())
            // Makes the data into a 2D array for later use
            .then((data) => {
                // loops through the data
                for (let i=0; i<data.length; i++) {
                    // Adds each record to the DishesList
                    this.DishesList.push(Object.values(data[i]));
                }
            })
          
        };
    }

// Initialised the OrderTaking object
OrderMethods = new OrderTaking()
// Runs the get_dishInfo function to get the dish information
OrderMethods.get_dishInfo()

// Makes the searchBar variable connected to the search bar using the ID
const searchBar = document.getElementById('Search-Bar');
// Adds an event listener which checks if a key has been pressed
searchBar.addEventListener('keydown', function(event) {
    // Checks if it is the enter key
    if (event.key === 'Enter') {
        // Stops the usual behaviour of HTML of submitting the form
        event.preventDefault();
        // Sends the query in the search bar to the search function in the class
        OrderMethods.search(searchBar.value);
    }
});

