(function($){
  $(function(){
    $('.sidenav').sidenav();
    $('.parallax').parallax();
  }); // end of document ready
})(jQuery); // end of jQuery name space

let options = []; // Ensure options is defined
options.push('newValue'); // Or some other operation that uses options

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, options);
});

// Or with jQuery
$(document).ready(function(){
  $('select').formSelect();
});

// Modify the function to fetch the CSV from a GitHub Gist URL
function loadCSVData() {
  const csvURL = 'https://gist.githubusercontent.com/username/gistid/raw/filename.csv'; // Replace with your GitHub Gist raw URL
  
  fetch(csvURL)
    .then(response => response.text())
    .then(csvContent => {
      Papa.parse(csvContent, {
        complete: function(results) {
          const data = results.data;

          // Populate first dropdown
          const firstYearSelect = document.getElementById('first-year');
          data[0].forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            firstYearSelect.appendChild(option);
          });

          // Populate second dropdown
          const secondYearSelect = document.getElementById('second-year');
          data[1].forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            secondYearSelect.appendChild(option);
          });

          // Reinitialize form select
          M.FormSelect.init(firstYearSelect);
          M.FormSelect.init(secondYearSelect);
        }
      });
    })
    .catch(error => {
      console.error('Error loading CSV:', error);
    });
}

// Load CSV data when the window is loaded
window.onload = function() {
  loadCSVData();
};
