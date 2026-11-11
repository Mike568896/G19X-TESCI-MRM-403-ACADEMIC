# Documento de Requisitos del Producto (PRD) - Pluri Uno

## 1. Requisitos Funcionales

1. **RF-01 (Autenticación y Sesión):** El sistema debe permitir el inicio de sesión con JWT para usuarios administradores y empleados, manteniendo la persistencia del token.
2. **RF-02 (Control de Roles RBAC):** El sistema debe restringir las vistas y acciones según el rol asignado (`Administrador` o `Empleado`).
3. **RF-03 (Gestión de Obligaciones):** El sistema debe permitir consultar, crear y actualizar el estado de las obligaciones normativas y legales guardadas en la base de datos SQLite.
4. **RF-04 (Filtro por Responsable):** El sistema debe proveer la ruta `GET /api/obligaciones` parametrizada para filtrar obligaciones por el usuario asignado.
5. **RF-05 (Evidencias y Notificaciones):** El sistema debe mostrar la interfaz para el control de evidencias visuales e indicadores de alerta por vencimiento.

## 2. Fuera de Alcance (Simulado / Pendiente)

- **Almacenamiento físico de evidencias:** No se incluye la subida real de archivos al servidor mediante middleware como Multer.
- **Notificaciones por Correo:** Las alertas operan de forma visual en la interfaz de usuario sin integración a un servidor SMTP activo.