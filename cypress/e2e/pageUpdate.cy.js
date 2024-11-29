import login from './pages/login';
import { SettingsDeleteContent } from './pages/settings';
import { CreatePage, EditPage } from './pages/page';
import { faker } from '@faker-js/faker';

const settingsDeleteContent = new SettingsDeleteContent();
const createPage = new CreatePage();
const editPage = new EditPage();
const apiUrl = Cypress.env('API_URL')+"/page-pseudo-aleatorio.json?key=6fad6d30";

let pageTitle = '';         

describe('Escenarios de pruebas para la funcionalidad páginas - Ghost', () => {

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
        // Restaurar la sesión antes de cada prueba y navegar al dashboard
        cy.session('user-session', () => {
            login.givenUserIsOnLoginPage(); 
            login.whenUserLogsIn();       
            login.thenUserShouldSeeDashboard(); 
        });
        cy.visit(Cypress.env('GHOST_URL') + '/ghost/#/dashboard');
        cy.wait(1000);

        pageTitle = faker.lorem.sentence();         
        const pageContent = faker.lorem.paragraph();
        
        // Crear página
        createPage.givenUserIsOnPages();
        createPage.andGivenUserStartsCreatingNewPage();
        createPage.whenUserEntersPageDetails(pageTitle, pageContent);
        createPage.thenPageShouldBeVisibleInPagesList(pageTitle);

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

    it('EP019 - Debería permitir al usuario editar una página existente con un extracto  (Aleatorio)', () => { 
        
        const newPageTitle = faker.lorem.sentence();         
        const newPageContent = faker.lorem.paragraph();
        const newPageDate = faker.date.past(1).toISOString().split('T')[0];
        const newPageExcerpt = faker.lorem.sentence();

        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(newPageTitle, newPageContent, newPageDate, newPageExcerpt);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(newPageTitle); 
    });

    it('EP020 - Debería permitir al usuario editar una página existente con un extracto (A-priori)', () => { 
        
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date, aPrioriData[aPrioriRowIndex].extract);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(aPrioriData[aPrioriRowIndex].title); 
    });

    it('EP021 - Debería permitir al usuario editar una página existente con un extracto (Pseudo-aleatorio)', () => { 
        
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date, pseudoData[pseudoRowIndex].extract);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(pseudoData[pseudoRowIndex].title); 
    });

    it('EP022 - Debería permitir al usuario editar una página existente con un tipo de acceso de una página (Aleatorio)', () => { 

        const newPageTitle = faker.lorem.sentence();         
        const newPageContent = faker.lorem.paragraph();
        const newPageDate = faker.date.past(1).toISOString().split('T')[0];
        const newPageAccessOptions = [
            { value: 'Public'},
            { value: 'Members only'},
            { value: 'Paid-members only'},
            { value: 'Specific tier(s)'}
        ];
        
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(newPageTitle, newPageContent, newPageDate, '', newPageAccessOptions);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(newPageTitle); 
    });

    it('EP023 - Debería permitir al usuario editar una página existente con un tipo de acceso de una página (A-priori)', () => { 
        
        const newPageAccessOptions = [
            { value: aPrioriData[aPrioriRowIndex].access}
        ];

        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date, '', newPageAccessOptions);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(aPrioriData[aPrioriRowIndex].title); 
    });

    it('EP024 - Debería permitir al usuario editar una página existente con un tipo de acceso de una página (Pseudo-aleatorio)', () => { 

        const newPageAccessOptions = [
            { value: pseudoData[pseudoRowIndex].access}
        ];
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date, '', newPageAccessOptions);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(pseudoData[pseudoRowIndex].title); 
    });


});