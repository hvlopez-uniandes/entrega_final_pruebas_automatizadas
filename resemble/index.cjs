const compareImages = require("resemblejs/compareImages");
const fs = require("fs");
const path = require("path");

const CONFIG = {
    before: "./screenshots/before",
    after: "./screenshots/after",
    options: {
        output: {
            errorColor: { red: 255, green: 0, blue: 255 },
            errorType: "movement",
            largeImageThreshold: 1200,
            useCrossOrigin: false,
            outputDiff: true,
        },
        scaleToSameSize: true,
        ignore: "antialiasing",
    },
};

const { before: Ghost3, after: Ghost4, options } = CONFIG;

function checkDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        throw new Error(`Directory does not exist: ${dir}`);
    }
}

function checkFileExists(file) {
    return fs.existsSync(file);
}

async function readDirectory(dir) {
    try {
        const items = await fs.promises.readdir(dir, { withFileTypes: true });
        return items.filter((item) => item.isDirectory()).map((item) => item.name);
    } catch (error) {
        throw new Error(`Failed to read directory ${dir}: ${error.message}`);
    }
}

async function compareDirectories(dirName, subDir3, subDir4) {
    const resultInfo = {};

    for (const file of subDir4) {
        const filePath3 = `${Ghost3}/${dirName}/${file}`;
        const filePath4 = `${Ghost4}/${dirName}/${file}`;

        if (!checkFileExists(filePath3) || !checkFileExists(filePath4)) {
            console.error(`File missing: ${filePath3} or ${filePath4}`);
            continue;
        }

        try {
            const data = await compareImages(
                fs.readFileSync(filePath3),
                fs.readFileSync(filePath4),
                options
            );
            if (!data) {
                console.error(`Comparison failed: No data returned for ${filePath3} vs ${filePath4}`);
                continue;
            }

            resultInfo[file] = {
                isSameDimensions: data.isSameDimensions,
                dimensionDifference: data.dimensionDifference,
                rawMisMatchPercentage: data.rawMisMatchPercentage,
                misMatchPercentage: data.misMatchPercentage,
                diffBounds: data.diffBounds,
                analysisTime: data.analysisTime,
            };

            const outputDir = path.resolve(`./screenshots/compare/${dirName}`);
            fs.mkdirSync(outputDir, { recursive: true });
            fs.writeFileSync(`${outputDir}/${file}`, data.getBuffer());
        } catch (error) {
            console.error(`Error comparing files: ${filePath3} vs ${filePath4}`, error.message);
        }
    }

    return resultInfo;
}

function screenshotHTML(dirName, imageName, mismatchPercentage) {
    return `
        <div class="browser">
            <div class="btitle"><h3>Image: ${imageName}</h3></div>
            <div class="mismatch-percentage">
                <p>Mismatch Percentage: <strong>${mismatchPercentage}%</strong></p>
            </div>
            <div class="imgline">
                <div class="imgcontainer">
                    <span class="imgname">Base 4.5</span>
                    <img class="img2" src="./screenshots/before/${dirName}/${imageName}" alt="Reference">
                </div>
                <div class="imgcontainer">
                    <span class="imgname">Rc 5.96</span>
                    <img class="img2" src="./screenshots/after/${dirName}/${imageName}" alt="Test">
                </div>
                <div class="imgcontainer">
                    <span class="imgname">Diff</span>
                    <img class="imgfull" src="./screenshots/compare/${dirName}/${imageName}" alt="Diff">
                </div>
            </div>
        </div>`;
}

function generateReportHTML(datetime, response) {
    const content = Object.entries(response)
        .map(([dirName, images]) => {
            return `<h2>${dirName}</h2>${Object.entries(images)
                .map(([imageName, data]) => {
                    const mismatch = data.misMatchPercentage || 0;
                    return screenshotHTML(dirName, imageName, mismatch);
                })
                .join("")}`;
        })
        .join("");

    return `
        <html>
            <head>
                <title>Visual Regression Test Report</title>
                <link rel="stylesheet" href="index.css">
            </head>
            <body>
                <h1>Visual Regression Test Report</h1>
                <p>Executed on: ${datetime}</p>
                <div>${content}</div>
            </body>
        </html>`;
}

async function executeTest() {
    const response = {};

    try {
        console.log(`Validating directories:`);
        console.log(`Before: ${path.resolve(Ghost3)}`);
        console.log(`After: ${path.resolve(Ghost4)}`);

        checkDirectoryExists(Ghost3);
        checkDirectoryExists(Ghost4);

        const [dir3Content, dir4Content] = await Promise.all([
            readDirectory(Ghost3),
            readDirectory(Ghost4),
        ]);

        for (const dirName of dir3Content) {
            if (!dir4Content.includes(dirName)) {
                console.error(`Directory mismatch: ${dirName} not found in 'after'`);
                continue;
            }

            const [subDir3, subDir4] = await Promise.all([
                fs.promises.readdir(`${Ghost3}/${dirName}`),
                fs.promises.readdir(`${Ghost4}/${dirName}`),
            ]);

            response[dirName] = await compareDirectories(dirName, subDir3, subDir4);
        }
    } catch (error) {
        console.error("Error executing test:", error.message);
    }

    return response;
}

async function main() {
    const datetime = new Date().toISOString().replace(/:/g, "-");
    const response = await executeTest();
    const reportHTML = generateReportHTML(datetime, response);

    const outputDir = "./";
    fs.writeFileSync(`${outputDir}/index.html`, reportHTML);

    console.log("Execution finished. Check the report in the docs folder.");
}

main();
