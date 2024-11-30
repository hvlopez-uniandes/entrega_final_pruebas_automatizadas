# Proyecto de Pruebas Automatizadas - Ghost

Este proyecto contiene un conjunto de pruebas automatizadas para verificar las funcionalidades principales de la plataforma Ghost. Cada funcionalidad ha sido estructurada en escenarios de prueba que garantizan la correcta operación de las características clave de Ghost.

## Funcionalidades

### 1. Login

   - **EP001** - Debería permitir iniciar sesión con un usuario existente.

---

### 2. Post

   - **EP002** - Debería permitir crear un post con un título y descripción (Aleatorio)
   - **EP003** - Debería permitir crear un post con un título de menos de 255 carácteres (A-priori)
   - **EP004** - No debería permitir crear un post con un título de más de 255 carácteres (Aleatorio)
   - **EP005** - Debería validar que un post no se pueda crear con título vacío (Aleatorio)
   - **EP006** - Debería validar que un post no se pueda crear con contenido vacío (Aleatorio)
   - **EP007** - Debería permitir crear un post con fecha (A-priori)
   - **EP008** - No debería permitir crear un post sin autor (A-priori)
   - **EP009** - Debería permitir crear un post con fecha (Pseudo-aletorio)
   - **EP010** - No debería permitir crear un post sin autor (Pseudo-aletorio)
   - **EP011** - Debería permitir crear un post con un título de menos de 255 carácteres (Pseudo-aletorio)
   - **EP012** - No debería permitir crear un post sin título y sin contenido (Aletorio)
   - **EP013** - No debería permitir crear un post con un título con carácteres especiales (Aleatorio)
   - **EP014** -  No debería permitir crear un post con contenido con carácteres especiales (Aleatorio)
   - **EP015** - Debería permitir al usuario editar un post existente (Aleatorio) 
   - **EP016** - Debería permitir despublicar un post existente (Aleatorio)
   - **EP017** - Debería sacar error al intentar editar una post con título de más de 255 carácteres (Aleatorio)
   - **EP018** - Debería permitir al usuario editar una post existente y poner una fecha (A-priori)
   - **EP019** - No debería permitir al usuario editar una post existente sin el título(Aleatorio)
   - **EP020** - No debería permitir al usuario editar una post existente sin el contenido (Aleatorio)
   - **EP021** - No debería permitir al usuario editar una post existente sin autor (A-priori)
   - **EP022** - Debería permitir al usuario editar una post existente y poner una fecha (Pseudo-aletorio)
   - **EP023** - No debería permitir al usuario editar una post existente sin autor (Pseudo-aletorio)
   - **EP024** - No debería permitir al usuario editar una sin título y sin contenido (Aleatorio)
   - **EP025** - Debería permitir al usuario editar una post existente con un título con carácteres especiales (Aleatorio)
   - **EP026** - No debería permitir al usuario editar un Post existente con contenido con carácteres especiales(Aleatorio)
   - **EP027** - Debería mostrar los posts creados en la lista de posts
   - **EP028** - Debería visualizar un post y validar título y contenido
   - **EP029** - Debería permitir al usuario eliminar un post existente

---

