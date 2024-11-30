# Pruebas Automatizadas

- Eduard Bernal (e.bernalo@uniandes.edu.co)
- Hector Lopez (hv.lopez@uniandes.edu.co)


Link de la Wiki: [Aqui](https://github.com/hvlopez-uniandes/entrega_final_pruebas_automatizadas/wiki)

# Kraken
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

2. Clona este repositorio en tu máquina local usando el siguiente comando:

  ```bash
  git clone https://github.com/ebernalo2576/pruebas_e2e
  cd pruebas_e2e/pruebas_kraken
  ```

2. Ubicación de carpeta

#### Opción 1: Versión RC (Ghost 5.96)

Para ubicarse en la ruta de la versión RC 

```bash
cd pruebas_e2e/rc_pruebas_kraken
```

#### Opción 2: Versión base (Ghost 4.5)

Para ubicarse en la ruta de la versión RC 

```bash
cd pruebas_e2e/base_pruebas_kraken

4. **Instalar Dependencias del Proyecto**

   Desde el directorio `pruebas_kraken`, ejecute:
   ```bash
   npm install
   ```

## Ejecución de Pruebas

Configurar los valores **USERNAME1** y **PASSWORD1** con las credenciales correctas para el login de Ghost en el archivo *pruebas_kraken/properties.json*


Para ejecutar todas las pruebas E2E del proyecto, simplemente ejecute:
```bash
npx kraken-node run
```


Tambien se puede ejecutar con el comando desde otro sistema operativo como Windows:
```bash
./node_modules/.bin/kraken-node run
```

### Nota:
Kraken ejecutará todas las pruebas en el proyecto simultáneamente. Si desea ejecutar un archivo de pruebas individual, renombrar todos los demás archivos cambiando la extension *.feature* y luego ejecutar el siguiente comando:

```bash
npx kraken-node run
```

---

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:
- **features**: Contiene los archivos `.feature` con los escenarios de prueba.
- **step_definitions**: Contiene las implementaciones de cada paso definido en los archivos `.feature`.
- **page_objects**: Incluye los objetos de página que representan las distintas páginas y funcionalidades de Ghost.

¡Listo! Ahora puedes ejecutar y personalizar tus pruebas según sea necesario.


## Pruebas de Regresión Visual con Pixelmatch

Para garantizar la consistencia visual entre versiones, utilizamos [Pixelmatch](https://github.com/mapbox/pixelmatch) como herramienta para comparar las capturas de pantalla generadas en las pruebas con Kraken. Este proceso nos permite identificar cambios visuales no deseados entre una versión base y la release candidate (RC).

### Proceso

1. **Captura de Pantallas**: Las pruebas automatizadas con Kraken generan capturas de pantalla de las diferentes vistas y escenarios probados.
2. **Comparación con Pixelmatch**: Las capturas generadas se comparan con las imágenes de referencia utilizando Pixelmatch, destacando las diferencias en una imagen de salida que resalta los cambios.
3. **Resultados**: Los resultados de las comparaciones se almacenan en "./pixelmatch/test-results" y pueden ser revisados para identificar inconsistencias visuales.

### Ejecución

Asegúrate de haber ejecutado las pruebas con Kraken y haber generado las capturas de pantalla. Luego, sigue estos pasos:

1. Mueve las capturas de pantalla de la **versión base** a la carpeta:

   ```plaintext
   ./pixelmatch/before  
   ```

2. Mueve las capturas de pantalla de la **versión rc** a la carpeta:

   ```plaintext
   ./pixelmatch/after  
   ```

3. Asegúrate de que las imágenes a comparar tengan el **mismo nombre** en ambas carpetas.

4. Desde el directorio `./pixelmatch`, ejecuta el script de comparación:

```bash
node index.js    
```   


Este script utiliza **Pixelmatch** para comparar las imágenes en las carpetas `pixelmatch/before` y `pixelmatch/after`. Las diferencias se almacenarán en `pixelmatch/compare`.

Finalmente, dentro de la carpeta `test-results`, se generará una subcarpeta con el **timestamp** del momento de ejecución de las comparaciones. Si accedes a esta subcarpeta, encontrarás un archivo HTML que contiene el reporte de ejecución.

### Ver el Reporte

Para visualizar el reporte, abre el archivo HTML generado con cualquier navegador web. Por ejemplo:

1. Navega a la carpeta generada:
   ```plaintext
   ./test-results/YYYY-MM-DD_HH-MM-S
   ```   

2. Abre el archivo report.html en tu navegador:
   - En sistemas Unix (Linux/Mac), puedes usar el siguiente comando:   
   
   ```bash
   open ./test-results/YYYY-MM-DD_HH-MM-SS/report.html   
   ```   

   - En Windows, simplemente haz doble clic en el archivo desde el explorador de archivos, ejecútalo con LiveServer o utiliza:   

   ```bash
   start ./test-results/YYYY-MM-DD_HH-MM-SS/report.html   
   ```   


¡Ahora podrás visualizar las diferencias y resultados directamente en el navegador!

***

# Cypress
## 1. Requisitos Previos

   - Node.js (versión 20.18.0 es la recomendada)
   - Git
   - Cypress (si no está instalado, se instalará como parte de este proyecto)


### 2. Instalación


#### Paso 1: Clonar el Repositorio
Clona este repositorio en tu máquina local usando el siguiente comando:

```bash
git clone https://github.com/ebernalo2576/pruebas_e2e
cd pruebas_e2e/pruebas_cypress
```
#### Paso 2: Ubicación de carpeta

#### Opción 1: Versión RC (Ghost 5.96)

Para ubicarse en la ruta de la versión RC 

```bash
cd pruebas_e2e/rc_pruebas_cypress
```

#### Opción 2: Versión base (Ghost 4.5)

Para ubicarse en la ruta de la versión RC 

```bash
cd pruebas_e2e/base_pruebas_cypress
```

#### Paso 3: Instalar las Dependencias
Instala todas las dependencias necesarias usando npm. Esto incluirá Cypress y cualquier otra dependencia requerida para los tests.

```bash
npm install
```

### Paso 4: Configuración del Entorno de Pruebas

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

### Paso 5: Resultados de las Pruebas

- **En Modo Interactivo**: Los resultados se muestran en la interfaz de Cypress en tiempo real mientras se ejecutan las pruebas.
- **En Modo Headless**: Al final de la ejecución, la consola mostrará un resumen del resultado de todas las pruebas (pasadas o fallidas).
- **Capturas y Videos**: Cypress genera capturas de pantalla y videos de cada prueba (especialmente útil para pruebas fallidas). Puedes encontrar estos archivos en las carpetas `cypress/screenshots` y `cypress/videos`.

***

### Notas Adicionales

- Asegúrate de que el servidor de Ghost esté activo y accesible en la URL configurada antes de ejecutar las pruebas.
- En caso de cualquier error en la configuración, revisa el archivo `cypress.env.json` para asegurarte de que las variables de entorno son correctas.

**¡Listo!** Ahora deberías tener todo lo necesario para ejecutar y evaluar los escenarios de prueba en Ghost.


## Pruebas de Regresión Visual con ResembleJs

Para garantizar la consistencia visual entre versiones, utilizamos [ResembleJs](https://github.com/rsmbl/Resemble.js) como herramienta para comparar las capturas de pantalla generadas en las pruebas con Kraken. Este proceso nos permite identificar cambios visuales no deseados entre una versión base y la release candidate (RC).

### Proceso

1. **Captura de Pantallas**: Las pruebas automatizadas con Kraken o cypress generan capturas de pantalla de las diferentes vistas y escenarios probados.
2. **Comparación con ResembleJs**: Las capturas generadas se comparan con las imágenes de referencia utilizando ResembleJs, destacando las diferencias en una imagen de salida que resalta los cambios.
3. **Resultados**: Los resultados de las comparaciones se almacenan en "./resemble/index.html" y pueden ser revisados para identificar inconsistencias visuales.

### Ejecución

Asegúrate de haber ejecutado las pruebas con Kraken y haber generado las capturas de pantalla. Luego, sigue estos pasos:

1. Mueve las capturas de pantalla de la **versión base** a la carpeta:

   ```plaintext
   ./resemble/before  
   ```

2. Mueve las capturas de pantalla de la **versión rc** a la carpeta:

   ```plaintext
   ./resemble/after  
   ```

3. Asegúrate de que las imágenes a comparar tengan el **mismo nombre** en ambas carpetas.

4. Desde el directorio `./resemble`, ejecuta el script de comparación:

```bash
node index.js    
```   


Este script utiliza **ResembleJs** para comparar las imágenes en las carpetas `resemble/before` y `resemble/after`. Las diferencias se almacenarán en `resemble/compare`.


### Ver el Reporte

Para visualizar el reporte, abre el archivo HTML generado con cualquier navegador web. Por ejemplo:

1. Navega a la carpeta generada:
   ```plaintext
   ./resemble
   ```   

2. Abre el archivo report.html en tu navegador:
   - En sistemas Unix (Linux/Mac), puedes usar el siguiente comando:   
   
   ```bash
   open ./index.html   
   ```   

   - En Windows, simplemente haz doble clic en el archivo desde el explorador de archivos, ejecútalo con LiveServer o utiliza:   

   ```bash
   start ./index.html   
   ```   


¡Ahora podrás visualizar las diferencias y resultados directamente en el navegador!
