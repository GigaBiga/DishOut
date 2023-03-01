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
        // Gets the search query from the search bar
        var term = document.getElementById("Search-Bar").value;
        // Loops through the DishesList array and changes it to be lowercase while searching
        for (let i=0; i<this.DishesList.length; i++){
            // Checks if the search term is in the dish name using wildcards so it can be anywhere in the name
            if (this.DishesList[i][1].toLowerCase().includes(term.toLowerCase())){
                // Makes the dish containers visible
                document.getElementById("dish-"+this.DishesList[i][0]).style.display = "block";
            // If the search term is not in the dish name it hides the dish container
            } else {
                // Makes the dish containers invisible
                document.getElementById("dish-"+this.DishesList[i][0]).style.display = "none";
            };
        }
    }; 
    
    // Category selection function
    categorySelect(categoryToBeSelected,id){
        // Gets the contents of the currently selected category using the Seleted-Category id 
        var current_selected = document.getElementById("Selected-Category").innerHTML;
        // Loops through the DishesList array and checks if the category matches the category of the dish
        for (let i=0; i<this.DishesList.length; i++){
            // Checks if the category matches the category of the dish 
            if (this.DishesList[i][4] == categoryToBeSelected){
                // Makes the dish containers visible
                document.getElementById("dish-"+this.DishesList[i][0]).style.display = "block";
            // If the category is equal to "All" it shows all the dishes
            } else if (categoryToBeSelected == "All"){
                // Makes the dish containers visible
                document.getElementById("dish-"+this.DishesList[i][0]).style.display = "block";

            // If the category does not match the category of the dish it hides the dish container
            } else {
                // Makes the dish containers invisible
                document.getElementById("dish-"+this.DishesList[i][0]).style.display = "none";
            };
        }
        // Changes the contents of the currently selected category to the new category
        document.getElementById("Selected-Category").innerHTML = categoryToBeSelected;
        // Uses the id of the div then changes its contents to the previous category
        document.getElementById(id).innerHTML = current_selected;
    };

    addItem(DishNum){
        // checks if dish is already in any of the order
        for (let i=0; i<this.current_order[0].length; i++){
            if (this.current_order[0][i] == DishNum){
                // if dish is already in order, increase quantity by 1
                this.current_order[1][i] += 1;
                // update the total price
                this.totalPrice += this.DishesList[DishNum-1][2];
                // refreshes the html order list
                this.addToHTML();
                //Update total price in html
                this.addTotalToPayHtml()
                return;
            }
        }
        // if dish is not in order, add it to the bottom of the order
        //Adds the dish number to the order
        this.current_order[0].push(DishNum);
        //Adds the quantity to the order
        this.current_order[1].push(1);
        //Adds the note to the order
        this.current_order[2].push("");
        // refreshes the html order list
        this.addToHTML();
        // update the total price
        this.totalPrice += this.DishesList[DishNum-1][2];
        // Update total price in HTML
        this.addTotalToPayHtml()
    };
    // Function to remove an item from the order
    removeItem(DishNum){
        // Loops through the current_order array
        for (let i=0; i<this.current_order[0].length; i++){
            // Checks if the dish number is equal to the dish number in the current_order array
            if (this.current_order[0][i] == DishNum){
                // checks if the quantity is greater than 1
                if (this.current_order[1][i] > 1){
                    // if the quantity is greater than 1 it decreases the quantity by 1
                    this.current_order[1][i] -= 1;
                    // update the total price
                    this.totalPrice -= this.DishesList[DishNum-1][2];
                    // refreshes the html order list
                    this.addToHTML();
                    //Update total price in html
                    this.addTotalToPayHtml()
                    return;
                // if the quantity is equal to 1 it removes the dish from the order
                } else {
                    // Removes the dish number from the order
                    this.current_order[0].splice(i,1);
                    // Removes the quantity from the order
                    this.current_order[1].splice(i,1);
                    // Removes the note from the order
                    this.current_order[2].splice(i,1);
                    // refreshes the html order list
                    this.addToHTML();
                    // update the total price
                    this.totalPrice -= this.DishesList[DishNum-1][2];
                    //Update total price in html
                    this.addTotalToPayHtml()
                    return;
                }
            }
        }
    };
        
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
    // Function to add current_order records to the html page
    addToHTML(){
        // Clears the order list
        document.getElementById("CurrentOrderContainer").innerHTML = "";
        console.log(this.current_order);
        // Loops through the current_order array
        for (let i=1; i<this.current_order[0].length; i++){
            // Creates a new div to store the order information
            var newDiv = document.createElement("div");
            // Adds the id to the div
            newDiv.id = "order-"+i;
            // Adds the class to the div
            newDiv.className = "OrderItem";
            // adds the name as a div to the div with the class ItemProperties
            newDiv.innerHTML = "<div class='ItemName'>"+i+". "+this.DishesList[this.current_order[0][i]-1][1]+"</div>";
            // adds the quantity as a div to the div with the class ItemProperties
            newDiv.innerHTML += "<div class='ItemProperties'>x"+this.current_order[1][i]+"</div>";
            // adds the price as a div to the div with the class ItemProperties times by the quantity and makes sure that it is to 2 decimal places and rounded
            newDiv.innerHTML += "<div class='ItemProperties'>£"+(Math.round((this.DishesList[this.current_order[0][i]-1][2]*this.current_order[1][i])*100)/100).toFixed(2)+"</div>";
            // Puts the buttons in a div
            newDiv.innerHTML += "<div class='ItemProperties, Button-Container'>";
            // adds the plus button as a button to the Button-Container with the class Plus-Button
            newDiv.innerHTML += "<button class='ItemProperties, Plus-Button' onclick='OrderMethods.addItem("+this.current_order[0][i]+")'>+</button>";
            // adds the minus button as a button to the div with the class ItemProperties and Minus-Button
            newDiv.innerHTML += "<button class='ItemProperties, Minus-Button' onclick='OrderMethods.removeItem("+this.current_order[0][i]+")'>-</button>";
            // adds newDiv to the CurrentOrderContainer
            document.getElementById("CurrentOrderContainer").appendChild(newDiv);
            // Updates the current dish dropdown menu
            this.addDishesToCurrentDish();
        }
    };
    // Makes a function which gets the selected table number from the dropdown menu with the id Table-Number
    getTableNumber(){
        // Makes a variable which is the value of the dropdown menu
        var tableNumber = document.querySelector("#Table-Select").value;
        // Makes tableNumber an integer
        tableNumber = parseInt(tableNumber);
        // Returns the tableNumber variable
        return tableNumber;
    };
    addTotalToPayHtml(){
        // Adds the total price to the html page
        document.getElementById("TotalToPay").innerHTML = "Total: £"+(Math.round(this.totalPrice*100)/100).toFixed(2);
    }
    addNote(){
        // Gets the dish number from the dropdown menu
        var numOfDishInList = document.querySelector("#Current-Dish").value;
        // Makes an alert input box which asks for the note
        var note = prompt("Please enter a note for the dish");
        // Makes an alert input box which asks how many of the dishes the user wants to have the note on
        // Makes the variable quantity an integer and the question shows how many dishes there are
        var quantity = parseInt(prompt("How many of the dish do you want to have the note on? [Max: "+this.current_order[1][numOfDishInList]+"]"));
        // Checks if the quantity is less than 1 or greater than the quantity of the dish. Keeps asking until the quantity is valid
        while (quantity < 1 || quantity > this.current_order[1][numOfDishInList]){
            // Makes an alert box which says that the quantity is invalid
            alert("Invalid quantity");
            // Makes them do it again
            quantity = parseInt(prompt("How many of the dish do you want to have the note on? [Max: "+this.current_order[1][numOfDishInList]+"]"));
        }
        note = note+" {"+quantity;
        // Adds the note to the current_order array
        this.current_order[2][numOfDishInList] = note;
    }
    async submitOrder(){
    // Makes a submit pop up box which asks if the user is sure they want to submit the order and makes the buttons text yes or no
    var submit = confirm("Are you sure you want to submit the order?");
    // Checks if the user has clicked ok
    if (submit == true){ 
        // Creates XMLHttpRequest object
        var xhr = new XMLHttpRequest();
        // Saves the URL to the API
        var url = "/waiter/OrderTaking/submitOrder";
        // Makes an empty json order object
        var order_data = {};
        // Gets the table number
        let TableNumber = this.getTableNumber();
        // Make an array to store the order which holds the table number, DishID and the note
        var order = [];
        // Checks if the table number is not 0
            if (TableNumber != 0){
                // Iterates through the current_order array
                for (let i=1; i<this.current_order[0].length; i++){
                    // Makes a for loop which iterates over the quantity of the dish
                    for (let x=0; x<this.current_order[1][i]; x++){
                        // Checks if the note is not empty
                        if (this.current_order[2][i] != ""){
                            // Splits the note into an array via the { character
                            var notearray = this.current_order[2][i].split("{");
                            // Defines the actual note as the first element of the array
                            var note = notearray[0];
                            // Defines the quantity of the note as the second element of the array
                            var notequantity = notearray[1];
                            // Checks if the quantity of the note is greater or equal to 1
                            if (notequantity >= 1){
                                // Gets the order and changes the last character of the note to be one less then notequantity
                                this.current_order[2][i] = note+"{"+(notequantity-1);
                            } else {
                                // If the quantity of the note is not greater than 1 then it sets the note to be empty
                                this.current_order[2][i] = "";
                                note = "";
                            }
                        // If the note is empty then it sets the note variable to be empty
                        } else { var note = ""; }
                        // Adds the order to the order array 
                        order = [ TableNumber, this.current_order[0][i], note];
                        // Makes the order_data object into a JSON string
                        order_data = JSON.stringify(order);
                        // Sends the order to the API
                        xhr.open("POST", url, true);
                        xhr.setRequestHeader("Content-Type", "application/json");
                        // Sets the CSRF token
                        xhr.setRequestHeader('X-CSRFToken', this.CSRF_Token);
                        // Waits for the response from the API
                        try {
                            await new Promise((resolve, reject) => {
                            // Checks if the request is done and if it is successful
                            xhr.onreadystatechange = function() {
                                if (xhr.readyState == 4) {
                                    if (xhr.status == 200) {
                                        console.log("Order processed successfully!");
                                        resolve();
                                    } else {
                                        reject(new Error("Order processing failed"));
                                    }
                                }
                            };
                            // Sends the order data to the API
                            xhr.send(order_data);
                            });
                        // Catches any errors
                        } catch (error) {
                            // Prints the error message
                            console.log(error.message);
                        }
                    }
                }
                // Resets the current order
                this.current_order = [["DishID"],["Quantity"],["Note"]];
                // Resets the total price
                this.totalPrice = 0;
                // Updates the html using addToHtml
                this.addToHTML();
                // Updates the total price
                this.addTotalToPayHtml();
            }else{
                // Makes an alert saying that the table number is not selected
                alert("Table number is not selected");
            }
        }
    };
    // Function which gets the CSRF token using fetch
    async get_CSRF() {
        // Fetches the CSRF token from the API
        const response = await fetch('/waiter/OrderTaking/get_csrf');
        // Converts the response to a JSON object
        const data = await response.json();
        // Gets the CSRF token from the JSON object
        this.CSRF_Token = data.csrfToken;
    }   
    // Makes the showOrder function which makes the Mobile-Order IDs display flex
    // it also makes Mobile-Dishes and Mobile-Only display none
    showOrder(){
        document.getElementById("Mobile-Order").style.display = "flex";
        document.getElementById("Mobile-Dishes").style.display = "none";
        document.getElementById("Mobile-Only").style.display = "none";
    }
    // Makes the showDishes function which makes the Mobile-Dishes IDs display flex
    showDishes(){
        // Makes the Mobile-Order IDs display none
        document.getElementById("Mobile-Order").style.display = "none";
        // Makes the Mobile-Dishes IDs display flex
        document.getElementById("Mobile-Dishes").style.display = "flex";
        // Makes the Mobile-Only IDs display flex
        document.getElementById("Mobile-Only").style.display = "flex";
    }
    // Makes a function which adds the dishes to the Current Dish dropdown menu
    addDishesToCurrentDish(){
        // gets the Current-Dish dropdown menu and removes all the options by empting the innerHTML
        document.getElementById("Current-Dish").innerHTML = "";
        // Firstly adds the default option to the dropdown menu
        document.getElementById("Current-Dish").innerHTML += '<option value="0" selected>Current Dish: None</option>';
        // Iterates through the current_order array and adds the dish names to the dropdown menu
        for (let i=1; i<this.current_order[0].length; i++){
            // Checks if the dish name is already in the dropdown menu
            if (document.getElementById("Current-Dish").innerHTML.indexOf(this.DishesList[this.current_order[0][i]-1][1]) == -1){
                // Adds the dish name to the dropdown menu
                document.getElementById("Current-Dish").innerHTML += "<option value='"+i+"'>"+ i +". "+this.DishesList[this.current_order[0][i]-1][1]+"</option>";
            }
        }
    }
};
// Initialised the OrderTaking object
OrderMethods = new OrderTaking()
// Runs the get_dishInfo function to get the dish information
OrderMethods.get_dishInfo()
// Runs the get_CSRF function to get the CSRF token
OrderMethods.get_CSRF()

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

