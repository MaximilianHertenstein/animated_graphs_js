(function () {
  function mapX(x, w, pad, minX, maxX) {
    return pad + ((x - minX) / (maxX - minX)) * (w - 2 * pad);
  }

  function mapY(y, h, pad, minY, maxY) {
    return h - pad - ((y - minY) / (maxY - minY)) * (h - 2 * pad);
  }

  function drawGrid(ctx, w, h, pad, minX, maxX, minY, maxY) {
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;

    for (var x = minX; x <= maxX; x += 1) {
      var px = mapX(x, w, pad, minX, maxX);
      ctx.beginPath();
      ctx.moveTo(px, pad);
      ctx.lineTo(px, h - pad);
      ctx.stroke();
    }

    for (var y = minY; y <= maxY; y += 1) {
      var py = mapY(y, h, pad, minY, maxY);
      ctx.beginPath();
      ctx.moveTo(pad, py);
      ctx.lineTo(w - pad, py);
      ctx.stroke();
    }
  }

  function drawAxes(ctx, w, h, pad, minX, maxX, minY, maxY) {
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = 1.6;

    var x0 = mapX(0, w, pad, minX, maxX);
    var y0 = mapY(0, h, pad, minY, maxY);

    ctx.beginPath();
    ctx.moveTo(pad, y0);
    ctx.lineTo(w - pad, y0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x0, pad);
    ctx.lineTo(x0, h - pad);
    ctx.stroke();

    ctx.fillStyle = "rgba(230,236,245,0.92)";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (var x = minX; x <= maxX; x += 1) {
      var px = mapX(x, w, pad, minX, maxX);
      ctx.fillText(String(x), px, y0 + 6);
    }

    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (var y = minY; y <= maxY; y += 1) {
      var py = mapY(y, h, pad, minY, maxY);
      if (y !== 0) ctx.fillText(String(y), x0 - 8, py);
    }
  }

  function drawCurve(ctx, w, h, pad, fn, minX, maxX, minY, maxY, samples) {
    ctx.strokeStyle = "#67d6ff";
    ctx.lineWidth = 3;
    ctx.beginPath();

    var started = false;
    for (var i = 0; i <= samples; i++) {
      var x = minX + ((maxX - minX) * i) / samples;
      var y = fn(x);
      if (!Number.isFinite(y) || y < minY || y > maxY) {
        started = false;
        continue;
      }

      var px = mapX(x, w, pad, minX, maxX);
      var py = mapY(y, h, pad, minY, maxY);

      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.stroke();
  }

  window.plotLine = function (canvas, fn, options) {
    var opts = options || {};
    var minX = opts.minX ?? -5;
    var maxX = opts.maxX ?? 5;
    var minY = opts.minY ?? -5;
    var maxY = opts.maxY ?? 5;
    var samples = opts.samples ?? 700;
    var pad = opts.padding ?? 36;

    var ctx = canvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#111722";
    ctx.fillRect(0, 0, w, h);

    drawGrid(ctx, w, h, pad, minX, maxX, minY, maxY);
    drawAxes(ctx, w, h, pad, minX, maxX, minY, maxY);
    drawCurve(ctx, w, h, pad, fn, minX, maxX, minY, maxY, samples);
  };
})();
