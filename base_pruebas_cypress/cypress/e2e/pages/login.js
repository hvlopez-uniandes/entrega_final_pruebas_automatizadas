class Login {
    constructor() {
        this.url = Cypress.env('GHOST_URL')+'/ghost/#/signin';                
        this.emailField = 'input[name="identification"]';
        this.passwordField = 'input[name="password"]';
        this.signInButton = 'button[type="submit"]';
        this.defaultEmail = Cypress.env('GHOST_EMAIL');
        this.defaultPassword = Cypress.env('GHOST_PASSWORD');
    }

    // Given: El usuario está en la página de inicio de sesión
    givenUserIsOnLoginPage() {
        cy.visit(this.url);
        cy.screenshot('login-page');
    }

    // When: El usuario ingresa sus credenciales y envía el formulario
    whenUserLogsIn(email = this.defaultEmail, password = this.defaultPassword) {
        cy.get(this.emailField).type(email);
        cy.screenshot('email-entered');
        cy.get(this.passwordField).type(password);
        cy.screenshot('password-entered');
        cy.get(this.signInButton).click();
        cy.screenshot('login-submitted');
    }

    // Then: El usuario debería ver el dashboard
    thenUserShouldSeeDashboard() {
        cy.url().should('include', '/ghost/#/dashboard');
        cy.screenshot('dashboard-visible');
        cy.wait(1000);
    }
}

export default new Login();