// inicializações
$(document).ready(function(){
  $('.collapsible').collapsible();
});
$(document).ready(function(){
  $('.tooltipped').tooltip();
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

// populando os filtros pela primeira vez
// populando os dois filtros de anos
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

// populando o filtro de países
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

// populando o filtro de objetivos
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

// inicializando a tabela
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
              (countryData.totalGoalsCount || 1);
          });

          const tableBody = document.querySelector('table tbody');
          tableBody.innerHTML = '';

          Object.keys(yearGroupValues).forEach(country => {
            const row = document.createElement('tr');

            const countryCell = document.createElement('td');
            countryCell.textContent = country;
            row.appendChild(countryCell);

            const yearGroup1Cell = document.createElement('td');
            yearGroup1Cell.textContent = yearGroupValues[country].yearGroupValue.toFixed(2);
            row.appendChild(yearGroup1Cell);

            const yearGroup2Cell = document.createElement('td');
            yearGroup2Cell.textContent = ''; // Mantém a coluna vazia
            row.appendChild(yearGroup2Cell);

            const progressCell = document.createElement('td');
            progressCell.textContent = ''; // Nova coluna Progress vazia
            row.appendChild(progressCell);

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
      .map(cell => `"${cell.textContent.trim()}"`)
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
    let yearGroupValue2 = "";
    if (data.yearGroupValues2[country]) {
      const countryData2 = data.yearGroupValues2[country];
      yearGroupValue2 = countryData2.totalCount > 0 ? (countryData2.totalSum / countryData2.totalCount).toFixed(2) : "0";
      yearGroup2Cell.textContent = yearGroupValue2;
    } else {
      yearGroup2Cell.textContent = "";
    }
    row.appendChild(yearGroup2Cell);

    const progressCell = document.createElement('td');
    if (yearGroupValue1 !== "" && yearGroupValue2 !== "") {
      progressCell.textContent = (parseFloat(yearGroupValue2) - parseFloat(yearGroupValue1)).toFixed(2);
    } else {
      progressCell.textContent = "";
    }
    row.appendChild(progressCell);

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

// filtragem do país
document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("countryHeader")
  const icon = header.querySelector(".sort-icons")

  header.addEventListener("click", function () {
    let order = header.getAttribute("data-order")

    if (order === "both") {
      header.setAttribute("data-order", "down")
      icon.classList.add("down")
      icon.classList.remove("up")
    } else if (order === "down") {
      header.setAttribute("data-order", "up")
      icon.classList.add("up")
      icon.classList.remove("down")
    } else {
      header.setAttribute("data-order", "both")
      icon.classList.remove("up", "down")
    }
  })
})

document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("yg1Header")
  const icon = header.querySelector(".sort-icons")

  header.addEventListener("click", function () {
    let order = header.getAttribute("data-order")

    if (order === "both") {
      header.setAttribute("data-order", "down")
      icon.classList.add("down")
      icon.classList.remove("up")
    } else if (order === "down") {
      header.setAttribute("data-order", "up")
      icon.classList.add("up")
      icon.classList.remove("down")
    } else {
      header.setAttribute("data-order", "both")
      icon.classList.remove("up", "down")
    }
  })
})

document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("yg2Header")
  const icon = header.querySelector(".sort-icons")

  header.addEventListener("click", function () {
    let order = header.getAttribute("data-order")

    if (order === "both") {
      header.setAttribute("data-order", "down")
      icon.classList.add("down")
      icon.classList.remove("up")
    } else if (order === "down") {
      header.setAttribute("data-order", "up")
      icon.classList.add("up")
      icon.classList.remove("down")
    } else {
      header.setAttribute("data-order", "both")
      icon.classList.remove("up", "down")
    }
  })
})
document.addEventListener("DOMContentLoaded", function () {
  // Selecione todos os cabeçalhos da tabela com a classe 'sortable'
  const headers = document.querySelectorAll('.sortable');
  
  headers.forEach(header => {
    const icon = header.querySelector('.sort-icons');

    header.addEventListener("click", function () {
      // Verifique o estado atual da ordenação
      let order = header.getAttribute("data-order");
      
      // Manipulação de ordenação para cada estado possível
      if (order === "both") {
        // Primeira vez, ordena de forma crescente
        header.setAttribute("data-order", "down");
        icon.classList.add("down");
        icon.classList.remove("up");
        sortTable(header, 'asc');  // Ordena de forma crescente
      } else if (order === "down") {
        // Segunda vez, ordena de forma decrescente
        header.setAttribute("data-order", "up");
        icon.classList.add("up");
        icon.classList.remove("down");
        sortTable(header, 'desc');  // Ordena de forma decrescente
      } else {
        // Terceira vez, remove a ordenação
        header.setAttribute("data-order", "both");
        icon.classList.remove("up", "down");
        resetSort();  // Remove a ordenação da tabela
      }
    });
  });

  // Função que ordena a tabela
  function sortTable(header, direction) {
    const columnIndex = Array.from(header.parentNode.children).indexOf(header); // Índice da coluna
    const rows = Array.from(document.querySelectorAll('table tbody tr')); // Seleciona todas as linhas da tabela

    rows.sort((rowA, rowB) => {
      let cellA = rowA.cells[columnIndex].textContent.trim();
      let cellB = rowB.cells[columnIndex].textContent.trim();

      // Converte para número, assumindo 0 caso seja vazio ou inválido
      let numA = cellA === "" ? 0 : parseFloat(cellA.replace(',', '.'));
      let numB = cellB === "" ? 0 : parseFloat(cellB.replace(',', '.'));

      // Usa números para comparação se forem válidos
      if (!isNaN(numA) && !isNaN(numB)) {
        return direction === 'asc' ? numA - numB : numB - numA;
      } else {
        return direction === 'asc' ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
      }
    });

    // Reorganiza as linhas na tabela de acordo com a ordenação
    const tbody = document.querySelector('table tbody');
    rows.forEach(row => tbody.appendChild(row));
  }


  // Função que reinicia a ordenação, mantendo a ordem original
  function resetSort() {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    const tbody = document.querySelector('table tbody');

    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[0].textContent.trim();
      const cellB = rowB.cells[0].textContent.trim();
      return cellA.localeCompare(cellB);
    });

    rows.forEach(row => tbody.appendChild(row));
  }
});


