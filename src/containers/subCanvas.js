import React, { useEffect, useRef } from 'react';
const { createCanvas } = require('canvas'); // Import required canvas functions

const SubCanvas = ({ array }) => {
    const canvasRef = useRef(null);
    const canvasWidth = 400;
    const canvasHeight = 300;
    const overviewCanvas = createCanvas(canvasWidth, canvasHeight);
    const overviewContext = overviewCanvas.getContext('2d');

  useEffect(() => {
    if (!canvasRef.current) return;

    const imageData = new ImageData(array[0].length, array.length);
    const data = imageData.data;

    for (let y = 0; y < array.length; y++) {
      for (let x = 0; x < array[y].length; x++) {
        const index = (y * array[y].length + x) * 4;
        const value = array[y][x];
        if (value > 0) {
          data[index] = value;
          data[index + 3] = 255;
        }
      }
    }

    overviewContext.clearRect(0, 0, overviewCanvas.width, overviewCanvas.height);
    overviewContext.putImageData(imageData, 0, 0, 0, 0, overviewCanvas.width, overviewCanvas.height);

    const canvasElement = canvasRef.current;
    canvasElement.getContext('2d').drawImage(overviewCanvas, 0, 0);

  }, [array]);

  return <canvas ref={canvasRef} />;
};

export default SubCanvas;
