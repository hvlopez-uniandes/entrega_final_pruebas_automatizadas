class Member {
    constructor() {
        this.membersMenuButton = '[data-test-nav="members"]';
        this.memberListSelector = '.gh-members-list-name';
        this.newMemberButton = 'a.gh-btn.gh-btn-primary';
        this.memberNameField = '#member-name';
        this.memberEmailField = '#member-email';
        this.saveMemberButton = 'button.gh-btn.gh-btn-primary.gh-btn-icon.ember-view';
        this.duplicatedEmailError = '.form-group.max-width.error > p';
    }
}

class CreateMember extends Member {
    constructor() {
        super();
    }

    // Given El usuario navega a la sección de miembros
    givenUserIsOnMembersPage() {
        cy.get(this.membersMenuButton).should('be.visible').click();
        cy.url().should('include', '/ghost/#/members');
        cy.screenshot('members-page');
    }

    // And El usuario navega a la sección de miembros
    andUserIsOnMembersPage() {
        cy.get(this.membersMenuButton).should('be.visible').click();
        cy.url().should('include', '/ghost/#/members');
        cy.screenshot('members-page');
    }

    // and El usuario hace clic en "New Member" para crear un nuevo miembro
    andGivenUserStartsCreatingNewMember() {
        cy.get(this.newMemberButton).should('be.visible').click();
        cy.url().should('include', '/ghost/#/members/new');
        cy.screenshot('new-member-page');
    }

    // and El usuario hace clic en "New Member" para crear un nuevo miembro
    andUserStartsCreatingNewMember() {
        cy.get(this.newMemberButton).should('be.visible').click();
        cy.url().should('include', '/ghost/#/members/new');
        cy.screenshot('new-member-page');
    }

    // and El usuario hace clic en "New Member" para crear un nuevo miembro
    whenUserStartsCreatingNewMember() {
        cy.get(this.newMemberButton).should('be.visible').click();
        cy.url().should('include', '/ghost/#/members/new');
        cy.screenshot('new-member-page');
    }

    // When El usuario ingresa el nombre y correo electrónico del miembro
    whenUserEntersMemberDetails(name, email) {
        cy.get(this.memberNameField).clear().type(name);
        cy.screenshot('member-name-entered');
        if (email == '') {
            cy.get(this.memberEmailField).clear();
            cy.screenshot('member-email-entered');
        } else {
            cy.get(this.memberEmailField).clear().type(email);
            cy.screenshot('member-email-entered');
        }
        cy.get('.gh-main').scrollTo('top');
        cy.get(this.saveMemberButton).should('be.visible').click();
        cy.screenshot('member-saved');
    }

        // When El usuario ingresa el nombre y correo electrónico del miembro
        andUserEntersMemberDetails(name, email) {
            cy.get(this.memberNameField).clear().type(name);
            cy.screenshot('member-name-entered');
            if (email == '') {
                cy.get(this.memberEmailField).clear();
                cy.screenshot('member-email-entered');
            } else {
                cy.get(this.memberEmailField).clear().type(email);
                cy.screenshot('member-email-entered');
            }
            cy.get('.gh-main').scrollTo('top');
            cy.get(this.saveMemberButton).should('be.visible').click();
            cy.screenshot('member-saved');
        }

    // Then El usuario verifica que el miembro esté visible en la lista de miembros
    thenMemberShouldBeVisibleInMembersList(name) {
        cy.get(this.membersMenuButton).click(); 
        cy.contains(this.memberListSelector, name).should('be.visible');
        cy.screenshot('member-visible-in-list'); 
    }

    // Then El usuario debería ver un mensaje de error que indica que el email ya existe
    thenUserShouldSeeDuplicatedEmailError() {
        cy.get(this.duplicatedEmailError).should('be.visible');
        cy.screenshot('duplicated-email-error');
    }
}
class ViewMembers {
    constructor() {
        this.membersMenuButton = '[data-test-nav="members"]';  
        this.memberListSelector = '.gh-members-list-name';    
    }

    // Given El usuario navega a la sección de miembros
    givenUserIsOnMembersPage() {
        cy.get(this.membersMenuButton).should('be.visible').click(); 
        cy.url().should('include', '/ghost/#/members');  
        cy.screenshot('members-page-view');     
    }

    // When El usuario visualiza la lista de miembros
    whenUserViewsMembersList() {
        cy.get(this.memberListSelector).should('exist');
        cy.screenshot('members-list-visible');   
    }

    // Then Verifica que la lista de miembros esté visible
    thenMembersListShouldBeVisible() {
        cy.get(this.memberListSelector).should('be.visible');   
        cy.screenshot('members-list-validated');
    }
}

