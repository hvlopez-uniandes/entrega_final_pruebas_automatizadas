const { After, Before, AfterStep, BeforeStep, BeforeAll } = require('@cucumber/cucumber');
const { WebClient } = require('kraken-node');
const fs = require('fs');

let counter = 0;  // Initialize counter globally

// Setup WebClient and driver before each scenario
Before(async function() {
  this.deviceClient = new WebClient('chrome', {}, this.userId);
  this.driver = await this.deviceClient.startKrakenForUserId(this.userId);
});

// Tear down WebClient after each scenario
After(async function() {
  await this.deviceClient.stopKrakenForUserId(this.userId);
});

// Increment counter before each step
BeforeStep(async function() {
  counter++;
});

// Reset counter before all scenarios
BeforeAll(async function() {
  counter = 0;
});

// Take screenshot after each step
AfterStep(async function(Scenario) {
  // Sanitize scenario name for filesystem compatibility
  const scenarioName = Scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '');
  const folderPath = `./reports/screenshot/${scenarioName}`;

  // Create folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Save screenshot with step counter
  await this.driver.saveScreenshot(`${folderPath}/Paso_${counter}.png`);
});
