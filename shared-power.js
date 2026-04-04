(function () {
  const TICKS = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  function powerY(a, n, x) {
    return a * Math.pow(Math.abs(x), n) * (x < 0 && n % 2 !== 0 ? -1 : 1);
  }

  function getParams(aInput, nInput, aOutput, nOutput) {
    const a = parseFloat(aInput.value);
    const n = parseInt(nInput.value, 10);
    if (aOutput) aOutput.textContent = a.toFixed(1);
    if (nOutput) nOutput.textContent = String(n);
    return { a, n };
  }

  function updatePowerFormula(formulaEl, a, n) {
    if (!formulaEl) return;
    formulaEl.innerHTML = `\\(f(x)=${a.toFixed(1)}\\cdot x^{${n}}\\)`;
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise([formulaEl]).catch(() => {});
    }
  }

  function samplePoints(a, n, steps, minX, maxX) {
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const x = minX + ((maxX - minX) * i) / steps;
      points.push({ x: x, y: powerY(a, n, x) });
    }
    return points;
  }

  window.PowerShared = {
    TICKS,
    powerY,
    getParams,
    updatePowerFormula,
    samplePoints,
  };
})();
