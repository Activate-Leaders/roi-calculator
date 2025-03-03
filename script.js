function updateCharts() {
    const savingsLowImpact = totalSavings1;
    const savingsOversight = totalSavings2;
    const savingsTurnover = totalSavings3;

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
    }

    // Line Chart Data
    const monthlySavings = [savingsLowImpact, savingsOversight, savingsTurnover].map(savings => savings / 12);
    const cumulativeSavings = [];
    let total = 0;

    // Apply 4-hour reduction for the first 12 months
    for (let i = 0; i < 12; i++) {
        const adjustedSavings = monthlySavings.map(savings => savings - (4 * savings / totalSavings1));
        total += adjustedSavings.reduce((sum, savings) => sum + savings, 0);
        cumulativeSavings.push(total);
    }

    // No reduction from month 13 onwards
    for (let i = 12; i < 36; i++) {
        total += monthlySavings.reduce((sum, savings) => sum + savings, 0);
        cumulativeSavings.push(total);
    }

    console.log("Updating charts with data:", {
        bar: [savingsLowImpact, savingsOversight, savingsTurnover],
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
