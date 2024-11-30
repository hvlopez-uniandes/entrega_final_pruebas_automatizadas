import loginPage from './pages/login';
import { CreateMember, ViewMembers, EditMember, DeleteMember } from './pages/member';
import { faker } from '@faker-js/faker';


const createMember = new CreateMember();
const viewMembers = new ViewMembers();
const editMember = new EditMember();
const deleteMember = new DeleteMember();
const memberName = faker.person.fullName();
const memberEmail = faker.internet.email();
const newMemberName = faker.person.fullName(); 
const newMemberEmail = faker.internet.email(); 
const apiUrl = Cypress.env('MEMBERS_API_URL');
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



    
    it('EP058 - Debería permitir crear y visualizar un nuevo miembro (A priori)', () => {
        // Precondición inicio de sesión para ejecutar el escenario de prueba
        // loginPage.givenUserIsOnLoginPage();
        // loginPage.whenUserLogsIn();
        // loginPage.thenUserShouldSeeDashboard();

        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // When El usuario comienza a crear un nuevo miembro
        createMember.andGivenUserStartsCreatingNewMember();

        // And El usuario ingresa los detalles del miembro
        createMember.whenUserEntersMemberDetails(memberName, memberEmail);

        // Then El usuario verifica que el miembro esté visible en la lista de miembros
        createMember.thenMemberShouldBeVisibleInMembersList(memberName);
    });

    it('EP059 - Debería permitir ver la lista de miembros', () => {
        // Precondición inicio de sesión para ejecutar el escenario de prueba
        // loginPage.givenUserIsOnLoginPage();        
        // loginPage.whenUserLogsIn();                    
        // loginPage.thenUserShouldSeeDashboard();   
    
        // Given El usuario navega a la sección de miembros
        viewMembers.givenUserIsOnMembersPage();  
    
        // When El usuario visualiza la lista de miembros
        viewMembers.whenUserViewsMembersList();   
    
        // Then El usuario verifica que haya miembros en la lista
        viewMembers.thenMembersListShouldBeVisible();  
    });

    it('EP060 - Debería permitir al usuario editar un miembro existente (A priori)', () => {

        // Given El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.givenUserIsOnMembersPageAndSelectsMemberToEdit(memberName);
    
        // When El usuario edita el nombre y el correo del miembro
        editMember.whenUserEditsMemberDetails(newMemberName, newMemberEmail);  
    
        // Then El usuario verifica que el miembro editado esté en la lista de miembros con el nuevo nombre
        editMember.thenMemberShouldBeUpdatedInMembersList(newMemberName); 
    });

    it('EP061 - Debería permitir eliminar un miembro existente', () => {
        // Precondición inicio de sesión para ejecutar el escenario de prueba
        // loginPage.givenUserIsOnLoginPage();            
        // loginPage.whenUserLogsIn();                    
        // loginPage.thenUserShouldSeeDashboard();       
    
        // Given El usuario navega a la lista de miembros y selecciona un miembro específico para eliminar
        deleteMember.givenUserIsOnMembersPageAndSelectsMemberToDelete(newMemberName); 
    
        // When El usuario confirma la eliminación del miembro
        deleteMember.whenUserDeletesMember();        
    
        // Then El usuario verifica que el miembro eliminado ya no esté en la lista de miembros
        deleteMember.thenMemberShouldNotBeVisibleInMembersList(newMemberName);
    });

    //Debería mostrar un error al intentar CREAR un miembro con un email duplicado (A priori)
    it('EP062 - Debería mostrar un error al intentar CREAR un miembro con un email duplicado (A priori)', () => {    
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro
        createMember.andUserEntersMemberDetails(aPrioriData[aPrioriRowIndex].memberName, aPrioriData[aPrioriRowIndex].memberEmail);   
        
        // And El usuario vuelve a la seccion de miembros
        createMember.andUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
        
        // When El usuario ingresa los detalles del miembro con un email duplicado
        createMember.whenUserEntersMemberDetails(aPrioriData[aPrioriRowIndex].memberName, aPrioriData[aPrioriRowIndex].memberEmail);
    
        // Then El usuario debería ver un mensaje de error que indica que el email ya existe
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });

    //Debería mostrar un error al intentar CREAR un miembro con un email duplicado (Pseudo-aleatorio)
    it('EP063 - Debería mostrar un error al intentar CREAR un miembro con un email duplicado (Pseudo-aletorio)', () => {    
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(pseudoData[pseudoRowIndex].memberName, pseudoData[pseudoRowIndex].memberEmail);   
        
        // And El usuario vuelve a la seccion de miembros
        createMember.andUserIsOnMembersPage();
        
        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();

        // When El usuario ingresa los detalles del miembro con un email duplicado
        createMember.whenUserEntersMemberDetails(pseudoData[pseudoRowIndex].memberName, pseudoData[pseudoRowIndex].memberEmail);
    
        // Then El usuario debería ver un mensaje de error que indica que el email ya existe
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería rechazar la creación de un miembro con un email duplicado. (Aleatorio)
    it('EP064 - Debería mostrar un error al intentar CREAR un miembro con un email duplicado (Aleatorio)', () => { 
        const memberName = faker.person.fullName();
        const memberEmail = faker.internet.email();

        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(memberName, memberEmail);   
        
        // And El usuario vuelve a la seccion de miembros
        createMember.andUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();

        // When El usuario ingresa los detalles del miembro con un email duplicado
        createMember.whenUserEntersMemberDetails(memberName, memberEmail);
    
        // Then El usuario debería ver un mensaje de error que indica que el email ya existe
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });


    //Debería mostrar un error al intentar EDITAR un miembro con un email duplicado (A priori)
    it('EP065 - Debería mostrar un error al intentar EDITAR un miembro con un email duplicado (A priori)', () => {    
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(aPrioriData[aPrioriRowIndex].memberName, aPrioriData[aPrioriRowIndex].memberEmail); 
        
        // And El usuario vuelve a la seccion de miembros
        createMember.andUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(aPrioriData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberName, aPrioriData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberEmail); 
                
        // And El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.andUserIsOnMembersPageAndSelectsMemberToEdit(aPrioriData[aPrioriRowIndex].memberName);

        // When El usuario edita el miembro con un email duplicado
        editMember.whenUserEditsMemberDetails(aPrioriData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberName, aPrioriData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberEmail);  
       
        // Then El usuario debería ver un mensaje de error que indica que el email ya existe
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });

    //Debería mostrar un error al intentar EDITAR un miembro con un email duplicado (Pseudo-aleatorio)
    it('EP066 - Debería mostrar un error al intentar EDITAR un miembro con un email duplicado (Pseudo-aleatorio)', () => {    
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(pseudoData[pseudoRowIndex].memberName, pseudoData[pseudoRowIndex].memberEmail); 
        
        // And El usuario vuelve a la seccion de miembros
        createMember.andUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(pseudoData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberName, pseudoData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberEmail); 
                
        // And El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.andUserIsOnMembersPageAndSelectsMemberToEdit(pseudoData[pseudoRowIndex].memberName);

        // When El usuario edita el miembro con un email duplicado
        editMember.whenUserEditsMemberDetails(pseudoData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberName, pseudoData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberEmail);  
       
        // Then El usuario debería ver un mensaje de error que indica que el email ya existe
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería mostrar un error al intentar EDITAR un miembro con un email duplicado (Aleatorio)
    it('EP067 - Debería mostrar un error al intentar EDITAR un miembro con un email duplicado (aleatorio)', () => {   
        const member1Name = faker.person.fullName();
        const member1Email = faker.internet.email(); 
        const member2Name = faker.person.fullName();
        const member2Email = faker.internet.email();
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(member1Name, member1Email); 
        
        // And El usuario vuelve a la seccion de miembros
        createMember.andUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(member2Name, member2Email); 
                
        // And El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.andUserIsOnMembersPageAndSelectsMemberToEdit(member1Name);

        // When El usuario edita el miembro con un email duplicado
        editMember.whenUserEditsMemberDetails(member2Name, member2Email);  
       
        // Then El usuario debería ver un mensaje de error que indica que el email ya existe
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });


    //Debería mostrar un error al intentar crear un miembro con un email excesivamente largo de 200 caracteres (A priori)
    it('EP068 - Debería mostrar un error al intentar CREAR un miembro con un email excesivamente largo de 200 caracteres (A priori)', () => {    
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // When El usuario ingresa los detalles del miembro con un email excesivamente largo de 200 caracteres
        createMember.whenUserEntersMemberDetails(aPrioriData[aPrioriRowIndex].memberName, aPrioriData[aPrioriRowIndex].memberLongEmail);  
    
        // Then El usuario debería ver un mensaje de error que indica que el email excede la longitud máxima permitida
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería mostrar un error al intentar crear un miembro con un email excesivamente largo de 200 caracteres (Pseudo-aletorio)
    it('EP069 - Debería mostrar un error al intentar CREAR un miembro con un email excesivamente largo de 200 caracteres (Pseudo-aletorio)', () => {    
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // When El usuario ingresa los detalles del miembro con un email excesivamente largo de 200 caracteres
        createMember.whenUserEntersMemberDetails(pseudoData[pseudoRowIndex].memberName, pseudoData[pseudoRowIndex].memberLongEmail);  
    
        // Then El usuario debería ver un mensaje de error que indica que el email excede la longitud máxima permitida
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería mostrar un error al intentar crear un miembro con un email excesivamente largo de 200 caracteres (Aleatorio)  
    it('EP070 - Debería mostrar un error al intentar CREAR un miembro con un email excesivamente largo de 200 caracteres (Aleatorio)', () => {
        const memberName = faker.person.fullName();
        const memberEmail = faker.string.alphanumeric(100) + '@' + faker.string.alphanumeric(95) + '.com';
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // When El usuario ingresa los detalles del miembro con un email excesivamente largo de 200 caracteres
        createMember.whenUserEntersMemberDetails(memberName, memberEmail);  
    
        // Then El usuario debería ver un mensaje de error que indica que el email excede la longitud máxima permitida
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });



    //Debería mostrar un error al intentar CREAR un miembro con un email vacío (A priori)
    it('EP071 - Debería mostrar un error al intentar CREAR un miembro con un email vacío (A priori)', () => {    
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
    it('EP072 - Debería mostrar un error al intentar CREAR un miembro con un email vacío (Pseudo-aleatorio)', () => {    
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
    it('EP073 - Debería mostrar un error al intentar CREAR un miembro con un email vacío (Aleatorio)', () => {    
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



    //Debería mostrar un error al intentar EDITAR un miembro con un email vacío (A priori)
    it('EP074 - Debería mostrar un error al intentar EDITAR un miembro con un email vacío (A priori)', () => {    
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(aPrioriData[aPrioriRowIndex].memberName, aPrioriData[aPrioriRowIndex].memberEmail); 
                
        // And El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.andUserIsOnMembersPageAndSelectsMemberToEdit(aPrioriData[aPrioriRowIndex].memberName);

        // When El usuario edita el miembro con un email vacío
        editMember.whenUserEditsMemberDetails(aPrioriData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberName, aPrioriData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].emptyEmail);  
       
        // Then El usuario debería ver un mensaje de error que indica que debe ingresar un email
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería mostrar un error al intentar EDITAR un miembro con un email vacío (Pseudo-aleatorio)
    it('EP075 - Debería mostrar un error al intentar EDITAR un miembro con un email vacío (Pseudo-aleatorio)', () => {    
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(pseudoData[pseudoRowIndex].memberName, pseudoData[pseudoRowIndex].memberEmail); 
                
        // And El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.andUserIsOnMembersPageAndSelectsMemberToEdit(pseudoData[pseudoRowIndex].memberName);

        // When El usuario edita el miembro con un email vacío
        editMember.whenUserEditsMemberDetails(pseudoData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberName, pseudoData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].emptyEmail);  
       
        // Then El usuario debería ver un mensaje de error que indica que debe ingresar un email
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería mostrar un error al intentar EDITAR un miembro con un email vacío (Aleatorio)
    it('EP076 - Debería mostrar un error al intentar EDITAR un miembro con un email vacío (Aleatorio)', () => {   
        const memberName = faker.person.fullName();
        const memberEmail = faker.internet.email();
        const emptyEmail = ""; 
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(memberName, memberEmail); 
                
        // And El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.andUserIsOnMembersPageAndSelectsMemberToEdit(memberName);

        // When El usuario edita el miembro con un email vacío
        editMember.whenUserEditsMemberDetails(memberName, emptyEmail);  
       
        // Then El usuario debería ver un mensaje de error que indica que debe ingresar un email
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });


    //Debería permitir al usuario EDITAR exitosamente un miembro existente con un email y nombre válidos (Pseudo-aleatorio)
    it('EP077 - Debería permitir al usuario EDITAR exitosamente un miembro existente con un email y nombre válidos (Pseudo-aleatorio)', () => {    
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(pseudoData[pseudoRowIndex].memberName, pseudoData[pseudoRowIndex].memberEmail); 
                
        // And El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.andUserIsOnMembersPageAndSelectsMemberToEdit(pseudoData[pseudoRowIndex].memberName);

        // When El usuario edita el miembro con un nombre y email válidos
        editMember.whenUserEditsMemberDetails(pseudoData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberName, pseudoData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberEmail); 
    
        // Then El usuario verifica que el miembro editado esté en la lista de miembros con el nuevo nombre
        editMember.thenMemberShouldBeUpdatedInMembersList(pseudoData[(pseudoRowIndex - 1 + pseudoData.length) % pseudoData.length].memberName); 
    });
    //Debería permitir al usuario EDITAR exitosamente un miembro existente con un email y nombre válidos (Aleatorio)
    it('EP078 - Debería permitir al usuario EDITAR exitosamente un miembro existente con un email y nombre válidos (Aleatorio)', () => {    
        const memberName = faker.person.fullName();
        const memberEmail = faker.internet.email();
        const newMemberName = faker.person.fullName();
        const newMemberEmail = faker.internet.email();
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // And El usuario ingresa los detalles del miembro 
        createMember.andUserEntersMemberDetails(memberName, memberEmail); 
                
        // And El usuario navega a la lista de miembros y selecciona un miembro específico para editar
        editMember.andUserIsOnMembersPageAndSelectsMemberToEdit(memberName);

        // When El usuario edita el miembro con un nombre y email válidos
        editMember.whenUserEditsMemberDetails(newMemberName, newMemberEmail); 
    
        // Then El usuario verifica que el miembro editado esté en la lista de miembros con el nuevo nombre
        editMember.thenMemberShouldBeUpdatedInMembersList(newMemberName); 
    });



    //Debería mostrar un error al intentar CREAR un miembro con un email en un formato inválido (A priori)
    it('EP079 - Debería mostrar un error al intentar CREAR un miembro con un email en un formato inválido (A priori)', () => {    
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // When El usuario ingresa los detalles del miembro con un email en un formato inválido
        createMember.whenUserEntersMemberDetails(aPrioriData[aPrioriRowIndex].memberName, aPrioriData[aPrioriRowIndex].invalidEmail);  
    
        // Then El usuario debería ver un mensaje de error que indica que el email no es válido
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería mostrar un error al intentar CREAR un miembro con un email en un formato inválido (Pseudo-aletorio)
    it('EP080 - Debería mostrar un error al intentar CREAR un miembro con un email en un formato inválido (Pseudo-aletorio)', () => {    
        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // When El usuario ingresa los detalles del miembro con un email en un formato inválido
        createMember.whenUserEntersMemberDetails(pseudoData[pseudoRowIndex].memberName, pseudoData[pseudoRowIndex].invalidEmail);  
    
        // Then El usuario debería ver un mensaje de error que indica que el email no es válido
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });
    //Debería mostrar un error al intentar CREAR un miembro con un email en un formato inválido (Aleatorio) 
    it('EP081 - Debería mostrar un error al intentar CREAR un miembro con un email en un formato inválido (Aleatorio)', () => {    
        const memberName = faker.person.fullName();
        const invalidEmail = faker.string.symbol(10) + faker.internet.emoji() + faker.string.sample(10);

        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();
    
        // When El usuario ingresa los detalles del miembro con un email en un formato inválido
        createMember.whenUserEntersMemberDetails(memberName, invalidEmail);  
    
        // Then El usuario debería ver un mensaje de error que indica que el email no es válido
        createMember.thenUserShouldSeeDuplicatedEmailError();
    });



    //Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (A priori)
    it('EP082 - Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (A priori)', () => {    
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
    it('EP083 - Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (Pseudo-aleatorio)', () => {    
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
    it('EP084 - Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (aleatorio)', () => {   
        const memberName = faker.person.fullName();
        const memberEmail = faker.internet.email();
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
    it('EP085 - Debería permitir CREAR exitosamente un nuevo miembro con un email y nombre válidos (Pseudo-aletorio)', () => {    
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
    it('EP086 - Debería permitir CREAR exitosamente un nuevo miembro con un email y nombre válidos (Aletorio)', () => {  
        const memberName = faker.person.fullName();
        const memberEmail = faker.internet.email();

        // Given El usuario navega a la sección de miembros
        createMember.givenUserIsOnMembersPage();

        // And El usuario comienza a crear un nuevo miembro
        createMember.andUserStartsCreatingNewMember();

        // When El usuario ingresa los detalles del miembro con un email y nombre válidos
        createMember.whenUserEntersMemberDetails(memberName, memberEmail);

        // Then El usuario verifica que el miembro esté visible en la lista de miembros
        createMember.thenMemberShouldBeVisibleInMembersList(memberName);
    });

});