const { Given, When, Then } = require("@cucumber/cucumber");
const fs = require("fs");
const csv = require("csv-parser");
const LoginPage = require("../features/login/page-object/login-page");
const PostPage = require("../features/post/page-object/post-page");
const TagPage = require('../features/tags/tag-page');
const Page = require('../features/page/page-object/pages-page');
const MemberPage = require('../features/members/page-object/members-page');
const SettingsPage = require('../features/settings/page-object/settings-page');
const properties = require("../../../properties.json");  // Adjust the path as needed
const assert = require("assert");

const data = [];
let currentData = {};
// Feature 1 - Escenario de pruebas 1 - login con usuario y password valido
// Step to open the Ghost login page using the URL from properties.json
Given("I open the Ghost login page", async function () {
  await LoginPage.open(this.driver);  // Pass driver as a parameter
});

// Load data from CSV and store it in currentData
Given("I have data from {string}", async function (csvFilePath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        currentData = data[0];  // Use the first row for now
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  });
});

// Enter the login email from the CSV data
When("I enter login email CSV {string}", async function (emailField) {
  await LoginPage.emailInput(this.driver).setValue(properties[emailField]);  // Pass driver as a parameter
});

// Enter the login password from the CSV data
When("I enter login password CSV {string}", async function (passwordField) {
  await LoginPage.passwordInput(this.driver).setValue(properties[passwordField]);  // Pass driver as a parameter
});

// Submit the login form
When("I submit login", async function () {
  await LoginPage.submitButton(this.driver).click();  // Pass driver as a parameter
});

// Verify that the nav-bar with functions is displayed after login
Then("I should have a nav-bar with functions", async function () {
  await LoginPage.isNavBarDisplayed(this.driver);  // Pass driver as a parameter
});
// Given: The user is on the posts list page
Given("I am on the posts list page", async function () {
  await PostPage.openPostsList(this.driver);
});
// verify that errors is shown on login screen when user and pasword is incorrect
Then("I should have a error message present", async function(){
  await LoginPage.isErrorShowForInvalidLogin(this.driver);
});// Given: The user is on the posts list page

// When: The user enters post details
When("I enter post title {string} and content {string}", async function (title, content) {
  await PostPage.enterPostDetails(this.driver, title, content);
});

// When: The user publishes the post
When("I publish the post", async function () {
  await PostPage.publishPost(this.driver);
});

// Then: The post should be visible in the posts list
Then("I should see the post with title {string} in the posts list", async function (title) {
  const titles = [title];

  await PostPage.checkPostsPresence(this.driver, titles);
});

// When: The user selects a post to unpublish
When("I select the post with title {string} to unpublish", async function (title) {
  await PostPage.selectPostToUnpublish(this.driver, title);
});


When("I create a new post with title {string} and content {string}", async function (title, content) {
  await PostPage.enterPostDetails(this.driver, title, content);
});
// Then: The post should be marked as "Draft" in the posts list
Then("the post with title {string} should be marked as Draft", async function (title) {
  await PostPage.verifyPostIsDraft(this.driver, title);
});
Then("I should see all posts in the posts list with titles:", async function (dataTable) {
  const titles = dataTable.raw().flat();
  await PostPage.verifyPostsInList(this.driver, titles);
});

When("I open the post with title {string}", async function (title) {
  await PostPage.selectPostByTitle(this.driver, title);
});

Then("I should see the post title {string} and content {string}", async function (expectedTitle, expectedContent) {
  const actualTitle = await PostPage.getPostTitle(this.driver);
  const actualContent = await PostPage.getPostContent(this.driver);
  assert.strictEqual(actualTitle, expectedTitle, `El título del post no coincide. Esperado: "${expectedTitle}", Actual: "${actualTitle}"`);
  assert.strictEqual(actualContent, expectedContent, `El contenido del post no coincide. Esperado: "${expectedContent}", Actual: "${actualContent}"`);
});

When("I go back to the posts list page", async function () {
  await PostPage.goBackToPostsList(this.driver);
});

