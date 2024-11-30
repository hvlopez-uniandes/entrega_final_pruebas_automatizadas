const assert = require("assert");
const properties = require("../../../../../properties.json");

class PostPage {
  newPostButton(driver) { return driver.$(".gh-nav-new-post"); }
  titleInput(driver) { return driver.$('.gh-editor-title.ember-text-area.gh-input.ember-view'); }
  contentInput(driver) { return driver.$('.koenig-editor__editor.__mobiledoc-editor > p'); }
  publishMenu(driver) { return driver.$(".gh-publishmenu.ember-view > div"); }
  finalReviewButton(driver) { return driver.$(".gh-publish-cta > button"); }
  publishConfirmationButton(driver) { return driver.$(".gh-btn.gh-btn-black.gh-publishmenu-button.gh-btn-icon.ember-view"); }
  closeModalButton(driver) { return driver.$(".modal-content .close"); }
  postsListButton(driver) { return driver.$('[data-test-nav="posts"]'); }
  postTitleInList(driver) { return driver.$("h3.gh-content-entry-title"); }
  postDetailTitle(driver) { return driver.$(".gh-editor-title.ember-text-area.gh-input.ember-view"); }
  postDetailContent(driver) { return driver.$('.koenig-editor__editor.__mobiledoc-editor > p'); }
  updateButton(driver) { return driver.$(".gh-publishmenu.ember-view"); }
  backToPostsButton(driver) { return driver.$("a.gh-editor-back-button"); }

  postContainers(driver) { return driver.$$(".ember-view.permalink.gh-list-data.gh-post-list-title"); }
  postTitleInContainer(container) { return container.$("h3.gh-content-entry-title"); }
  unpublishPostButton(driver) { return driver.$(".gh-editor-header > .gh-editor-publish-buttons > .darkgrey > span"); }
  confirmUnpublishPostButton(driver) { return driver.$(".gh-revert-to-draft > span"); }
  confirmDraftPost(driver) { return driver.$("span:contains('Draft')"); }
  draftStatusIndicator(driver) { return driver.$(".gh-content-entry-status .draft"); }  // Indicador de notificación de borrador


  // Método para abrir la lista de posts
  async openPostsList(driver) {
    console.log("Navigating to posts list page...");
    await driver.url(properties["URL"] + "#/posts");
    await driver.pause(2000);
  }

  // Método para ingresar los detalles de un post
  async enterPostDetails(driver, title, content) {
    console.log("Entering post details...");
    await this.newPostButton(driver).click();
    await this.titleInput(driver).waitForDisplayed({ timeout: 5000 });
    await this.titleInput(driver).click();
    await this.titleInput(driver).setValue(title);
    console.log(`Title entered: ${title}`);
    const contentInput = this.contentInput(driver);
    await contentInput.waitForDisplayed({ timeout: 5000 });
    await contentInput.click();
    await contentInput.addValue(content);
    console.log(`Content entered: ${content}`);
  }
  async deletePost(driver) {
    const settingsButton = await driver.$('.gh-btn.gh-btn-editor.gh-btn-icon.only-has-icon.gh-actions-cog.ml3'); // Cambia el selector por el adecuado
    await settingsButton.click();

    // Selecciona el botón de eliminación en el post abierto
    const deleteButton = await driver.$('.gh-btn.gh-btn-hover-red.gh-btn-icon.settings-menu-delete-button'); // Cambia el selector por el adecuado
    await deleteButton.click();
  
    // Confirmar eliminación si es necesario
    const confirmButton = await driver.$('.gh-btn.gh-btn-red.gh-btn-icon.ember-view'); // Cambia el selector por el adecuado
    await confirmButton.click();
  
    console.log("Post eliminado exitosamente.");
  }
  
  // Método para publicar el post
  async publishPost(driver) {
    console.log("Publishing post...");
    await this.publishMenu(driver).waitForDisplayed({ timeout: 5000 });
    await this.publishMenu(driver).click();
    await this.publishConfirmationButton(driver).waitForDisplayed({ timeout: 5000 });
    await this.publishConfirmationButton(driver).click();
    await this.openPostsList(driver);
    console.log("Post published and modal closed.");
  }

  // Método para verificar que un post con el título especificado esté en la lista de posts
  async verifyPostInList(driver, title) {
    console.log("Verifying post in list...");
    await this.postsListButton(driver).waitForDisplayed({ timeout: 5000 });
    await this.postsListButton(driver).click();
    const postTitle = await this.postTitleInList(driver).getText();
    console.log(`Expected title: ${title}, Found title: ${postTitle}`);
    assert.strictEqual(postTitle, title, "The post was not created correctly");
  }

  // Método para seleccionar un post por título
  async selectPostByTitle(driver, title) {
    const postContainers = await this.postContainers(driver);
    for (const container of postContainers) {
      const titleElement = await this.postTitleInContainer(container);
      const postTitle = await titleElement.getText();
      if (postTitle === title) {
        await titleElement.click();
        await driver.pause(1000);
        return;
      }
    }
    throw new Error(`El post con título "${title}" no se encontró en la lista.`);
  }

