import login from './pages/login';
import { CreatePost, EditPost, DeletePost } from './pages/post';
import { faker } from '@faker-js/faker'


const createPost = new CreatePost();
const editPost = new EditPost();
const deletePost = new DeletePost();

const postTitle = faker.lorem.sentence();
const postContent = faker.lorem.paragraph();
const newTitle = faker.lorem.sentence();
const newContent = faker.lorem.paragraph();

describe('Escenarios de pruebas para la funcionalidad post - Ghost Version Base', () => {

    it('EP002 - Debería permitir crear un post con un título y descripción aleatoria', () => {
        // Precondición inicio de sesión para ejecutar el escenario de prueba
        login.givenUserIsOnLoginPage();
        login.whenUserLogsIn();
        login.thenUserShouldSeeDashboard();

        // Given El usuario está en la página de creación de posts
        createPost.givenUserIsOnPostCreation();

        // When El usuario introduce el título y el contenido del post
        createPost.whenUserEntersPostDetails(postTitle, postContent);

        // Then El post debería estar visible en la lista de posts
        createPost.thenPostShouldBeVisibleInPostsList(postTitle);
    });
    
    it('EP005 - Debería permitir al usuario editar un post existente', () => {
        // Precondición inicio de sesión para ejecutar el escenario de prueba
        login.givenUserIsOnLoginPage();
        login.whenUserLogsIn();
        login.thenUserShouldSeeDashboard();

        // Given El usuario está en la lista de posts
        editPost.givenUserIsOnPostsList();

        // When El usuario selecciona un post para editar
        editPost.andGivenUserSelectsPostToEdit(postTitle);

        // When El usuario edita el título y el contenido del post
        editPost.whenUserEditsPostDetails(newTitle, newContent);

        // Then El post debería estar visible en la lista de posts con el nuevo título
        editPost.thenPostShouldBeUpdated(newTitle);
    });
    
    it('EP007 - Debería permitir al usuario eliminar un post existente', () => {
        // Precondición inicio de sesión para ejecutar el escenario de prueba
        login.givenUserIsOnLoginPage();
        login.whenUserLogsIn();
        login.thenUserShouldSeeDashboard();

        // Given El usuario está en la lista de posts
        deletePost.givenUserIsOnPostsList();

        // When El usuario selecciona un post para eliminar
        deletePost.whenUserSelectsPostToDelete(newTitle);

        // When El usuario confirma la eliminación del post
        deletePost.thenUserConfirmsDeletion();

        // Then El post no debería estar visible en la lista de posts
        deletePost.andThenPostShouldNotBeVisibleInPostsList(newTitle);
    });
    
    
});