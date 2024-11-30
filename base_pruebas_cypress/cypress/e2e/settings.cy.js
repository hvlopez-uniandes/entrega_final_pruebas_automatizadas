import login from './pages/login';
import { Settings } from './pages/settings';
import { faker } from '@faker-js/faker';

const settings = new Settings();
const title = faker.lorem.words(3); 
const description = faker.lorem.sentence(6); 
     
describe('Escenarios de pruebas para la funcionalidad Settings - Ghost Version Base', () => {
    Cypress.on('uncaught:exception', (err) => {
        if (err.message.includes('TransitionAborted')) {
            return false; 
        }
    });

    it('EP021 - Debería permitir al usuario cambiar el título y configuración el sitio y guardar los cambios', () => {
        // Precondición inicio de sesión para ejecutar el escenario de prueba
        login.givenUserIsOnLoginPage();
        login.whenUserLogsIn();
        login.thenUserShouldSeeDashboard();

        // Given El usuario accede a la sección de configuración
        settings.givenUserIsInSettings();

        // and El usuario abre la sección general
        settings.andGivenUserOpensGeneralSection();

         // and El usuario expande la sección de título y descripción
        settings.andGivenUserExpandsTitleSection();

        // and El usuario cambia los campos de título y descripción
        settings.whenUserChangesTitleDescriptionFields(title, description);

        // then Los cambios deberían guardarse correctamente
        settings.thenSettingsShouldBeSaved();
    });
});