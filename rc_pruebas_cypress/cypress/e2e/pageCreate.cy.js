import loginPage from './pages/login';
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
        // Restaurar la sesión antes de cada prueba y navegar alZ dashboard
        cy.session('user-session', () => {
            loginPage.givenUserIsOnLoginPage(); 
            loginPage.whenUserLogsIn();       
            loginPage.thenUserShouldSeeDashboard(); 
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
        //Eliminar todo el contenido
        cy.wait(1000);
        settingsDeleteContent.givenUserIsInSettings(); 
        settingsDeleteContent.andGivenUserOpensGeneralSection(); 
        settingsDeleteContent.whenUserDeleteAllContent(); 
        settingsDeleteContent.thenSettingsShouldDeleted(); 
    });


    it('EP030 - Debería permitir crear y visualizar una nueva página (Aleatorio)', () => {

        const pageTitle = faker.lorem.sentence();         
        const pageContent = faker.lorem.paragraph();

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pageTitle, pageContent);


        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(pageTitle);
    });

    it('EP031 - Debería permitir crear una página con un título de menos de 255 carácteres (A-priori)', () => {

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(aPrioriData[aPrioriRowIndex].title);
    });

    it('EP032 - No debería permitir crear una página con un título de más de 255 carácteres (Aleatorio)', () => {

        let longTitle = faker.lorem.sentence(10);
        while (longTitle.length <= 255) {
            longTitle += ` ${faker.lorem.sentence(1)}`; 
        }
        const pageContent = faker.lorem.paragraph();

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(longTitle, pageContent);

        // Then El usuario valida que la página no esté visible en la lista de páginas
        createPage.thenPageShouldNotBeVisibleInPageList(longTitle);
    });

    it('EP033 - Debería validar que una página no se pueda crear con título vacío (Aleatorio)', () => {

        const pageContent = faker.lorem.paragraph();

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails('', pageContent);


        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList('');
    });

    it('EP034 - Debería validar que una página no se pueda crear con contenido vacío (Aleatorio)', () => {

        const pageTitle = faker.lorem.sentence(); 

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pageTitle, '');

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(pageTitle);
    });

    it('EP035 - Debería permitir crear una página con fecha (A-priori)', () => {

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(aPrioriData[aPrioriRowIndex].title);
    });

    it('EP036 - No debería permitir crear una página sin autor (A-priori)', () => {

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date, false);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldNotBeVisibleInPageList(aPrioriData[aPrioriRowIndex].title, false);
    });

    it('EP037 - Debería permitir crear una página con fecha (Pseudo-aletorio)', () => {

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(pseudoData[pseudoRowIndex].title);
    });

    it('EP038 - No debería permitir crear una página sin autor (Pseudo-aletorio)', () => {

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date, false);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldNotBeVisibleInPageList(pseudoData[pseudoRowIndex].title, false);
    });

    it('EP039 - Debería permitir crear una página con un título de menos de 255 carácteres (Pseudo-aletorio)', () => {

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(pseudoData[pseudoRowIndex].title);
    });

    it('EP040 - No debería permitir crear una página sin título y sin contenido (Aletorio)', () => {

        const pageTitle = faker.lorem.sentence();         
        const pageContent = faker.lorem.paragraph();

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pageTitle, pageContent, '', true, true);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList('');
    });

    it('EP041 - No debería permitir crear una página con un título con carácteres especiales (Aleatorio)', () => {

        const specialCharacters = '!@#$%^&*)_+}|:<>?];~';
        const length = 50; 

        const pageTitle = Array.from({ length }, () =>
            faker.helpers.arrayElement(specialCharacters.split(''))
        ).join('');
     
        const pageContent = faker.lorem.paragraph();

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pageTitle, pageContent);


        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(pageTitle);
    });

    it('EP042 - No debería permitir crear una página con contenido con carácteres especiales (Aleatorio)', () => {

        const specialCharacters = '!@#$%^&*)_+}|:<>?];~';
        const length = 50; 

        const pageTitle = faker.lorem.sentence(); 
        const pageContent = Array.from({ length }, () =>
            faker.helpers.arrayElement(specialCharacters.split(''))
        ).join('');

        // Given El usuario navega a la sección de páginas
        createPage.givenUserIsOnPages();

        // and El usuario comienza a crear una nueva página
        createPage.andGivenUserStartsCreatingNewPage();

        // When El usuario ingresa los detalles de la página
        createPage.whenUserEntersPageDetails(pageTitle, pageContent);


        // Then El usuario valida que la página esté visible en la lista de páginas
        createPage.thenPageShouldBeVisibleInPagesList(pageTitle);
    });
});