### 3. Página

   - **EP030** - Debería permitir crear y visualizar una nueva página (Aleatorio)
   - **EP031** - Debería permitir crear una página con un título de menos de 255 carácteres (A-priori)
   - **EP032** - No debería permitir crear una página con un título de más de 255 carácteres (Aleatorio)
   - **EP033** - Debería validar que una página no se pueda crear con título vacío (Aleatorio)
   - **EP034** - Debería validar que una página no se pueda crear con contenido vacío (Aleatorio)
   - **EP035** - Debería permitir crear una página con fecha (A-priori)
   - **EP036** - No debería permitir crear una página sin autor (A-priori)
   - **EP037** - Debería permitir crear una página con fecha (Pseudo-aletorio)
   - **EP038** - No debería permitir crear una página sin autor (Pseudo-aletorio)
   - **EP039** - Debería permitir crear una página con un título de menos de 255 carácteres (Pseudo-aletorio)
   - **EP040** - No debería permitir crear una página sin título y sin contenido (Aletorio)
   - **EP041** - No debería permitir crear una página con un título con carácteres especiales (Aleatorio)
   - **EP042** - No debería permitir crear una página con contenido con carácteres especiales (Aleatorio)
   - **EP043** - Debería permitir al usuario editar una página existente (Aleatorio)
   - **EP044** - Debería permitir despublicar una página existente (Aleatorio)
   - **EP045** - Debería sacar error al intentar editar una página con título de más de 255 carácteres (Aleatorio)
   - **EP046** - Debería permitir al usuario editar una página existente y poner una fecha (A-priori)
   - **EP047** - No debería permitir al usuario editar una página existente sin el título(Aleatorio)
   - **EP048** - No debería permitir al usuario editar una página existente sin el contenido (Aleatorio)
   - **EP049** - No debería permitir al usuario editar una página existente sin autor (A-priori)
   - **EP050** - Debería permitir al usuario editar una página existente y poner una fecha (Pseudo-aletorio)
   - **EP051** - No debería permitir al usuario editar una página existente sin autor (Pseudo-aletorio)
   - **EP052** - No debería permitir al usuario editar una sin título y sin contenido (Aleatorio)
   - **EP053** - Debería permitir al usuario editar una página existente con un título con carácteres especiales (Aleatorio)
   - **EP054** - No debería permitir al usuario editar una página existente con contenido con carácteres especiales(Aleatorio)
   - **EP055** - Debería permitir ver una página existente en la lista de páginas (Aleatorio)
   - **EP056** - Debería validar los detalles de una página existente (Aleatorio)
   - **EP057** - Debería permitir eliminar una página existente (Aleatorio)

---

### 4. Miembro

   - **EP058** - Debería permitir crear y visualizar un nuevo miembro (A priori)
   - **EP059** - Debería permitir ver la lista de miembros
   - **EP060** - Debería permitir al usuario editar un miembro existente (A priori)
   - **EP061** - Debería permitir eliminar un miembro existente
   - **EP062** - Debería mostrar un error al intentar CREAR un miembro con un email duplicado (A priori)
   - **EP063** - Debería mostrar un error al intentar CREAR un miembro con un email duplicado (Pseudo-aletorio)
   - **EP064** - Debería mostrar un error al intentar CREAR un miembro con un email duplicado (Aleatorio)
   - **EP065** - Debería mostrar un error al intentar EDITAR un miembro con un email duplicado (A priori)
   - **EP066** - Debería mostrar un error al intentar EDITAR un miembro con un email duplicado (Pseudo-aleatorio)
   - **EP067** - Debería mostrar un error al intentar EDITAR un miembro con un email duplicado (aleatorio)
   - **EP068** - Debería mostrar un error al intentar CREAR un miembro con un email excesivamente largo de 200 caracteres (A priori)
   - **EP069** - Debería mostrar un error al intentar CREAR un miembro con un email excesivamente largo de 200 caracteres (Pseudo-aletorio)
   - **EP070** - Debería mostrar un error al intentar CREAR un miembro con un email excesivamente largo de 200 caracteres (Aleatorio)
   - **EP071** - Debería mostrar un error al intentar CREAR un miembro con un email vacío (A priori)
   - **EP072** - Debería mostrar un error al intentar CREAR un miembro con un email vacío (Pseudo-aleatorio)
   - **EP073** - Debería mostrar un error al intentar CREAR un miembro con un email vacío (Aleatorio)
   - **EP074** - Debería mostrar un error al intentar EDITAR un miembro con un email vacío (A priori)
   - **EP075** - Debería mostrar un error al intentar EDITAR un miembro con un email vacío (Pseudo-aleatorio)
   - **EP076** - Debería mostrar un error al intentar EDITAR un miembro con un email vacío (Aleatorio)
   - **EP077** - Debería permitir al usuario EDITAR exitosamente un miembro existente con un email y nombre válidos (Pseudo-aleatorio)
   - **EP078** - Debería permitir al usuario EDITAR exitosamente un miembro existente con un email y nombre válidos (Aleatorio)
   - **EP079** - Debería mostrar un error al intentar CREAR un miembro con un email en un formato inválido (A priori)
   - **EP080** - Debería mostrar un error al intentar CREAR un miembro con un email en un formato inválido (Pseudo-aletorio)
   - **EP081** - Debería mostrar un error al intentar CREAR un miembro con un email en un formato inválido (Aleatorio)
   - **EP082** - Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (A priori)
   - **EP083** - Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (Pseudo-aleatorio)
   - **EP084** - Debería mostrar un error al intentar EDITAR un miembro con un email en un formato inválido (aleatorio)
   - **EP085** - Debería permitir CREAR exitosamente un nuevo miembro con un email y nombre válidos (Pseudo-aletorio)
   - **EP086** - Debería permitir CREAR exitosamente un nuevo miembro con un email y nombre válidos (Aletorio)

