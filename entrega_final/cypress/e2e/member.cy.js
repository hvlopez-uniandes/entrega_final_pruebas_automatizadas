import loginPage from './pages/login';
import { CreateMember, EditMember } from './pages/member';
import { faker } from '@faker-js/faker';


const createMember = new CreateMember();
const editMember = new EditMember();
const apiUrl = Cypress.env('API_URL');
const MEMBERS_API_MOCK_PATH = Cypress.env('MEMBERS_API_MOCK_PATH');


describe('Escenarios de pruebas para la funcionalidad miembros - Ghost', () => {

    let aPrioriData = [];
    let aPrioriRowIndex = 0;
    let pseudoData = [];
    let pseudoRowIndex = 0;

    before(() => {
        // Configuración inicial de sesión
        cy.session('user-session', () => {
            loginPage.givenUserIsOnLoginPage(); // Navegar a la página de inicio de sesión
            loginPage.whenUserLogsIn();        // Iniciar sesión
            loginPage.thenUserShouldSeeDashboard(); // Confirmar que el dashboard se cargó
        });

        // Leer datos del archivo CSV (a priori) antes de las pruebas
        cy.fixture('members-a-priori.json').then((members) => {
            aPrioriData = members;
        });
    });

    beforeEach(() => {
        // Restaurar la sesión antes de cada prueba y navegar al dashboard
        cy.session('user-session', () => {
            loginPage.givenUserIsOnLoginPage(); // Navegar a la página de inicio de sesión
            loginPage.whenUserLogsIn();        // Iniciar sesión
            loginPage.thenUserShouldSeeDashboard(); // Confirmar que el dashboard se cargó
        });
        cy.visit(Cypress.env('GHOST_URL') + '/ghost/#/dashboard'); // Navegar al dashboard

        cy.log(aPrioriData);
        console.log(aPrioriData);
        // Seleccionar un índice aleatorio de la lista de datos a priori
        aPrioriRowIndex = Math.floor(Math.random() * aPrioriData.length);

        // Hacer peticion a la API de mockaroo
        cy.request(apiUrl + "/" + MEMBERS_API_MOCK_PATH).then((response) => {
            // Guardar los datos de la API en pseudoData
            pseudoData = response.body;

            // Seleccionar un índice aleatorio de la lista de datos pseudo-aleatorios
            pseudoRowIndex = Math.floor(Math.random() * pseudoData.length);

            console.log(pseudoRowIndex)
            console.log(pseudoData[pseudoRowIndex])


        });

        cy.wait(1000);
    });

    //Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (A priori)
    it('EP031 - Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (A priori)', () => {
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();

        // And El usuario ingresa los detalles del miembro  
        createMember.andUserEntersMemberDetails(aPrioriData[aPrioriRowIndex].memberName, aPrioriData[aPrioriRowIndex].memberEmail);

        // And El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.andUserIsOnMembersPageAndSelectsMemberToEdit(aPrioriData[aPrioriRowIndex].memberName);

        // When El usuario edita el miembro con un email en un formato inválido
        editMember.whenUserEditsMemberDetails(aPrioriData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberName, aPrioriData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].invalidEmail);

        // Then El usuario debería ver un mensaje de error que indica que el email no es válido
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (Pseudo-aletorio)
    it('EP032 - Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (Pseudo-aleatorio)', () => {
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();

        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(pseudoData[pseudoRowIndex].memberName, pseudoData[pseudoRowIndex].memberEmail);

        // And El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.andUserIsOnMembersPageAndSelectsMemberToEdit(pseudoData[pseudoRowIndex].memberName);

        // When El usuario edita el miembro con un email en un formato inválido
        editMember.whenUserEditsMemberDetails(pseudoData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberName, pseudoData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].invalidEmail);

        // Then El usuario debería ver un mensaje de error que indica que el email no es válido
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (Aleatorio)
    it('EP033 - Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (aleatorio)', () => {
        const memberName = faker.person.fullName();
        const memberEmail = faker.internet.email({provider: 'gmail.com', allowSpecialCharacters: false});
        const invalidEmail = faker.string.symbol(10) + faker.internet.emoji() + faker.string.sample(10);

        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();

        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(memberName, memberEmail);

        // And El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.andUserIsOnMembersPageAndSelectsMemberToEdit(memberName);

        // When El usuario edita el miembro con un email en un formato inválido
        editMember.whenUserEditsMemberDetails(memberName, invalidEmail);

        // Then El usuario debería ver un mensaje de error que indica que el email no es válido
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });


    //Debería permitir CREAR exitosamente un nuevo miembro con un email y nombre válidos (Pseudo-aletorio)
    it('EP034 - Debería permitir CREAR exitosamente un nuevo miembro con un email y nombre válidos (Pseudo-aletorio)', () => {
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();

        // When El usuario ingresa los detalles del miembro con un email y nombre válidos
        createMember.whenUserEntersMemberDetails(pseudoData[pseudoRowIndex].memberName, pseudoData[pseudoRowIndex].memberEmail);

        // Then El usuario verifica que el miembro esté visible en la lista de miembros
        createMember.thenMemberShouldBeVisibleInMembersList(pseudoData[pseudoRowIndex].memberName);
    });
    //Debería permitir CREAR exitosamente un nuevo miembro con un email y nombre válidos (Aletorio)
    it('EP035 - Debería permitir CREAR exitosamente un nuevo miembro con un email y nombre válidos (Aletorio)', () => {
        const memberName = faker.person.fullName();
        const memberEmail = faker.internet.email({provider: 'gmail.com', allowSpecialCharacters: false});

        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();

        // When El usuario ingresa los detalles del miembro con un email y nombre válidos
        createMember.whenUserEntersMemberDetails(memberName, memberEmail);

        // Then El usuario verifica que el miembro esté visible en la lista de miembros
        createMember.thenMemberShouldBeVisibleInMembersList(memberName);
    });

    //Debería mostrar un error al intentar CREAR un miembro con un email vacío (A priori)
    it('EP036 - Debería mostrar un error al intentar CREAR un miembro con un email vacío (A priori)', () => {
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();

        // When El usuario ingresa los detalles del miembro con un email vacío
        createMember.whenUserEntersMemberDetails(aPrioriData[aPrioriRowIndex].memberName, aPrioriData[aPrioriRowIndex].emptyEmail);

        // Then El usuario debería ver un mensaje de error que indica que debe ingresar un email
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería mostrar un error al intentar CREAR un miembro con un email vacío (Pseudo-aleatorio)
    it('EP037 - Debería mostrar un error al intentar CREAR un miembro con un email vacío (Pseudo-aleatorio)', () => {
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro 
        createMember.andUserStartsCreatingNewMember();

        // When El usuario ingresa los detalles del miembro con un email vacío
        createMember.whenUserEntersMemberDetails(pseudoData[pseudoRowIndex].memberName, pseudoData[pseudoRowIndex].emptyEmail);

        // Then El usuario debería ver un mensaje de error que indica que debe ingresar un email
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería mostrar un error al intentar CREAR un miembro con un email vacío (Aleatorio)
    it('EP038 - Debería mostrar un error al intentar CREAR un miembro con un email vacío (Aleatorio)', () => {
        const memberName = faker.person.fullName();
        const emptyEmail = "";
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();

        // When El usuario ingresa los detalles del miembro con un email vacío
        createMember.whenUserEntersMemberDetails(memberName, emptyEmail);

        // Then El usuario debería ver un mensaje de error que indica que debe ingresar un email
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });

});