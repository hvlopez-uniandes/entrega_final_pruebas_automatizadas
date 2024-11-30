const assert = require("assert");
const properties = require("../../../../../properties.json");

class SettingsPage {
  titleDescriptionEditButton(driver) { return driver.$(".cursor-pointer.text-grey-900.inline-flex.items-center"); }
  titleInput(driver) { return driver.$(".peer.z-\\[1\\].order-2.h-9.w-full.bg-transparent.px-3.py-1\\.5.text-sm.placeholder\\:text-grey-500.dark\\:placeholder\\:text-grey-700.md\\:h-\\[38px\\].md\\:py-2.md\\:text-md.dark\\:text-white.rounded-lg"); }
  contentInput(driver) { return driver.$(".peer.z-\\[1\\].order-2.h-9.w-full.bg-transparent.px-3.py-1\\.5.text-sm.placeholder\\:text-grey-500.dark\\:placeholder\\:text-grey-700.md\\:h-\\[38px\\].md\\:py-2.md\\:text-md.dark\\:text-white.rounded-lg"); }
  saveTitleDescriptionButton(driver) { return driver.$(".cursor-pointer.bg-green.text-white.hover\\:bg-green-400.inline-flex.items-center.justify-center.whitespace-nowrap.rounded.text-sm.transition.font-bold.h-7.px-3"); }

  siteTimezoneEditButton(driver) { return driver.$('[data-testid="timezone"] > .flex.items-start.justify-between.gap-4 > div > .flex.items-center.justify-start.rounded.gap-2.-mr-1.mt-\\[-5px\\] > button'); }
  siteTimezoneInput(driver) { return driver.$('input[id="\\:r18\\:"]'); }

  languageEditButton(driver) { return driver.$('[data-testid="publication-language"] > .flex.items-start.justify-between.gap-4 > div > .flex.items-center.justify-start.rounded.gap-2.-mr-1.mt-\\[-5px\\] > button'); }
  languageInput(driver) { return driver.$('.peer.z-\\[1\\].order-2.h-9.w-full.bg-transparent.px-3.py-1\\.5.text-sm.placeholder\\:text-grey-500.dark\\:placeholder\\:text-grey-700.md\\:h-\\[38px\\].md\\:py-2.md\\:text-md.dark\\:text-white.rounded-lg'); }

  titleDescriptionDiv(driver) { return driver.$('[data-testid="title-and-description"] > .grid.grid-cols-1.md\\:grid-cols-2.gap-x-8.gap-y-6.undefined > .flex.flex-col > .flex.items-center.mt-1'); }
  siteTimezoneDiv(driver) { return driver.$('[data-testid="timezone"] > .flex.flex-col.gap-x-5.gap-y-7.undefined > .flex.flex-col > .flex.items-center.undefined > .flex.flex-col'); }
  languageDiv(driver) { return driver.$('[data-testid="publication-language"] > .flex.flex-col.gap-x-5.gap-y-7.undefined > .flex.flex-col > .flex.items-center.mt-1'); }

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
    await this.saveTitleDescriptionButton(driver).click();
  }

  async editSiteTimezone(driver, timezone) {
    console.log("Editing site timezone...");
    console.log(await this.siteTimezoneEditButton(driver));
    await this.siteTimezoneEditButton(driver).click();
    await this.siteTimezoneInput(driver).click();
    await this.siteTimezoneInput(driver).clearValue(); 
    await this.siteTimezoneInput(driver).setValue('(GMT -6:00) Central Time (US & Canada)'); 
    await this.siteTimezoneInput(driver).addValue('\uE007'); // Unicode para "Enter"
    await this.saveTitleDescriptionButton(driver).click();
  }

  async editPublicationLanguage(driver, language) {
    console.log("Editing publication language...");
    await this.languageEditButton(driver).click();
    await this.languageInput(driver).click();
    await this.languageInput(driver).clearValue();
    await this.languageInput(driver).setValue("de");
    await this.saveTitleDescriptionButton(driver).click();
  }

  async verifySettingsChanges(driver, title, content) {
    console.log("Verifying settings changes...");
    assert(await this.titleDescriptionDiv(driver).getText() === 'Edited Description', 'Title & Description was edited');
    await driver.pause(1000);
    assert((await this.siteTimezoneDiv(driver).getText()).includes('(GMT -6:00) Central Time (US & Canada)'), 'Site timezone was edited');
    await driver.pause(1000);
    assert((await this.languageDiv(driver).getText()).includes('de'), 'Publication language was edited');
  }
}

module.exports = new SettingsPage();