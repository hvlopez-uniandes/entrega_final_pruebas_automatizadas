import login from './pages/login';
import { CreateTag, DeleteTag } from './pages/tag';
import { faker } from '@faker-js/faker'

const createTag = new CreateTag();
const deleteTag = new DeleteTag();
const tagName = faker.commerce.productName();         
const tagDescription = faker.lorem.sentence();
       

describe('Escenarios de pruebas para la funcionalidad tags - Ghost', () => {
    Cypress.on('uncaughtexception', (err) => {
        if (err.message.includes('TransitionAborted')) {
            return false; 
        }
    });

    it('EP008 - Debería permitir crear y visualizar un nuevo tag', () => {
        // Precondición inicio de sesión para ejecutar el escenario de prueba
        login.givenUserIsOnLoginPage();
        login.whenUserLogsIn();
        login.thenUserShouldSeeDashboard();

        // Given El usuario navega a la página de tags
        createTag.givenUserIsOnTags();

        // When El usuario comienza a crear un nuevo tag
        createTag.andGivenUserStartsCreatingNewTag();

        // When El usuario ingresa los detalles del tag
        createTag.whenUserEntersTagDetails(tagName, tagDescription);

        // Then El usuario valida que el tag esté visible en la lista de tags
        createTag.thenTagShouldBeVisibleInTagsList(tagName);
    });

    it('EP010 - Debería permitir eliminar un tag y verificar que ya no esté en la lista', () => {
        // Precondición inicio de sesión para ejecutar el escenario de prueba
        login.givenUserIsOnLoginPage();
        login.whenUserLogsIn();
        login.thenUserShouldSeeDashboard();

        // Given El usuario está en la página de tags y selecciona el tag a eliminar
        deleteTag.givenUserIsOnTagsPageAndSelectsTagToDelete(tagName);

        // When El usuario elimina el tag
        deleteTag.whenUserDeletesTag();

        // Then El usuario verifica que el tag ya no esté en la lista de tags
        deleteTag.thenTagShouldNotBeVisibleInTagsList(tagName);
    });
});