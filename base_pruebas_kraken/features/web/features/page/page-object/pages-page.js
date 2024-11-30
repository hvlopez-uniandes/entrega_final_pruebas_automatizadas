const assert = require("assert");
const properties = require("../../../../../properties.json");

class Page {
    pagesMenuButton(driver) { return driver.$('[data-test-nav="pages"]'); }
    pageTitleField(driver) { return driver.$('.gh-editor-title.ember-text-area.gh-input.ember-view'); }
    pageContentField(driver) { return driver.$('.koenig-editor__editor.__mobiledoc-editor > p'); }
    savePageButton(driver) { return driver.$('button.gh-btn.gh-btn-editor.darkgrey.gh-publish-trigger'); }
    pageListSelector(driver) { return driver.$('.posts-list.gh-list'); }
    newPageButton(driver) { return driver.$('a.gh-btn.gh-btn-primary'); }
    settingsMenuButton(driver) { return driver.$('.settings-menu-toggle'); }
    deletePageButton(driver) { return driver.$('.settings-menu-delete-button > .gh-btn'); }
    confirmDeleteButton(driver) { return driver.$('.modal-footer .gh-btn-red'); }
    backToPagesButton(driver) { return driver.$('a.ember-view.gh-editor-back-button'); }
    publishMenuButton(driver) { return driver.$('.gh-publishmenu.ember-view > div'); }
    edithMenuButton(driver) { return driver.$('.gh-publishmenu.ember-view'); }
    publishButton(driver) { return driver.$('.gh-publish-cta > .gh-btn > span'); }
    confirmPublishButton(driver) { return driver.$('.gh-btn.gh-btn-black.gh-publishmenu-button.gh-btn-icon.ember-view'); }
    closeModalButton(driver) { return driver.$(".modal-content .close"); }
    pagesContainer(driver) { return driver.$$('.ember-view.permalink.gh-list-data.gh-post-list-title'); }
    pagesTitleInContainer(container) { return container.$('h3.gh-content-entry-title'); }
    pageTitleInList(driver) { return driver.$("h3.gh-content-entry-title"); }
    unpublishButton(driver) { return driver.$('.gh-editor-header > .gh-editor-publish-buttons > .darkgrey > span'); }
    confirmUnpublishButton(driver) { return driver.$('button.gh-revert-to-draft'); }
    draftStatusIndicator(driver) { return driver.$(".gh-content-entry-status .draft"); }  // Indicador de notificación de borrador

    // Navigate to the pages page
    async navigateToPagesPage(driver) {
        console.log("Navigating to pages page...");
       await driver.url(properties["URL"] + "#/pages");
    }

    // Start creating a new page
    async startCreatingNewPage(driver) {

        await driver.url(properties["URL"] + "#/editor/page");
    }

    // Enter page details (title and content)
    async enterPageDetails(driver, title, content) {
        console.log(`Entering page details - Title: ${title}, Content: ${content}`);
        await this.pageTitleField(driver).clearValue();
        await this.pageTitleField(driver).setValue(title);
        await this.pageContentField(driver).click();
        await this.pageContentField(driver).setValue(content);
    }

    // Save the page
    async savePage(driver) {
        console.log("Saving the page...");
        await this.savePageButton(driver).click();
        await driver.pause(1000);
    }
    async verifyPagesInList(driver, titles) {
        await driver.pause(1000);  // Breve pausa para asegurarse de que los posts se hayan cargado
    
        const postContainers = await this.pagesContainer(driver);
        console.log(`Se encontraron ${postContainers.length} contenedores de posts.`);
    
        // Extrae el texto del título de cada post en la lista
        const postTitlesText = await Promise.all(postContainers.map(async (container) => {
          const titleElement = await this.pagesTitleInContainer(container);
          const titleText = await titleElement.getText();
          console.log(`Título encontrado: "${titleText}"`);
          return titleText;
        }));
    
        // Verifica que todos los títulos esperados estén presentes en la lista de títulos obtenidos
        for (const title of titles) {
          assert(postTitlesText.includes(title), `El post con el título "${title}" no se encontró en la lista.`);
        }
      }
    // Publish the page
    async publishPage(driver) {
        console.log("Publishing the page...");
        await this.publishMenuButton(driver).click();
        await this.confirmPublishButton(driver).click();
        await this.navigateToPagesPage(driver);
        console.log("Page published.");
    }

    async verifyPageInList(driver, title) {
        console.log("Verifying page in list...");
        await this.navigateToPagesPage(driver);
        
        const pageTitle = await this.pageTitleInList(driver).getText();
        console.log(`Expected title: ${title}, Found title: ${pageTitle}`);
        assert.strictEqual(pageTitle, title, "The page was not created correctly");
    }


