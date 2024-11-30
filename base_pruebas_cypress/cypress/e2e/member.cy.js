import loginPage from './pages/login';
import { CreateMember, ViewMembers, EditMember, DeleteMember } from './pages/member';
import { faker } from '@faker-js/faker';

const createMember = new CreateMember();

const deleteMember = new DeleteMember();
const memberName = faker.person.fullName();
const memberEmail = faker.internet.email();

describe('Escenarios de pruebas para la funcionalidad miembros - Ghost', () => {

    it('EP017 - Debería permitir crear y visualizar un nuevo miembro', () => {
        // Precondición inicio de sesión para ejecutar el escenario de prueba
        loginPage.givenUserIsOnLoginPage();
        loginPage.whenUserLogsIn();
        loginPage.thenUserShouldSeeDashboard();

        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // and El usuario comienza a crear un nuevo miembro
        createMember.andGivenUserStartsCreatingNewMember();

        // Given El usuario ingresa los detalles del miembro
        createMember.whenUserEntersMemberDetails(memberName, memberEmail);

        // Then El usuario verifica que el miembro esté visible en la lista de miembros
        createMember.thenMemberShouldBeVisibleInMembersList(memberName);
    });

    it('EP020 - Debería permitir eliminar un miembro existente', () => {
        // Precondición inicio de sesión para ejecutar el escenario de prueba
        loginPage.givenUserIsOnLoginPage();            
        loginPage.whenUserLogsIn();                    
        loginPage.thenUserShouldSeeDashboard();       
    
        // Given El usuario navega a la lista de miembros y selecciona un miembro específico para eliminar
        deleteMember.givenUserIsOnMembersPageAndSelectsMemberToDelete(memberName); 
    
        // When El usuario confirma la eliminación del miembro
        deleteMember.whenUserDeletesMember();        
    
        // Then El usuario verifica que el miembro eliminado ya no esté en la lista de miembros
        deleteMember.thenMemberShouldNotBeVisibleInMembersList(memberName);
    });
});