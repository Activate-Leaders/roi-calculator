function updateCharts() {
    if (totalSavings1 === 0 && totalSavings2 === 0 && totalSavings3 === 0) {
        alert("Please calculate the savings first.");
        return;
    }

    const savingsLowImpact = totalSavings1;
    const savingsOversight = totalSavings2;
    const savingsTurnover = totalSavings3;

    const barCtx = document.getElementById('savingsBarChart')?.getContext('2d');
    if (!barCtx) {
        alert("Bar chart context not found.");
        return;
    }

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

    const monthlySavings = [savingsLowImpact, savingsOversight, savingsTurnover].map(savings => savings / 12);
    const cumulativeSavings = [];
    let total = 0;

    for (let i = 0; i < 12; i++) {
        const monthlyGainFactor = i < 6 ? 0.5 : 1.5;
        total += monthlySavings.reduce((sum, savings) => sum + (savings * monthlyGainFactor), 0);
        cumulativeSavings.push(total);
    }

    const lineCtx = document.getElementById('savingsLineChart')?.getContext('2d');
    if (!lineCtx) {
        alert("Line chart context not found.");
        return;
    }

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

    console.log("Charts updated successfully");
}
