class Settings {
    constructor() {
        this.settingsMenuButton = 'a[href=\\#\\/settings\\/]';
        this.generalSettingsButton = 'a[href=\\#\\/settings\\/general\\/]';
        this.expandButtonSection = 'button.gh-btn';
        this.titleField = 'div.form-group.ember-view > input';
        this.descriptionField = 'div.description-container > input';
        this.saveButton = 'button.gh-btn > span';     
    }

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

    // And El usuario expande la sección de título y descripción
    andGivenUserExpandsTitleSection() {
        cy.get(this.expandButtonSection).eq(1).click();
        cy.screenshot('title-section-expanded'); 
    }

    // When El usuario ingresa un nuevo título y descripción
    whenUserChangesTitleDescriptionFields(title, description) { 
        cy.get(this.titleField).first().clear().type(title, {force: true});
        cy.screenshot('title-field-updated'); 

        cy.get(this.descriptionField).first().clear().type(description, {force: true});
        cy.screenshot('description-field-updated'); 

        cy.contains(this.saveButton, "Save settings").first().click();
        cy.screenshot('settings-saved'); 
    }

    // Then El usuario verifica que los cambios se hayan guardado correctamente
    thenSettingsShouldBeSaved() {
        cy.contains(this.saveButton, "Saved").should('exist');
        cy.screenshot('settings-saved-successfully'); 
    }
}
export { Settings };