import login from './pages/login';
import { SettingsDeleteContent } from './pages/settings';
import { CreatePost, ViewPosts, ValidatePost } from './pages/post';
import { faker } from '@faker-js/faker'

const settingsDeleteContent = new SettingsDeleteContent();
const createPost = new CreatePost();
const viewPost = new ViewPosts();
const validatePost = new ValidatePost();

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

    afterEach(() => {
        //Eliminar todo el contenido
        cy.wait(1000);
        settingsDeleteContent.givenUserIsInSettings(); 
        settingsDeleteContent.andGivenUserOpensGeneralSection(); 
        settingsDeleteContent.whenUserDeleteAllContent(); 
        settingsDeleteContent.thenSettingsShouldDeleted(); 
    });
   
    it('EP027 - Debería mostrar los posts creados en la lista de posts', () => {
        // Given El usuario navega a la lista de posts
        viewPost.givenUserIsOnPostsList();

        // When El usuario revisa la lista de posts
        viewPost.whenUserViewsPostsList();

        // Then Verifica que el post creado esté visible en la lista
        viewPost.thenPostShouldBeVisibleInList(postTitle);
    });

    it('EP028 - Debería visualizar un post y validar título y contenido', () => {
        // Given El usuario está en la lista de posts
        validatePost.givenUserIsOnPostsList();

        // When El usuario selecciona un post para visualizarlo
        validatePost.whenUserSelectsPostToView(postTitle);

        // Then El contenido del post deberían coincidir con los valores esperados
        validatePost.thenPostContentShouldMatch(postContent);
    });
    
});