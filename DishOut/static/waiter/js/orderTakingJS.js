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
                console.log(this.current_order);
                // refreshes the html order list
                this.addToHTML();
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
        console.log(this.current_order);
        // refreshes the html order list
        this.addToHTML();
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
        // Loops through the current_order array
        for (let i=1; i<this.current_order[0].length; i++){
            // Creates a new div to store the order information
            var newDiv = document.createElement("div");
            // Adds the id to the div
            newDiv.id = "order-"+i;
            // adds the name as a div to the div with the class ItemProperties
            newDiv.innerHTML = "<div class='ItemProperties'>"+this.DishesList[this.current_order[0][i]-1][1]+"</div>";
            // adds the quantity as a div to the div with the class ItemProperties
            newDiv.innerHTML += "<div class='ItemProperties'>"+this.current_order[1][i]+"</div>";
            // adds newDiv to the CurrentOrderContainer
            document.getElementById("CurrentOrderContainer").appendChild(newDiv);
        }
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

// Makes the dishButton variable connected to the dish button using the ID
const dishButton = document.querySelectorAll('.dish-container');

// Loop through each container
dishButton.forEach(function(container) {
  // Add a click event listener to the container
  container.addEventListener('click', function() {
    // Get the dish number from the data attribute of the container
    const dishNumber = container.getAttribute('data-dish-number');
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

