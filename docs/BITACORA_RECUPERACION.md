# Bitácora de Recuperación - [24 noviembre 2026]

## Bloque 1: Martes (Corrección inicial del sistema)
* **Hora de inicio:** 9:00 AM | **Hora de fin:** 11:00 AM
* **¿Qué hice?:** Diagnóstico del error en consola (`ReferenceError: showNotifications is not defined`), reordenamiento de estados en `src/App.jsx` para evitar problemas en la Temporal Dead Zone y validación visual en `localhost:5173`.
* **¿Qué me costó trabajo?:** Encontrar exactamente en qué orden se inicializaban los estados de las obligaciones y el menú flotante.
* **¿Qué le pedí a la IA?:** Ayuda para identificar la línea exacta del error en consola y la estructura para declarar el estado faltante.

## Bloque 2: Martes (Implementación de persistencia de sesión)
* **Hora de inicio:** 12:00 PM | **Hora de fin:** 2:00 PM
* **¿Qué hice?:** Corrección del manejo de estado global con `localStorage` para el token y el objeto de usuario, asegurando que la sesión persista al presionar F5. Creación de la función `handleLogout` para limpiar correctamente las credenciales al cerrar sesión y evitar estados "fantasma".
* **¿Qué me costó trabajo?:** Sincronizar el renderizado inicial de React con los datos del `localStorage` para evitar errores de tipo (`Cannot read properties of null`) al recargar.
* **¿Qué le pedí a la IA?:** Asistencia para estructurar el encadenamiento opcional (`?.`) en las propiedades del usuario y el manejo seguro del almacenamiento local.

## Bloque 3: Miércoles (Persistencia de perfil y control de evidencias)
* **Hora de inicio:** 4:00 PM | **Hora de fin:** 7:30 PM
* **Qué hice:** Implementación de persistencia local por correo para los datos editados en "Mi Cuenta", limpieza del botón de inicio de sesión de Microsoft y aplicación del filtro en el modal de "Cargar Evidencia" para evitar registros duplicados de obligaciones.
* **Qué me costó trabajo:** Sincronizar el estado global del usuario con respaldos independientes en el `localStorage` para que sobrevivieran al cierre de sesión sin alterar el backend principal.
* **Qué le pedí a la IA:** Soporte lógico para cruzar los estados del perfil con llaves dinámicas y el filtrado de opciones en el selector de evidencias.

## Bloque 4: Jueves (Depuración de persistencia y asignación de obligaciones)
* **Hora de inicio:** 6:30 PM | **Hora de fin:** 9:30 PM
* **¿Qué hice?:** 
  * Se corrigió el error `400 Bad Request` al registrar obligaciones estandarizando el payload y la validación en `server.js` para usar `responsable_id` en lugar del campo legacy de texto.
  * Se recreó la estructura de la base de datos SQLite para soportar la columna `responsable_id INTEGER`.
  * Se sustituyó la llamada a la función faltante `cargarObligaciones` en el frontend por un `fetch` directo en `src/App.jsx` que refresca el estado local con `setObligaciones(data)`.
* **¿Qué me costó trabajo?:** Sincronizar la estructura de las tablas del servidor con las peticiones POST enviadas desde el modal de React y asegurar que la tabla de la interfaz se recargara correctamente al guardar un nuevo registro.
* **¿Qué le pedí al asistente?:** Asistencia en vivo para interpretar los códigos de error en la consola (`SQLite error` y `400 Bad Request`), identificar el campo faltante en la tabla y estructurar el fragmento de código exacto para actualizar el estado en el archivo `App.jsx`.

## Blocker 5: Viernes (Ajustes finales de dictamen, README y cuentas)
* **Hora de inicio:** 5:00 PM | **Hora de fin:** 9:00 PM
* **¿Qué hice?:** 
  * Se corrigió el diseño responsivo en pantallas móviles de `390 px` ajustando las clases de Tailwind (`hidden md:flex`) en el componente `<aside>`.
  * Se actualizó el título de la pestaña en `index.html` a "Pluri Uno - Centro de Cumplimiento" y se limpiaron restos de plantillas previas.
  * Se sincronizó el archivo `README.md` con las cuentas de prueba reales del script de siembra (`seed.js`), asegurando el acceso con las 3 credenciales en minúsculas (`ana@plurione.com`, `carlos@plurione.com`, `m.romero@plurione.com`).
  * Se refactorizó el script `seed.js` y el servidor para soportar la asignación por ID numérico (`responsable_id INTEGER`), validando la integridad referencial en SQLite.
* **¿Qué me costó trabajo:** Verificar que los correos y las contraseñas del `README.md` coincidieran al 100% con los hashes y consultas generados en el `seed.js`.
* **¿Qué le pedí al asistente?:** Validación de la estructura del script de siembra con claves foráneas numéricas y redacción transparente del alcance técnico para los archivos del PRD y MVP.