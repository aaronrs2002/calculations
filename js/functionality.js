function calculateLoan() {
    // 1. Get input values
    const principal = parseFloat(document.querySelector("input[name='loanTotal']").value);
    const annualRate = parseFloat(document.querySelector("input[name='annualInterestRate']").value);
    const years = parseFloat(document.querySelector("input[name='loanTerm']").value);
    const extraPayment = parseFloat(document.querySelector("input[name='extraMonthlyPrinciplePayment']").value) || 0;

    // 2. Convert to monthly variables
    const monthlyRate = (annualRate / 100) / 12;
    const totalMonths = years * 12;

    // 3. Calculate standard fixed monthly payment
    let baseMonthlyPayment;
    if (monthlyRate === 0) {
        baseMonthlyPayment = principal / totalMonths;
    } else {
        const factor = Math.pow(1 + monthlyRate, totalMonths);
        baseMonthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
    }

    // 4. Simulate month-by-month to handle extra principal payments
    let balance = principal;
    let month = 0;
    let totalInterestPaid = 0;
    let tableHTML = `
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Month</th>
              <th>Payment</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Remaining Balance</th>
            </tr>
          </thead>
          <tbody>
      `;

    while (balance > 0 && month < totalMonths) {
        month++;

        // Interest for this specific month is based on remaining balance
        const interestForMonth = balance * monthlyRate;

        // Total planned payment (base + extra)
        let actualPayment = baseMonthlyPayment + extraPayment;
        let principalForMonth = actualPayment - interestForMonth;

        // Prevent overpaying on the final month
        if (principalForMonth > balance) {
            principalForMonth = balance;
            actualPayment = principalForMonth + interestForMonth;
        }

        balance -= principalForMonth;
        totalInterestPaid += interestForMonth;

        tableHTML += `
          <tr>
            <td>${month}</td>
            <td>$${actualPayment.toFixed(2)}</td>
            <td>$${principalForMonth.toFixed(2)}</td>
            <td>$${interestForMonth.toFixed(2)}</td>
            <td>$${Math.max(0, balance).toFixed(2)}</td>
          </tr>
        `;
    }

    tableHTML += `</tbody></table>`;

    // 5. Display Summary & Schedule
    const summaryDiv = document.getElementById('summary');
    summaryDiv.style.display = 'block';
    summaryDiv.innerHTML = `
        <strong>Base Monthly Payment:</strong> $${baseMonthlyPayment.toFixed(2)}<br>
        <strong>Total Actual Monthly Payment:</strong> $${(baseMonthlyPayment + extraPayment).toFixed(2)}<br>
        <strong>Payoff Time:</strong> ${month} months (originally ${totalMonths} months)<br>
        <strong>Total Interest Paid:</strong> $${totalInterestPaid.toFixed(2)}
      `;

    document.getElementById('schedule').innerHTML = tableHTML;
}