// Paso para editar el título y contenido del post
When("I edit the post title to {string} and content to {string}", async function (newTitle, newContent) {
  await PostPage.editPostDetails(this.driver, newTitle, newContent); // Edita el título y contenido del post
});

// Paso para guardar los cambios en el post actualizado
When("I update the post", async function () {
  await PostPage.updatePost(this.driver); // Guarda los cambios
});

// Paso para despublicar el post
When("I unpublish the post", async function () {
  await PostPage.unpublishPost(this.driver); // Despublica el post
});

// Paso para verificar que el post esté marcado como borrador en la lista
Then("I should see the post with title {string} marked as Draft in the posts list", async function (title) {
  await PostPage.verifyPostIsDraft(this.driver, title); // Verifica que el post esté marcado como borrador
});

Then("I should see the post with title {string} marked as draft", async function (title) {
  const isDraft = await PostPage.verifyPostIsDraft(this.driver, title);
  assert.strictEqual(isDraft, true, `El post con título "${title}" no está marcado como borrador.`);
});

Then('I should not see the post with title {string} in the posts list', async function (title) {
  await this.driver.pause(1000);  // Espera para asegurarse de que la lista se actualice

  const postContainers = await PostPage.postContainers(this.driver); // Obtén los contenedores de posts en la lista
  const postTitlesText = await Promise.all(postContainers.map(async (container) => {
  const titleElement = await PostPage.postTitleInContainer(container);
    return await titleElement.getText();
  }));

  // Verifica que el título del post no esté en la lista
  assert(!postTitlesText.includes(title), `El post con el título "${title}" aún se encuentra en la lista.`);
});

When('I delete the post', async function () {
  await PostPage.deletePost(this.driver); // Llama a la función para eliminar el post
});

When('I delete the tag', async function () {
  await TagPage.deleteTag(this.driver); // Llama a la función para eliminar el post
});

Then('I should see the tag {string} in the tags list', async function(tagName) {
  await TagPage.verifyTagIsVisible(this.driver, tagName);
});


// Tags
Given('I navigate to the tags page', async function() {
  await TagPage.navigateToTagsPage(this.driver);
});

Given('I navigate to the tags page and select the tag {string} to edit', async function(name) {
  await TagPage.navigateToTagsPage(this.driver);
  await TagPage.selectTagByName(this.driver,name);
});

Given('I navigate to the tags page and select the tag {string} to delete', async function(name) {
  await TagPage.navigateToTagsPage(this.driver);
  await TagPage.selectTagByName(this.driver, name);
});


When('I enter tag details {string} {string}', async function(tagName, tagDescription) {
  await TagPage.enterTagDetails(this.driver, tagName, tagDescription);
});

When('I save the tag', async function() {
  await TagPage.saveTag(this.driver);
});


When('I enter to create a new tag', async function() {
  await TagPage.openOpenNewTagClick(this.driver);
});



// Editar los detalles del tag (nombre y descripción)
When('I edit tag details to {string} {string}', async function(newTagName, newTagDescription) {
  await TagPage.editTagDetails(this.driver, newTagName, newTagDescription);
});

// Seleccionar un tag existente para editar
Given('I select the tag to edit {string}', async function(name) {
  await TagPage.selectTagByName(this.driver, name);
});

// Verifica que un tag con un nombre específico no esté en la lista
Then('I should not see the tag {string} in the tags list', async function(tagName) {
  await TagPage.verifyTagNotInList(this.driver, tagName);
});


Given('I navigate to the pages page', async function() {
  await Page.navigateToPagesPage(this.driver);
});

When('I enter to create a new page', async function() {
  await Page.startCreatingNewPage(this.driver);
});

When('I enter page details {string} {string}', async function(title, content) {
  await Page.enterPageDetails(this.driver, title, content);
});

When('I save the page', async function() {
  await Page.savePage(this.driver);
});

When('I edit the page', async function() {
  await Page.updatePage(this.driver);
});

When('I publish the page', async function() {
  await Page.publishPage(this.driver);
});

Then('I should see the page {string} in the pages list', async function(title) {
  await Page.verifyPageIsVisible(this.driver, [title]);
});

