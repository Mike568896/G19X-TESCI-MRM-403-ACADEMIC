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