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
function startTimer(startTime,tableNumber) {
  let currentTime = new Date();
  startTime = startTime.split(':')
  console.log(currentTime)
  let difference = is_minus(currentTime.getHours()-startTime[0]) + ':' + is_minus(currentTime.getMinutes()-startTime[1]) + ':' + is_minus(currentTime.getSeconds()-startTime[2]);

  document.getElementById(`timer-${tableNumber}`).innerHTML = difference;
}

// Timer data retriver and updater
function get_times(){
  fetch('/waiter/TableStatus/get_times')
      .then(response => response.json())
      .then(function(data) {
        console.log(data)
        let dataL = data.length;
        for(let i = 0; i < dataL; i++){
          const tableNumber = data[i].Table_Number;
          const timerStatus = data[i].Timer_Status;
          console.log(timerStatus)
          startTimer(timerStatus,tableNumber)
        }
    });
  };

function is_minus(number){
  if (number < 0){
    number = 60 + number; 
    return number;
  } else {
    return number;
  };
  
}


// Refresh the page every 5 seconds
setInterval(refreshPage, 20000);

get_times();
setInterval(get_times, 1000)

