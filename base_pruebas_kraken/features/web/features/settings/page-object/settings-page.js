const assert = require("assert");
const properties = require("../../../../../properties.json");

class SettingsPage {
  titleDescriptionEditButton(driver) { return driver.$('//div[@class="gh-expandable-block"][1]//button[@class="gh-btn"]'); }
  titleInput(driver) { return driver.$(".gh-expandable-block:nth-of-type(1) .gh-input"); }
  contentInput(driver) { return driver.$(".gh-expandable-block:nth-of-type(1) .description-container .gh-input"); }

  siteTimezoneEditButton(driver) { return driver.$('//div[@class="gh-expandable-block"][2]//button[@class="gh-btn"]'); }
  siteTimezoneInput(driver) { return driver.$('#timezone'); }

  languageEditButton(driver) { return driver.$('//div[@class="gh-expandable-block"][3]//button[@class="gh-btn"]'); }
  languageInput(driver) { return driver.$('.gh-expandable-block:nth-of-type(3) .gh-input'); }

  titleDescriptionDiv(driver) { return driver.$('.gh-expandable > .gh-expandable-block:nth-of-type(1)'); }
  siteTimezoneDiv(driver) { return driver.$('.gh-expandable > .gh-expandable-block:nth-of-type(2)'); }
  languageDiv(driver) { return driver.$('.gh-expandable > .gh-expandable-block:nth-of-type(3)'); }

  saveButton(driver) { return driver.$('.gh-btn.gh-btn-primary.gh-btn-icon.ember-view'); }


  // Método para abrir la configuracion
  async navigateToSettingsPage(driver) {
    console.log("Navigating to settings page...");
    await driver.url(properties["URL"] + "#/settings/general");
    await driver.pause(2000);
  }

  async editTitleDescription(driver) {
    console.log("Editing title and description...");
    await this.titleDescriptionEditButton(driver).click();
    await this.titleInput(driver).clearValue();
    await this.titleInput(driver).setValue("Edited Title");
    await this.contentInput(driver).click();
    await this.contentInput(driver).clearValue();
    await this.contentInput(driver).setValue("Edited Description");
  }

  async editSiteTimezone(driver, timezone) {
    console.log("Editing site timezone...");
    await this.siteTimezoneEditButton(driver).click();
    await this.siteTimezoneInput(driver).click();
    await this.siteTimezoneInput(driver).setValue('(GMT -6:00) Central Time (US & Canada)'); 
    await this.siteTimezoneInput(driver).addValue('\uE007'); // Unicode para "Enter"
  }

  async editPublicationLanguage(driver, language) {
    console.log("Editing publication language...");
    await this.languageEditButton(driver).click();
    await this.languageInput(driver).click();
    await this.languageInput(driver).clearValue();
    await this.languageInput(driver).setValue("de");
    await this.saveButton(driver).click();
  }

  async verifySettingsChanges(driver, title, content) {
    console.log("Verifying settings changes...");
    assert(await this.titleInput(driver).getValue() === 'Edited Title', 'Title & Description was edited');
    await driver.pause(1000);
    console.log(await this.siteTimezoneInput(driver).getValue());
    assert((await this.siteTimezoneInput(driver).getText()).includes('(GMT -6:00) Central Time (US & Canada)'), 'Site timezone was edited');
    await driver.pause(1000);
    assert((await this.languageInput(driver).getValue()).includes('de'), 'Publication language was edited');
  }
}

module.exports = new SettingsPage();