  // Método para obtener el título del post
  async getPostTitle(driver) {
    const titleElement = await this.postDetailTitle(driver);
    await titleElement.waitForDisplayed({ timeout: 5000 });
    return await titleElement.getValue();
  }

  // Método para obtener el contenido del post
  async getPostContent(driver) {
    const contentElement = await this.contentInput(driver);
    await contentElement.waitForDisplayed({ timeout: 5000 });
    return await contentElement.getText();
  }

  // Método para editar el título y contenido del post
  async editPostDetails(driver, newTitle, newContent) {
    console.log("Editing post details...");

    // Limpiar y establecer nuevo título
    const titleElement = await this.postDetailTitle(driver);
    await titleElement.waitForDisplayed({ timeout: 5000 });
    await titleElement.click();
    await titleElement.clearValue(); // Limpia el campo antes de establecer el nuevo valor
    await titleElement.setValue(newTitle);
    console.log(`New title entered: ${newTitle}`);

    // Limpiar y establecer nuevo contenido
    const contentElement = await this.postDetailContent(driver);
    await contentElement.waitForDisplayed({ timeout: 5000 });
    await contentElement.click();
    await contentElement.clearValue(); // Limpia el campo antes de establecer el nuevo valor
    await contentElement.setValue(newContent);
    console.log(`New content entered: ${newContent}`);
  }
  // Método para actualizar el post después de editarlo
  async updatePost(driver) {
    console.log("Updating post...");
    const updateButton = await this.updateButton(driver);
    await updateButton.waitForDisplayed({ timeout: 5000 });
    await updateButton.click();
    const confirmUpdateButton = await this.publishConfirmationButton(driver);
    await confirmUpdateButton.waitForDisplayed({ timeout: 5000 });
    await confirmUpdateButton.click();
    await this.openPostsList(driver);
    console.log("Post updated and returned to posts list.");
  }

  async goBackToPostsList(driver) {
    console.log("Navigating back to posts list...");
    await this.backToPostsButton(driver).waitForDisplayed({ timeout: 5000 });
    await this.backToPostsButton(driver).click();
    await driver.pause(1000); // Breve pausa para cargar la lista de posts
  }


  async verifyPostIsDraft(driver, title) {
    this.openPostsList(driver);
    console.log(`Verificando que el post con título "${title}" esté marcado como borrador...`);
    
    // Espera a que el indicador de estado esté visible
    await this.draftStatusIndicator(driver).waitForDisplayed({ timeout: 5000 });
    
    // Verifica que el texto del indicador indique "Draft" o "Borrador"
    const draftStatus = await this.draftStatusIndicator(driver).getText();
    return draftStatus.includes("Draft") || draftStatus.includes("Borrador");
  }
  async unpublishPost(driver) {
    console.log("Unpublishing post...");
    await this.unpublishPostButton(driver).waitForDisplayed({ timeout: 5000 });
    await this.unpublishPostButton(driver).click();
    await this.confirmUnpublishPostButton(driver).waitForDisplayed({ timeout: 5000 });
    await this.confirmUnpublishPostButton(driver).click();
    await this.goBackToPostsList(driver);
    console.log("Post unpublished and marked as Draft.");
  }
  async verifyPostsInList(driver, titles) {
    await driver.pause(1000);  // Breve pausa para asegurarse de que los posts se hayan cargado

    const postContainers = await this.postContainers(driver);
    console.log(`Se encontraron ${postContainers.length} contenedores de posts.`);

    // Extrae el texto del título de cada post en la lista
    const postTitlesText = await Promise.all(postContainers.map(async (container) => {
      const titleElement = await this.postTitleInContainer(container);
      const titleText = await titleElement.getText();
      console.log(`Título encontrado: "${titleText}"`);
      return titleText;
    }));

    // Verifica que todos los títulos esperados estén presentes en la lista de títulos obtenidos
    for (const title of titles) {
      assert(postTitlesText.includes(title), `El post con el título "${title}" no se encontró en la lista.`);
    }
  }

  async checkPostsPresence(driver, titles) {
    await driver.pause(1000);  // Breve pausa para asegurarse de que los posts se hayan cargado
  
    // Obtén todos los contenedores de posts
    const postContainers = await this.postContainers(driver);
    console.log(`Se encontraron ${postContainers.length} contenedores de posts.`);
  
    // Extrae el texto del título de cada post en la lista
    const postTitlesText = await Promise.all(postContainers.map(async (container) => {
      const titleElement = await this.postTitleInContainer(container);
      const titleText = await titleElement.getText();
      console.log(`Título encontrado: "${titleText}"`);
      return titleText;
    }));
  
    // Verifica que todos los títulos esperados estén presentes en la lista de títulos obtenidos
    for (const title of titles) {
      assert(postTitlesText.includes(title), `El post con el título "${title}" no se encontró en la lista.`);
    }
  }
  

}

module.exports = new PostPage();
