# Documento de Requisitos del Producto (PRD) - Pluri Uno

## 1. Requisitos Funcionales
1. **RF-01 (Autenticación y Sesión):** El sistema implementa autenticación local robusta basada en JSON Web Tokens (JWT) y cifrado con `bcrypt`, garantizando la persistencia activa de la sesión del usuario al recargar el navegador (`F5`) mediante almacenamiento local (`localStorage`).
2. **RF-02 (Control de Roles RBAC):** El sistema restringe las vistas y acciones según el rol asignado (`Administrador` o `Empleado`), protegiendo los endpoints del servidor con validación de privilegios.
3. **RF-03 (Gestión de Obligaciones):** El sistema permite consultar, crear y actualizar el estado de las obligaciones normativas y legales guardadas en la base de datos SQLite.
4. **RF-04 (Relación por ID de Responsable):** El alta de obligaciones (`POST /api/obligaciones`), restringida al rol `Administrador`, vincula cada registro mediante una clave foránea numérica (`responsable_id` INTEGER) para asegurar la integridad referencial.
5. **RF-05 (Evidencias y Alertas Dinámicas):** El sistema muestra una interfaz para el control de evidencias visuales y un motor unificado de cálculo de fechas para las alertas de vencimiento.

## 2. Fuera de Alcance (Simulado / Conceptual / Pendiente)
- **Autenticación Enterprise (Microsoft Entra ID / OAuth2):** Si bien forma parte de la arquitectura conceptual original de la plataforma, este MVP opta por un esquema de autenticación local autónomo con JWT para facilitar el despliegue y pruebas directas.
- **Servicios Cloud e Inteligencia Artificial (Azure OpenAI / Azure AI Search):** Las capacidades avanzadas de análisis predictivo descritas en la propuesta teórica inicial se abstraen en esta versión mediante motores lógicos internos basados en control de fechas y estados relacionales.
- **Almacenamiento físico de evidencias en la nube:** No se incluye la subida real de archivos pesados al servidor mediante middleware de almacenamiento binario (como Multer o Azure Blob), operando mediante banderas de estado e interfaz visual.
- **Notificaciones por Correo (SMTP):** Las alertas operan de forma visual y dinámica dentro de la interfaz de usuario en tiempo real, sin integración activa a un servidor de correo saliente SMTP externo.