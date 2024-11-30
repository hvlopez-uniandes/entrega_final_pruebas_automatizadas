import login from './pages/login';
import { SettingsDeleteContent } from './pages/settings';
import { CreatePost, DeletePost } from './pages/post';
import { faker } from '@faker-js/faker'

const settingsDeleteContent = new SettingsDeleteContent();
const createPost = new CreatePost();
const deletePost = new DeletePost();

const postTitle = faker.lorem.sentence();
const postContent = faker.lorem.paragraph();


describe('Escenarios de pruebas para la funcionalidad post - Ghost', () => {
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
            login.givenUserIsOnLoginPage(); 
            login.whenUserLogsIn();       
            login.thenUserShouldSeeDashboard(); 
        });
        cy.visit(Cypress.env('GHOST_URL') + '/ghost/#/dashboard');
        cy.wait(1000);
        
        // Crear post
        createPost.givenUserIsOnPostCreation();
        createPost.whenUserEntersPostDetails(postTitle, postContent);
        createPost.thenPostShouldBeVisibleInPostsList(postTitle);

        aPrioriRowIndex = Math.floor(Math.random() * aPrioriData.length);

    });


    it('EP029 - Debería permitir al usuario eliminar un post existente', () => {
     
        // Given El usuario está en la lista de posts
        deletePost.givenUserIsOnPostsList();

        // When El usuario selecciona un post para eliminar
        deletePost.andGivenUserSelectsPostToDelete(postTitle);

        // When El usuario confirma la eliminación del post
        deletePost.whenUserConfirmsDeletion();

        // Then El post no debería estar visible en la lista de posts
        deletePost.thenPostShouldNotBeVisibleInPostsList(postTitle);
    });
    
});