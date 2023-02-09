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

// Checks if the number is minus and if it is it changes it so that it is a posative
function is_minus(number){
  //  is the time negative
  if (number < 0){
    // If it is add it to 60 which will give you the difference which will be the correct time
    number = 60 + number; 
    // Now return the number
    return number;
  } else {
    // If it is not negative just return the number
    return number;
  };
}

// Takes in the start time and the table number for which it is for
// function updateTimer(startTime,tableNumber) {
//   // Gets the current date and saves it to currentTime
//   let currentTime = new Date();
//   // Splits the start time into the hours, minutes and seconds 
//   startTime = startTime.split(':')
//   // minuses the current hours, minutes and seconds from the start time ones then also adds a colon inbetween them
//   // It also uses the is_minus function I made
//   let difference = (currentTime.getHours()-startTime[0]) + ':' + is_minus(currentTime.getMinutes()-startTime[1]) + ':' + is_minus(currentTime.getSeconds()-startTime[2]);
//   // changes the contents of the timer element for that table with the difference
//   document.getElementById(`timer-${tableNumber}`).innerHTML = difference;
// }

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
          NewUpdateTimer(timerStatus,tableNumber)
        }
    });
  };




// Refresh the page every 5 seconds
setInterval(refreshPage, 20000);

// refreshes the timer every second and runs it instatly whenever the page is refreshed
get_times();
setInterval(get_times, 1000)

function NewUpdateTimer (startTime,tableNumber){
  let currentTime = new Date();
  currentTime = (currentTime.getHours() * 3600) + (currentTime.getMinutes() * 60) + currentTime.getSeconds();
  startTime = startTime.split(':');
  startTime = ((startTime[0] * 3600)+(startTime[1] * 60)+(startTime[2]*1));
  var differenceSEC = currentTime - startTime;
  var differenceHours = Math.abs(Math.trunc((differenceSEC/3600)));
  var differenceMinutes = Math.abs(Math.trunc((differenceSEC-(differenceHours*3600))/60));
  var differenceSeconds = Math.abs(Math.trunc((differenceSEC-(differenceHours*3600))-differenceMinutes*60));
  let difference = (differenceHours) + ':' + (differenceMinutes) + ':' + (differenceSeconds);
  document.getElementById(`timer-${tableNumber}`).innerHTML = difference;
}