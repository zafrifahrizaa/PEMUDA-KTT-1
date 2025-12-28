async function cekHappy() {
    const number = document.getElementById("number").value;
    const algorithm = document.getElementById("algorithm").value;
    const hasilDiv = document.getElementById("hasil");
    const stepsDiv = document.getElementById("steps");
    const resultContainer = document.getElementById("resultContainer");

    if (!number || number <= 0) {
        alert("Masukkan angka positif yang valid!");
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/api/happy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                number: number,
                algorithm: algorithm
            })
        });

        const data = await response.json();

        // Display summary
        const statusClass = data.happy ? 'happy' : 'unhappy';
        const statusText = data.happy ? 'Happy Number ✓' : 'Bukan Happy Number ✗';

        hasilDiv.innerHTML = `
      <div class="summary">
        <p><strong>Angka:</strong> ${data.number}</p>
        <p><strong>Algoritma:</strong> ${data.algorithm}</p>
        <p><strong>Hasil:</strong> <span class="${statusClass}">${statusText}</span></p>
        <p><strong>Waktu Eksekusi:</strong> ${data.time} ms</p>
      </div>
    `;

        // Display langkah-langkah
        if (data.steps && data.steps.length > 0) {
            let stepsHTML = '<h3>📝 Langkah-langkah Perhitungan:</h3>';

            data.steps.forEach((step, index) => {
                stepsHTML += `
          <div class="step">
            <div class="step-number">Langkah ${index + 1}</div>
            <div class="step-content">
              <div class="step-formula">${step.formula} = ${step.calculation}</div>
              <div class="step-result">= <strong>${step.result}</strong></div>
            </div>
          </div>
        `;
            });

            
            if (data.happy) {
                stepsHTML += `
          <div class="final-message success">
            ✅ Mencapai angka 1, maka ${data.number} adalah Happy Number!
          </div>
        `;
            } else {
                stepsHTML += `
          <div class="final-message error">
            ❌ Terjebak dalam siklus (kembali ke ${data.final}), maka ${data.number} bukan Happy Number
          </div>
        `;
            }

            stepsDiv.innerHTML = stepsHTML;
        }

        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        alert("Error: Pastikan server sudah berjalan di http://localhost:3001");
        console.error(error);
    }
}
