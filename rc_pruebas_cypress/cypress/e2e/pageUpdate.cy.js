import loginPage from './pages/login';
import { SettingsDeleteContent } from './pages/settings';
import { CreatePage, EditPage, UnpublishPage } from './pages/page';
import { faker } from '@faker-js/faker';

const settingsDeleteContent = new SettingsDeleteContent();
const createPage = new CreatePage();
const editPage = new EditPage();
const unpublishPage = new UnpublishPage();
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
            loginPage.givenUserIsOnLoginPage(); 
            loginPage.whenUserLogsIn();       
            loginPage.thenUserShouldSeeDashboard(); 
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

    it('EP043 - Debería permitir al usuario editar una página existente (Aleatorio)', () => { 
        const newPageTitle = faker.lorem.sentence();  
        const newPageContent = faker.lorem.paragraph(); 
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(newPageTitle, newPageContent);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(newPageTitle); 
    });

    it('EP044 - Debería permitir despublicar una página existente (Aleatorio)', () => {      
    
        // Given El usuario navega a la lista de páginas y selecciona la página para despublicar
        unpublishPage.givenUserIsOnPagesAndSelectsPageToUnpublish(pageTitle);
    
        // When El usuario cambia el estado de la página a borrador
        unpublishPage.whenUserUnpublishesPage();     
    
        // Then El usuario verifica que la página esté en estado de borrador en la lista de páginas
        unpublishPage.thenPageShouldBeInDraftState(pageTitle);
    });

    it('EP045 - Debería sacar error al intentar editar una página con título de más de 255 carácteres (Aleatorio) ', () => {      
        
        let longTitle = faker.lorem.sentence(10);
        while (longTitle.length <= 255) {
            longTitle += ` ${faker.lorem.sentence(1)}`; 
        }
        const newPageContent = faker.lorem.paragraph();

        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(longTitle, newPageContent);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldNotBeVisibleInPageList(longTitle); 
    });

    it('EP046 - Debería permitir al usuario editar una página existente y poner una fecha (A-priori)', () => { 
        
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(aPrioriData[aPrioriRowIndex].title); 
    });

    it('EP047 - No debería permitir al usuario editar una página existente sin el título(Aleatorio)', () => { 
  
        const newPageContent = faker.lorem.paragraph(); 
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
   
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails('', newPageContent);       
     
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(''); 
    });

    it('EP048 - No debería permitir al usuario editar una página existente sin el contenido (Aleatorio)', () => { 
        
        const newPageTitle = faker.lorem.sentence();  
        
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
   
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(newPageTitle, '');       
     
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(newPageTitle); 
    });

    it('EP049 - No debería permitir al usuario editar una página existente sin autor (A-priori)', () => { 
        
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date, false);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldNotBeVisibleInPageList(aPrioriData[aPrioriRowIndex].title); 
    });

    it('EP050 - Debería permitir al usuario editar una página existente y poner una fecha (Pseudo-aletorio)', () => { 
        
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(pseudoData[pseudoRowIndex].title); 
    });

    it('EP051 - No debería permitir al usuario editar una página existente sin autor (Pseudo-aletorio)', () => { 
        
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date, false);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldNotBeVisibleInPageList(pseudoData[pseudoRowIndex].title); 
    });

    it('EP052 - No debería permitir al usuario editar una sin título y sin contenido (Aleatorio)', () => { 
        const newPageTitle = faker.lorem.sentence();  
        const newPageContent = faker.lorem.paragraph(); 
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails('', '');       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(''); 
    });

    it('EP053 - Debería permitir al usuario editar una página existente con un título con carácteres especiales (Aleatorio)', () => { 
        const specialCharacters = '!@#$%^&*)_+}|:<>?];~';
        const length = 50; 

        const newPageTitle = Array.from({ length }, () =>
            faker.helpers.arrayElement(specialCharacters.split(''))
        ).join('');

        const newPageContent = faker.lorem.paragraph(); 
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(newPageTitle, newPageContent);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(newPageTitle); 
    });

    it('EP054 - No debería permitir al usuario editar una página existente con contenido con carácteres especiales(Aleatorio)', () => { 

        const specialCharacters = '!@#$%^&*)_+}|:<>?];~';
        const length = 50; 

        const newPageTitle = faker.lorem.sentence();  
        const newPageContent = Array.from({ length }, () =>
            faker.helpers.arrayElement(specialCharacters.split(''))
        ).join('');
    
        // Given El usuario navega a la lista de páginas y selecciona una página para editar
        editPage.givenUserIsOnPagesAndSelectsPageToEdit(pageTitle); 
    
        // When El usuario edita el título y el contenido de la página
        editPage.whenUserEditsPageDetails(newPageTitle, newPageContent);       
    
        // Then El usuario verifica que la página editada esté en la lista de páginas con el nuevo título
        editPage.thenPageShouldBeUpdatedInPagesList(newPageTitle); 
    });

});