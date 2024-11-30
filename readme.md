# Cypress
## 1. Requisitos Previos

   - Node.js (versión 20.18.0 es la recomendada)
   - Git
   - Cypress (si no está instalado, se instalará como parte de este proyecto)


### 2. Instalación


#### Paso 1: Clonar el Repositorio
Clona este repositorio en tu máquina local usando el siguiente comando:

```bash
git clone https://github.com/hvlopez-uniandes/entrega_final_pruebas_automatizadas.git
cd entrega_final_pruebas_automatizadas
```

#### Paso 2: Instalar las Dependencias
Instala todas las dependencias necesarias usando npm. Esto incluirá Cypress y cualquier otra dependencia requerida para los tests.

```bash
npm install
```

### Paso 3: Configuración del Entorno de Pruebas

Configura el archivo `cypress.env.json` en la raíz del proyecto para agregar las variables de entorno necesarias (por ejemplo, URL de Ghost, credenciales de usuario, etc.). Un ejemplo de configuración:

```json
{
  "GHOST_URL": "http://localhost:2368",
  "GHOST_USER": "tu_usuario@example.com",
  "GHOST_PASSWORD": "tu_contraseña"
}
```

### Ejecución de las Pruebas

#### Opción 1: Ejecución en el Modo Interactivo (Cypress UI)

Para ejecutar las pruebas en el modo interactivo de Cypress (útil para ver cada paso de las pruebas en detalle):

```bash
npx cypress open
```

Luego, selecciona el archivo de prueba que deseas ejecutar en la interfaz de Cypress.

#### Opción 2: Ejecución en Modo Headless (sin interfaz)

Para ejecutar todas las pruebas en modo headless (sin abrir la interfaz de Cypress):

```bash
npx cypress run
```

Esto ejecutará todos los escenarios de prueba de manera continua y mostrará los resultados en la consola.

### Paso 4: Resultados de las Pruebas

- **En Modo Interactivo**: Los resultados se muestran en la interfaz de Cypress en tiempo real mientras se ejecutan las pruebas.
- **En Modo Headless**: Al final de la ejecución, la consola mostrará un resumen del resultado de todas las pruebas (pasadas o fallidas).
- **Capturas y Videos**: Cypress genera capturas de pantalla y videos de cada prueba (especialmente útil para pruebas fallidas). Puedes encontrar estos archivos en las carpetas `cypress/screenshots` y `cypress/videos`.

***

### Notas Adicionales

- Asegúrate de que el servidor de Ghost esté activo y accesible en la URL configurada antes de ejecutar las pruebas.
- En caso de cualquier error en la configuración, revisa el archivo `cypress.env.json` para asegurarte de que las variables de entorno son correctas.

**¡Listo!** Ahora deberías tener todo lo necesario para ejecutar y evaluar los escenarios de prueba en Ghost.
