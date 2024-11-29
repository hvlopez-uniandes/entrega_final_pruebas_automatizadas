import login from './pages/login';
import { SettingsDeleteContent } from './pages/settings';
import { CreatePost, EditPost, UnpublishPost } from './pages/post';
import { faker } from '@faker-js/faker'

const settingsDeleteContent = new SettingsDeleteContent();
const createPost = new CreatePost();
const editPost = new EditPost();
const unpublishPost = new UnpublishPost();
const apiUrl = Cypress.env('API_URL')+"/post-pseudo-aleatorio.json?key=aff162e0";

let postTitle = '';

describe('Escenarios de pruebas para la funcionalidad post - Ghost', () => {
    let aPrioriData = [];
    let aPrioriRowIndex = 0;
    let pseudoData = [];
    let pseudoRowIndex = 0;

    before(() => {
        cy.fixture('post-a-priori.json').then((page) => {
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

        postTitle = faker.lorem.sentence();         
        const postContent = faker.lorem.paragraph();
        
        // Crear post
        createPost.givenUserIsOnPostCreation();
        createPost.whenUserEntersPostDetails(postTitle, postContent);
        createPost.thenPostShouldBeVisibleInPostsList(postTitle);

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


    it('EP007 - Debería permitir al usuario editar una post existente con un post con extracto (Aleatorio)', () => { 

        const newPostTitle = faker.lorem.sentence();         
        const newPostContent = faker.lorem.paragraph();
        const newPostDate = faker.date.past(1).toISOString().split('T')[0];
        const newPostExcerpt = faker.lorem.sentence();
        // Given El usuario está en la lista de posts
        editPost.givenUserIsOnPostsList();

        // and El usuario selecciona un post para editar
        editPost.andGivenUserSelectsPostToEdit(postTitle);
    
        // When El usuario edita el título y el contenido de la post
        editPost.whenUserEditsPostDetails(newPostTitle, newPostContent, newPostDate, newPostExcerpt);       
    
        // Then El usuario verifica que la post editada esté en la lista de posts con el nuevo título
        editPost.thenPostShouldBeUpdated(newPostTitle); 
    });

    it('EP008 - Debería permitir al usuario editar una post existente con un post con extracto (A-priori)', () => { 
        
        // Given El usuario está en la lista de posts
        editPost.givenUserIsOnPostsList();

        // and El usuario selecciona un post para editar
        editPost.andGivenUserSelectsPostToEdit(postTitle);
    
        // When El usuario edita el título y el contenido de la post
        editPost.whenUserEditsPostDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date, aPrioriData[aPrioriRowIndex].extract);       
    
        // Then El usuario verifica que la post editada esté en la lista de posts con el nuevo título
        editPost.thenPostShouldBeUpdated(aPrioriData[aPrioriRowIndex].title); 
    });

    it('EP009 - Debería permitir al usuario editar una post existente con un post con extracto (Pseudo-aleatorio)', () => { 
        
        // Given El usuario está en la lista de posts
        editPost.givenUserIsOnPostsList();

        // and El usuario selecciona un post para editar
        editPost.andGivenUserSelectsPostToEdit(postTitle);
    
        // When El usuario edita el título y el contenido de la post
        editPost.whenUserEditsPostDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date, pseudoData[pseudoRowIndex].extract);       
    
        // Then El usuario verifica que la post editada esté en la lista de posts con el nuevo título
        editPost.thenPostShouldBeUpdated(pseudoData[pseudoRowIndex].title); 
    });

    it('EP010 - Debería permitir al usuario editar una post existente y poner una fecha (Aleatorio)', () => { 
        
        const newPostTitle = faker.lorem.sentence();         
        const newPostContent = faker.lorem.paragraph();
        const newPostDate = faker.date.past(1).toISOString().split('T')[0];
        const newPostAccessOptions = [
            { value: 'Public'},
            { value: 'Members only'},
            { value: 'Paid-members only'},
            { value: 'Specific tier(s)'}
        ];
        // Given El usuario está en la lista de posts
        editPost.givenUserIsOnPostsList();

        // and El usuario selecciona un post para editar
        editPost.andGivenUserSelectsPostToEdit(postTitle);
    
        // When El usuario edita el título y el contenido de la post
        editPost.whenUserEditsPostDetails(newPostTitle, newPostContent, newPostDate, '', newPostAccessOptions);       
    
        // Then El usuario verifica que la post editada esté en la lista de posts con el nuevo título
        editPost.thenPostShouldBeUpdated(newPostTitle); 
    });

    it('EP011 - Debería permitir al usuario editar una post existente y poner una fecha (A-priori)', () => { 
        
        const newPostAccessOptions = [
            { value: aPrioriData[aPrioriRowIndex].access}
        ];
        // Given El usuario está en la lista de posts
        editPost.givenUserIsOnPostsList();

        // and El usuario selecciona un post para editar
        editPost.andGivenUserSelectsPostToEdit(postTitle);
    
        // When El usuario edita el título y el contenido de la post
        editPost.whenUserEditsPostDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date, '', newPostAccessOptions);       
    
        // Then El usuario verifica que la post editada esté en la lista de posts con el nuevo título
        editPost.thenPostShouldBeUpdated(aPrioriData[aPrioriRowIndex].title); 
    });

    it('EP012 - Debería permitir al usuario editar una post existente y poner una fecha (Pseudo-aleatorio)', () => { 

        const newPostAccessOptions = [
            { value: pseudoData[pseudoRowIndex].access}
        ];
        
        // Given El usuario está en la lista de posts
        editPost.givenUserIsOnPostsList();

        // and El usuario selecciona un post para editar
        editPost.andGivenUserSelectsPostToEdit(postTitle);
    
        // When El usuario edita el título y el contenido de la post
        editPost.whenUserEditsPostDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date, '', newPostAccessOptions);       
    
        // Then El usuario verifica que la post editada esté en la lista de posts con el nuevo título
        editPost.thenPostShouldBeUpdated(pseudoData[pseudoRowIndex].title); 
    });


    
});