import login from './pages/login';
import { CreateTag, EditTag, DeleteTag } from './pages/tags';
import { faker } from '@faker-js/faker'

const createTag = new CreateTag();
const editTag = new EditTag();
const deleteTag = new DeleteTag();
const tagName = faker.commerce.productName();         
const tagDescription = faker.lorem.sentence();
const newTagName = faker.commerce.productName(); 
const newTagDescription = faker.lorem.sentence();       

describe('Escenarios de pruebas para la funcionalidad tags - Ghost', () => {
    Cypress.on('uncaught:exception', (err) => {
        if (err.message.includes('TransitionAborted')) {
            return false; 
        }
    });

    beforeEach(() => {
        // Restaurar la sesión antes de cada prueba y navegar alZ dashboard
        cy.session('user-session', () => {
            login.givenUserIsOnLoginPage(); 
            login.whenUserLogsIn();       
            login.thenUserShouldSeeDashboard(); 
        });
        cy.visit(Cypress.env('GHOST_URL') + '/ghost/#/dashboard');
        cy.wait(1000);

    });

    it('EP094 - Debería permitir crear y visualizar un nuevo tag (Aleatorio)', () => {

        // Given El usuario navega a la página de tags
        createTag.givenUserIsOnTags();

        // and El usuario comienza a crear un nuevo tag
        createTag.andGivenUserStartsCreatingNewTag();

        // When El usuario ingresa los detalles del tag
        createTag.whenUserEntersTagDetails(tagName, tagDescription);

        // Then El usuario valida que el tag esté visible en la lista de tags
        createTag.thenTagShouldBeVisibleInTagsList(tagName);
    });

    it('EP095 - Debería permitir editar un tag existente (Aleatorio)', () => {

        // Given El usuario está en la página de tags y selecciona el tag a editar
        editTag.givenUserIsOnTagsPageAndSelectsTagToEdit(tagName);

        // When El usuario modifica el nombre y descripción del tag
        editTag.whenUserEditsTagDetails(newTagName, newTagDescription);

        // Then El usuario verifica que el tag se haya actualizado en la lista de tags
        editTag.thenTagShouldBeUpdatedInTagsList(newTagName);
    });

    it('EP096 - Debería permitir eliminar un tag y verificar que ya no esté en la lista (Aleatorio)', () => {

        // Given El usuario está en la página de tags y selecciona el tag a eliminar
        deleteTag.givenUserIsOnTagsPageAndSelectsTagToDelete(newTagName);

        // When El usuario elimina el tag
        deleteTag.whenUserDeletesTag();

        // Then El usuario verifica que el tag ya no esté en la lista de tags
        deleteTag.thenTagShouldNotBeVisibleInTagsList(newTagName);
    });
});