---

### 5. Settings

   - **EP087** - Debería permitir al usuario cambiar el título y configuración el sitio y guardar los cambios (Aleatorio)
   - **EP088** - No debería permitir al usuario guardar el título del sitio en vacío (Aleatorio)
   - **EP089** - No debería permitir al usuario guardar el título y configuración el sitio en vacío (Aleatorio)
   - **EP090** - No debería permitir al usuario guardar el título con carácteres especiales (Aleatorio)
   - **EP091** - No debería permitir al usuario guardar la descripción del sitio con carácteres especiales (Aleatorio)
   - **EP092** - Debería permitir al usuario cambiar el título y configuración el sitio y guardar los cambios (A-priori)
   - **EP093** - Debería permitir al usuario cambiar el título y configuración el sitio y guardar los cambios (Pseudo-aleatorio)

---

### 6. Tag

   - **EP094** - Debería permitir crear y visualizar un nuevo tag (Aleatorio)
   - **EP095** - Debería permitir editar un tag existente (Aleatorio)
   - **EP096** - Debería permitir eliminar un tag y verificar que ya no esté en la lista (Aleatorio)
   - **EP097** - Debería permitir crear un tag con datos válidos (A priori).
   - **EP098** - Debería permitir crear un tag con datos válidos (Pseudo-aleatorio).
   - **EP099** - Debería permitir crear un tag con datos válidos (Aleatorio).za
   - **EP100** - Debería mostrar un error al intentar crear un tag sin datos (A priori).
   - **EP101** - Debería mostrar un error al intentar crear un tag sin datos (Pseudo-aleatorio).
   - **EP102** - Debería mostrar un error al intentar crear un tag sin datos (Aleatorio).
   - **EP103** - Debería permitir crear un tag con slug válido (A priori).
   - **EP104** - Debería permitir crear un tag con slug válido (Pseudo-aleatorio).
   - **EP105** - Debería permitir crear un tag con slug válido (Aleatorio).
   - **EP106** - Crear un nuevo tag con menos de 191 caracteres en el campo slug (A priori).
   - **EP107** - Crear un nuevo tag con menos de 191 caracteres en el campo slug (Pseudo-aleatorio).
   - **EP108** - Crear un nuevo tag con menos de 191 caracteres en el campo slug (Aleatorio).
   - **EP109** - Debería permitir crear un tag con descripción válida (A priori).
   - **EP110** - Debería permitir crear un tag con descripción válida (Pseudo-aleatorio).
   - **EP111** - Debería permitir crear un tag con descripción válida (Aleatorio).
   - **EP112** - Debería mostrar un error al intentar crear un tag con descripción demasiado larga (A priori).
   - **EP113** - Debería mostrar un error al intentar crear un tag con descripción demasiado larga (Pseudo-aleatorio).
   - **EP114** - Debería mostrar un error al intentar crear un tag con descripción demasiado larga (Aleatorio).
   - **EP115** - Debería mostrar un error al intentar crear un tag con name demasiado largo (A priori).
   - **EP116** - Debería mostrar un error al intentar crear un tag con name demasiado largo (Pseudo-aleatorio).
   - **EP117** - Debería mostrar un error al intentar crear un tag con name demasiado largo (Aleatorio).
   - **EP118** - Debería permitir editar un tag existente (A priori).
   - **EP119** - Debería permitir editar un tag existente (Pseudo-aleatorio).
   - **EP120** - Debería permitir editar un tag existente (Aleatorio).
---



