class Member {
    constructor() {
        this.membersMenuButton = 'li > [href="#/members/"]';
        this.memberListSelector = '.gh-members-list-name';
        this.newMemberButton = 'a.gh-btn.gh-btn-primary';
        this.memberNameField = '#member-name';
        this.memberEmailField = '#member-email';
        this.saveMemberButton = 'button.gh-btn.gh-btn-primary.gh-btn-icon.ember-view';
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
        cy.screenshot('members-page-loaded'); 
    }

    // and El usuario hace clic en "New Member" para crear un nuevo miembro
    andGivenUserStartsCreatingNewMember() {
        cy.get(this.newMemberButton).should('be.visible').click();
        cy.screenshot('entered-name');
        cy.url().should('include', '/ghost/#/members/new');
        cy.screenshot('new-member-page');
 
    }

    // When El usuario ingresa el nombre y correo electrónico del miembro
    whenUserEntersMemberDetails(name, email) {
        
        cy.get(this.memberNameField).type(name);
        cy.screenshot('entered-name');
        cy.get(this.memberEmailField).type(email);
        cy.screenshot('entered-email'); 
        cy.get('.gh-main').scrollTo('top');
        cy.get(this.saveMemberButton).should('be.visible').click();
        cy.screenshot('saved-member');
    }

    // Then El usuario verifica que el miembro esté visible en la lista de miembros
    thenMemberShouldBeVisibleInMembersList(name) {
        cy.get(this.membersMenuButton).click(); 
        cy.contains(this.memberListSelector, name).should('be.visible');
        cy.screenshot('member-visible-in-list'); 
    }
}

class DeleteMember extends Member {
    constructor() {
        super();
        this.settingsMenuButton = 'button.closed.ember-view';        
        this.deleteMemberButton = '.gh-main-section-block > button';     
        this.confirmDeleteButton = 'div > section > .modal-footer > .gh-btn-red.gh-btn-icon > span';    
    }

    // Given El usuario navega a la lista de miembros y selecciona el miembro para eliminar
    givenUserIsOnMembersPageAndSelectsMemberToDelete(name) {
        cy.get(this.membersMenuButton).should('be.visible').click();
        cy.screenshot('members-page-before-delete');
        cy.contains(this.memberListSelector, name).click(); 
        cy.get('.gh-main').scrollTo('bottom');
        cy.screenshot('selected-member-to-delete'); 
    }

    // When El usuario confirma la eliminación del miembro
    whenUserDeletesMember() {
        cy.get(this.deleteMemberButton).should('be.visible').click();
        cy.screenshot('clicked-delete-member'); 
        cy.get(this.confirmDeleteButton).first().as('deleteBtn');
        cy.get('@deleteBtn').click();
        cy.screenshot('confirmed-delete');
    }

    // Then El usuario verifica que el miembro ya no esté en la lista de miembros
    thenMemberShouldNotBeVisibleInMembersList(name) {
        cy.log('ingresa por aca');
        cy.get(this.membersMenuButton).should('be.visible').click(); 
        cy.contains(this.memberListSelector, name).should('not.exist');
        cy.screenshot('member-not-visible-in-list');
    }
}

export { CreateMember, DeleteMember };