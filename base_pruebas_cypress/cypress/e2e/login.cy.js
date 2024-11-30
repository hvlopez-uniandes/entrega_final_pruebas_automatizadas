import login from './pages/login';

describe('Escenarios de pruebas para la funcionalidad post - Ghost Version Base', () => {

    it('EP001 - Debería permitir iniciar sesión con un usuario existente', () => {
        // Given: El usuario está en la página de inicio de sesión
        login.givenUserIsOnLoginPage();

        // When: El usuario ingresa sus credenciales y envía el formulario
        login.whenUserLogsIn();

        // Then: El usuario debería ver el dashboard
        login.thenUserShouldSeeDashboard();

    });
});