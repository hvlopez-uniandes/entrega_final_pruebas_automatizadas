class Page {
    constructor() {
        this.pagesMenuButton = '[data-test-nav="pages"]';  
         
        this.pageListSelector = '.gh-content-entry-title';
        this.pageTitleField = 'textarea[placeholder="Page title"]';
        this.pageContentField = '[data-secondary-instance="false"] > .koenig-lexical > [data-kg="editor"] > .kg-prose > p';
        this.settingsMenuButton = '.settings-menu-toggle';
        this.backToPagesButton = 'a.ember-view.gh-editor-back-button'; 
        this.confirmLeaveButton = '.modal-footer .gh-btn-red';   
        this.errorAlert = '.gh-alert';    
        this.settingsMenuButton = '.settings-menu-toggle'; 
        this.closeNotification = '.gh-notification-close';
    }
}

class CreatePage extends Page {
    constructor() {
        super();
        this.publishMenuButton = '.gh-editor-header > .gh-editor-publish-buttons > .darkgrey > span';             
        this.newPageButton = 'a.gh-btn.gh-btn-primary';                                  
        this.publishButton = '.gh-publish-cta > .gh-btn > span'; 
        this.confirmPublishButton = 'button.gh-btn.gh-btn-large.gh-btn-pulse.ember-view';
        this.closeButton = 'button.close';
        this.backButton = 'a.ember-view.gh-btn-editor.gh-editor-back-button';              
    }

    // Given El usuario navega a la sección de páginas
    givenUserIsOnPages() {
        cy.get(this.pagesMenuButton).should('be.visible').click();
        cy.url().should('include', '/ghost/#/pages');
        cy.screenshot('pages-list-page');
    }

    // and El usuario hace clic en "New Page" para crear una nueva página
    andGivenUserStartsCreatingNewPage() {
        cy.get(this.newPageButton).should('be.visible').click();
        cy.url().should('include', '/ghost/#/editor/page');
        cy.screenshot('new-page-editor'); 
    }

    // When El usuario ingresa el título y el contenido de la página
    whenUserEntersPageDetails(title, content, date = '', autor = true, borrar = false) {
        
        if (title != '') {
            cy.get(this.pageTitleField).clear().type(title);
            cy.screenshot('page-title-entered');
        }

        if (content != '') {
            cy.get(this.pageContentField).click().type(content);
            cy.screenshot('page-content-entered'); 
        } else {
            cy.get(this.pageContentField).click().type('{enter}');
            cy.screenshot('page-content-entered'); 
        }
        
        if (borrar) {
            cy.get(this.pageTitleField).clear();
            cy.get(this.pageContentField).click().clear();
            cy.screenshot('erase-content');
        }

        if (date != '') {
            cy.get(this.settingsMenuButton).should('be.visible').click(); 
            cy.screenshot('settings-menu-opened');
            cy.get('.gh-date-time-picker-date').clear().type(date);
            cy.screenshot('page-content-entered');

            if (autor == false) {
                cy.get('.ember-power-select-multiple-remove-btn').should('be.visible').click();
                cy.screenshot('page-content-entered');
            }

            cy.get(this.settingsMenuButton).should('be.visible').click(); 
            cy.screenshot('settings-menu-closed');
        }

        if (autor) {
            if (title.length <= 255) {
                cy.get(this.publishMenuButton).should('be.visible').click();
                cy.screenshot('publish-menu-opened');
                cy.get(this.publishButton).should('be.visible').click();
                cy.screenshot('page-published');
            } else {
                cy.log('Title is longer than 255 characters. Page will not be published.');
                cy.screenshot('title-too-long');
            }
        } else {
            cy.get(this.publishMenuButton).should('be.visible').click();
            cy.screenshot('publish-menu-opened');
            cy.contains(this.errorAlert, 'Validation failed: At least one author is required.').should('be.visible');
            cy.log('At least one author is required.');
            cy.screenshot('autor-is-required');
        }
    }

    // Then El usuario verifica que la página esté en la lista de páginas
    thenPageShouldBeVisibleInPagesList(title) {
        
        cy.get(this.confirmPublishButton).should('be.visible').click();
        cy.get(this.closeButton).should('be.visible').click();
        cy.screenshot('closed-page-editor');

        if (title != '') {
            cy.contains(title).should('exist');
        } else {
            cy.contains('Untitled').should('exist');
            cy.log('Title is empty. Page will be named "Untitled".')
        }
    }

