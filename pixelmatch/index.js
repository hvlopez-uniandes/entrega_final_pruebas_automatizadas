import fs from 'fs';
import path from 'path';
import sharp from 'sharp'; // Importa sharp
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { options, mismatchMaxValue } from '../vrt.config.js';

// Función para generar el bloque HTML para una comparación
function comparison(index, fileName, mismatchPercentage, sameDimensions, passed) {
    return `<div class="browser" id="test${index}" style="border: 2px solid ${passed ? 'green' : 'red'}; padding: 10px; margin-bottom: 20px;">
    <h2>Set ${index}: ${fileName}</h2>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Reference</span>
        <img class="img2" src="../../before/${fileName}" id="refImage" label="Reference">
      </div>
      <div class="imgcontainer">
        <span class="imgname">Test</span>
        <img class="img2" src="../../after/${fileName}" id="testImage" label="Test">
      </div>
    </div>
    <div class="imgline">
      <div class="imgcontainer">
        <span class="imgname">Diff</span>
        <img class="imgfull" src="../../compare/diff-${fileName}" id="diffImage" label="Diff">
      </div>
    </div>
    <div class="metrics">
      <p>Mismatch Percentage: <strong>${mismatchPercentage.toFixed(2)}%</strong></p>
      <p>Same Dimensions: <strong>${sameDimensions ? 'Yes' : 'No'}</strong></p>
      <p>Status: <strong style="color: ${passed ? 'green' : 'red'};">${passed ? 'Passed' : 'Failed'}</strong></p>
    </div>
  </div>`;
}

// Función para generar el reporte HTML con estadísticas
function createReportWithStats(comparisons, reportDate, passedCount, failedCount) {
    return `
    <html>
        <head>
            <title> VRT Report </title>
            <link href="index.css" type="text/css" rel="stylesheet">
        </head>
        <body>
            <h1>Visual Regression Testing Report for Ghost Admin</h1>
            <p><strong>Generated on:</strong> ${reportDate}</p>
            <p><strong>Missmatch maximum aceptable value:</strong> ${mismatchMaxValue}% </p>
            <p><strong>Total Tests:</strong> ${passedCount + failedCount}</p>
            <p><strong>Total Passed:</strong> ${passedCount}</p>
            <p><strong>Total Failed:</strong> ${failedCount}</p>
            <p><strong>Pass Percentage:</strong> ${((passedCount / (passedCount + failedCount)) * 100).toFixed(2)}%</p>
            <div id="visualizer">
                ${comparisons.join('')}
            </div>
        </body>
    </html>`;
}

// Variables necesarias
const datetime = new Date().toISOString().replace(/[:.]/g, '-'); // Fecha para crear carpetas únicas
const reportDate = new Date().toLocaleString(); // Fecha y hora legible para el reporte
const baseDir = `./test-results/${datetime}`;
const beforeDir = './before'; // Carpeta con las imágenes de referencia
const afterDir = './after';   // Carpeta con las imágenes de prueba
const compareDir = './compare'; // Carpeta con las imágenes de diferencias

// Crear directorio para el reporte
fs.mkdirSync(baseDir, { recursive: true });

// Leer los archivos de las carpetas
const beforeImages = fs.readdirSync(beforeDir);
const afterImages = fs.readdirSync(afterDir);

// Variables para contar pruebas pasadas y fallidas
let passedCount = 0;
let failedCount = 0;


// Crear los bloques de comparación enumerados
const comparisons = await Promise.all(
    beforeImages.map(async (fileName, index) => {
        if (afterImages.includes(fileName)) {
            const referencePath = path.join(beforeDir, fileName);
            const testPath = path.join(afterDir, fileName);
            const diffPath = path.join(compareDir, `diff-${fileName}`);

            // Cargar las imágenes
            const referenceBuffer = fs.readFileSync(referencePath);
            const testBuffer = fs.readFileSync(testPath);

            const referenceImg = PNG.sync.read(referenceBuffer);
            let testImg = PNG.sync.read(testBuffer);

            let sameDimensions = true;
            // Verificar dimensiones y redimensionar si es necesario
            if (
                referenceImg.width !== testImg.width ||
                referenceImg.height !== testImg.height
            ) {
                console.log(`Redimensionando ${fileName} para igualar dimensiones...`);
                sameDimensions = false;
                const resizedTestBuffer = await sharp(testBuffer)
                    .resize(referenceImg.width, referenceImg.height)
                    .toBuffer();
                testImg = PNG.sync.read(resizedTestBuffer);
            }

            // Crear la imagen de diferencia
            const diffImg = new PNG({ width: referenceImg.width, height: referenceImg.height });
            console.log(`Comparando ${fileName}...`);
            const numDiffPixels = pixelmatch(
                referenceImg.data,
                testImg.data,
                diffImg.data,
                referenceImg.width,
                referenceImg.height,
                options
            );

            // Guardar la imagen de diferencias
            fs.writeFileSync(diffPath, PNG.sync.write(diffImg));

            // Calcular el porcentaje de diferencias
            const totalPixels = referenceImg.width * referenceImg.height;
            const mismatchPercentage = (numDiffPixels / totalPixels) * 100;

            // Condición para aprobar la prueba
            const passed = mismatchPercentage <= mismatchMaxValue;

            // Actualizar contadores
            if (passed) {
                passedCount++;
            } else {
                failedCount++;
            }

            // Crear el bloque de comparación con índice
            return comparison(index + 1, fileName, mismatchPercentage, sameDimensions, passed);
        } else {
            console.log(`No se encontró una imagen de prueba para ${fileName}`);
            return '';
        }
    })
);

// Crear el reporte HTML
const reportPath = path.join(baseDir, 'report.html');
const cssPath = path.join(baseDir, 'index.css');

// Escribir el HTML del reporte con estadísticas
fs.writeFileSync(reportPath, createReportWithStats(comparisons, reportDate, passedCount, failedCount));
fs.copyFileSync('./index.css', cssPath); // Copiar el archivo CSS

console.log(`Reporte generado en ${reportPath}`);