const assert = require("assert");
const properties = require("../../../../../properties.json");

class LoginPage {
  // Define selectors as getter methods that accept driver as a parameter
  emailInput(driver) { return driver.$("#identification"); }
  passwordInput(driver) { return driver.$("#password"); }
  submitButton(driver) { return driver.$("#ember5"); }
  navBar(driver) { return driver.$(".gh-nav-top"); }  // Selector for nav-bar
  errorLogin(driver){
    return driver.$("p.main-error");
  }

  // Method to open the login page
  async open(driver) {
    await driver.url(properties["URL"]);  
  }

  // Method to perform login action
  async login(driver, email, password) {
    await this.emailInput(driver).setValue(email);
    await this.passwordInput(driver).setValue(password);
    await this.submitButton(driver).click();
  }

  // Method to verify if nav-bar is displayed
  async isNavBarDisplayed(driver) {
    const isDisplayed = await this.navBar(driver).isDisplayed();
    assert.strictEqual(isDisplayed, true, "Navbar is not displayed");
  }

  async isErrorShowForInvalidLogin(driver){
    const isDisplayed = await this.errorLogin(driver).isDisplayed();
    assert.strictEqual(isDisplayed, true, "Error is not displayed");
  }
}

module.exports = new LoginPage();
