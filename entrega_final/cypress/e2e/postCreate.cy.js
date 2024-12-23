import login from './pages/login';
import { CreatePost } from './pages/post';
import { faker } from '@faker-js/faker';
import { SettingsDeleteContent } from './pages/settings';

const createPost = new CreatePost();
const settingsDeleteContent = new SettingsDeleteContent();
const apiUrl = Cypress.env('API_URL') + "/post-pseudo-aleatorio.json?key=aff162e0";
function mezclar(array) {
    let indiceActual = array.length,
      indiceAleatorio;
  
    while (indiceActual !== 0) {
      indiceAleatorio = Math.floor(Math.random() * indiceActual);
      indiceActual--;
  
      [array[indiceActual], array[indiceAleatorio]] = [
        array[indiceAleatorio],
        array[indiceActual],
      ];
    }
  
    return array;
  }
describe('Escenarios de pruebas para la funcionalidad post - Ghost', () => {
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
        cy.fixture('post-a-priori.json').then((page) => {
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



    it('EP001 - Debería permitir crear un post con extracto (Aleatorio)', () => {

        const postTitle = faker.lorem.sentence();
        const postContent = faker.lorem.paragraph();
        const postDate = faker.date.past(1).toISOString().split('T')[0];
        const postExcerpt = faker.lorem.sentence();

        // Given El usuario navega a la sección de páginas
        createPost.givenUserIsOnPostCreation();

        // When El usuario ingresa los detalles de la página
        createPost.whenUserEntersPostDetails(postTitle, postContent, postDate, postExcerpt);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPost.thenPostShouldBeVisibleInPostsList(postTitle);
    });

    it('EP002 - Debería permitir crear un post con extracto (A-priori)', () => {

        // Given El usuario navega a la sección de páginas
        createPost.givenUserIsOnPostCreation();

        // When El usuario ingresa los detalles de la página
        createPost.whenUserEntersPostDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date, aPrioriData[aPrioriRowIndex].extract);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPost.thenPostShouldBeVisibleInPostsList(aPrioriData[aPrioriRowIndex].title);
    });

    it('EP003 - Debería permitir crear un post con extracto (Pseudo-aleatorio)', () => {

        // Given El usuario navega a la sección de páginas
        createPost.givenUserIsOnPostCreation();

        // When El usuario ingresa los detalles de la página
        createPost.whenUserEntersPostDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date, pseudoData[pseudoRowIndex].extract);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPost.thenPostShouldBeVisibleInPostsList(pseudoData[pseudoRowIndex].title);
    });

    it('EP004 - Debería permitir crear un post con tipo de acceso de post (Aleatorio)', () => {

        const postTitle = faker.lorem.sentence();
        const postContent = faker.lorem.paragraph();
        const postDate = faker.date.past(1).toISOString().split('T')[0];
        const postAccessOptions = [
            { value: 'Public' },
            { value: 'Members only' },
            { value: 'Paid-members only' },
            { value: 'Specific tier(s)' }
        ];

        // Given El usuario navega a la sección de páginas
        createPost.givenUserIsOnPostCreation();

        // When El usuario ingresa los detalles de la página
        createPost.whenUserEntersPostDetails(postTitle, postContent, postDate, '', postAccessOptions);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPost.thenPostShouldBeVisibleInPostsList(postTitle);
    });

    it('EP005 - Debería permitir crear un post con tipo de acceso de post (A-priori)', () => {

        const postAccessOptions = [
            { value: aPrioriData[aPrioriRowIndex].access }
        ];

        // Given El usuario navega a la sección de páginas
        createPost.givenUserIsOnPostCreation();

        // When El usuario ingresa los detalles de la página
        createPost.whenUserEntersPostDetails(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description, aPrioriData[aPrioriRowIndex].date, '', postAccessOptions);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPost.thenPostShouldBeVisibleInPostsList(aPrioriData[aPrioriRowIndex].title);
    });

    it('EP006 - Debería permitir crear un post con tipo de acceso de post (Pseudo-aleatorio)', () => {

        const postAccessOptions = [
            { value: pseudoData[pseudoRowIndex].access }
        ];

        // Given El usuario navega a la sección de páginas
        createPost.givenUserIsOnPostCreation();

        // When El usuario ingresa los detalles de la página
        createPost.whenUserEntersPostDetails(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description, pseudoData[pseudoRowIndex].date, '', postAccessOptions);

        // Then El usuario valida que la página esté visible en la lista de páginas
        createPost.thenPostShouldBeVisibleInPostsList(pseudoData[pseudoRowIndex].title);
    });

    it('EP025 - Debería permitir crear un post con un link de youtube (Pseudo-aleatorio)', () => {
        // Given
        createPost.givenUserIsOnPostCreation();
    
        // When
        createPost.whenUserCreatesPostWithYoutubeLink(`Post de ${url.title}`, url.url);
    
        // Then
        createPost.thenPostShouldBeVisibleInPostsList(`Post de ${url.title}`);
    });
    
    it('EP026 - Debería permitir crear un post con un link de youtube (Aleatorio)', () => {
        // Given
        createPost.givenUserIsOnPostCreation();
    
        // When
        const acciones = [
            () => createPost.whenUserSetsPostTitle(`Post de ${url.title}`),
            () => createPost.whenUserAddsYoutubeLink(url.url),
        ];
        createPost.randomizeActions(acciones).forEach((accion) => accion());
        createPost.whenUserPublishesThePost();
    
        // Then
        createPost.thenPostShouldBeVisibleInPostsList(`Post de ${url.title}`);
    });
    
    it('EP027 - Debería permitir crear un post con un link de youtube (A-priori)', () => {
        // Given
        createPost.givenUserIsOnPostCreation();
    
        // When
        createPost.whenUserCreatesPostWithoutMedia(`Post de ${url.title}`);
    
        // Then
        createPost.thenPostShouldBeVisibleInPostsList(`Post de ${url.title}`);
    });
    
    it('EP028 - Debería permitir crear un post con un link de spotify (A-priori)', () => {
        // Given
        createPost.givenUserIsOnPostCreation();
    
        // When
        createPost.whenUserCreatesPostWithSpotifyLink(`Post de ${url.title}`, url.url);
    
        // Then
        createPost.thenPostShouldBeVisibleInPostsList(`Post de ${url.title}`);
    });
    
    it('EP029 - Debería permitir crear un post con un link de spotify (Pseudo-aleatorio)', () => {
        // Given
        createPost.givenUserIsOnPostCreation();
    
        // When
        createPost.whenUserCreatesPostWithSpotifyLink(
            `Post of ${track.name} by ${track.artist} (${track.genre})`,
            track.url
        );
    
        // Then
        createPost.thenPostShouldBeVisibleInPostsList(
            `Post of ${track.name} by ${track.artist} (${track.genre})`
        );
    });
    
    it('EP030 - Debería permitir crear un post con un link de spotify (Aleatorio)', () => {
        // Given
        createPost.givenUserIsOnPostCreation();
    
        // When
        const acciones = [
            () => createPost.whenUserSetsPostTitle(`Post of ${track.name} by ${track.artist} (${track.genre})`),
            () => createPost.whenUserAddsSpotifyLink(track.url),
        ];
        createPost.randomizeActions(acciones).forEach((accion) => accion());
        createPost.whenUserPublishesThePost();
    
        // Then
        createPost.thenPostShouldBeVisibleInPostsList(
            `Post of ${track.name} by ${track.artist} (${track.genre})`
        );
    });
    
    

});