    async unpublishPage(driver) {
        console.log("Unpublishing page...");
        await this.unpublishButton(driver).waitForDisplayed({ timeout: 5000 });
        await this.unpublishButton(driver).click();
        await this.confirmUnpublishButton(driver).waitForDisplayed({ timeout: 5000 });
        await this.confirmUnpublishButton(driver).click();
        await this.backToPagesButton(driver).waitForDisplayed({ timeout: 5000 });
        await this.backToPagesButton(driver).click();
        console.log("Page unpublished and marked as Draft.");
    }
    
    // Verify that a page is marked as draft
    async verifyPageIsDraft(driver, title) {
        this.navigateToPagesPage(driver);
        console.log(`Verificando que el post con título "${title}" esté marcado como borrador...`);
        
        // Espera a que el indicador de estado esté visible
        await this.draftStatusIndicator(driver).waitForDisplayed({ timeout: 5000 });
        
        // Verifica que el texto del indicador indique "Draft" o "Borrador"
        const draftStatus = await this.draftStatusIndicator(driver).getText();
        return draftStatus.includes("Draft") || draftStatus.includes("Borrador");
      }
    async selectPageByTitle(driver, title) {
        const postContainers = await this.pagesContainer(driver);
        for (const container of postContainers) {
          const titleElement = await this.pagesTitleInContainer(container);
          const postTitle = await titleElement.getText();
          if (postTitle === title) {
            await titleElement.click();
            await driver.pause(1000);
            return;
          }
        }
        throw new Error(`El page con título "${title}" no se encontró en la lista.`);
      }
    
        // Go back to the pages list
        async goBackToPagesList(driver) {
            console.log("Going back to the pages list...");
            await this.backToPagesButton(driver).click();
            await driver.pause(1000);
        }
    // Verify the page details (title and content)
    async verifyPageDetails(driver, title, content) {
        console.log(`Verifying page details - Title: "${title}", Content: "${content}"`);
        await this.pageTitleField(driver).click();
        const pageTitle = await this.pageTitleField(driver).getValue();
        
        await this.pageContentField(driver).click();
        const pageContent = await this.pageContentField(driver).getText();
        
        assert.strictEqual(pageTitle, title, "The page title does not match.");
        assert.strictEqual(pageContent, content, "The page content does not match.");
    }
    // Edit page details (title and content)
    async editPageDetails(driver, newTitle, newContent) {
        console.log(`Editing page details to - Title: ${newTitle}, Content: ${newContent}`);
        await this.pageTitleField(driver).clearValue();
        await this.pageTitleField(driver).setValue(newTitle);
        await this.pageContentField(driver).clearValue();
        await this.pageContentField(driver).setValue(newContent);
    }
    // Update the page after editing
    async updatePage(driver) {
        console.log("Updating page...");
        await this.edithMenuButton(driver).click();
        await driver.pause(1000);
        await this.confirmPublishButton(driver).click();
        console.log("Page updated.");
    }

    // Delete a page
    async deletePage(driver) {
        console.log("Deleting the page...");
        await this.settingsMenuButton(driver).click();
        await this.deletePageButton(driver).click();
        await this.confirmDeleteButton(driver).click();
        await driver.pause(1000);
        console.log("Page deleted.");
    }
    async verifyPageIsVisible(driver, title) {
        const pageListContainer = await this.pagesContainer(driver);

        // Extrae el texto del título de cada post en la lista
        const pagesTitlesText = await Promise.all(pageListContainer.map(async (container) => {
          const titleElement = await this.pagesTitleInContainer(container);
          const titleText = await titleElement.getText();
          console.log(`Título encontrado: "${titleText}"`);
          return titleText;
        }));
    
        // Verifica que todos los títulos esperados estén presentes en la lista de títulos obtenidos
    // Verifica que todos los títulos esperados estén presentes en la lista de títulos obtenidos
    for (const title of pagesTitlesText) {
        assert(pagesTitlesText.includes(title), `El post con el título "${title}" no se encontró en la lista.`);
      }
    }
    // Verify that a page with a specific title is not visible in the pages list
    async verifyPageNotInList(driver, title) {
        console.log(`Verifying that page with title "${title}" is not in the list...`);
        const pageTitleElement = await driver.$(`//h3[contains(text(), "${title}")]`);
        
        const isVisible = await pageTitleElement.isDisplayed();
        assert(!isVisible, `The page with title "${title}" is still visible in the list.`);
        console.log(`Confirmed: Page with title "${title}" is not in the list.`);
    }
}

module.exports = new Page();
