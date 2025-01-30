// inicializações
$(document).ready(function(){
  $('.collapsible').collapsible();
});

(function($){
  $(function(){
    $('.sidenav').sidenav();
    $('.parallax').parallax();
  });
})(jQuery);

let options = [];
options.push('newValue');

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, options);
});

$(document).ready(function(){
  $('select').formSelect();
});

// populando os filtros e a tabela pela primeira vez
function loadCSVData() {
  const csvURL = 'https://raw.githubusercontent.com/bennettcatho/sdgprogress.github.io/refs/heads/main/data/years.csv';
  
  fetch(csvURL)
    .then(response => response.text())
    .then(csvContent => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const data = results.data;
          const years = data.map(row => row.year);

          const firstYearSelect = document.getElementById('first-year');
          years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            firstYearSelect.appendChild(option);
          });

          const secondYearSelect = document.getElementById('second-year');
          years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            secondYearSelect.appendChild(option);
          });

          M.FormSelect.init(firstYearSelect);
          M.FormSelect.init(secondYearSelect);

          firstYearSelect.addEventListener('change', () => {
            const selectedYear = firstYearSelect.value;
            const selectedYears = Array.from(firstYearSelect.selectedOptions).map(option => option.value);

            secondYearSelect.innerHTML = '';

            years.forEach(year => {
              if (!selectedYears.includes(year)) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                secondYearSelect.appendChild(option);
              }
            });

            const instance = M.FormSelect.getInstance(secondYearSelect);
            if (instance) instance.destroy();
            M.FormSelect.init(secondYearSelect);
          });
        }
      });
    })
    .catch(error => {
      console.error('Error loading CSV:', error);
    });
}
window.onload = function() {
  loadCSVData();
};


function initializeCountrySelector() {
  const csvURL = 'https://raw.githubusercontent.com/bennettcatho/sdgprogress.github.io/refs/heads/main/data/countries.csv'; // Replace with your raw Gist URL

  fetch(csvURL)
    .then(response => response.text())
    .then(csvContent => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const data = results.data;
          const countries = data.map(row => row['Country']);

          const countriesSelect = document.getElementById('countries');

          const clearOption = document.createElement('option');
          clearOption.value = 'clear-all';
          clearOption.textContent = 'Clear All';
          countriesSelect.appendChild(clearOption);

          const selectAllOption = document.createElement('option');
          selectAllOption.value = 'select-all';
          selectAllOption.textContent = 'Select All';
          countriesSelect.appendChild(selectAllOption);

          countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countriesSelect.appendChild(option);
          });

          M.FormSelect.init(countriesSelect);

          countriesSelect.addEventListener('change', () => {
            const selectedOptions = Array.from(countriesSelect.selectedOptions);
            const selectedValues = selectedOptions.map(option => option.value);

            if (selectedValues.includes('select-all')) {
              countriesSelect.selectedIndex = -1;
              countriesSelect.querySelectorAll('option:not([value="clear-all"], [value="select-all"])').forEach(option => {
                option.selected = true;
              });
              M.FormSelect.init(countriesSelect);
            }

            if (selectedValues.includes('clear-all')) {
              countriesSelect.selectedIndex = -1;
              M.FormSelect.init(countriesSelect);
            }
          });
        }
      });
    })
    .catch(error => {
      console.error('Error loading countries CSV:', error);
    });
}

initializeCountrySelector();

function initializeGoalsSelector() {
  const csvURL = 'https://raw.githubusercontent.com/bennettcatho/sdgprogress.github.io/refs/heads/main/data/goals.csv';
  
  fetch(csvURL)
    .then(response => response.text())
    .then(csvContent => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          const data = results.data;
          const goals = data.map(row => row['Goals']);
          const goalsSelect = document.getElementById('goals');
          const clearOption = document.createElement('option');
          clearOption.value = 'clear-all';
          clearOption.textContent = 'Clear All';
          goalsSelect.appendChild(clearOption);

          const selectAllOption = document.createElement('option');
          selectAllOption.value = 'select-all';
          selectAllOption.textContent = 'Select All';
          goalsSelect.appendChild(selectAllOption);

          goals.forEach(goal => {
            if (goal) {
              const option = document.createElement('option');
              option.value = goal.replace(/ /g, "_").toLowerCase();
              option.textContent = goal;
              goalsSelect.appendChild(option);
            }
          });

          M.FormSelect.init(goalsSelect);

          goalsSelect.addEventListener('change', () => {
            const selectedOptions = Array.from(goalsSelect.selectedOptions);
            const selectedValues = selectedOptions.map(option => option.value);

            if (selectedValues.includes('select-all')) {
              goalsSelect.selectedIndex = -1;
              goalsSelect.querySelectorAll('option:not([value="clear-all"], [value="select-all"])').forEach(option => {
                option.selected = true;
              });
              M.FormSelect.init(goalsSelect);
            }

            if (selectedValues.includes('clear-all')) {
              goalsSelect.selectedIndex = -1;
              M.FormSelect.init(goalsSelect);
            }
          });
        }
      });
    })
    .catch(error => {
      console.error('Error loading Goals CSV:', error);
    });
}