    thenPageShouldNotBeVisibleInPageList(title, autor = true) {
        
        cy.get(this.backToPagesButton).should('be.visible').click();
        cy.screenshot('page-content-validated');
        cy.get(this.confirmLeaveButton).should('be.visible').click();
        cy.screenshot('leave-confirmed');
        cy.url().should('include', '/ghost/#/pages'); 
        if (autor == false) {
            cy.contains(this.pageListSelector, title).should('exist');
            cy.screenshot('page-visible-in-list');
        } else {
            cy.contains(this.pageListSelector, title).should('not.exist');
            cy.screenshot('page-not-visible-in-list');
        }
    }
}
    

class ViewPages extends Page {
    constructor() {
        super();
    }

    // Given El usuario navega a la sección de páginas
    givenUserIsOnPagesSection() {
        cy.get(this.pagesMenuButton).should('be.visible').click();   
        cy.url().should('include', '/ghost/#/pages');   
        cy.screenshot('view-pages-list');            
    }

    // When El usuario visualiza la lista de páginas
    whenUserViewsPagesList() {
        cy.get(this.pageListSelector).should('exist'); 
        cy.screenshot('pages-list-visible'); 
    }

    // Then Verifica que una página con el título especificado esté visible en la lista
    thenPageShouldBeVisible(title) {
        cy.contains(this.pageListSelector, title).should('be.visible'); 
        cy.screenshot('page-visible'); 
    }
}

class ValidatePage extends Page {
    constructor() {
        super();                     
        this.pageContentSelector = '[data-secondary-instance="false"] > .koenig-lexical > [data-kg="editor"] > .kg-prose > p'; 
    }

    // Given El usuario navega a la lista de páginas
    givenUserIsOnPagesSection() {
        cy.get(this.pagesMenuButton).should('be.visible').click();
        cy.screenshot('pages-list-before-validation');
        cy.url().should('include', '/ghost/#/pages');
        cy.screenshot('pages-list-loaded');
    }

    // When El usuario selecciona una página específica para ver sus detalles
    whenUserSelectsPageToValidate(title) {
        cy.contains(this.pageListSelector, title).click(); 
        cy.screenshot('selected-page-for-validation'); 
    }

    // Then El usuario valida que el título y el contenido de la página coincidan con los valores esperados
    thenPageDetailsShouldMatch(expectedTitle, expectedContent) {
        cy.get(this.pageContentSelector).should('contain.text', expectedContent);
        cy.screenshot('page-title-validated');
        cy.get(this.backToPagesButton).should('be.visible').click();
        cy.screenshot('page-content-validated');
        cy.url().should('include', '/ghost/#/pages'); 
    }
}

class EditPage extends Page {
    constructor() {
        super();
        this.publishMenuButton = '.gh-editor-header > .gh-editor-publish-buttons > .green > span';
        this.updateButton = 'a.ember-view.gh-btn-editor.gh-editor-back-button'; 
        this.confirmUpdateButton = 'button.gh-btn.gh-btn-large.gh-btn-pulse.ember-view';
    }

    // Given El usuario navega a la lista de páginas y selecciona una página para editar
    givenUserIsOnPagesAndSelectsPageToEdit(title) {
        cy.get(this.pagesMenuButton).should('be.visible').click();
        cy.screenshot('pages-list-before-edit');
        cy.contains(this.pageListSelector, title).click();
        cy.screenshot('page-selected-for-edit');
    }

    // When El usuario modifica el título y el contenido de la página
    whenUserEditsPageDetails(newTitle, newContent, date = '', autor = true) {

        if (newTitle != '') {
            cy.get(this.pageTitleField).clear().type(newTitle);
            cy.screenshot('edited-page-title');
        } else {
            cy.get(this.pageTitleField).clear();
            cy.screenshot('edited-page-title');
        }

        if (newContent != '') {
            cy.get(this.pageContentField).clear().type(newContent);
            cy.screenshot('edited-page-content');
        } else {
            cy.get(this.pageContentField).clear();
            cy.screenshot('edited-page-content');
        }

        if (date != '') {
            cy.get(this.settingsMenuButton).should('be.visible').click(); 
            cy.screenshot('settings-menu-opened');
            cy.get('.gh-date-time-picker-date').clear().type(date);
            cy.screenshot('page-content-entered');

            if (autor == false) {
                cy.get('.ember-power-select-multiple-remove-btn').should('be.visible').click();
                cy.screenshot('page-content-entered');
            }

            cy.get(this.settingsMenuButton).should('be.visible').click(); 
            cy.screenshot('settings-menu-closed');
        }

        cy.get(this.publishMenuButton).click();
        cy.screenshot('publish-menu-opened');

        if (autor) {
            if (newTitle.length <= 255) {
                cy.get(this.closeNotification).should('be.visible').click();
                cy.get(this.updateButton).should('be.visible').click();
                cy.screenshot('page-updated');
            } else {
                cy.contains(this.errorAlert, 'Update failed: Title cannot be longer than 255 characters.').should('be.visible');
                cy.get(this.updateButton).should('be.visible').click();
                cy.screenshot('page-not-updated');
            }
        } else {    
            cy.get(this.publishMenuButton).should('be.visible').click();
            cy.screenshot('publish-menu-opened');
            cy.contains(this.errorAlert, 'Update failed: At least one author is required.').should('be.visible');
            cy.log('At least one author is required.');
            cy.screenshot('autor-is-required');
            cy.get(this.updateButton).should('be.visible').click();
            cy.screenshot('page-not-updated');
        }
    }

