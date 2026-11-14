# Documento de Requisitos del Producto (PRD) - Pluri Uno

## 1. Requisitos Funcionales

1. **RF-01 (Autenticación y Sesión):** El sistema debe permitir el inicio de sesión con JWT para usuarios administradores y empleados, manteniendo la persistencia del token.
2. **RF-02 (Control de Roles RBAC):** El sistema debe restringir las vistas y acciones según el rol asignado (`Administrador` o `Empleado`).
3. **RF-03 (Gestión de Obligaciones):** El sistema debe permitir consultar, crear y actualizar el estado de las obligaciones normativas y legales guardadas en la base de datos SQLite.
4. **RF-04 (Filtro por Responsable):** El sistema debe proveer la ruta `GET /api/obligaciones` parametrizada para filtrar obligaciones por el usuario asignado.
5. **RF-05 (Evidencias y Notificaciones):** El sistema debe mostrar la interfaz para el control de evidencias visuales e indicadores de alerta por vencimiento.

## 2. Fuera de Alcance (Simulado / Pendiente)

- **Autenticación Enterprise (Microsoft Entra ID / OAuth2):** Fuera del alcance del MVP académico; el sistema implementa un esquema robusto y autónomo de autenticación local basado en JSON Web Tokens (JWT) y SQLite.
- **Servicios Cloud e Inteligencia Artificial (Azure OpenAI / Azure AI Search):** Las capacidades de análisis predictivo e integración con modelos cognitivos masivos descritas en la propuesta teórica inicial se abstraen en esta versión mediante motores lógicos internos basados en control de fechas y estados relacionales.
- **Almacenamiento físico de evidencias:** No se incluye la subida real de archivos pesados al servidor mediante middleware como Multer o almacenamiento en la nube de Azure Blob.
- **Notificaciones por Correo (SMTP):** Las alertas operan de forma visual y dinámica en la interfaz de usuario sin integración activa a un servidor de correo saliente SMTP.