// Editing and deleting steps for a page
Given('I select the page to edit {string}', async function(title) {
  await Page.selectPageByTitle(this.driver, title);
});

When('I edit page details to {string} {string}', async function(newTitle, newContent) {
  await Page.editPageDetails(this.driver, newTitle, newContent);
});

When('I delete the page', async function() {
  await Page.deletePage(this.driver);
});


// Create a new page with title and content
When('I create a new page with title {string} and content {string}', async function(title, content) {
  await Page.startCreatingNewPage(this.driver);
  await Page.enterPageDetails(this.driver, title, content);
  await Page.savePage(this.driver);
});


// Verify all pages in the pages list with specific titles
Then('I should see all pages in the pages list with titles:', async function(table) {
  const titles = table.raw().flat();
  await Page.verifyPagesInList(this.driver, titles);
});

// Open a page by title
When('I open the page with title {string}', async function(title) {
  await Page.selectPageByTitle(this.driver, title);
});

// Verify the page title and content
Then('I should see the page title {string} and content {string}', async function(title, content) {
  await Page.verifyPageDetails(this.driver, title, content);
});

// Go back to the pages list page
When('I go back to the pages list page', async function() {
  await Page.goBackToPagesList(this.driver);
});

When('I edit the page title to {string} and content {string}', async function(newTitle, newContent) {
  await Page.editPageDetails(this.driver, newTitle, newContent);
});

When('I unpublish the page', async function() {
  await Page.unpublishPage(this.driver);
});

Then('I should see the page with title {string} marked as draft', async function(pageTitle) {
  await Page.verifyPageIsDraft(this.driver, pageTitle);
});


Then('I should not see the page with title {string} in the pages list', async function(pageTitle) {
  await Page.verifyPageNotInList(this.driver, pageTitle);
});

// Members
Given('I am on the members list page', async function() {
  await MemberPage.navigateToMembersPage(this.driver);
});



Then('I publish the member', async function() {
  await MemberPage.saveMember(this.driver);
});

Then('I should see the member with email {string} in the members list', async function(name) {
  await MemberPage.verifyMemberIsVisible(this.driver, name);
});

Then('I should see the member with title {string} in the members list', async function(name) {
  await MemberPage.verifyMemberIsVisible(this.driver, name);
});

Then('I go back to the pages members page', async function() {
  await MemberPage.goBacktoMembersPage(this.driver);
});


// members


// When I enter member title "My New member" and email "h3@gmail.com"
When('I enter member title {string} and email {string}', async function (title, email) {
  await MemberPage.enterMemberDetails(this.driver, title, email);
});

// When I open the member with title ""
When('I open the member with title {string}', async function (title) {
  await MemberPage.openMemberByTitle(this.driver, title);
});

// And I edit the member name to "Updated member name"
When('I edit the member name to {string}', async function (newName) {
  await MemberPage.editMemberDetails(this.driver, newName);
});

// And I update the member
When('I update the member', async function () {
  await MemberPage.saveMember(this.driver);
  await MemberPage.goBacktoMembersPage(this.driver);
});


// members


// Then I should see the member "Updated member name" in the members list
Then('I should see the member {string} in the members list', async function (newName) {
  await MemberPage.verifyMemberIsVisible(this.driver, newName);
});

// And I delete the member
When('I delete the member', async function () {
  await MemberPage.deleteMember(this.driver);
});

// Then I should not see the member "Updated member name" in the members list
Then('I should not see the member {string} in the members list', async function (newName) {
  await MemberPage.verifyMemberNotInList(this.driver, newName);
});



//Settings

Given('I navigate to the settings page', async function() {
  await SettingsPage.navigateToSettingsPage(this.driver);
});

When('I edit title&description', async function() {
  await SettingsPage.editTitleDescription(this.driver);
});

When('I edit site timezone', async function() {
  await SettingsPage.editSiteTimezone(this.driver);
});

When('I edit publication language', async function() {
  await SettingsPage.editPublicationLanguage(this.driver);
});

Then('I should see the modifications in the general settings section', async function() {
  await SettingsPage.verifySettingsChanges(this.driver);
});