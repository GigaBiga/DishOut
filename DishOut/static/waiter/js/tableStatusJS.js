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

// Timer function

// Timer data retriver and updater
function get_times(){
  // Fetches the table start times and table numbers from the API
  fetch('/waiter/TableStatus/get_times')
      // Converts the JSON response to an object array in JavaScript
      .then(response => response.json())
      // Defines what to do with the data
      .then(function(data) {
        // finds how many tables that will need a timer by checking the length of the list
        let dataL = data.length;
        // For loop that loops over the number of tables in the array and gets the data from them into seperate variables
        for(let i = 0; i < dataL; i++){
          const tableNumber = data[i].Table_Number;
          const timerStatus = data[i].Timer_Status;
          // Sends the start time and the table number to calculate the timer for to the updateTimer function
          updateTimer(timerStatus,tableNumber)
        }
    });
  };

// Updates timer using the difference in seconds
function updateTimer (startTime,tableNumber){
  // Gets the current time
  let currentTime = new Date();
  // Converts the current time into seconds
  currentTime = (currentTime.getHours() * 3600) + (currentTime.getMinutes() * 60) + currentTime.getSeconds();
  // Splits the start time of the table into an array holding the hour, minutes, and seconds
  startTime = startTime.split(':');
  // Finds the start time of the table in seconds
  startTime = ((startTime[0] * 3600)+(startTime[1] * 60)+(startTime[2]*1));
  // Variable that holds the difference in seconds
  var differenceSEC = currentTime - startTime;
  // Variable that holds the difference in hours converted from seconds. It truncates and makes value always positive
  var differenceHours = Math.abs(Math.trunc((differenceSEC/3600)));
  // Subtracts the differenceHours from the diffence in seconds then it can divide by 60 to find the minutes
  var differenceMinutes = Math.abs(Math.trunc((differenceSEC-(differenceHours*3600))/60));
  // Subtracts all the previous ones which will just equal the second
  var differenceSeconds = Math.abs(Math.trunc((differenceSEC-(differenceHours*3600))-differenceMinutes*60));
  // Then creates a variable which combines all the difference in times and connects them using colons. 
  // Uses the is_double function to find if they are double digits
  let difference = is_double(differenceHours) + ':' + is_double(differenceMinutes) + ':' + is_double(differenceSeconds);
  // Changes the table status timer to equal the correct time
  document.getElementById(`timer-${tableNumber}`).innerHTML = difference;
}

// Checks if a time is not double digits and makes it display as double digits
function is_double(time){
  // if time is less than 10 it must be singular digits
  if(time < 10){
    // converts time into a string and adds a string 0 infront of it
    time = "0" + String(time);
    // Returns converted time
    return time;
  } // If the time is larger than 10 or 10 it doesn't need to be converted so it is returned 
  else{ return time};
}


// Refresh the page every 5 seconds
setInterval(refreshPage, 5000);

// refreshes the timer every second and runs it instatly whenever the page is refreshed
get_times();
setInterval(get_times, 1000)