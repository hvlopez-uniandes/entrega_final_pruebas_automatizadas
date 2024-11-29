import login from './pages/login';
import { CreatePage } from './pages/page';
import { faker } from '@faker-js/faker';
import { SettingsDeleteContent } from './pages/settings';

const createPage = new CreatePage();
const settingsDeleteContent = new SettingsDeleteContent();
const apiUrl = Cypress.env('API_URL')+"/page-pseudo-aleatorio.json?key=6fad6d30";

describe('Escenarios de pruebas para la funcionalidad páginas - Ghost', () => {
    Cypress.on('uncaughtexception', (err) => {
        if (err.message.includes('TransitionAborted')) {
            return false; 
        }
    });

    let aPrioriData = [];
    let aPrioriRowIndex = 0;
    let pseudoData = [];
    let pseudoRowIndex = 0;

    before(() => {
        cy.fixture('page-a-priori.json').then((page) => {
            aPrioriData = page;
        });
    });

    beforeEach(() => {
        cy.session('user-session', () => {
            login.givenUserIsOnLoginPage(); 
            login.whenUserLogsIn();       
            login.thenUserShouldSeeDashboard(); 
        });
        cy.visit(Cypress.env('GHOST_URL') + '/ghost/#/dashboard');
        cy.wait(1000);

        aPrioriRowIndex = Math.floor(Math.random() * aPrioriData.length);

        cy.request(apiUrl).then((response) => {
            pseudoData = response.body;

            pseudoRowIndex = Math.floor(Math.random() * pseudoData.length);
        });
    });

    afterEach(() => {
        cy.wait(1000);
        settingsDeleteContent.givenUserIsInSettings(); 
        settingsDeleteContent.andGivenUserOpensGeneralSection(); 
        settingsDeleteContent.whenUserDeleteAllContent(); 
        settingsDeleteContent.thenSettingsShouldDeleted(); 
    });

    it('EP007 - Debería permitir crear una página con extracto (Aleatorio)', () => {

        const pageTitle = faker.lorem.sentence();         
        const pageContent = faker.lorem.paragraph();
        const pageDate = faker.date.past(1).toISOString().split('T')[0];
        const pageExcerpt = faker.lorem.sentence();
        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pageTitle, pageContent, pageDate, pageExcerpt);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(pageTitle);
    });

    it('EP008 - Debería permitir crear una página con extracto (A-priori)', () => {

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date, aPrioriData[aPrioriRowIndex].extract);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(aPrioriData[aPrioriRowIndex].title);
    });

    it('EP009 - Debería permitir crear una página con extracto (Pseudo-aleatorio)', () => {

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date, pseudoData[pseudoRowIndex].extract);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(pseudoData[pseudoRowIndex].title);
    });

    it('EP010 - Debería permitir crear una página con tipo de acceso de una página (Aleatorio)', () => {

        const pageTitle = faker.lorem.sentence();         
        const pageContent = faker.lorem.paragraph();
        const pageDate = faker.date.past(1).toISOString().split('T')[0];
        const pageAccessOptions = [
            { value: 'Public'},
            { value: 'Members only'},
            { value: 'Paid-members only'},
            { value: 'Specific tier(s)'}
        ];

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pageTitle, pageContent, pageDate, '', pageAccessOptions);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(pageTitle);
    });

    it('EP011 - Debería permitir crear una página con tipo de acceso de una página (A-priori)', () => {

        const pageAccessOptions = [
            { value: aPrioriData[aPrioriRowIndex].access}
        ];
        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date, '', pageAccessOptions);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(aPrioriData[aPrioriRowIndex].title);
    });

    it('EP012 - Debería permitir crear una página con tipo de acceso de una página (Pseudo-aleatorio)', () => {

        const pageAccessOptions = [
            { value: pseudoData[pseudoRowIndex].access}
        ];
        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date, '', pageAccessOptions);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(pseudoData[pseudoRowIndex].title);
    });

});