
const annualInput = document.getElementById('annual');
const rateInput = document.getElementById('rate');
const yearsInput = document.getElementById('years');
const timingInput = document.getElementById('timing');
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

function calculateInvestment(annualAmount, annualPercent, years, timing = 'end') {
    const rate = annualPercent / 100;
    /*  let balance = 2000000;*/
    let balance = Number(document.querySelector("input[name='initialInvestment']").value);
    console.log("(typeof Number(balance): " + (typeof balance) + " - balance: " + balance);

    if ((typeof Number(balance)) !== "number") {
        globalAlert("alert-warning", "What is your initial investment?");
        return;
    }
    const rows = [];

    for (let year = 1; year <= years; year++) {
        if (timing === 'beginning') balance += annualAmount;
        const growth = balance * rate;
        balance += growth;
        if (timing === 'end') balance += annualAmount;
        rows.push({ year, contributed: annualAmount * year, growth, balance });
    }
    return { invested: annualAmount * years, growth: balance - annualAmount * years, futureValue: balance, rows };
}

function updateCalculator() {
    const annual = Number(annualInput.value);
    const percent = Number(rateInput.value);
    const years = Number(yearsInput.value);
    const valid = [annual, percent, years].every(Number.isFinite) && annual >= 0 && percent >= 0 && Number.isInteger(years) && years >= 0 && years <= 200;
    if (!valid) {
        ['invested', 'growth', 'future'].forEach(id => document.getElementById(id).textContent = '—');
        document.getElementById('breakdown').replaceChildren();
        document.getElementById('contributionBar').style.width = '0%';
        document.getElementById('growthBar').style.width = '0%';
        return;
    }
    const result = calculateInvestment(annual, percent, years, timingInput.value);
    document.getElementById('invested').textContent = currency.format(result.invested);
    document.getElementById('growth').textContent = currency.format(result.growth);
    document.getElementById('future').textContent = currency.format(result.futureValue);
    const contributionPercent = result.futureValue > 0 ? (result.invested / result.futureValue) * 100 : 0;
    document.getElementById('contributionBar').style.width = contributionPercent + '%';
    document.getElementById('growthBar').style.width = (100 - contributionPercent) + '%';
    const tbody = document.getElementById('breakdown');
    tbody.replaceChildren();
    for (const row of result.rows) {
        const tr = document.createElement('tr');
        [row.year, currency.format(row.contributed), currency.format(row.growth), currency.format(row.balance)].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }
}

[annualInput, rateInput, yearsInput].forEach(input => input.addEventListener('input', updateCalculator));
timingInput.addEventListener('change', updateCalculator);
updateCalculator();