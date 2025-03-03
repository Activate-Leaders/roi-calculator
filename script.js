document.addEventListener("DOMContentLoaded", function () {
    // Constants
    const WEEKS_IN_YEAR = 52;
    const HOURS_IN_WEEK = 40;

    // Initialize total savings
    let totalSavings1 = 0;
    let totalSavings2 = 0;
    let totalSavings3 = 0;

    // Function to format number with spaces
    function formatNumberWithSpaces(number) {
        return number.toLocaleString('en').replace(/,/g, ' ');
    }

    // Function to update cumulative total
    function updateCumulativeTotal() {
        let cumulativeTotal = totalSavings1 + totalSavings2 + totalSavings3;
        document.getElementById("cumulativeTotal").innerText = 'R' + formatNumberWithSpaces(cumulativeTotal);
    }

    // Function to show tab
    function showTab(tabId) {
        const tabs = document.querySelectorAll('.tab');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));

        document.querySelector(`#${tabId}`).classList.add('active');
        document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');
    }

    // Generic function to calculate savings
    function calculateSavings(params) {
        let salary = parseFloat(document.getElementById(params.salaryId).value) * 12;
        let time = parseFloat(document.getElementById(params.timeId).value);
        let reduction = parseFloat(document.getElementById(params.reductionId).value) / 100;
        let numManagers = parseInt(document.getElementById(params.numManagersId).value);

        // Error handling for invalid inputs
        if (isNaN(salary) || isNaN(time) || isNaN(reduction) || isNaN(numManagers)) {
            alert("Please enter valid numbers for all fields.");
            return;
        }

        let annualHours = time * WEEKS_IN_YEAR;
        let hourlyRate = salary / (WEEKS_IN_YEAR * HOURS_IN_WEEK);
        let costPerManager = hourlyRate * annualHours;
        let savingsPerManager = costPerManager * reduction;

        let totalSavings = savingsPerManager * numManagers;

        if (params.savingsIndex === 1) {
            totalSavings1 = totalSavings;
        } else if (params.savingsIndex === 2) {
            totalSavings2 = totalSavings;
        } else if (params.savingsIndex === 3) {
            totalSavings3 = totalSavings;
        }

        const resultDiv = document.getElementById(params.resultId);
        resultDiv.innerHTML = params.resultHTML(costPerManager, savingsPerManager, totalSavings);
        resultDiv.classList.add('show');
        updateCumulativeTotal();
    }

    // Specific calculation functions
    function calculateROI() {
        calculateSavings({
            salaryId: "salary",
            timeId: "timeWasted",
            reductionId: "reduction",
            numManagersId: "numManagers",
            resultId: "result",
            savingsIndex: 1,
            resultHTML: (costPerManager, savingsPerManager, totalSavings) => `
                <p><em>*Takes annual & sick leave into account</em></p>
                <p>Yearly Cost of Wasted Time per Manager: R${formatNumberWithSpaces(costPerManager)}</p>
                <p>Annual Savings per Manager: R${formatNumberWithSpaces(savingsPerManager)}</p>
                <p>Total Company-Wide Savings: R${formatNumberWithSpaces(totalSavings)}</p>`
        });
    }

    function calculateOversightROI() {
        calculateSavings({
            salaryId: "salaryOversight",
            timeId: "oversightTime",
            reductionId: "reductionOversight",
            numManagersId: "numManagersOversight",
            resultId: "resultOversight",
            savingsIndex: 2,
            resultHTML: (costPerManager, savingsPerManager, totalSavings) => `
                <p><em>*Takes annual & sick leave into account</em></p>
                <p>Yearly Cost of Oversight per Manager: R${formatNumberWithSpaces(costPerManager)}</p>
                <p>Annual Savings per Manager: R${formatNumberWithSpaces(savingsPerManager)}</p>
                <p>Total Company-Wide Savings: R${formatNumberWithSpaces(totalSavings)}</p>`
        });
    }

    function calculateTurnoverROI() {
        let salary = parseFloat(document.getElementById("salaryTurnover").value) * 12;
        let totalEmployees = parseInt(document.getElementById("totalEmployees").value);
        let employeesWithoutPlans = (parseFloat(document.getElementById("employeesWithoutPlans").value) / 100) * totalEmployees;
        let turnoverRate = parseFloat(document.getElementById("turnoverRate").value) / 100;
        let reduction = parseFloat(document.getElementById("reductionTurnover").value) / 100;

        // Error handling for invalid inputs
        if (isNaN(salary) || isNaN(totalEmployees) || isNaN(employeesWithoutPlans) || isNaN(turnoverRate) || isNaN(reduction)) {
            alert("Please enter valid numbers for all fields.");
            return;
        }

        let employeesLostAnnually = employeesWithoutPlans * turnoverRate;
        let replacementCostPerEmployee = salary * 0.5;
        let totalTurnoverCost = employeesLostAnnually * replacementCostPerEmployee;

        let employeesRetained = Math.ceil(employeesLostAnnually * reduction);
        let preventedCost = employeesRetained * replacementCostPerEmployee;
        totalSavings3 = preventedCost;

        const resultDiv = document.getElementById("resultTurnover");
        resultDiv.innerHTML = `
            <p>Annual Cost of Turnover Due to Lack of Development: R${formatNumberWithSpaces(totalTurnoverCost)}</p>
            <p>Employees Retained Through Proactive Development: ${formatNumberWithSpaces(employeesRetained)}</p>
            <p>Total Prevented Cost Per Year: R${formatNumberWithSpaces(totalSavings3)}</p>`;
        resultDiv.classList.add('show');
        updateCumulativeTotal();
    }

    // Function to update charts
    function updateCharts() {
        const savingsLowImpact = totalSavings1;
        const savingsOversight = totalSavings2;
        const savingsTurnover = totalSavings3;

        const salary = parseFloat(document.getElementById("salary").value) * 12;
        const numManagers = parseInt(document.getElementById("numManagers").value);
        const hourlyRate = salary / (WEEKS_IN_YEAR * HOURS_IN_WEEK);
        const monthlyReduction = hourlyRate * 2 * numManagers;

        // Bar Chart Data
        const barCtx = document.getElementById('savingsBarChart').getContext('2d');
        if (window.savingsBarChart) {
            if (typeof window.savingsBarChart.destroy === 'function') {
                window.savingsBarChart.destroy();
            }
        }
        window.savingsBarChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Low-Impact Work Reduction', 'Task Oversight Reduction', 'Employee Turnover Reduction'],
                datasets: [{
                    label: 'Savings in Rands (R)',
                    data: [savingsLowImpact, savingsOversight, savingsTurnover],
                    backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                    borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Line Chart Data
        const monthlySavings = [savingsLowImpact, savingsOversight, savingsTurnover].map(savings => savings / 12);
        const cumulativeSavings = [];
        let total = 0;

        for (let i = 0; i < 12; i++) {
            const monthlyGainFactor = i < 6 ? 0.5 : 1.5; 
            const totalMonthlySavings = monthlySavings.reduce((sum, savings) => sum + (savings * monthlyGainFactor), 0);
            total += totalMonthlySavings - monthlyReduction;
            cumulativeSavings.push(total);
        }

        const lineCtx = document.getElementById('savingsLineChart').getContext('2d');
        if (window.savingsLineChart) {
            if (typeof window.savingsLineChart.destroy === 'function') {
                window.savingsLineChart.destroy();
            }
        }
        window.savingsLineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
                datasets: [{
                    label: 'Cumulative Savings in Rands (R)',
                    data: cumulativeSavings,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Ensure functions are accessible in HTML
    window.showTab = showTab;
    window.calculateROI = calculateROI;
    window.calculateOversightROI = calculateOversightROI;
    window.calculateTurnoverROI = calculateTurnoverROI;

    // Add event listener for the new button
    document.getElementById('generateGraphButton').addEventListener('click', function () {
        updateCharts();
        showTab('graph');
    });

    // Add scroll event listener for the banner
    let lastScrollTop = 0;
    const banner = document.querySelector('.banner-container');

    window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            banner.style.top = '-80px';
        } else {
            banner.style.top = '0';
        }
        lastScrollTop = scrollTop;
    });
});
