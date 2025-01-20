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

function loadCSVData() {
  const csvURL = 'https://raw.githubusercontent.com/bennettcatho/sdgprogress.github.io/refs/heads/main/data/years.csv'; // Replace with your raw Gist URL
  
  fetch(csvURL)
    .then(response => response.text()) // Get the text content of the CSV
    .then(csvContent => {
      Papa.parse(csvContent, {
        header: true, // Parse the CSV with headers
        skipEmptyLines: true, // Ignore empty lines
        complete: function(results) {
          const data = results.data; // Parsed CSV data as an array of objects
          const years = data.map(row => row.year); // Extract all years from the "year" column

          // Populate the first dropdown
          const firstYearSelect = document.getElementById('first-year');
          years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            firstYearSelect.appendChild(option);
          });

          // Populate the second dropdown
          const secondYearSelect = document.getElementById('second-year');
          years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            secondYearSelect.appendChild(option);
          });

          // Reinitialize Materialize form selects
          M.FormSelect.init(firstYearSelect);
          M.FormSelect.init(secondYearSelect);

          // Add event listener to update the second dropdown when the first dropdown changes
          firstYearSelect.addEventListener('change', () => {
            const selectedYear = firstYearSelect.value;
            const selectedYears = Array.from(firstYearSelect.selectedOptions).map(option => option.value);

            // Clear the second dropdown
            secondYearSelect.innerHTML = '';

            // Populate the second dropdown, excluding the years in selectedYears
            years.forEach(year => {
              if (!selectedYears.includes(year)) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                secondYearSelect.appendChild(option);
              }
            });

            // Fix: Reinitialize Materialize for the updated second dropdown
            const instance = M.FormSelect.getInstance(secondYearSelect);
            if (instance) instance.destroy(); // Destroy existing instance before reinitializing
            M.FormSelect.init(secondYearSelect); // Reinitialize with the updated options
          });
        }
      });
    })
    .catch(error => {
      console.error('Error loading CSV:', error);
    });
}

// Load CSV data when the page is loaded
window.onload = function() {
  loadCSVData();
};


function initializeCountrySelector() {
  const csvURL = 'https://raw.githubusercontent.com/bennettcatho/sdgprogress.github.io/refs/heads/main/data/countries.csv'; // Replace with your raw Gist URL

  fetch(csvURL)
    .then(response => response.text()) // Get the text content of the CSV
    .then(csvContent => {
      Papa.parse(csvContent, {
        header: true, // Parse CSV assuming it has headers
        skipEmptyLines: true, // Ignore empty lines
        complete: function(results) {
          const data = results.data; // Parsed CSV data as an array of objects
          const countries = data.map(row => row['Country']); // Extract all countries from the "country" column
          console.log(countries)

          // Populate the dropdown
          const countriesSelect = document.getElementById('countries');

          // Add "Clear All" and "Select All" options
          const clearOption = document.createElement('option');
          clearOption.value = 'clear-all';
          clearOption.textContent = 'Clear All';
          countriesSelect.appendChild(clearOption);

          const selectAllOption = document.createElement('option');
          selectAllOption.value = 'select-all';
          selectAllOption.textContent = 'Select All';
          countriesSelect.appendChild(selectAllOption);

          // Add country options
          countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countriesSelect.appendChild(option);
          });

          // Reinitialize Materialize form select
          M.FormSelect.init(countriesSelect);

          // Add event listener for change to handle "Select All" and "Clear All" logic
          countriesSelect.addEventListener('change', () => {
            const selectedOptions = Array.from(countriesSelect.selectedOptions);
            const selectedValues = selectedOptions.map(option => option.value);

            // If "Select All" is selected, select all countries (excluding "Clear All")
            if (selectedValues.includes('select-all')) {
              countriesSelect.selectedIndex = -1; // Deselect "Select All"
              countriesSelect.querySelectorAll('option:not([value="clear-all"], [value="select-all"])').forEach(option => {
                option.selected = true;
              });
              M.FormSelect.init(countriesSelect); // Reinitialize to update the select element
            }

            // If "Clear All" is selected, deselect everything
            if (selectedValues.includes('clear-all')) {
              countriesSelect.selectedIndex = -1; // Deselect everything
              M.FormSelect.init(countriesSelect); // Reinitialize to update the select element
            }
          });
        }
      });
    })
    .catch(error => {
      console.error('Error loading countries CSV:', error);
    });
}

// Call the function to initialize the countries dropdown
initializeCountrySelector();

function initializeGoalsSelector() {
  const csvURL = 'https://raw.githubusercontent.com/bennettcatho/sdgprogress.github.io/refs/heads/main/data/goals.csv';
  fetch(csvURL)
    .then(response => response.text()) // Get the text content of the CSV
    .then(csvContent => {
      Papa.parse(csvContent, {
        header: true, // Parse CSV assuming it has headers
        skipEmptyLines: true, // Ignore empty lines
        complete: function(results) {
          const data = results.data; // Parsed CSV data as an array of objects
          const goals = data.map(row => row['Goals']); // Extract goals from "Goals" column
          
          // Populate the dropdown
          const goalsSelect = document.getElementById('goals');

          // Add "Clear All" and "Select All" options
          const clearOption = document.createElement('option');
          clearOption.value = 'clear-all';
          clearOption.textContent = 'Clear All';
          goalsSelect.appendChild(clearOption);

          const selectAllOption = document.createElement('option');
          selectAllOption.value = 'select-all';
          selectAllOption.textContent = 'Select All';
          goalsSelect.appendChild(selectAllOption);

          // Add goals as options
          goals.forEach(goal => {
            if (goal) { // Ensure goal is not null or undefined
              const option = document.createElement('option');
              option.value = goal.replace(/ /g, "_").toLowerCase(); // Make it URL-friendly
              option.textContent = goal;
              goalsSelect.appendChild(option);
            }
          });

          // Reinitialize Materialize form select
          M.FormSelect.init(goalsSelect);

          // Add event listener for dropdown changes
          goalsSelect.addEventListener('change', () => {
            const selectedOptions = Array.from(goalsSelect.selectedOptions);
            const selectedValues = selectedOptions.map(option => option.value);

            // Handle "Select All"
            if (selectedValues.includes('select-all')) {
              goalsSelect.selectedIndex = -1; // Deselect "Select All"
              goalsSelect.querySelectorAll('option:not([value="clear-all"], [value="select-all"])').forEach(option => {
                option.selected = true;
              });
              M.FormSelect.init(goalsSelect); // Reinitialize to reflect the changes
            }

            // Handle "Clear All"
            if (selectedValues.includes('clear-all')) {
              goalsSelect.selectedIndex = -1; // Deselect everything
              M.FormSelect.init(goalsSelect); // Reinitialize to reflect the changes
            }

            // Automatically deselect "Clear All" if any other option is selected
            if (selectedValues.some(value => value !== 'clear-all')) {
              const clearAllOption = goalsSelect.querySelector('option[value="clear-all"]');
              if (clearAllOption) {
                clearAllOption.selected = false;
                M.FormSelect.init(goalsSelect);
              }
            }
          });
        }
      });
    })
    .catch(error => {
      console.error('Error loading Goals CSV:', error);
    });
}

// Call the function to initialize the goals dropdown
initializeGoalsSelector();