class EditMember extends Member {
    constructor() {
        super();
    }

    // Given El usuario navega a la lista de miembros y selecciona un miembro para editar
    givenUserIsOnMembersPageAndSelectsMemberToEdit(name) {
        cy.get(this.membersMenuButton).should('be.visible').click();
        cy.screenshot('members-page-for-edit');
        cy.contains(this.memberListSelector, name).click(); 
        cy.screenshot('member-selected-for-edit'); 

    }

    // and El usuario navega a la lista de miembros y selecciona un miembro para editar
    andUserIsOnMembersPageAndSelectsMemberToEdit(name) {
        cy.get(this.membersMenuButton).should('be.visible').click();
        cy.screenshot('members-page-for-edit');
        cy.contains(this.memberListSelector, name).click(); 
        cy.screenshot('member-selected-for-edit'); 

    }

    // When El usuario modifica el nombre y/o correo electrónico del miembro
    whenUserEditsMemberDetails(newName, newEmail) {
        cy.get(this.memberNameField).clear().type(newName);
        cy.screenshot('member-name-edited');
        if (newEmail == '') {
            cy.get(this.memberEmailField).clear();
            cy.screenshot('member-email-entered');
        } else {
            cy.get(this.memberEmailField).clear().type(newEmail);
            cy.screenshot('member-email-entered');
        }
        cy.screenshot('member-email-edited'); 
        cy.get('.gh-main').scrollTo('top');
        cy.get(this.saveMemberButton).should('be.visible').click();
        cy.screenshot('edited-member-saved');
    }


    // and El usuario modifica el nombre y/o correo electrónico del miembro
    andUserEditsMemberDetails(newName, newEmail) {
        cy.get(this.memberNameField).clear().type(newName);
        cy.screenshot('member-name-edited');
        if (newEmail == '') {
            cy.get(this.memberEmailField).clear();
            cy.screenshot('member-email-entered');
        } else {
            cy.get(this.memberEmailField).clear().type(newEmail);
            cy.screenshot('member-email-entered');
        }
        cy.screenshot('member-email-edited'); 
        cy.get('.gh-main').scrollTo('top');
        cy.get(this.saveMemberButton).should('be.visible').click();
        cy.screenshot('edited-member-saved');
    }    

    // Then El usuario verifica que el miembro editado esté visible en la lista de miembros con el nuevo nombre
    thenMemberShouldBeUpdatedInMembersList(newName) {
        cy.get(this.membersMenuButton).click(); 
        cy.contains(this.memberListSelector, newName).should('be.visible');
        cy.screenshot('edited-member-visible-in-list');
    }

    // Then El usuario debería ver un mensaje de error que indica que el email ya existe
    thenUserShouldSeeDuplicatedEmailError() {
        cy.get(this.duplicatedEmailError).should('be.visible');
        cy.screenshot('duplicated-email-error');
    }
}

class DeleteMember extends Member {
    constructor() {
        super();
        this.settingsMenuButton = 'button.closed.ember-view';        
        this.deleteMemberButton = '[data-test-button="delete-member"]';     
        this.confirmDeleteButton = '.modal-footer .gh-btn-red';    
    }

    // Given El usuario navega a la lista de miembros y selecciona el miembro para eliminar
    givenUserIsOnMembersPageAndSelectsMemberToDelete(name) {
        cy.get(this.membersMenuButton).should('be.visible').click();
        cy.screenshot('members-page-for-delete');
        cy.contains(this.memberListSelector, name).click(); 
        cy.get('.gh-main').scrollTo('top');
        cy.get(this.settingsMenuButton).should('be.visible').click(); 
        cy.screenshot('member-settings-opened'); 
    }

    // When El usuario confirma la eliminación del miembro
    whenUserDeletesMember() {
        cy.get(this.deleteMemberButton).should('be.visible').click();
        cy.screenshot('delete-member-clicked');
        cy.get(this.confirmDeleteButton).should('be.visible').click();
        cy.screenshot('delete-member-confirmed'); 
    }

    // Then El usuario verifica que el miembro ya no esté en la lista de miembros
    thenMemberShouldNotBeVisibleInMembersList(name) {
        cy.get(this.membersMenuButton).should('be.visible').click(); 
        cy.contains(this.memberListSelector, name).should('not.exist');
        cy.screenshot('member-not-visible-in-list');
    }

    // Then El usuario debería ver un mensaje de error que indica que el email ya existe
    thenUserShouldSeeDuplicatedEmailError() {
        cy.get(this.duplicatedEmailError).should('be.visible');
        cy.screenshot('duplicated-email-error');
    }
}

export { CreateMember, ViewMembers, EditMember, DeleteMember };