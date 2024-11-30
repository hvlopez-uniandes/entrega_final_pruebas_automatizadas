import loginPage from './pages/login';
import { SettingsDeleteContent } from './pages/settings';
import { CreatePage, ViewPages, ValidatePage } from './pages/page';
import { faker } from '@faker-js/faker';

const settingsDeleteContent = new SettingsDeleteContent();
const createPage = new CreatePage();
const viewPages = new ViewPages();
const validatePage = new ValidatePage();

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

    after(() => {
        //Eliminar todo el contenido
        cy.wait(1000);
        settingsDeleteContent.givenUserIsInSettings(); 
        settingsDeleteContent.andGivenUserOpensGeneralSection(); 
        settingsDeleteContent.whenUserDeleteAllContent(); 
        settingsDeleteContent.thenSettingsShouldDeleted(); 
    });


    it('EP055 - Debería permitir ver una página existente en la lista de páginas (Aleatorio)', () => {

        // Given El usuario navega a la sección de páginas
        viewPages.givenUserIsOnPagesSection();
    
        // When El usuario visualiza la lista de páginas
        viewPages.whenUserViewsPagesList();
    
        // Then El usuario verifica que la página con el título especificado esté visible en la lista
        viewPages.thenPageShouldBeVisible(pageTitle);
    });

    it('EP056 - Debería validar los detalles de una página existente (Aleatorio)', () => {

        // Given El usuario navega a la sección de páginas
        validatePage.givenUserIsOnPagesSection();   
    
        // When El usuario selecciona la página para ver sus detalles
        validatePage.whenUserSelectsPageToValidate(pageTitle);
    
        // Then El usuario valida que el título y el contenido de la página coincidan con los valores esperados
        validatePage.thenPageDetailsShouldMatch(pageTitle, pageContent);
    });

});