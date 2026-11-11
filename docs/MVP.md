# MVP (Minimum Viable Product) - Pluri Uno

## 1. Alcance y Estado del MVP

| Funcionalidad | Estado actual | Observaciones |
| :--- | :--- | :--- |
| **Autenticación y Sesión (JWT)** | Implementado | Manejo de login y persistencia de token |
| **Control de Roles (RBAC)** | Implementado | Roles de Administrador y Empleado |
| **Gestión de Obligaciones (SQLite)** | Implementado | Persistencia en base de datos SQLite |
| **Filtro por Responsable** | Implementado | RUTA `GET /api/obligaciones` con parámetro |
| **Carga de Evidencias** | Simulado / Pendiente | Evidencias visuales en UI sin subida física Multer |
| **Notificaciones por Correo** | Simulado / Pendiente | Alertas en pantalla sin servidor SMTP activo |

## 2. Criterios de Aceptación Comprobables

1. **Autenticación Correcta:** El usuario administrador y empleado pueden iniciar sesión con sus credenciales y recibir un JWT válido.
2. **Restricción de Acceso:** Un usuario con rol `Empleado` solo puede visualizar y gestionar las obligaciones que le han sido asignadas.
3. **Persistencia de Cambios:** Al modificar el estado de una obligación (`PATCH /api/obligaciones/:id`) y recargar la página (F5), el nuevo estado se mantiene guardado en la base de datos SQLite.