// Makes the dishButton variable connected to the dish button using the ID
const dishButton = document.querySelectorAll('.dish-container');

// Loop through each container
dishButton.forEach(function(container) {
  // Add a click event listener to the container
  container.addEventListener('click', function() {
    // Get the dish number from the data attribute of the container and convert it to an integer then add one to it
    const dishNumber = parseInt(container.getAttribute('data-dish-number'))+1;
    // Log the dish number to the console
    OrderMethods.addItem(dishNumber);
  });
});

// Makes the selected button variable connected to the unselected div using the class
const selectedButton = document.querySelectorAll('.UnselectedCat');

// Loop through each container
selectedButton.forEach(function(container) {
    // Add a click event listener to the container
    container.addEventListener('click', function() {
        // Get the category name from the contents of the div
        const category = container.innerHTML;
        // Gets the id of the div
        const id = container.id;
        // Log the dish number to the console
        OrderMethods.categorySelect(category,id);
    });
    }
);

// Makes the showOrder function which makes the Mobile-Order class display block
// it also makes Mobile-Dishes and Mobile-Only display none
function showOrder(){
    document.getElementById("Mobile-Order").style.display = "block";
    document.getElementById("Mobile-Dishes").style.display = "none";
    document.getElementById("Mobile-Only").style.display = "none";
}
