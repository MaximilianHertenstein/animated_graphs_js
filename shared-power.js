(function () {
  const X_MIN = -5;
  const X_MAX = 5;
  const Y_MIN = -5;
  const Y_MAX = 5;
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

  function getPowerUI(plotId) {
    return {
      aInput: document.getElementById("a"),
      nInput: document.getElementById("n"),
      aOutput: document.getElementById("aOut"),
      nOutput: document.getElementById("nOut"),
      formulaEl: document.getElementById("formula"),
      plotEl: document.getElementById(plotId),
    };
  }

  function syncPowerUI(ui) {
    const { a, n } = getParams(ui.aInput, ui.nInput, ui.aOutput, ui.nOutput);
    updatePowerFormula(ui.formulaEl, a, n);
    return { a, n };
  }

  function bindPowerUI(ui, render, resizeHandler = render) {
    ui.aInput.addEventListener("input", render);
    ui.nInput.addEventListener("input", render);
    if (resizeHandler) window.addEventListener("resize", resizeHandler);
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

  function isVisibleY(y, minY = Y_MIN, maxY = Y_MAX) {
    return Number.isFinite(y) && y >= minY && y <= maxY;
  }

  function toVisibleY(y, minY = Y_MIN, maxY = Y_MAX) {
    return isVisibleY(y, minY, maxY) ? y : null;
  }

  function sampleVisiblePoints(a, n, steps, minX = X_MIN, maxX = X_MAX, minY = Y_MIN, maxY = Y_MAX) {
    return samplePoints(a, n, steps, minX, maxX).map((point) => ({
      x: point.x,
      y: toVisibleY(point.y, minY, maxY),
    }));
  }

  function buildPowerMathTerm(a, n) {
    return `(${a}) * x^(${n})`;
  }

  function buildPowerJsTerm(a, n) {
    return `(${a}) * Math.pow(x, ${n})`;
  }

  function toXYArrays(points) {
    return {
      x: points.map((point) => point.x),
      y: points.map((point) => point.y),
    };
  }

  window.PowerShared = {
    X_MIN,
    X_MAX,
    Y_MIN,
    Y_MAX,
    TICKS,
    powerY,
    getParams,
    getPowerUI,
    syncPowerUI,
    bindPowerUI,
    isVisibleY,
    toVisibleY,
    updatePowerFormula,
    samplePoints,
    sampleVisiblePoints,
    buildPowerMathTerm,
    buildPowerJsTerm,
    toXYArrays,
  };
})();
