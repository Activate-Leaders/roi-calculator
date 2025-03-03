document.addEventListener("DOMContentLoaded", function () {
    function showTab(tabId) {
        const tabs = document.querySelectorAll('.tab');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach((tab) => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));

        document.querySelector(`#${tabId}`).classList.add('active');
        document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');

        console.log(`Tab ${tabId} is now active`);
    }

    window.showTab = showTab; // Ensure function is available globally

    let totalSavings1 = 0;
    let totalSavings2 = 0;

    function formatNumberWithSpaces(number) {
        return number.toLocaleString('en').replace(/,/g, ' ');
    }

    function updateCumulativeTotal() {
        let cumulativeTotal = totalSavings1 + totalSavings2;
        document.getElementById("cumulativeTotal").innerText = 'R' + formatNumberWithSpaces(cumulativeTotal);
    }

    function calculateROI() {
        let salary = parseFloat(document.getElementById("salary").value) * 12;
        let timeWasted = parseFloat(document.getElementById("timeWasted").value);
        let reduction = parseFloat(document.getElementById("reduction").value) / 100;
        let numManagers = parseInt(document.getElementById("numManagers").value);

        let annualHoursWasted = timeWasted * 52;
        let hourlyRate = salary / (52 * 40);
        let wastedCostPerManager = hourlyRate * annualHoursWasted;
        let savingsPerManager = wastedCostPerManager * reduction;

        totalSavings1 = savingsPerManager * numManagers;

        console.log(`Total Savings 1: ${totalSavings1}`);

        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `
            <p><em>*Takes annual & sick leave into account</em></p>
            <p>Yearly Cost of Wasted Time per Manager: R${formatNumberWithSpaces(wastedCostPerManager)}</p>
            <p>Annual Savings per Manager: R${formatNumberWithSpaces(savingsPerManager)}</p>
            <p>Total Company-Wide Savings: R${formatNumberWithSpaces(totalSavings1)}</p>
        `;
        resultDiv.classList.add('show');
        updateCumulativeTotal();
    }

    function calculateOversightROI() {
        let salary = parseFloat(document.getElementById("salaryOversight").value) * 12;
        let oversightTime = parseFloat(document.getElementById("oversightTime").value);
        let reduction = parseFloat(document.getElementById("reductionOversight").value) / 100;
        let numManagers = parseInt(document.getElementById("numManagersOversight").value);

        let annualHoursOversight = oversightTime * 52;
        let hourlyRateOversight = salary / (52 * 40);
        let oversightCostPerManager = hourlyRateOversight * annualHoursOversight;
        let savingsPerManager = oversightCostPerManager * reduction;
        totalSavings2 = savingsPerManager * numManagers;

        console.log(`Total Savings 2: ${totalSavings2}`);

        const resultDiv = document.getElementById("resultOversight");
        resultDiv.innerHTML = `
            <p><em>*Takes annual & sick leave into account</em></p>
            <p>Yearly Cost of Oversight per Manager: R${formatNumberWithSpaces(oversightCostPerManager)}</p>
            <p>Annual Savings per Manager: R${formatNumberWithSpaces(savingsPerManager)}</p>
            <p>Total Company-Wide Savings: R${formatNumberWithSpaces(totalSavings2)}</p>
        `;
        resultDiv.classList.add('show');
        updateCumulativeTotal();
    }

    async function exportROIReport() {
        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({ orientation: 'landscape' });

        // Helper function to add content of a tab to the PDF
        const addTabContentToPDF = async (tabId, pageTitle) => {
            showTab(tabId);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the tab to render

            const element = document.querySelector(`#${tabId}`);
            pdf.text(pageTitle, 10, 10);
            await pdf.html(element, { x: 10, y: 20 });
            pdf.addPage('landscape');
        };

        // Add each tab content to the PDF
        await addTabContentToPDF('calculators', 'ROI Calculators');
        await addTabContentToPDF('explanation', 'How We Calculate ROI');
        await addTabContentToPDF('graph', 'Annual Savings Breakdown');

        // Remove the last empty page
        pdf.deletePage(pdf.getNumberOfPages());

        // Save the PDF
        pdf.save('ROI_Report.pdf');
    }

    function updateCharts() {
        const savingsLowImpact = totalSavings1;
        const savingsOversight = totalSavings2;

        // Bar Chart Data
        const barCtx = document.getElementById('savingsBarChart')?.getContext('2d');
        if (barCtx) {
            if (window.savingsBarChart) {
                if (typeof window.savingsBarChart.destroy === 'function') {
                    window.savingsBarChart.destroy();
                }
            }
            window.savingsBarChart = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ['Low-Impact Work Reduction', 'Task Oversight Reduction'],
                    datasets: [{
                        label: 'Savings in Rands (R)',
                        data: [savingsLowImpact, savingsOversight],
                        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
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

        // Calculate the worth of 2 hours of time per leader
        const hourlyRate = parseFloat(document.getElementById("salary").value) * 12 / (52 * 40);
        const hourReduction = 2 * hourlyRate * parseInt(document.getElementById("numManagers").value);

        // Line Chart Data
        const monthlySavings = [savingsLowImpact, savingsOversight].map(savings => savings / 12);
        const cumulativeSavings = [];
        let total = 0;

        // Apply dynamic 2-hour reduction for the first 12 months
        for (let i = 0; i < 12; i++) {
            const adjustedSavings = monthlySavings.map(savings => savings - hourReduction);
            total += adjustedSavings.reduce((sum, savings) => sum + savings, 0);
            cumulativeSavings.push(total);
        }

        // No reduction from month 13 onwards
        for (let i = 12; i < 36; i++) {
            total += monthlySavings.reduce((sum, savings) => sum + savings, 0);
            cumulativeSavings.push(total);
        }

        console.log("Updating charts with data:", {
            bar: [savingsLowImpact, savingsOversight],
            line: cumulativeSavings
        });

        const lineCtx = document.getElementById('savingsLineChart')?.getContext('2d');
        if (lineCtx) {
            if (window.savingsLineChart) {
                if (typeof window.savingsLineChart.destroy === 'function') {
                    window.savingsLineChart.destroy();
                }
            }
            window.savingsLineChart = new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 36 }, (_, i) => `Month ${i + 1}`),
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

        console.log("Charts updated successfully");
    }

    // Ensure functions are accessible in HTML
    window.calculateROI = calculateROI;
    window.calculateOversightROI = calculateOversightROI;
    window.exportROIReport = exportROIReport;

    // Add event listener for the new button
    document.getElementById('generateGraphButton').addEventListener('click', function () {
        console.log("Generate Graph button clicked");
        updateCharts();
        showTab('graph');
    });
});
