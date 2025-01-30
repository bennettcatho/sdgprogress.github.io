function testFilters() {
    const firstYearOptions = Array.from(firstYearSelect.options).map(opt => opt.value);
    const secondYearOptions = Array.from(secondYearSelect.options).map(opt => opt.value);
    const countryOptions = Array.from(countriesSelect.options).map(opt => opt.value);
    const goalOptions = Array.from(goalsSelect.options).map(opt => opt.value);

    const filterCombinations = generateCombinations([
        firstYearOptions, secondYearOptions, countryOptions, goalOptions
    ]);

    console.log(`Testing ${filterCombinations.length} filter combinations...`);

    let testIndex = 0;

    function applyNextTest() {
        if (testIndex >= filterCombinations.length) {
            console.log("All tests completed!");
            return;
        }

        const [firstYear, secondYear, country, goal] = filterCombinations[testIndex];

        // Apply filters
        firstYearSelect.value = firstYear;
        secondYearSelect.value = secondYear;
        countriesSelect.value = country;
        goalsSelect.value = goal;

        // Trigger change events
        firstYearSelect.dispatchEvent(new Event('change'));
        secondYearSelect.dispatchEvent(new Event('change'));
        countriesSelect.dispatchEvent(new Event('change'));
        goalsSelect.dispatchEvent(new Event('change'));

        setTimeout(() => {
            const tableRows = document.querySelectorAll("#yourTableID tbody tr"); // Change #yourTableID
            if (tableRows.length === 0) {
                console.warn(`⚠️ Filter combination ${testIndex + 1} returned NO results!`, { firstYear, secondYear, country, goal });
            }
            testIndex++;
            applyNextTest();
        }, 500); // Wait for table update
    }

    applyNextTest();
}

function generateCombinations(arrays) {
    function helper(arr, prefix = []) {
        if (!arr.length) return [prefix];
        return arr[0].flatMap(value => helper(arr.slice(1), [...prefix, value]));
    }
    return helper(arrays);
}