// COMEÇAM AS FUNÇÕES DE DECORAÇÃO (label com os filtros selecionados nos nomes das colunas)
function updateYearGroupLabels() {
  const firstSelectedYears = Array.from(document.getElementById('first-year').selectedOptions).map(option => option.value);
  const secondSelectedYears = Array.from(document.getElementById('second-year').selectedOptions).map(option => option.value);
  let selectedGoals = Array.from(document.getElementById('goals').selectedOptions).map(option => option.value);

  const goalsSelect = document.getElementById('goals');
  if (selectedGoals.includes('select-all')) {
      selectedGoals = Array.from(goalsSelect.options)
          .map(option => option.value)
          .filter(value => value !== 'select-all' && value !== 'clear-all');
  }
  
  let goalNumbers = [];
  if (selectedGoals.includes('clear-all')) {
      selectedGoals = [];
      goalNumbers = [];
  } else {
      goalNumbers = selectedGoals.map(value => value.match(/\d+/)).filter(Boolean);
  }
  const yg1Label = document.getElementById('yg1-label');
  const yg2Label = document.getElementById('yg2-label');

  let yg1Text = '';
  let yg2Text = '';

  if (firstSelectedYears.length === 1) {
      yg1Text += `For the year ${firstSelectedYears[0]}`;
  } else if (firstSelectedYears.length > 1) {
      yg1Text += `Average of years ${firstSelectedYears.join(', ')}`;
  }
  
  if (secondSelectedYears.length === 1) {
      yg2Text += `For the year ${secondSelectedYears[0]}`;
  } else if (secondSelectedYears.length > 1) {
      yg2Text += `Average of years ${secondSelectedYears.join(', ')}`;
  } else if (secondSelectedYears.length === 0) {
      yg2Text = '';
  }
  
  if (goalNumbers.length === 1) {
    const goalsText = ` considering goal ${goalNumbers.join(', ')}`;
    yg1Text += goalsText;
    yg2Text += goalsText;
  }  else if (goalNumbers.length > 0 && goalNumbers.length < 17) {
      const goalsText = ` considering goals ${goalNumbers.join(', ')}`;
      yg1Text += goalsText;
      yg2Text += goalsText;
  } else if (goalNumbers.length === 0 || goalNumbers.length === 17) {
    const goalsText = ` considering all goals`;
    yg1Text += goalsText;
    yg2Text += goalsText;
}

  yg1Label.textContent = yg1Text;
  yg2Label.textContent = yg2Text;
}

// Criar os elementos de rótulo abaixo dos cabeçalhos Year Group 1 e Year Group 2
document.addEventListener('DOMContentLoaded', function () {
  const yg1Header = document.getElementById('yg1Header');
  const yg2Header = document.getElementById('yg2Header');

  const yg1Label = document.createElement('div');
  yg1Label.id = 'yg1-label';
  yg1Label.style.fontSize = '12px';
  yg1Label.style.color = '#555';
  yg1Header.appendChild(yg1Label);

  const yg2Label = document.createElement('div');
  yg2Label.id = 'yg2-label';
  yg2Label.style.fontSize = '12px';
  yg2Label.style.color = '#555';
  yg2Header.appendChild(yg2Label);

  document.getElementById('first-year').addEventListener('change', updateYearGroupLabels);
  document.getElementById('second-year').addEventListener('change', updateYearGroupLabels);
  document.getElementById('goals').addEventListener('change', updateYearGroupLabels);
});


// ação do botão que limpa todos os filtros (corrigir o bug de limpar também o label descritivo embaixo de Score Period 1 e Score Period 2)
document.getElementById("clean-filter-btn").addEventListener("click", () => {
  firstYearSelect.value = "";
  secondYearSelect.value = "";
  countriesSelect.value = "";
  goalsSelect.value = "";
  [firstYearSelect, secondYearSelect, countriesSelect, goalsSelect].forEach(select => {
    if (select.multiple) {
      Array.from(select.options).forEach(option => option.selected = false);
    }
  });
  filterTable();
  const yg1Header = document.getElementById('yg1-label');
  yg1Header.textContent = '';
  const yg2Header = document.getElementById('yg2-label');
  yg2Header.textContent = '';

  loadCSVData();
  initializeCountrySelector();
  initializeGoalsSelector();
});

// ação do botão generate charts
// opcao 1 - mostrar os gráficos na própria página (acho que não é uma boa)
/*
document.addEventListener("DOMContentLoaded", function () {
  const generateChartsBtn = document.getElementById("generate-charts-btn");
  const chartsDiv = document.getElementById("charts");

  if (!generateChartsBtn || !chartsDiv) {
      console.error("Element not found!");
      return;
  }

  generateChartsBtn.addEventListener("click", function () {
      chartsDiv.style.display = chartsDiv.style.display === "none" || chartsDiv.style.display === "" ? "block" : "none";
  });
});
*/
// opcao 2 - mostrar os gráficos em uma Modal (acho que é melhor)