initializeGoalsSelector();

function updateTableWithYearGroups() {
  const csvURL = 'https://raw.githubusercontent.com/bennettcatho/sdgprogress.github.io/refs/heads/main/data/data.csv';

  fetch(csvURL)
    .then(response => response.text())
    .then(csvContent => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const data = results.data;

          const yearGroupValues = {};
          data.forEach(row => {
            const country = row.Country;
            if (!yearGroupValues[country]) {
              yearGroupValues[country] = {
                totalGoalsSum: 0,
                totalGoalsCount: 0
              };
            }

            yearGroupValues[country].yearCount += 1;

            Object.keys(row).forEach(key => {
              if (key.startsWith('goal') && row[key]) {
                const value = parseFloat(row[key]);
                if (!isNaN(value)) {
                  yearGroupValues[country].totalGoalsSum += value;
                  yearGroupValues[country].totalGoalsCount += 1;
                }
              }
            });
          });

          Object.keys(yearGroupValues).forEach(country => {
            const countryData = yearGroupValues[country];
            countryData.yearGroupValue =
              countryData.totalGoalsSum /
              (countryData.totalGoalsCount);
          });

          const tableBody = document.querySelector('table tbody');
          tableBody.innerHTML = '';

          Object.keys(yearGroupValues).forEach(country => {
            const row = document.createElement('tr');

            const countryCell = document.createElement('td');
            countryCell.textContent = country;
            row.appendChild(countryCell);

            const yearGroup1Cell = document.createElement('td');
            const yearGroup2Cell = document.createElement('td');
            const yearGroupValue = yearGroupValues[country].yearGroupValue.toFixed(2);
            yearGroup1Cell.textContent = yearGroupValue;
            yearGroup2Cell.textContent = yearGroupValue;
            row.appendChild(yearGroup1Cell);
            row.appendChild(yearGroup2Cell);

            tableBody.appendChild(row);
          });
        }
      });
    })
    .catch(error => {
      console.error('Error loading data:', error);
    });
}
updateTableWithYearGroups();

// Função que exporta a tabela em CSV
function exportTableToCSV() {
  const table = document.querySelector('table');
  const rows = table.querySelectorAll('tr');
  let csvContent = '';
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    const rowContent = Array.from(cells)
      .map(cell => `"${cell.textContent}"`)
      .join(',');
    csvContent += rowContent + '\n';
  });
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'table_export.csv');
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
document.getElementById('export-csv-btn').addEventListener('click', exportTableToCSV);

//
// COMEÇAM AS FUNÇÕES DE FILTRAGEM
//

const firstYearSelect = document.getElementById('first-year');
const secondYearSelect = document.getElementById('second-year');
const countriesSelect = document.getElementById('countries');
const goalsSelect = document.getElementById('goals');

function filterYears(data, yeargroup1 = [], yeargroup2 = []) {
  yeargroup1 = data.filter(row => yeargroup1.includes(row.year));
  yeargroup2 = data.filter(row => yeargroup2.includes(row.year)); //|| [];
  return {yeargroup1, yeargroup2};
}

function filterCountries(data, countries = []) {
  countries = data.filter(row => countries.includes(row.Country));
  return countries;
}


function filteredTable(goals = [], firstData = [], secondData = []) {
  let selected_goals = [];
  let goalColumnNames = [];
  if (goals.length === 0) {
    goals = ['goal_1_-_no_poverty', 'goal_2_-_zero_hunger', 'goal_3_-_good_health_and_well_being', 'goal_4_-_quality_education', 'goal_5_-_gender_equality', 'goal_6_-_clean_water_and_sanitation', 'goal_7_-_affordable_clean_energy', 'goal_8_-_efficient_work_and_economic_growth', 'goal_9_-_industry,_innovation_and_infrastructure', 'goal_10_-_reduced_inequalities', 'goal_11_-_sustainable_cities_and_communities', 'goal_12_-_responsible_consumption_and_production', 'goal_13_-_climate_action', 'goal_14_-_life_below_water', 'goal_15_-_life_on_land', 'goal_16_-_peace,_justice_and_strong_institutions', 'goal_17_-_partnerships_for_the_goals'];
  }
  goalColumnNames = goals.map(goal => {
    const goalNumber = goal.match(/goal_(\d+)_/)[1];
    return `goal${goalNumber}`;
  });
  const yearGroupValues1 = {};
  firstData.forEach(row => {
    const country = row.Country;
    if (!yearGroupValues1[country]) {
      yearGroupValues1[country] = {
        totalSum: 0,
        totalCount: 0
      };
    }
    goalColumnNames.forEach(goalColumn => {
      if (row[goalColumn]) {
        const value = parseFloat(row[goalColumn]);
        if (!isNaN(value)) {
          yearGroupValues1[country].totalSum += value;
          yearGroupValues1[country].totalCount += 1;
        }
      }
    });
  });
  const yearGroupValues2 = {};
  secondData.forEach(row => {
    const country = row.Country;
    if (!yearGroupValues2[country]) {
      yearGroupValues2[country] = {
        totalSum: 0,
        totalCount: 0
      };
    }
    goalColumnNames.forEach(goalColumn => {
      if (row[goalColumn]) {
        selected_goals += goalColumn;
        const value = parseFloat(row[goalColumn]);
        if (!isNaN(value)) {
          yearGroupValues2[country].totalSum += value;
          yearGroupValues2[country].totalCount += 1;
        }
      }
    });
  });
  return {yearGroupValues1, yearGroupValues2}
}

