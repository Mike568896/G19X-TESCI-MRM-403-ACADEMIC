# Informe Técnico: Decisiones de Arquitectura frente al Descriptivo Original

## 1. Sustitución de Servicios Cloud por Stack Local Autocontenido
El descriptivo original contemplaba integraciones empresariales con Microsoft Entra ID, Azure OpenAI y Azure Blob Storage. Para garantizar un producto funcional, verificable de extremo a extremo y ejecutable desde cero sin dependencia de suscripciones externas ni llaves de pago, se tomó la decisión técnica de implementar un backend autónomo en **Node.js + Express** con **SQLite** y **JWT**.

## 2. Normalización del Modelo de Datos (`responsable_id`)
Inicialmente, la asignación de obligaciones almacenaba el nombre del responsable como cadena de texto (`TEXT`), lo que generaba inconsistencias ante cambios de nombre o errores de captura. Se refactorizó el esquema de SQLite, las rutas de `server.js` y el script `seed.js` para utilizar una relación numérica mediante `responsable_id` (`INTEGER`), garantizando integridad referencial y control estricto de permisos (`403 Forbidden` para roles no administradores).

## 3. Unificación del Motor de Vencimientos y Limpieza de Interfaz
Se eliminaron botones y etiquetas de funciones no implementadas (como inicio con Microsoft o cifrado simulado) para mantener total transparencia funcional. Asimismo, se unificó la comparación de fechas en formato ISO (`YYYY-MM-DD`) en `src/App.jsx` para evitar discrepancias entre el sistema de alertas y las vistas tabulares, ajustando las clases de Tailwind CSS para asegurar usabilidad completa en resoluciones móviles de `390 px`.