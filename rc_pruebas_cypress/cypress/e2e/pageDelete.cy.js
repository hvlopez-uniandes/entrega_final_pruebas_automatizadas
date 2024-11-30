import loginPage from './pages/login';
import { SettingsDeleteContent } from './pages/settings';
import { CreatePage, DeletePage } from './pages/page';
import { faker } from '@faker-js/faker';

const settingsDeleteContent = new SettingsDeleteContent();
const createPage = new CreatePage();
const deletePage = new DeletePage();
const pageTitle = faker.lorem.sentence();         
const pageContent = faker.lorem.paragraph();

describe('Escenarios de pruebas para la funcionalidad páginas - Ghost', () => {

    let aPrioriData = [];
    let aPrioriRowIndex = 0;

    before(() => {
        cy.fixture('page-a-priori.json').then((page) => {
            aPrioriData = page;
        });
    });

    beforeEach(() => {
        // Restaurar la sesión antes de cada prueba y navegar al dashboard
        cy.session('user-session', () => {
            loginPage.givenUserIsOnLoginPage(); 
            loginPage.whenUserLogsIn();       
            loginPage.thenUserShouldSeeDashboard(); 
        });
        cy.visit(Cypress.env('GHOST_URL') + '/ghost/#/dashboard');
        cy.wait(1000);

        // Crear página
        createPage.givenUserIsOnPages();
        createPage.andGivenUserStartsCreatingNewPage();
        createPage.whenUserEntersPageDetails(pageTitle, pageContent);
        createPage.thenPageShouldBeVisibleInPagesList(pageTitle);

        aPrioriRowIndex = Math.floor(Math.random() * aPrioriData.length);
    });


    it('EP057 - Debería permitir eliminar una página existente (Aleatorio)', () => {  
    
        // Given El usuario navega a la lista de páginas y selecciona la página que desea eliminar
        deletePage.givenUserIsOnPagesAndSelectsPageToDelete(pageTitle); 
    
        // When El usuario confirma la eliminación de la página
        deletePage.whenUserDeletesPage();      
    
        // Then El usuario verifica que la página eliminada ya no esté en la lista de páginas
        deletePage.thenPageShouldNotBeVisibleInPagesList(pageTitle);
    });

    
});