function fillTable(data) {
  const tableBody = document.querySelector('table tbody');
  tableBody.innerHTML = '';

  Object.keys(data.yearGroupValues1).forEach(country => {
    const row = document.createElement('tr');

    const countryCell = document.createElement('td');
    countryCell.textContent = country;
    row.appendChild(countryCell);

    const yearGroup1Cell = document.createElement('td');
    const countryData1 = data.yearGroupValues1[country];
    const yearGroupValue1 =
      countryData1.totalCount > 0 ? (countryData1.totalSum / countryData1.totalCount).toFixed(2) : "0";
    yearGroup1Cell.textContent = yearGroupValue1;
    row.appendChild(yearGroup1Cell);

    const yearGroup2Cell = document.createElement('td');
    if (data.yearGroupValues2[country]) {
      const countryData2 = data.yearGroupValues2[country];
      const yearGroupValue2 =
        countryData2.totalCount > 0 ? (countryData2.totalSum / countryData2.totalCount).toFixed(2) : "0";
      yearGroup2Cell.textContent = yearGroupValue2;
    } else {
      yearGroup2Cell.textContent = "";
    }
    row.appendChild(yearGroup2Cell);
    tableBody.appendChild(row);
  });
}

function filterTable() {
  const csvURL = 'https://raw.githubusercontent.com/bennettcatho/sdgprogress.github.io/refs/heads/main/data/data.csv';
  fetch(csvURL)
    .then(response => response.text())
    .then(csvContent => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const firstselectedYears = Array.from(firstYearSelect.selectedOptions).map(option => option.value);
          const secondselectedYears = Array.from(secondYearSelect.selectedOptions).map(option => option.value);
          const selectedCountries = Array.from(countriesSelect.selectedOptions).map(option => option.value);
          const selectedGoals = Array.from(goalsSelect.selectedOptions).map(option => option.value);
          const filters = [firstselectedYears, secondselectedYears, selectedCountries, selectedGoals];
          console.log('filters',filters)
          let filteredData = results.data;
          let yearsResult = [];
          let final_result;
          if (selectedCountries.length > 0 && ((firstselectedYears.length == 0 && secondselectedYears.length == 0))) {
            filteredData = filterCountries(filteredData, selectedCountries);
            final_result = filteredTable(selectedGoals, filteredData);
            fillTable(final_result);
          }
          if (selectedCountries.length > 0 && ((firstselectedYears.length > 0 || secondselectedYears.length > 0))) {
            filteredData = filterCountries(filteredData, selectedCountries);
            final_result = filteredTable(selectedGoals, filteredData);
            fillTable(final_result);
          }
          if (firstselectedYears.length > 0 || secondselectedYears.length > 0) {
            yearsResult = filterYears(filteredData, firstselectedYears, secondselectedYears);
            final_result = filteredTable(selectedGoals, yearsResult.yeargroup1, yearsResult.yeargroup2);
            fillTable(final_result);
          }
          if (selectedCountries.length == 0 && firstselectedYears.length == 0 && secondselectedYears.length == 0) {
            final_result = filteredTable(selectedGoals, filteredData);
            fillTable(final_result);
          }
          console.log(final_result)
        }
      });
    })
  }

firstYearSelect.addEventListener('change', filterTable);
secondYearSelect.addEventListener('change', filterTable);
countriesSelect.addEventListener('change', filterTable);
goalsSelect.addEventListener('change', filterTable);

//
// FIM DAS FUNÇÕES DE FILTRAGEM
//

// COMEÇAM AS FUNÇÕES DE ORDENAÇÃO

// COMEÇAM AS FUNÇÕES DE DECORAÇÃO