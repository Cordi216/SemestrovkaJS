const drawing = () => {
  const canvas = document.getElementById("canvas");
  const saveButton = document.getElementById("button-save");
  const clearButton = document.getElementById("button-clear");
  const ctx = canvas.getContext("2d");
  let isMouseDown = false;
  let currentColor = "#000000";
  let coords = [];

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const colorPicker = document.getElementById("colorPicker");
  colorPicker.addEventListener("input", function (e) {
    currentColor = e.target.value;
  });

  const brushSizeSlider = document.getElementById("brushSizeSlider");
  const brushSizeLabel = document.getElementById("brushSizeLabel");

  brushSizeSlider.addEventListener("input", function (e) {
    const newSize = parseInt(e.target.value);
    brushSizeLabel.textContent = `Размер кисти: ${newSize}`;
  });

  window.addEventListener("mousedown", function () {
    isMouseDown = true;
  });

  window.addEventListener("mouseup", function () {
    isMouseDown = false;
    ctx.beginPath();
    coords.push([isMouseDown]);
  });

  canvas.addEventListener("mouseleave", function () {
    ctx.beginPath();
  });

  canvas.addEventListener("mousemove", function (e) {
    if (isMouseDown) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        coords.push([x, y, brushSizeSlider.value, currentColor]);
        ctx.lineWidth = brushSizeSlider.value * 2;
        ctx.strokeStyle = currentColor;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();

        ctx.fillStyle = currentColor;
        ctx.arc(x, y, brushSizeSlider.value, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();

        ctx.moveTo(x, y);
      }
    }
  });

  function clearCanvas() {
    return new Promise((resolve, reject) => {
      const result = window.confirm("Вы уверены, что хотите очистить холст?");
      if (result) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        coords = [];
        localStorage.removeItem("coords");
        resolve("Холст очищен");
      } else {
        reject("Отмена действия");
      }
    });
  }

  function saveDrawing() {
    localStorage.setItem("coords", JSON.stringify(coords));
  }

  clearButton.addEventListener("click", () => {
    clearCanvas()
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  function replayDrawing() {
    coords.forEach((crd) => {
      const x = crd[0];
      const y = crd[1];
      const brushSize = crd[2];
      const color = crd[3];

      ctx.lineWidth = brushSize * 2;
      ctx.strokeStyle = color;

      ctx.lineTo(x, y);
      if (isMouseDown) {
        ctx.stroke();
      } else {
        ctx.stroke();
        ctx.beginPath();
      }
      ctx.beginPath();

      ctx.fillStyle = color;
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();

      ctx.moveTo(x, y);
    });
  }

  saveButton.addEventListener("click", () => {
    saveDrawing();
  });

  function restoreDrawing() {
    const savedCoords = localStorage.getItem("coords");
    if (savedCoords) {
      coords = JSON.parse(savedCoords);
      replayDrawing();
    }
  }

  restoreDrawing();
};

drawing();