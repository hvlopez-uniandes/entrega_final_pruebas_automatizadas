import login from './pages/login';
import { SettingsTitleDescription,  SettingsDeleteContent} from './pages/settings';
import { faker } from '@faker-js/faker';

const settingsTitleDescription = new SettingsTitleDescription();
const settingsDeleteContent = new SettingsDeleteContent();
const apiUrl = Cypress.env('API_URL')+"/settings-pseudo-aleatorio.json?key=f0c0d4e0";

     
describe('Escenarios de pruebas para la funcionalidad Settings - Ghost Version Base', () => {
    Cypress.on('uncaught:exception', (err) => {
        if (err.message.includes('TransitionAborted')) {
            return false; 
        }
    });

    let aPrioriData = [];
    let aPrioriRowIndex = 0;
    let pseudoData = [];
    let pseudoRowIndex = 0;

    before(() => {
        cy.fixture('settings-a-priori.json').then((page) => {
            aPrioriData = page;
        });
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

        aPrioriRowIndex = Math.floor(Math.random() * aPrioriData.length);

        cy.request(apiUrl).then((response) => {
            pseudoData = response.body;

            pseudoRowIndex = Math.floor(Math.random() * pseudoData.length);
        });
    });


    it('EP087 - Debería permitir al usuario cambiar el título y configuración el sitio y guardar los cambios (Aleatorio)', () => {

        const title = faker.lorem.words(3); 
        const description = faker.lorem.sentence(6); 
        // Given El usuario accede a la sección de configuración
        settingsTitleDescription.givenUserIsInSettings();

        // and El usuario abre la sección general
        settingsTitleDescription.andGivenUserOpensGeneralSection();

        // and El usuario cambia los campos de título y descripción
        settingsTitleDescription.whenUserChangesTitleDescriptionFields(title, description);

        // then Los cambios deberían guardarse correctamente
        settingsTitleDescription.thenSettingsShouldBeSaved();
    });

    it('EP088 - No debería permitir al usuario guardar el título del sitio en vacío (Aleatorio)', () => {

        const title = faker.lorem.words(3); 
        const description = faker.lorem.sentence(6); 
        // Given El usuario accede a la sección de configuración
        settingsTitleDescription.givenUserIsInSettings();

        // and El usuario abre la sección general
        settingsTitleDescription.andGivenUserOpensGeneralSection();

        // and El usuario cambia los campos de título y descripción
        settingsTitleDescription.whenUserChangesTitleDescriptionFields('', description);

        // then Los cambios deberían guardarse correctamente
        settingsTitleDescription.thenSettingsShouldBeSaved();
    });

    it('EP089 - No debería permitir al usuario guardar el título y configuración el sitio en vacío (Aleatorio)', () => {

        const title = faker.lorem.words(3); 
        const description = faker.lorem.sentence(6); 
        // Given El usuario accede a la sección de configuración
        settingsTitleDescription.givenUserIsInSettings();

        // and El usuario abre la sección general
        settingsTitleDescription.andGivenUserOpensGeneralSection();

        // and El usuario cambia los campos de título y descripción
        settingsTitleDescription.whenUserChangesTitleDescriptionFields('', '');

        // then Los cambios deberían guardarse correctamente
        settingsTitleDescription.thenSettingsShouldBeSaved();
    });

    it('EP090 - No debería permitir al usuario guardar el título con carácteres especiales (Aleatorio)', () => {

        const specialCharacters = '!@#$%^&*)_+}|:<>?];~';
        const length = 50; 

        const title = Array.from({ length }, () =>
            faker.helpers.arrayElement(specialCharacters.split(''))
        ).join('');; 
        const description = faker.lorem.sentence(6); 
        // Given El usuario accede a la sección de configuración
        settingsTitleDescription.givenUserIsInSettings();

        // and El usuario abre la sección general
        settingsTitleDescription.andGivenUserOpensGeneralSection();

        // and El usuario cambia los campos de título y descripción
        settingsTitleDescription.whenUserChangesTitleDescriptionFields(title, description);

        // then Los cambios deberían guardarse correctamente
        settingsTitleDescription.thenSettingsShouldBeSaved();
    });

    it('EP091 - No debería permitir al usuario guardar la descripción del sitio con carácteres especiales (Aleatorio)', () => {

        const specialCharacters = '!@#$%^&*)_+}|:<>?];~';
        const length = 50; 
        const title = faker.lorem.words(3);  
        const description = Array.from({ length }, () =>
            faker.helpers.arrayElement(specialCharacters.split(''))
        ).join('');
        // Given El usuario accede a la sección de configuración
        settingsTitleDescription.givenUserIsInSettings();

        // and El usuario abre la sección general
        settingsTitleDescription.andGivenUserOpensGeneralSection();

        // and El usuario cambia los campos de título y descripción
        settingsTitleDescription.whenUserChangesTitleDescriptionFields(title, description);

        // then Los cambios deberían guardarse correctamente
        settingsTitleDescription.thenSettingsShouldBeSaved();
    });

    it('EP092 - Debería permitir al usuario cambiar el título y configuración el sitio y guardar los cambios (A-priori)', () => {

        // Given El usuario accede a la sección de configuración
        settingsTitleDescription.givenUserIsInSettings();

        // and El usuario abre la sección general
        settingsTitleDescription.andGivenUserOpensGeneralSection();

        // and El usuario cambia los campos de título y descripción
        settingsTitleDescription.whenUserChangesTitleDescriptionFields(aPrioriData[aPrioriRowIndex].title, aPrioriData[aPrioriRowIndex].description);

        // then Los cambios deberían guardarse correctamente
        settingsTitleDescription.thenSettingsShouldBeSaved();
    });

    it('EP093 - Debería permitir al usuario cambiar el título y configuración el sitio y guardar los cambios (Pseudo-aleatorio)', () => {
        // Given El usuario accede a la sección de configuración
        settingsTitleDescription.givenUserIsInSettings();

        // and El usuario abre la sección general
        settingsTitleDescription.andGivenUserOpensGeneralSection();

        // and El usuario cambia los campos de título y descripción
        settingsTitleDescription.whenUserChangesTitleDescriptionFields(pseudoData[pseudoRowIndex].title, pseudoData[pseudoRowIndex].description);

        // then Los cambios deberían guardarse correctamente
        settingsTitleDescription.thenSettingsShouldBeSaved();
    });

});