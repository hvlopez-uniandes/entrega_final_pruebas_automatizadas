
# Proyecto de Pruebas E2E con Kraken y Ghost

Este proyecto contiene pruebas de extremo a extremo (E2E) para la aplicación Ghost en su versión 5.96, utilizando Kraken para la ejecución de pruebas automatizadas. A continuación, se detallan los pasos necesarios para ejecutar el proyecto en un entorno local utilizando Docker.

## Funcionalidades
## 1. Login
    EP001 - Debería permitir iniciar sesión con un usuario existente
## 2. Post
    EP002 - Debería permitir crear un post con un título y descripción aleatoria
    EP003 - Debería mostrar los posts creados en la lista de posts
    EP004 - Debería visualizar un post y validar título y contenido
    EP005 - Debería permitir al usuario editar un post existente
    EP006 - Debería permitir despublicar un post existente
    EP007 - Debería permitir al usuario eliminar un post existente
## 3. Tag
    EP008 - Debería permitir crear y visualizar un nuevo tag
    EP009 - Debería permitir editar un tag existente
    EP010 - Debería permitir eliminar un tag y verificar que ya no esté en la lista
## 4. Página
    EP011 - Debería permitir crear y visualizar una nueva página
    EP012 - Debería permitir ver una página existente en la lista de páginas
    EP013 - Debería validar los detalles de una página existente
    EP014 - Debería permitir al usuario editar una página existente
    EP015 - Debería permitir despublicar una página existente
    EP016 - Debería permitir eliminar una página existente
## 5. Miembro
    EP017 - Debería permitir crear y visualizar un nuevo miembro
    EP018 - Debería permitir ver la lista de miembros
    EP019 - Debería permitir al usuario editar un miembro existente
    EP020 - Debería permitir eliminar un miembro existente (edited) 

## 6. Configuración
    EP021 - Debería permitir al usuario cambiar la configuración general del sitio y guardar los cambios


## Requisitos Previos

- **Docker**: Asegúrese de tener Docker instalado en su máquina.
- **ADB (Android Developer Tools)**: Para macOS, puede instalarlo ejecutando:
  ```bash
  brew install android-developer-tools
  ```
- **Node.js**: Instale las dependencias del proyecto con `npm`.

## Instrucciones de Configuración

1. **Ejecutar la Aplicación Ghost en Docker**

   Ejecute el siguiente comando para iniciar Ghost versión 5.96 en un contenedor Docker:
   ```bash
   docker run --name my-ghost-596 -e url=http://localhost:3001 -e NODE_ENV=development -p 3001:2368 ghost:5.96
   ```

   Esto ejecutará Ghost en el puerto `3001` de su máquina local.

2. **Instalar Dependencias del Proyecto**

   Desde el nivel del directorio `pruebas_kraken`, ejecute:
   ```bash
   npm install
   ```

## Ejecución de Pruebas

Para ejecutar todas las pruebas E2E del proyecto, simplemente ejecute:
```bash
npx kraken-node run
```

### Nota:
Kraken ejecutará todas las pruebas en el proyecto simultáneamente. Si desea ejecutar un archivo de pruebas individual, puede comentar los demás archivos de pruebas y especificar el archivo en el siguiente formato:

```bash
npx kraken-node run
```

> **Importante**: Recuerde que Kraken ejecuta los archivos de prueba en conjunto a menos que los comentes como te indico siguientemente login-EP001.feature a login-EP001-feature de este modo no correran .

---

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:
- **features**: Contiene los archivos `.feature` con los escenarios de prueba.
- **step_definitions**: Contiene las implementaciones de cada paso definido en los archivos `.feature`.
- **page_objects**: Incluye los objetos de página que representan las distintas páginas y funcionalidades de Ghost.

¡Listo! Ahora puedes ejecutar y personalizar tus pruebas según sea necesario.
