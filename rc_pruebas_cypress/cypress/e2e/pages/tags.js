class Tag {
    constructor() {
        this.tagsMenuButton = '[data-test-nav="tags"]'
        this.tagNameField = '#tag-name';
        this.tagDescriptionField = '#tag-description';
        this.saveTagButton = 'button.gh-btn.gh-btn-primary.gh-btn-icon.ember-view';
        this.tagListSelector = '.gh-tag-list-name';
    }
}

class CreateTag extends Tag {
    constructor() {   
        super();   
        this.newTagButton = 'a.gh-btn.gh-btn-primary';                           
    }

    // Given El usuario navega a la página de tags
    givenUserIsOnTags() {
        cy.get(this.tagsMenuButton).should('be.visible').click();
        cy.url().should('include', '/ghost/#/tags');
        cy.screenshot('tags-page');
    }

    // and El usuario hace clic en "New Tag" para crear un tag
    andGivenUserStartsCreatingNewTag() {
        cy.get(this.newTagButton).should('be.visible').click();
        cy.url().should('include', '/ghost/#/tags/new');
        cy.screenshot('new-tag-page');
    }

    // When El usuario ingresa el nombre y descripción del tag
    whenUserEntersTagDetails(name, description) {
        cy.get(this.tagNameField).clear().type(name);
        cy.screenshot('tag-name-entered'); 
        cy.get(this.tagDescriptionField).clear().type(description);
        cy.screenshot('tag-description-entered'); 
        cy.get('.gh-main').scrollTo('top');
        cy.get(this.saveTagButton).should('be.visible').click();
        cy.screenshot('tag-saved');
    }

    // Then El usuario valida que el tag esté en la lista de tags
    thenTagShouldBeVisibleInTagsList(name) {
        cy.get(this.tagsMenuButton).click(); 
        cy.contains(this.tagListSelector, name).should('be.visible');
        cy.screenshot('tag-visible-in-list'); 
    }
}

class EditTag extends Tag {
    constructor() {
        super();
    }

    // Given El usuario navega a la página de tags y selecciona el tag a editar
    givenUserIsOnTagsPageAndSelectsTagToEdit(name) {
        cy.get(this.tagsMenuButton).should('be.visible').click();
        cy.url().should('include', '/ghost/#/tags');
        cy.screenshot('tags-page-before-edit');
        cy.contains(name).click();  
        cy.screenshot('tag-selected-for-edit'); 
    }

    // When El usuario modifica el nombre y la descripción del tag
    whenUserEditsTagDetails(newName, newDescription) {
        cy.get(this.tagNameField).clear().type(newName);
        cy.screenshot('tag-name-edited'); 
        cy.get(this.tagDescriptionField).clear().type(newDescription);
        cy.screenshot('tag-description-edited'); 
        cy.get('.gh-main').scrollTo('top');
        cy.get(this.saveTagButton).should('be.visible').click();
        cy.screenshot('tag-changes-saved');
    }

    // Then El usuario verifica que el tag se haya actualizado en la lista de tags
    thenTagShouldBeUpdatedInTagsList(newName) {
        cy.get(this.tagsMenuButton).click(); 
        cy.contains(this.tagListSelector, newName).should('be.visible');
        cy.screenshot('tag-updated-in-list');
    }
}

class DeleteTag extends Tag {
    constructor() {
        super();         
        this.deleteTagButton = 'button.gh-btn.gh-btn-red.gh-btn-icon'; 
        this.confirmDeleteTagButton = '.modal-footer .gh-btn-red';
    }

    // Given El usuario está en la página de tags y selecciona el tag a eliminar
    givenUserIsOnTagsPageAndSelectsTagToDelete(name) {
        cy.get(this.tagsMenuButton).should('be.visible').click();
        cy.url().should('include', '/ghost/#/tags');
        cy.screenshot('tags-page-before-delete');
        cy.contains(name).click(); 
        cy.screenshot('tag-selected-for-delete'); 
    }

    // When El usuario hace clic en el botón para eliminar el tag
    whenUserDeletesTag() {
        cy.get('.gh-main').scrollTo('bottom'); 
        cy.screenshot('scroll-to-delete-button');
        cy.get(this.deleteTagButton).should('be.visible').click();
        cy.screenshot('delete-button-clicked');
        cy.wait(500); 
        cy.get(this.confirmDeleteTagButton).click();
        cy.screenshot('delete-confirmed');
        //cy.wait(1000);
    }

    // Then El usuario verifica que el tag ya no está en la lista de tags
    thenTagShouldNotBeVisibleInTagsList(name) {
        cy.get(this.tagsMenuButton).click(); 
        cy.contains(this.tagListSelector, name).should('not.exist');
        cy.screenshot('tag-not-visible-in-list');
    }
}

export { CreateTag, EditTag, DeleteTag };