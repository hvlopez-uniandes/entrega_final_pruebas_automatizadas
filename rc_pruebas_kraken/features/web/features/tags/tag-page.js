const assert = require("assert");
const properties = require("../../../../properties.json");

class TagPage {
    tagsMenuButton(driver) { return driver.$('[data-test-nav="tags"]'); }
    tagNameField(driver) { return driver.$('#tag-name'); }
    tagDescriptionField(driver) { return driver.$('#tag-description'); }
    saveTagButton(driver) { return driver.$('button.gh-btn.gh-btn-primary.gh-btn-icon.ember-view'); }
    tagListSelector(driver) { return driver.$('.gh-tag-list-name'); }
    deleteTagButton(driver) { return driver.$('button.gh-btn.gh-btn-red.gh-btn-icon'); }
    confirmDeleteTagButton(driver) { return driver.$('.modal-footer .gh-btn-red'); }
    newTagButton(driver) { return driver.$('a.gh-btn.gh-btn-primary'); }
    tagTitleInContainer(container) { return container.$('.gh-tag-list-name'); }
    // Navigate to the tags page
     // Obtén todos los contenedores de tags
     tagContainers(driver) { return driver.$$("li.gh-list-row.gh-tags-list-item"); }
    
     // Función para obtener el elemento de nombre del tag en un contenedor
     tagNameInContainer(container) { return container.$(".gh-tag-list-name"); }
 
    async navigateToTagsPage(driver) {
        console.log("Navigating to tags page...");
        await driver.url(properties["URL"] + "#/tags");
    }

    async openOpenNewTagClick(driver){
        console.log("Opening to create a new tag...");
        await this.newTagButton(driver).click();
        await driver.pause(1000);
    }
    // Fill in tag details (name and description)
    async fillTagDetails(driver, name, description) {
        console.log("Filling tag details...");
        await this.tagNameField(driver).clearValue();
        await this.tagNameField(driver).setValue(name);
        await this.tagDescriptionField(driver).clearValue();
        await this.tagDescriptionField(driver).setValue(description);
    }

    // Save the tag (for either creating or editing)
    async saveTag(driver) {
        await this.saveTagButton(driver).click();
        await driver.pause(1000);
    }

    // Verify that a tag is not visible in the tags list
    async verifyTagIsNotVisible(driver, name) {
        console.log(`Verifying tag "${name}" is not visible...`);
        await this.tagsMenuButton(driver).click();
        const tags = await driver.$$(this.tagListSelector(driver));
        const tagNames = await Promise.all(tags.map(async tag => await tag.getText()));
        assert(!tagNames.includes(name), `The tag "${name}" is still visible in the tags list`);
    }

    // Select an existing tag by name
    async selectTagByName(driver, name) {
        console.log(`Selecting tag "${name}"...`);
        const tagContainers = await this.tagContainers(driver);

        for (const container of tagContainers) {
            const tagNameElement = await this.tagNameInContainer(container);
            const tagName = (await tagNameElement.getText()).trim();
            if (tagName === name.trim()) {
                await tagNameElement.click();
                await driver.pause(1000);
                console.log(`Tag "${name}" found and selected.`);
                return;
            }
        }
        throw new Error(`El tag con nombre "${name}" no se encontró en la lista.`);
    }
    async editTagDetails(driver, newName, newDescription) {
        console.log("Editing tag details...");
    
        // Limpiar y establecer nuevo nombre del tag
        const tagNameElement = await this.tagNameField(driver);
        await tagNameElement.click();
        await tagNameElement.clearValue();
        await tagNameElement.setValue(newName);
        console.log(`New tag name entered: ${newName}`);
    
        // Limpiar y establecer nueva descripción del tag
        const tagDescriptionElement = await this.tagDescriptionField(driver);
        await tagDescriptionElement.click();
        await tagDescriptionElement.clearValue();
        await tagDescriptionElement.setValue(newDescription);
        console.log(`New tag description entered: ${newDescription}`);
      }

    // Delete a tag
    async deleteTag(driver) {
        await this.deleteTagButton(driver).click();
        await this.confirmDeleteTagButton(driver).click();
        await driver.pause(1000);
    }

     // Start creating a new tag
     async startCreatingNewTag(driver) {
        console.log("Starting to create a new tag...");
        await this.newTagButton(driver).click();
        await driver.pause(1000);
        await driver.url().should('include', '/ghost/#/tags/new');
    }

    // Enter tag details (name and description)
    async enterTagDetails(driver, name, description) {
        console.log(`Entering tag details - Name: ${name}, Description: ${description}`);
        await this.tagNameField(driver).click();
        await this.tagNameField(driver).setValue(name);
        await this.tagDescriptionField(driver).click();

        await this.tagDescriptionField(driver).setValue(description);
    }

    // Save the tag (for either creating or editing)
    async saveTag(driver) {
        await this.saveTagButton(driver).click();
        await driver.pause(1000);
    }
    async verifyTagNotInList(driver, tagName) {
        console.log(`Verifying that tag with name "${tagName}" is not in the list...`);
        const tagContainers = await driver.$$('li.gh-tags-list-item'); // Selecciona todos los contenedores de tags
        
        // Recorre cada contenedor para verificar si el nombre está presente
        for (const container of tagContainers) {
            const nameElement = await container.$('h3.gh-tag-list-name'); // Busca el elemento que contiene el nombre del tag
            const currentTagName = await nameElement.getText();
            if (currentTagName === tagName) {
                throw new Error(`El tag con nombre "${tagName}" aún se encuentra en la lista.`);
            }
        }
        console.log(`Confirmed: Tag with name "${tagName}" is not in the list.`);
    }
    async verifyTagIsVisible(driver, tagName) {
        console.log(`Verifying that tag "${tagName}" is visible...`);
    
        // Use a simple text-based selector to check for visibility of the tag name
        const tagTextElement = await driver.$(`//*[text()="${tagName}"]`);
        const isTagVisible = await tagTextElement.isDisplayed();
    
        // Assert that the tag is visible
        assert(isTagVisible, `The tag "${tagName}" is not visible on the page.`);
        console.log(`Tag "${tagName}" is confirmed visible.`);
      }
}

module.exports = new TagPage();
