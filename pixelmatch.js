import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import sharp from 'sharp'; // Importa sharp
import { options } from './vrt.config.js';

// Calcula la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorios de las imágenes
const beforePath = path.join(__dirname, 'pixelmatch', 'before');
const afterPath = path.join(__dirname, 'pixelmatch', 'after');
const comparePath = path.join(__dirname, 'pixelmatch', 'compare');

// Asegúrate de que la carpeta de diferencias exista
if (!fs.existsSync(comparePath)) {
    fs.mkdirSync(comparePath);
}

// Lee las imágenes de ambas carpetas
const referenceImages = fs.readdirSync(beforePath);
const testImages = fs.readdirSync(afterPath);

// Compara las imágenes que coinciden por nombre
referenceImages.forEach(async (fileName) => {
    if (testImages.includes(fileName)) {
        const referencePath = path.join(beforePath, fileName);
        const testPath = path.join(afterPath, fileName);
        const diffPath = path.join(comparePath, `diff-${fileName}`);

        // Carga las imágenes con sharp
        const referenceBuffer = fs.readFileSync(referencePath);
        const testBuffer = fs.readFileSync(testPath);

        const referenceImg = PNG.sync.read(referenceBuffer);
        let testImg = PNG.sync.read(testBuffer);

        // Verifica si las dimensiones coinciden
        if (
            referenceImg.width !== testImg.width ||
            referenceImg.height !== testImg.height
        ) {
            console.log(
                `Redimensionando ${fileName} para igualar dimensiones...`
            );

            // Redimensiona la imagen de prueba
            const resizedTestBuffer = await sharp(testBuffer)
                .resize(referenceImg.width, referenceImg.height)
                .toBuffer();
            testImg = PNG.sync.read(resizedTestBuffer);
        }

        // Crea una nueva imagen para la diferencia
        const diff = new PNG({
            width: referenceImg.width,
            height: referenceImg.height,
        });

        // Realiza la comparación
        const numDiffPixels = pixelmatch(
            referenceImg.data,
            testImg.data,
            diff.data,
            referenceImg.width,
            referenceImg.height,
            options
        );

        // Guarda la imagen de diferencia
        fs.writeFileSync(diffPath, PNG.sync.write(diff));

        console.log(`Diferencias en ${fileName}: ${numDiffPixels} píxeles.`);
    } else {
        console.log(`No se encontró la imagen de prueba para ${fileName}`);
    }
});

