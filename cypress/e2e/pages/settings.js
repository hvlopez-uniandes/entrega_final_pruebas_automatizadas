class Settings {
    constructor() {
        this.settingsMenuButton = '[data-test-nav="settings"]';
        this.generalSettingsButton = '[data-testid="title-and-description"] > .items-start > :nth-child(2) > .flex > .cursor-pointer > span';
        this.expandButtonSection = 'button.gh-btn';
        this.titleField = 'input[placeholder="Site title"]';
        this.descriptionField = 'input[placeholder="Site description"]';
        this.saveButton = 'div > button.bg-green > span';  
        this.contentSettings = '#admin-x-settings-scroller';
        this.deleteContent = '[data-testid="dangerzone"] > :nth-child(3) > .cursor-pointer';
        this.confirmDeleteButton = '[data-testid="confirmation-modal"] > div > div > div > button.bg-red';  
    }
}

class SettingsTitleDescription extends Settings{
   
    // Given El usuario navega a la página de configuración
    givenUserIsInSettings() {
        cy.get(this.settingsMenuButton).should('be.visible').click();
        cy.screenshot('settings-menu-opened'); 
    }

    // And El usuario abre la sección general de configuración
    andGivenUserOpensGeneralSection() {
        cy.get(this.generalSettingsButton).first().click();
        cy.screenshot('general-section-opened'); 
    }

    // When El usuario ingresa un nuevo título y descripción
    whenUserChangesTitleDescriptionFields(title, description) { 

        if (title != '') {
            cy.get(this.titleField).clear().type(title);
            cy.screenshot('title-field-updated');
        } else {
            cy.get(this.titleField).clear();
            cy.screenshot('title-field-cleared');
        }
        
        if (description != '') {
            cy.get(this.descriptionField).clear().type(description);
            cy.screenshot('description-field-updated'); 
        } else {
            cy.get(this.descriptionField).clear();
            cy.screenshot('description-field-cleared');
        }
        
    }

    // Then El usuario verifica que los cambios se hayan guardado correctamente
    thenSettingsShouldBeSaved() {
        cy.get(this.contentSettings).scrollTo('top');
        cy.get(this.saveButton).should('be.visible').click();
        cy.screenshot('settings-saved'); 
    }
}

class SettingsDeleteContent extends Settings{
   
    // Given El usuario navega a la página de configuración
    givenUserIsInSettings() {
        cy.get(this.settingsMenuButton).first().click();
        cy.screenshot('settings-menu-opened'); 
    }

    // And El usuario abre la sección general de configuración
    andGivenUserOpensGeneralSection() {
        cy.get(this.generalSettingsButton).first().click();
        cy.screenshot('general-section-opened'); 
    }

    // When El usuario ingresa un nuevo título y descripción
    whenUserDeleteAllContent() { 
        cy.get(this.contentSettings).scrollTo('bottom');
        cy.get(this.deleteContent).should('be.visible').click();
        cy.screenshot('delete-all-content');    
    }

    // Then El usuario verifica que los cambios se hayan guardado correctamente
    thenSettingsShouldDeleted() {
        cy.get(this.confirmDeleteButton).should('be.visible').click();
        cy.screenshot('confirm-delete-all-content'); 
    }
}
export { SettingsTitleDescription, SettingsDeleteContent };