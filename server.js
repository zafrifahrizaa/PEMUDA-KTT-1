const express = require('express');
const cors = require('cors');
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function sumSquareDigits(n) {
    let sum = 0;
    let digits = [];
    let temp = n;

    while (temp > 0) {
        let d = temp % 10;
        digits.unshift(d);
        sum += d * d;
        temp = Math.floor(temp / 10);
    }

    return { sum, digits };
}

function isHappyIterative(n) {
    const visited = new Set();
    const steps = [];
    let current = n;

    while (current !== 1 && !visited.has(current)) {
        visited.add(current);
        const { sum, digits } = sumSquareDigits(current);

        const formula = digits.map(d => `${d}²`).join(' + ');
        const calculation = digits.map(d => d * d).join(' + ');

        steps.push({
            number: current,
            formula: formula,
            calculation: calculation,
            result: sum
        });

        current = sum;
    }

    return {
        isHappy: current === 1,
        steps: steps,
        final: current
    };
}

function isHappyRecursive(n, visited = new Set(), steps = []) {
    if (n === 1) {
        return { isHappy: true, steps, final: 1 };
    }
    if (visited.has(n)) {
        return { isHappy: false, steps, final: n };
    }

    visited.add(n);
    const { sum, digits } = sumSquareDigits(n);

    const formula = digits.map(d => `${d}²`).join(' + ');
    const calculation = digits.map(d => d * d).join(' + ');

    steps.push({
        number: n,
        formula: formula,
        calculation: calculation,
        result: sum
    });

    return isHappyRecursive(sum, visited, steps);
}

app.post('/api/happy', (req, res) => {
    const { number, algorithm } = req.body;
    const n = parseInt(number);

    if (!n || n <= 0) {
        return res.status(400).json({ error: 'Masukkan angka positif yang valid' });
    }

    let result;
    const start = performance.now();

    if (algorithm === 'recursive') {
        result = isHappyRecursive(n);
    } else {
        result = isHappyIterative(n);
    }

    const end = performance.now();

    res.json({
        number: n,
        algorithm: algorithm === 'recursive' ? 'Rekursif' : 'Iteratif',
        happy: result.isHappy,
        steps: result.steps,
        final: result.final,
        time: (end - start).toFixed(3)
    });
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`✅ Server running di http://localhost:${PORT}`);
});