    thenPageShouldNotBeVisibleInPageList(title) {
        cy.log('Title is longer than 255 characters. Page will not be published.');
        cy.get(this.confirmLeaveButton).should('be.visible').click();
        cy.screenshot('leave-confirmed');
        cy.url().should('include', '/ghost/#/pages'); 
        cy.contains(this.pageListSelector, title).should('not.exist');
        cy.screenshot('page-not-visible-in-list');
    }

    // Then El usuario verifica que la página editada esté en la lista de páginas
    thenPageShouldBeUpdatedInPagesList(newTitle) {
        cy.get(this.pagesMenuButton).click();
        cy.screenshot('returned-to-pages-list');
        if (newTitle != '') {
            cy.contains(this.pageListSelector, newTitle).should('be.visible');
            cy.screenshot('updated-page-visible-in-list');    
        } else {
            cy.contains('Untitled').should('exist');
            cy.log('Title is empty. Page will be named "Untitled".')
            cy.wait(500);
        }
        
    }
}

class UnpublishPage extends Page {
    constructor() {
        super();             
        this.unpublishButton = '.gh-editor-header > .gh-editor-publish-buttons > .darkgrey > span'; 
        this.confirmUnpublishButton = '.gh-revert-to-draft > span';  
        this.confirmDraftPage = 'span > div'; 
    }

    // Given El usuario navega a la lista de páginas y selecciona una página para despublicar
    givenUserIsOnPagesAndSelectsPageToUnpublish(title) {
        cy.get(this.pagesMenuButton).should('be.visible').click();
        cy.screenshot('pages-list-before-unpublish');
        cy.contains(this.pageListSelector, title).click(); 
        cy.screenshot('page-selected-for-unpublish');
    }

    // When El usuario cambia el estado de la página a borrador
    whenUserUnpublishesPage() {
        cy.get(this.unpublishButton).should('be.visible').click();
        cy.screenshot('unpublish-button-clicked'); 
        cy.get(this.confirmUnpublishButton).should('be.visible').click();
        cy.screenshot('unpublish-confirmed');
    }

    // Then El usuario verifica que la página esté en estado de borrador
    thenPageShouldBeInDraftState(title) {
        cy.get(this.confirmDraftPage).should('contain', 'Draft');
        cy.screenshot('page-in-draft-state');
        cy.wait(500);
        cy.get(this.closeNotification).should('be.visible').click();
        cy.get(this.backToPagesButton).should('be.visible').click();
        cy.screenshot('returned-to-pages-list');
        cy.wait(500);
        cy.contains(this.pageListSelector, title).should('be.visible');
        cy.screenshot('draft-page-visible-in-list');
    }
}
class DeletePage extends Page {
    constructor() {
        super();
        this.deletePageButton = '.settings-menu-delete-button > .gh-btn'; 
        this.confirmDeleteButton = '.modal-footer .gh-btn-red';   
    }

    // Given El usuario navega a la lista de páginas y selecciona la página para eliminar
    givenUserIsOnPagesAndSelectsPageToDelete(title) {
        cy.get(this.pagesMenuButton).should('be.visible').click();
        cy.screenshot('pages-list-before-delete');
        cy.contains(this.pageListSelector, title).click();
        cy.screenshot('page-selected-for-delete');
        cy.get(this.settingsMenuButton).should('be.visible').click(); 
        cy.screenshot('settings-menu-opened');
    }

    // When El usuario confirma la eliminación de la página
    whenUserDeletesPage() {
        cy.get('.settings-menu').scrollTo('bottom');
        cy.screenshot('scroll-to-delete');
        cy.get(this.deletePageButton).should('be.visible').click();
        cy.screenshot('delete-button-clicked');
        cy.get(this.confirmDeleteButton).should('be.visible').click();
        cy.screenshot('delete-confirmed');
    }

    // Then El usuario verifica que la página ya no esté en la lista de páginas
    thenPageShouldNotBeVisibleInPagesList(title) {
        cy.get(this.pagesMenuButton).click();
        cy.screenshot('returned-to-pages-list'); 
        cy.contains(this.pageListSelector, title).should('not.exist');
        cy.screenshot('page-not-visible-in-list');
    }
}

export { CreatePage, ViewPages, ValidatePage, EditPage, UnpublishPage, DeletePage };